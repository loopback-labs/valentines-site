import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import DatePlanningForm, { DatePreferences } from "@/components/DatePlanningForm";
import { DatePlanningConfig } from "@/components/TemplatePreview";

interface MemeGifPreviewProps {
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
  isLive?: boolean;
  onYesClick?: () => void;
  onDateFormSubmit?: (preferences: DatePreferences) => Promise<void>;
}

const noButtonVariants = [
  "No",
  "Are you sure?",
  "Really sure?",
  "Think again!",
  "Last chance!",
  "Surely not?",
  "You might regret this!",
  "Give it another thought!",
  "Are you absolutely sure?",
  "This could be a mistake!",
  "Have a heart!",
  "Don't be so cold!",
  "Change of heart?",
  "Wouldn't you reconsider?",
  "Is that your final answer?",
  "You're breaking my heart ;(",
];

// Theme-specific neutral/default GIFs
const neutralGifsByTheme: Record<string, string> = {
  cute: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm1jN2tiem55bXBrbTlja3Q1MHNwc2wzM3podzd1OXYzejFvNXd0byZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8QbwUh40Hl96yMgvOx/giphy.gif", // Cute pleading cat
  minimal: "https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif", // Clean simple cat
  dark: "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif", // Mysterious cat
  pastel: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif", // Soft dreamy cat
  chaotic: "https://media.giphy.com/media/nR4L10XlJcSeQ/giphy.gif", // Crazy energetic cat
};

// Sad GIF (same for all themes)
const sadGif = "https://media.giphy.com/media/BEob5qwFkSJ7G/giphy.gif";

// Theme-specific happy/celebration GIFs
const happyGifsByTheme: Record<string, string> = {
  cute: "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif", // Happy celebration cat
  minimal: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", // Simple thumbs up
  dark: "https://media.giphy.com/media/l4pTdcifPZLpDjL1e/giphy.gif", // Mysterious celebration
  pastel: "https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif", // Soft happy dance
  chaotic: "https://media.giphy.com/media/5xaOcLGvzHxDKjufnLW/giphy.gif", // Wild celebration
};

const themeStyles = {
  cute: {
    bg: "bg-gradient-to-br from-pink-50 via-white to-rose-50",
    card: "",
    text: "text-pink-900",
    subtext: "text-pink-700",
    buttonYes: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/25",
    buttonNo: "bg-pink-100 hover:bg-pink-200 text-pink-700 border border-pink-300",
  },
  minimal: {
    bg: "bg-white",
    card: "",
    text: "text-gray-900",
    subtext: "text-gray-600",
    buttonYes: "bg-gray-900 hover:bg-gray-800 text-white",
    buttonNo: "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300",
  },
  dark: {
    bg: "bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900",
    card: "",
    text: "text-white",
    subtext: "text-purple-200",
    buttonYes: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25",
    buttonNo: "bg-gray-700 hover:bg-gray-600 text-purple-200 border border-purple-500/30",
  },
  pastel: {
    bg: "bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100",
    card: "",
    text: "text-purple-900",
    subtext: "text-purple-700",
    buttonYes: "bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-400/25",
    buttonNo: "bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-300",
  },
  chaotic: {
    bg: "bg-gradient-chaotic",
    card: "",
    text: "text-white",
    subtext: "text-white/80",
    buttonYes: "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-600 text-white animate-pulse shadow-lg",
    buttonNo: "bg-white/20 hover:bg-white/30 text-white border border-white/40",
  },
};

export default function MemeGifPreview({ 
  config, 
  datePlanningConfig,
  isLive = false, 
  onYesClick,
  onDateFormSubmit,
}: MemeGifPreviewProps) {
  const [noIndex, setNoIndex] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [gifState, setGifState] = useState<"neutral" | "sad" | "happy">("neutral");

  const styles = themeStyles[config.theme];

  const handleNoClick = () => {
    setNoIndex((prev) => Math.min(prev + 1, noButtonVariants.length - 1));
    setYesScale((prev) => Math.min(prev + 0.15, 2.5));
    setGifState("sad");
  };

  const handleYesClick = () => {
    setShowSuccess(true);
    setGifState("happy");
    if (onYesClick) onYesClick();
  };

  // Reset on config change (for preview)
  useEffect(() => {
    setNoIndex(0);
    setYesScale(1);
    setShowSuccess(false);
    setGifState("neutral");
  }, [config.theme]);

  const showDatePlanningForm = datePlanningConfig?.enableDatePlanning && 
    datePlanningConfig.availableDates.length > 0;

  if (showSuccess) {
    return (
      <div className={`h-full flex flex-col items-center justify-center p-4 ${styles.bg} overflow-y-auto`}>
        <div className={`max-w-md w-full ${styles.card} rounded-2xl p-6 text-center`}>
          <div className="w-48 h-48 mx-auto mb-4 rounded-xl overflow-hidden">
            <img
              src={happyGifsByTheme[config.theme] || happyGifsByTheme.cute}
              alt="Celebration"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className={`text-2xl md:text-3xl font-bold ${styles.text} mb-2`}>
            {config.successHeadline || "Yay! 🎉"}
          </h1>
          <p className={`text-lg ${styles.subtext} mb-6`}>
            {config.successSubtext || "I knew you'd say yes! See you soon! 💕"}
          </p>

          {showDatePlanningForm && onDateFormSubmit && (
            <DatePlanningForm
              availableDates={datePlanningConfig.availableDates}
              timeSlots={datePlanningConfig.timeSlots}
              foodOptions={datePlanningConfig.foodOptions}
              activityOptions={datePlanningConfig.activityOptions}
              onSubmit={onDateFormSubmit}
              theme={config.theme}
            />
          )}
        </div>
      </div>
    );
  }

  // Heart color based on theme
  const heartColors: Record<string, string> = {
    cute: "text-pink-400",
    minimal: "text-gray-400",
    dark: "text-purple-500",
    pastel: "text-purple-400",
    chaotic: "text-yellow-400",
  };

  return (
    <div className={`h-full flex flex-col items-center justify-center p-4 ${styles.bg} relative overflow-hidden`}>
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <Heart
            key={i}
            className={`absolute ${heartColors[config.theme]} opacity-20 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${12 + Math.random() * 20}px`,
              height: `${12 + Math.random() * 20}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      <div className={`max-w-md w-full ${styles.card} rounded-2xl p-6 relative z-10`}>
        {/* GIF Banner */}
        <div className="w-full aspect-square max-w-[200px] mx-auto mb-6 rounded-xl overflow-hidden">
          <img
            src={gifState === "neutral" ? (neutralGifsByTheme[config.theme] || neutralGifsByTheme.cute) : sadGif}
            alt="Valentine"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="text-center mb-6">
          <h1 className={`text-xl md:text-2xl font-bold ${styles.text} mb-2`}>
            {config.headline || "Will You Be My Valentine?"}
          </h1>
          <p className={`${styles.subtext}`}>
            {config.subtext || "I really like you... 💕"}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div 
            className="flex items-center justify-center transition-all"
            style={{ 
              width: `${120 * yesScale}px`,
              height: `${48 * yesScale}px`,
            }}
          >
            <button
              onClick={handleYesClick}
              className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${styles.buttonYes}`}
              style={{ 
                transform: `scale(${yesScale})`,
              }}
            >
              {config.yesButtonText || "Yes! 💕"}
            </button>
          </div>

          <button
            onClick={handleNoClick}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${styles.buttonNo}`}
            style={{
              transform: `scale(${Math.max(0.7, 1 - noIndex * 0.05)})`,
              opacity: Math.max(0.5, 1 - noIndex * 0.03),
            }}
          >
            {noButtonVariants[noIndex] || config.noButtonText || "No"}
          </button>
        </div>
      </div>
    </div>
  );
}
