import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import SiteEditorForm, {
  type SiteEditorConfig,
} from "@/components/SiteEditorForm";
import {
  DEFAULT_TIME_SLOTS,
  DEFAULT_FOOD_OPTIONS,
  DEFAULT_ACTIVITY_OPTIONS,
} from "@/components/DatePlanningConfig";
import { TemplateId } from "@/components/TemplateSelector";
import { PhotoDisplayMode } from "@/components/PhotoUploadConfig";
import type { Theme } from "@/types/site";
import { queryKeys } from "@/lib/queryClient";

type SiteRow = Tables<"valentine_sites">;

function toEditorConfig(data: SiteRow): SiteEditorConfig {
  return {
    template: data.template as TemplateId,
    headline: data.headline,
    subtext: data.subtext || "",
    yesButtonText: data.yes_button_text,
    noButtonText: data.no_button_text,
    successHeadline: data.success_headline || "Yay! 🎉",
    successSubtext: data.success_subtext || "I knew you'd say yes! 💕",
    theme: data.theme as Theme,
    slug: data.slug,
    isPublished: data.is_published,
    enableDatePlanning: data.enable_date_planning || false,
    timeSlots: data.time_slots || [...DEFAULT_TIME_SLOTS],
    foodOptions: data.food_options || [...DEFAULT_FOOD_OPTIONS],
    activityOptions: data.activity_options || [...DEFAULT_ACTIVITY_OPTIONS],
    passwordProtected: data.password_protected || false,
    password: data.password_hash || "",
    enableBackgroundPhotos: !!(data.background_photos && data.background_photos.length > 0),
    backgroundPhotos: data.background_photos || [],
    photoDisplayMode: (data.photo_display_mode as PhotoDisplayMode) || "background",
  };
}

export default function EditSite() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();

  const siteQuery = useQuery({
    queryKey: queryKeys.site(id),
    enabled: !!user && !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("valentine_sites")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (siteQuery.isPending) {
    return <LoadingScreen />;
  }

  // A failed background refetch keeps the previous data, so only redirect when
  // there is no row; otherwise in-progress edits would be lost.
  const site = siteQuery.data;
  if (!site || site.user_id !== user.id) {
    return <Navigate to="/dashboard" replace />;
  }

  return <EditSiteForm key={site.id} site={site} />;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Heart className="w-16 h-16 text-primary animate-pulse" fill="currentColor" />
    </div>
  );
}

// Holds the editable copy of the site. Initialized once from the fetched row,
// so a background refetch never overwrites in-progress edits.
function EditSiteForm({ site }: { site: SiteRow }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<SiteEditorConfig>(() => toEditorConfig(site));
  const [datePlanningOpen, setDatePlanningOpen] = useState(!!site.enable_date_planning);

  const patchConfig = (patch: Partial<SiteEditorConfig>) => {
    setConfig((c) => ({ ...c, ...patch }));
  };

  const saveSite = useMutation({
    mutationFn: async (publish: boolean) => {
      const { error } = await supabase
        .from("valentine_sites")
        .update({
          template: config.template,
          headline: config.headline,
          subtext: config.subtext,
          yes_button_text: config.yesButtonText,
          no_button_text: config.noButtonText,
          theme: config.theme,
          is_published: publish,
          enable_date_planning: config.enableDatePlanning,
          time_slots: config.timeSlots,
          food_options: config.foodOptions,
          activity_options: config.activityOptions,
          success_headline: config.successHeadline,
          success_subtext: config.successSubtext,
          password_protected: config.passwordProtected && config.password.length > 0,
          password_hash:
            config.passwordProtected && config.password.length > 0 ? config.password : null,
          background_photos:
            config.enableBackgroundPhotos && config.backgroundPhotos.length > 0
              ? config.backgroundPhotos
              : null,
          photo_display_mode: config.photoDisplayMode,
        })
        .eq("id", site.id);
      if (error) throw error;

      if (publish) {
        await supabase.functions.invoke("cleanup-stale-photos");
      }
    },
    onSuccess: (_, publish) => {
      void queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.removeQueries({ queryKey: queryKeys.publicSite(site.slug) });
      toast.success(publish ? "Site published! 🎉" : "Changes saved");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error("Failed to update site");
      console.error(error);
    },
  });

  return (
    <SiteEditorForm
      headerTitle="Edit Site"
      config={config}
      onPatch={patchConfig}
      slugError=""
      onSlugInputChange={() => {}}
      slugReadOnly
      datePlanningOpen={datePlanningOpen}
      onDatePlanningOpenChange={setDatePlanningOpen}
      isSaving={saveSite.isPending}
      onSaveDraft={() => saveSite.mutate(false)}
      onPublish={() => saveSite.mutate(true)}
      publishButtonLabel={config.isPublished ? "Update" : "Publish"}
    />
  );
}
