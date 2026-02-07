import { TemplateId } from "./TemplateSelector";
import ClassicPreview from "./templates/ClassicPreview";
import MemeGifPreview from "./templates/MemeGifPreview";
import TeddyBearPreview from "./templates/TeddyBearPreview";
import { DatePreferences } from "./DatePlanningForm";

export interface DatePlanningConfig {
  enableDatePlanning: boolean;
  timeSlots: string[];
  foodOptions: string[];
  activityOptions: string[];
}

interface TemplatePreviewProps {
  template: TemplateId;
  config: {
    headline: string;
    subtext: string;
    yesButtonText: string;
    noButtonText: string;
    successHeadline?: string;
    successSubtext?: string;
    theme: "cute" | "minimal" | "dark" | "pastel" | "chaotic";
  };
  datePlanningConfig?: DatePlanningConfig;
  backgroundPhotos?: string[];
  isLive?: boolean;
  onYesClick?: () => void;
  onDateFormSubmit?: (preferences: DatePreferences) => Promise<void>;
}

export default function TemplatePreview({ 
  template, 
  config, 
  datePlanningConfig,
  backgroundPhotos,
  isLive = false, 
  onYesClick,
  onDateFormSubmit,
}: TemplatePreviewProps) {
  switch (template) {
    case "meme_gif":
      return (
        <MemeGifPreview 
          config={config} 
          datePlanningConfig={datePlanningConfig}
          backgroundPhotos={backgroundPhotos}
          isLive={isLive} 
          onYesClick={onYesClick}
          onDateFormSubmit={onDateFormSubmit}
        />
      );
    case "teddy_bear":
      return (
        <TeddyBearPreview 
          config={config} 
          datePlanningConfig={datePlanningConfig}
          backgroundPhotos={backgroundPhotos}
          isLive={isLive} 
          onYesClick={onYesClick}
          onDateFormSubmit={onDateFormSubmit}
        />
      );
    case "classic":
    default:
      return (
        <ClassicPreview 
          config={config} 
          datePlanningConfig={datePlanningConfig}
          backgroundPhotos={backgroundPhotos}
          isLive={isLive} 
          onYesClick={onYesClick}
          onDateFormSubmit={onDateFormSubmit}
        />
      );
  }
}
