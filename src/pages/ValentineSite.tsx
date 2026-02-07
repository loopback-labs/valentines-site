import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Loader2 } from "lucide-react";
import TemplatePreview from "@/components/TemplatePreview";
import { TemplateId } from "@/components/TemplateSelector";
import { DatePreferences } from "@/components/DatePlanningForm";

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
  enable_date_planning: boolean;
  available_dates: string[] | null;
  time_slots: string[] | null;
  food_options: string[] | null;
  activity_options: string[] | null;
}

// Session storage keys for rate limiting
const VIEWED_SITES_KEY = "lovelink_viewed_sites";
const YES_CLICKED_SITES_KEY = "lovelink_yes_clicked_sites";

// Helper to check if action was already performed this session
const hasPerformedAction = (storageKey: string, siteId: string): boolean => {
  try {
    const stored = sessionStorage.getItem(storageKey);
    if (!stored) return false;
    const sites: string[] = JSON.parse(stored);
    return sites.includes(siteId);
  } catch {
    return false;
  }
};

// Helper to mark action as performed
const markActionPerformed = (storageKey: string, siteId: string): void => {
  try {
    const stored = sessionStorage.getItem(storageKey);
    const sites: string[] = stored ? JSON.parse(stored) : [];
    if (!sites.includes(siteId)) {
      sites.push(siteId);
      sessionStorage.setItem(storageKey, JSON.stringify(sites));
    }
  } catch {
    // Silently fail if sessionStorage is unavailable
  }
};

export default function ValentineSite() {
  const { slug } = useParams<{ slug: string }>();
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const trackView = useCallback(async (siteId: string) => {
    // Check if already viewed this session (rate limiting)
    if (hasPerformedAction(VIEWED_SITES_KEY, siteId)) {
      return;
    }

    // Mark as viewed before making requests
    markActionPerformed(VIEWED_SITES_KEY, siteId);

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
  }, []);

  useEffect(() => {
    if (slug) {
      fetchSite();
    }
  }, [slug]);

  const fetchSite = async () => {
    // Query only the fields we need, explicitly excluding user_id for privacy
    const { data, error } = await supabase
      .from("valentine_sites")
      .select(`
        id,
        slug,
        headline,
        subtext,
        yes_button_text,
        no_button_text,
        template,
        theme,
        is_published,
        enable_date_planning,
        available_dates,
        time_slots,
        food_options,
        activity_options,
        success_headline,
        success_subtext,
        password_protected
      `)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !data) {
      setNotFound(true);
    } else {
      setSite(data as SiteData);
      // Track view with session-based deduplication
      trackView(data.id);
    }
    setLoading(false);
  };

  const handleYesClick = async () => {
    if (!site) return;

    // Check if already clicked yes this session (rate limiting)
    if (hasPerformedAction(YES_CLICKED_SITES_KEY, site.id)) {
      return;
    }

    // Mark as clicked before making requests
    markActionPerformed(YES_CLICKED_SITES_KEY, site.id);

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

  // Parse available dates from string array to Date objects
  const availableDates = site.available_dates 
    ? site.available_dates.map(d => new Date(d))
    : [];

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
          availableDates: availableDates,
          timeSlots: site.time_slots || [],
          foodOptions: site.food_options || [],
          activityOptions: site.activity_options || [],
        }}
        isLive
        onYesClick={handleYesClick}
        onDateFormSubmit={handleDateFormSubmit}
      />
    </div>
  );
}
