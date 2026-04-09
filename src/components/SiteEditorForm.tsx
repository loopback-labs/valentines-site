import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  ArrowLeft,
  Sparkles,
  Monitor,
  Smartphone,
  Check,
  Loader2,
  CalendarDays,
  ImagePlus,
  Lock,
} from "lucide-react";
import TemplateSelector, { TemplateId } from "@/components/TemplateSelector";
import TemplatePreview from "@/components/TemplatePreview";
import DatePlanningConfig from "@/components/DatePlanningConfig";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PasswordProtectionConfig } from "@/components/PasswordProtection";
import { PhotoUploadConfig, PhotoDisplayMode } from "@/components/PhotoUploadConfig";
import { THEMES, type Theme } from "@/types/site";

export interface SiteEditorConfig {
  template: TemplateId;
  headline: string;
  subtext: string;
  yesButtonText: string;
  noButtonText: string;
  successHeadline: string;
  successSubtext: string;
  theme: Theme;
  slug: string;
  /** Present when editing an existing site (publish button label). */
  isPublished?: boolean;
  enableDatePlanning: boolean;
  timeSlots: string[];
  foodOptions: string[];
  activityOptions: string[];
  passwordProtected: boolean;
  password: string;
  enableBackgroundPhotos: boolean;
  backgroundPhotos: string[];
  photoDisplayMode: PhotoDisplayMode;
}

export interface SiteEditorFormProps {
  headerTitle: string;
  config: SiteEditorConfig;
  onPatch: (patch: Partial<SiteEditorConfig>) => void;
  slugError: string;
  /** Ignored when `slugReadOnly` is true */
  onSlugInputChange: (value: string) => void;
  slugReadOnly?: boolean;
  datePlanningOpen: boolean;
  onDatePlanningOpenChange: (open: boolean) => void;
  isSaving: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  publishButtonLabel: string;
}

export default function SiteEditorForm({
  headerTitle,
  config,
  onPatch,
  slugError,
  onSlugInputChange,
  slugReadOnly = false,
  datePlanningOpen,
  onDatePlanningOpenChange,
  isSaving,
  onSaveDraft,
  onPublish,
  publishButtonLabel,
}: SiteEditorFormProps) {
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="min-h-screen bg-background">
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
              {headerTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onSaveDraft} disabled={isSaving}>
              Save Draft
            </Button>
            <Button className="bg-gradient-love hover:opacity-90" onClick={onPublish} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Heart className="w-4 h-4 mr-2" fill="currentColor" />
              )}
              {publishButtonLabel}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">🎨 Choose Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="lg:flex lg:gap-4">
              <TemplateSelector
                selected={config.template}
                onSelect={(template) => onPatch({ template })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="w-5 h-5" />
              🔗 URL & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">Your URL</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">/</span>
                <Input
                  value={config.slug}
                  readOnly={slugReadOnly}
                  onChange={(e) => !slugReadOnly && onSlugInputChange(e.target.value)}
                  placeholder="your-name"
                  className={
                    !slugReadOnly && slugError ? "border-destructive" : slugReadOnly ? "bg-muted" : ""
                  }
                />
              </div>
              {!slugReadOnly && slugError && (
                <p className="text-sm text-destructive mt-2">{slugError}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {slugReadOnly
                  ? "URL cannot be changed after creation"
                  : "This will be your shareable link"}
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <PasswordProtectionConfig
                enabled={config.passwordProtected}
                onEnabledChange={(enabled) => onPatch({ passwordProtected: enabled })}
                password={config.password}
                onPasswordChange={(password) => onPatch({ password })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
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
                  onChange={(e) => onPatch({ headline: e.target.value })}
                  placeholder="Will You Be My Valentine?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtext">Subtext</Label>
                <Input
                  id="subtext"
                  value={config.subtext}
                  onChange={(e) => onPatch({ subtext: e.target.value })}
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
                  onChange={(e) => onPatch({ yesButtonText: e.target.value })}
                  placeholder="Yes! 💕"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="no-btn">No Button</Label>
                <Input
                  id="no-btn"
                  value={config.noButtonText}
                  onChange={(e) => onPatch({ noButtonText: e.target.value })}
                  placeholder="No"
                />
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">After clicking "Yes":</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="success-headline">Success Headline</Label>
                  <Input
                    id="success-headline"
                    value={config.successHeadline}
                    onChange={(e) => onPatch({ successHeadline: e.target.value })}
                    placeholder="Yay! 🎉"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="success-subtext">Success Message</Label>
                  <Input
                    id="success-subtext"
                    value={config.successSubtext}
                    onChange={(e) => onPatch({ successSubtext: e.target.value })}
                    placeholder="I knew you'd say yes! 💕"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <Collapsible open={datePlanningOpen} onOpenChange={onDatePlanningOpenChange}>
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
                  onEnabledChange={(enabled) => onPatch({ enableDatePlanning: enabled })}
                  timeSlots={config.timeSlots}
                  onTimeSlotsChange={(slots) => onPatch({ timeSlots: slots })}
                  foodOptions={config.foodOptions}
                  onFoodOptionsChange={(options) => onPatch({ foodOptions: options })}
                  activityOptions={config.activityOptions}
                  onActivityOptionsChange={(options) => onPatch({ activityOptions: options })}
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ImagePlus className="w-5 h-5" />
              📷 Memories (Optional)
            </CardTitle>
            <Switch
              id="photo-bg-toggle"
              checked={config.enableBackgroundPhotos}
              onCheckedChange={(enabled) => onPatch({ enableBackgroundPhotos: enabled })}
            />
          </CardHeader>
          <CardContent>
            <PhotoUploadConfig
              enabled={config.enableBackgroundPhotos}
              onEnabledChange={(enabled) => onPatch({ enableBackgroundPhotos: enabled })}
              photos={config.backgroundPhotos}
              onPhotosChange={(photos) => onPatch({ backgroundPhotos: photos })}
              displayMode={config.photoDisplayMode}
              onDisplayModeChange={(photoMode) => onPatch({ photoDisplayMode: photoMode })}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">🎨 Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => onPatch({ theme: theme.id })}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover-grow ${
                      config.theme === theme.id
                        ? "border-primary bg-primary/5 glow-pink"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl">{theme.emoji}</span>
                      {config.theme === theme.id && <Check className="w-5 h-5 text-primary" />}
                    </div>
                    <p className="font-medium">{theme.name}</p>
                    <p className="text-xs text-muted-foreground">{theme.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

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
                  backgroundPhotos={config.enableBackgroundPhotos ? config.backgroundPhotos : undefined}
                  photoDisplayMode={config.photoDisplayMode}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
