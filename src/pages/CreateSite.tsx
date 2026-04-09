import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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

export default function CreateSite() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [slugError, setSlugError] = useState("");
  const [datePlanningOpen, setDatePlanningOpen] = useState(false);

  const [config, setConfig] = useState<SiteEditorConfig>({
    template: "classic",
    headline: "Will You Be My Valentine? 💘",
    subtext: "I've been wanting to ask you this for a while...",
    yesButtonText: "Yes, absolutely! 💕",
    noButtonText: "Let me think...",
    successHeadline: "You made my heart explode! 💥💖",
    successSubtext: "I promise to make you smile every single day!",
    theme: "cute",
    slug: "",
    enableDatePlanning: false,
    timeSlots: [...DEFAULT_TIME_SLOTS],
    foodOptions: [...DEFAULT_FOOD_OPTIONS],
    activityOptions: [...DEFAULT_ACTIVITY_OPTIONS],
    passwordProtected: false,
    password: "",
    enableBackgroundPhotos: false,
    backgroundPhotos: [],
    photoDisplayMode: "background",
  });

  const patchConfig = (patch: Partial<SiteEditorConfig>) => {
    setConfig((c) => ({ ...c, ...patch }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Heart className="w-16 h-16 text-primary animate-pulse" fill="currentColor" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const validateSlug = (slug: string) => {
    if (!slug) {
      setSlugError("Slug is required");
      return false;
    }
    if (slug.length < 3) {
      setSlugError("Slug must be at least 3 characters");
      return false;
    }
    if (slug.length > 30) {
      setSlugError("Slug must be less than 30 characters");
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setSlugError("Only lowercase letters, numbers, and hyphens allowed");
      return false;
    }
    setSlugError("");
    return true;
  };

  const handleSlugChange = (value: string) => {
    const formatted = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    patchConfig({ slug: formatted });
    validateSlug(formatted);
  };

  const handleSave = async (publish: boolean) => {
    if (!validateSlug(config.slug)) return;

    setIsSaving(true);

    const { data: existing } = await supabase
      .from("valentine_sites")
      .select("id")
      .eq("slug", config.slug)
      .maybeSingle();

    if (existing) {
      setSlugError("This slug is already taken");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.from("valentine_sites").insert({
      user_id: user.id,
      slug: config.slug,
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
    });

    if (error) {
      toast.error("Failed to create site");
      console.error(error);
    } else {
      if (publish) {
        await supabase.functions.invoke("cleanup-stale-photos");
      }
      toast.success(publish ? "Site published! 🎉" : "Site saved as draft");
      navigate("/dashboard");
    }

    setIsSaving(false);
  };

  return (
    <SiteEditorForm
      headerTitle="Create New Site"
      config={config}
      onPatch={patchConfig}
      slugError={slugError}
      onSlugInputChange={handleSlugChange}
      datePlanningOpen={datePlanningOpen}
      onDatePlanningOpenChange={setDatePlanningOpen}
      isSaving={isSaving}
      onSaveDraft={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      publishButtonLabel="Publish"
    />
  );
}
