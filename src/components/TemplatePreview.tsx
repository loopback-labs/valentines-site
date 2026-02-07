import { TemplateId } from "./TemplateSelector";
import ClassicPreview from "./templates/ClassicPreview";
import MemeGifPreview from "./templates/MemeGifPreview";
import TeddyBearPreview from "./templates/TeddyBearPreview";

interface TemplatePreviewProps {
  template: TemplateId;
  config: {
    headline: string;
    subtext: string;
    yesButtonText: string;
    noButtonText: string;
    theme: "cute" | "minimal" | "dark" | "pastel" | "chaotic";
  };
  isLive?: boolean;
  onYesClick?: () => void;
}

export default function TemplatePreview({ template, config, isLive = false, onYesClick }: TemplatePreviewProps) {
  switch (template) {
    case "meme_gif":
      return <MemeGifPreview config={config} isLive={isLive} onYesClick={onYesClick} />;
    case "teddy_bear":
      return <TeddyBearPreview config={config} isLive={isLive} onYesClick={onYesClick} />;
    case "classic":
    default:
      return <ClassicPreview config={config} isLive={isLive} onYesClick={onYesClick} />;
  }
}
