// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BUCKET_NAME = "valentine-photos";
const PUBLIC_OBJECT_PATH = `/object/public/${BUCKET_NAME}/`;
const STORAGE_PUBLIC_OBJECT_PATH = `/storage/v1/object/public/${BUCKET_NAME}/`;

const getStoragePathFromPhotoUrl = (photoUrl: string): string | null => {
  if (!photoUrl) {
    return null;
  }

  if (photoUrl.includes(PUBLIC_OBJECT_PATH)) {
    return photoUrl.split(PUBLIC_OBJECT_PATH)[1] ?? null;
  }

  if (photoUrl.includes(STORAGE_PUBLIC_OBJECT_PATH)) {
    return photoUrl.split(STORAGE_PUBLIC_OBJECT_PATH)[1] ?? null;
  }

  // Backstop in case absolute URL was transformed before save.
  if (/^[^/]+\/.+/.test(photoUrl)) {
    return photoUrl;
  }

  return null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase environment variables" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const jwt = authHeader.replace("Bearer ", "").trim();

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: userData, error: userError } = await adminClient.auth.getUser(jwt);

    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userId = userData.user.id;
    let offset = 0;
    const limit = 100;
    const existingPaths: string[] = [];

    while (true) {
      const { data: listedObjects, error: listError } = await adminClient.storage
        .from(BUCKET_NAME)
        .list(userId, { limit, offset, sortBy: { column: "name", order: "asc" } });

      if (listError) {
        return new Response(
          JSON.stringify({ error: "Failed to list storage objects" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (!listedObjects || listedObjects.length === 0) {
        break;
      }

      for (const object of listedObjects) {
        if (!object.name) continue;
        existingPaths.push(`${userId}/${object.name}`);
      }

      if (listedObjects.length < limit) {
        break;
      }

      offset += limit;
    }

    if (existingPaths.length === 0) {
      return new Response(
        JSON.stringify({ deletedCount: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: sites, error: sitesError } = await adminClient
      .from("valentine_sites")
      .select("background_photos")
      .eq("user_id", userId);

    if (sitesError) {
      return new Response(
        JSON.stringify({ error: "Failed to query site photos" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const referencedPaths = new Set<string>();

    for (const site of sites ?? []) {
      for (const photoUrl of site.background_photos ?? []) {
        const storagePath = getStoragePathFromPhotoUrl(photoUrl);
        if (!storagePath) continue;
        if (storagePath.startsWith(`${userId}/`)) {
          referencedPaths.add(storagePath);
        }
      }
    }

    const stalePaths = existingPaths.filter((path) => !referencedPaths.has(path));

    if (stalePaths.length === 0) {
      return new Response(
        JSON.stringify({ deletedCount: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { error: removeError } = await adminClient.storage
      .from(BUCKET_NAME)
      .remove(stalePaths);

    if (removeError) {
      return new Response(
        JSON.stringify({ error: "Failed to delete stale photos" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ deletedCount: stalePaths.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("cleanup-stale-photos failed:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
