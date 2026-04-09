import { useState, useEffect, useCallback } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
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
import { TemplateId } from "@/components/TemplateSelector";
import { PhotoDisplayMode } from "@/components/PhotoUploadConfig";
import type { Theme } from "@/types/site";

export default function EditSite() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [datePlanningOpen, setDatePlanningOpen] = useState(false);

  const [config, setConfig] = useState<SiteEditorConfig>({
    template: "classic",
    headline: "",
    subtext: "",
    yesButtonText: "",
    noButtonText: "",
    successHeadline: "You made my heart explode! 💥💖",
    successSubtext: "I promise to make you smile every single day!",
    theme: "cute",
    slug: "",
    isPublished: false,
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

  const fetchSite = useCallback(async () => {
    if (!user?.id || !id) return;

    const { data, error } = await supabase
      .from("valentine_sites")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    if (data.user_id !== user.id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setConfig({
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
    });
    if (data.enable_date_planning) {
      setDatePlanningOpen(true);
    }
    setIsLoading(false);
  }, [user?.id, id]);

  useEffect(() => {
    if (user && id) {
      void fetchSite();
    }
  }, [user, id, fetchSite]);

  const patchConfig = (patch: Partial<SiteEditorConfig>) => {
    setConfig((c) => ({ ...c, ...patch }));
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Heart className="w-16 h-16 text-primary animate-pulse" fill="currentColor" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (notFound) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSave = async (publish: boolean) => {
    setIsSaving(true);

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
      .eq("id", id);

    if (error) {
      toast.error("Failed to update site");
      console.error(error);
    } else {
      if (publish) {
        await supabase.functions.invoke("cleanup-stale-photos");
      }
      toast.success(publish ? "Site published! 🎉" : "Changes saved");
      navigate("/dashboard");
    }

    setIsSaving(false);
  };

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
      isSaving={isSaving}
      onSaveDraft={() => handleSave(false)}
      onPublish={() => handleSave(true)}
      publishButtonLabel={config.isPublished ? "Update" : "Publish"}
    />
  );
}
