import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft, Sparkles, Monitor, Smartphone, Check, Loader2, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import TemplateSelector, { TemplateId } from "@/components/TemplateSelector";
import TemplatePreview from "@/components/TemplatePreview";
import DatePlanningConfig, { 
  DEFAULT_TIME_SLOTS, 
  DEFAULT_FOOD_OPTIONS, 
  DEFAULT_ACTIVITY_OPTIONS 
} from "@/components/DatePlanningConfig";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PasswordProtectionConfig } from "@/components/PasswordProtection";
import { Lock } from "lucide-react";

type Theme = "cute" | "minimal" | "dark" | "pastel" | "chaotic";

interface SiteConfig {
  template: TemplateId;
  headline: string;
  subtext: string;
  yesButtonText: string;
  noButtonText: string;
  successHeadline: string;
  successSubtext: string;
  theme: Theme;
  slug: string;
  enableDatePlanning: boolean;
  timeSlots: string[];
  foodOptions: string[];
  activityOptions: string[];
  passwordProtected: boolean;
  password: string;
}

const themes: { id: Theme; name: string; emoji: string; description: string }[] = [
  { id: "cute", name: "Cute", emoji: "💕", description: "Soft pinks, hearts, romantic" },
  { id: "minimal", name: "Minimal", emoji: "⬜", description: "Clean, modern, understated" },
  { id: "dark", name: "Dark", emoji: "🌙", description: "Moody, elegant, mysterious" },
  { id: "pastel", name: "Pastel", emoji: "🍬", description: "Soft colors, dreamy" },
  { id: "chaotic", name: "Chaotic", emoji: "🎪", description: "Extra animations, playful" },
];

export default function CreateSite() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [slugError, setSlugError] = useState("");
  const [datePlanningOpen, setDatePlanningOpen] = useState(false);

  const [config, setConfig] = useState<SiteConfig>({
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
  });

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
    setConfig({ ...config, slug: formatted });
    validateSlug(formatted);
  };

  const handleSave = async (publish: boolean) => {
    if (!validateSlug(config.slug)) return;

    setIsSaving(true);

    // Check if slug is available
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

    const { data, error } = await supabase.from("valentine_sites").insert({
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
      password_hash: config.passwordProtected && config.password.length > 0 ? config.password : null,
    }).select().single();

    if (error) {
      toast.error("Failed to create site");
      console.error(error);
    } else {
      toast.success(publish ? "Site published! 🎉" : "Site saved as draft");
      navigate("/dashboard");
    }

    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Create New Site
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isSaving}
            >
              Save Draft
            </Button>
            <Button
              className="bg-gradient-love hover:opacity-90"
              onClick={() => handleSave(true)}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Heart className="w-4 h-4 mr-2" fill="currentColor" />
              )}
              Publish
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Step 1: Template Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">🎨 Choose Template</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateSelector
              selected={config.template}
              onSelect={(template) => setConfig({ ...config, template })}
            />
          </CardContent>
        </Card>

        {/* Top Section: URL and Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* URL Slug */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">/</span>
                <Input
                  value={config.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="your-name"
                  className={slugError ? "border-destructive" : ""}
                />
              </div>
              {slugError && (
                <p className="text-sm text-destructive mt-2">{slugError}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                This will be your shareable link
              </p>
            </CardContent>
          </Card>

          {/* Text Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✏️ Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={config.headline}
                    onChange={(e) => setConfig({ ...config, headline: e.target.value })}
                    placeholder="Will You Be My Valentine?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtext">Subtext</Label>
                  <Input
                    id="subtext"
                    value={config.subtext}
                    onChange={(e) => setConfig({ ...config, subtext: e.target.value })}
                    placeholder="I really like you..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yes-btn">Yes Button</Label>
                  <Input
                    id="yes-btn"
                    value={config.yesButtonText}
                    onChange={(e) => setConfig({ ...config, yesButtonText: e.target.value })}
                    placeholder="Yes! 💕"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="no-btn">No Button</Label>
                  <Input
                    id="no-btn"
                    value={config.noButtonText}
                    onChange={(e) => setConfig({ ...config, noButtonText: e.target.value })}
                    placeholder="No"
                  />
                </div>
              </div>
              {/* Success State Text */}
              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">After clicking "Yes":</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="success-headline">Success Headline</Label>
                    <Input
                      id="success-headline"
                      value={config.successHeadline}
                      onChange={(e) => setConfig({ ...config, successHeadline: e.target.value })}
                      placeholder="Yay! 🎉"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="success-subtext">Success Message</Label>
                    <Input
                      id="success-subtext"
                      value={config.successSubtext}
                      onChange={(e) => setConfig({ ...config, successSubtext: e.target.value })}
                      placeholder="I knew you'd say yes! 💕"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Date Planning Section */}
        <Card className="mb-8">
          <Collapsible open={datePlanningOpen} onOpenChange={setDatePlanningOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  📅 Date Planning (Optional)
                  <span className="text-sm font-normal text-muted-foreground ml-auto">
                    {datePlanningOpen ? "Click to collapse" : "Click to expand"}
                  </span>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <DatePlanningConfig
                  enabled={config.enableDatePlanning}
                  onEnabledChange={(enabled) => setConfig({ ...config, enableDatePlanning: enabled })}
                  timeSlots={config.timeSlots}
                  onTimeSlotsChange={(slots) => setConfig({ ...config, timeSlots: slots })}
                  foodOptions={config.foodOptions}
                  onFoodOptionsChange={(options) => setConfig({ ...config, foodOptions: options })}
                  activityOptions={config.activityOptions}
                  onActivityOptionsChange={(options) => setConfig({ ...config, activityOptions: options })}
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Password Protection Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="w-5 h-5" />
              🔒 Password Protection (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordProtectionConfig
              enabled={config.passwordProtected}
              onEnabledChange={(enabled) => setConfig({ ...config, passwordProtected: enabled })}
              password={config.password}
              onPasswordChange={(password) => setConfig({ ...config, password })}
            />
          </CardContent>
        </Card>

        {/* Bottom Section: Themes (left) + Preview (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Theme Selection */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">🎨 Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setConfig({ ...config, theme: theme.id })}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover-grow ${
                      config.theme === theme.id
                        ? "border-primary bg-primary/5 glow-pink"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl">{theme.emoji}</span>
                      {config.theme === theme.id && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <p className="font-medium">{theme.name}</p>
                    <p className="text-xs text-muted-foreground">{theme.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="lg:sticky lg:top-24 lg:h-[calc(100vh-12rem)]">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">👀 Preview</CardTitle>
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                  <Button
                    variant={previewMode === "desktop" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setPreviewMode("desktop")}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === "mobile" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setPreviewMode("mobile")}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-4 h-[calc(100%-5rem)]">
              <div
                className={`h-full mx-auto bg-background rounded-lg overflow-hidden border shadow-lg ${
                  previewMode === "mobile" ? "max-w-[375px]" : "w-full"
                }`}
              >
                <TemplatePreview 
                  template={config.template} 
                  config={config}
                  datePlanningConfig={{
                    enableDatePlanning: config.enableDatePlanning,
                    timeSlots: config.timeSlots,
                    foodOptions: config.foodOptions,
                    activityOptions: config.activityOptions,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
