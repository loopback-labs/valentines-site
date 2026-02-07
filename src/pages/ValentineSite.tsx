import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Loader2 } from "lucide-react";
import TemplatePreview from "@/components/TemplatePreview";
import { TemplateId } from "@/components/TemplateSelector";
import { DatePreferences } from "@/components/DatePlanningForm";
import { PasswordEntryScreen } from "@/components/PasswordProtection";
import { PhotoDisplayMode } from "@/components/PhotoUploadConfig";

interface SiteData {
  id: string;
  template: TemplateId;
  headline: string;
  subtext: string;
  yes_button_text: string;
  no_button_text: string;
  success_headline: string | null;
  success_subtext: string | null;
  theme: "cute" | "minimal" | "dark" | "pastel" | "chaotic";
  password_protected: boolean;
  password_hash: string | null;
  enable_date_planning: boolean;
  available_dates: string[] | null;
  time_slots: string[] | null;
  food_options: string[] | null;
  activity_options: string[] | null;
  background_photos: string[] | null;
  photo_display_mode: string | null;
}

export default function ValentineSite() {
  const { slug } = useParams<{ slug: string }>();
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [checkingPassword, setCheckingPassword] = useState(false);

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
      // If not password protected, auto-unlock
      if (!data.password_protected) {
        setIsUnlocked(true);
        // Track view immediately for non-protected sites
        if (!viewTracked) {
          trackView(data.id);
          setViewTracked(true);
        }
      }
    }
    setLoading(false);
  };

  const handlePasswordSubmit = (enteredPassword: string) => {
    if (!site) return;
    
    setCheckingPassword(true);
    setPasswordError("");
    
    // Simple password check (comparing plain text for now)
    // In production, you'd want to hash and compare server-side
    if (enteredPassword === site.password_hash) {
      setIsUnlocked(true);
      // Track view after successful unlock
      if (!viewTracked) {
        trackView(site.id);
        setViewTracked(true);
      }
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
    
    setCheckingPassword(false);
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

  const handleDateFormSubmit = async (preferences: DatePreferences) => {
    if (!site) return;

    await supabase.from("date_preferences").insert({
      site_id: site.id,
      selected_date: preferences.selectedDate.toISOString().split('T')[0],
      selected_time: preferences.selectedTime,
      food_preference: preferences.foodPreference,
      activity_preference: preferences.activityPreference,
    });
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

  // Show password screen if protected and not unlocked
  if (site.password_protected && !isUnlocked) {
    return (
      <PasswordEntryScreen
        onSubmit={handlePasswordSubmit}
        error={passwordError}
        isLoading={checkingPassword}
        theme={site.theme}
      />
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <TemplatePreview
        template={site.template || "classic"}
        config={{
          headline: site.headline,
          subtext: site.subtext || "",
          yesButtonText: site.yes_button_text,
          noButtonText: site.no_button_text,
          successHeadline: site.success_headline || undefined,
          successSubtext: site.success_subtext || undefined,
          theme: site.theme,
        }}
        datePlanningConfig={{
          enableDatePlanning: site.enable_date_planning,
          timeSlots: site.time_slots || [],
          foodOptions: site.food_options || [],
          activityOptions: site.activity_options || [],
        }}
        backgroundPhotos={site.background_photos || undefined}
        photoDisplayMode={(site.photo_display_mode as PhotoDisplayMode) || "background"}
        isLive
        onYesClick={handleYesClick}
        onDateFormSubmit={handleDateFormSubmit}
      />
    </div>
  );
}
