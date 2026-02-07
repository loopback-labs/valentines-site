import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Loader2 } from "lucide-react";
import TemplatePreview from "@/components/TemplatePreview";
import { TemplateId } from "@/components/TemplateSelector";

interface SiteData {
  id: string;
  template: TemplateId;
  headline: string;
  subtext: string;
  yes_button_text: string;
  no_button_text: string;
  theme: "cute" | "minimal" | "dark" | "pastel" | "chaotic";
  password_protected: boolean;
}

export default function ValentineSite() {
  const { slug } = useParams<{ slug: string }>();
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchSite();
    }
  }, [slug]);

  const fetchSite = async () => {
    const { data, error } = await supabase
      .from("valentine_sites")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !data) {
      setNotFound(true);
    } else {
      setSite(data as SiteData);
      // Track view
      if (!viewTracked) {
        trackView(data.id);
        setViewTracked(true);
      }
    }
    setLoading(false);
  };

  const trackView = async (siteId: string) => {
    // Insert view response
    await supabase.from("site_responses").insert({
      site_id: siteId,
      response_type: "view",
    });

    // Increment view count using RPC
    try {
      await (supabase.rpc as Function)("increment_view_count", { site_id: siteId });
    } catch {
      // RPC might not exist yet, silently fail
    }
  };

  const handleYesClick = async () => {
    if (!site) return;

    await supabase.from("site_responses").insert({
      site_id: site.id,
      response_type: "yes_click",
    });

    // Increment yes count using RPC
    try {
      await (supabase.rpc as Function)("increment_yes_count", { site_id: site.id });
    } catch {
      // RPC might not exist yet, silently fail
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-love">
        <Loader2 className="w-12 h-12 text-primary-foreground animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-love p-8">
        <Heart className="w-16 h-16 text-primary-foreground/50 mb-6" />
        <h1 className="text-3xl font-bold text-primary-foreground mb-4">Site Not Found</h1>
        <p className="text-primary-foreground/80 text-center">
          This Valentine site doesn't exist or hasn't been published yet.
        </p>
      </div>
    );
  }

  if (!site) return null;

  return (
    <div className="h-screen w-screen overflow-hidden">
      <TemplatePreview
        template={site.template || "classic"}
        config={{
          headline: site.headline,
          subtext: site.subtext || "",
          yesButtonText: site.yes_button_text,
          noButtonText: site.no_button_text,
          theme: site.theme,
        }}
        isLive
        onYesClick={handleYesClick}
      />
    </div>
  );
}
