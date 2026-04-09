import { useState, useEffect } from "react";
import DatePlanningForm, { DatePreferences } from "@/components/DatePlanningForm";
import { DatePlanningConfig } from "@/components/TemplatePreview";
import {
  PhotoBackground,
  PhotoGallery,
  type PhotoDisplayMode,
} from "@/components/PhotoUploadConfig";
import { NEUTRAL_GIFS_BY_THEME, NO_BUTTON_VARIANTS } from "@/components/templates/shared";
import type { Theme } from "@/types/site";

interface TeddyBearPreviewProps {
  config: {
    headline: string;
    subtext: string;
    yesButtonText: string;
    noButtonText: string;
    successHeadline?: string;
    successSubtext?: string;
    theme: Theme;
  };
  datePlanningConfig?: DatePlanningConfig;
  backgroundPhotos?: string[];
  photoDisplayMode?: PhotoDisplayMode;
  onYesClick?: () => void;
  onDateFormSubmit?: (preferences: DatePreferences) => Promise<void>;
}

// Sad GIFs for No click - expanded variety
const sadGifs = [
  "https://media.giphy.com/media/BEob5qwFkSJ7G/giphy.gif",
  "https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif",
  "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif",
  "https://media.giphy.com/media/3o6wrvdHFbwBrUFenu/giphy.gif",
  "https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif",
  "https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif",
  "https://media.giphy.com/media/2WxWfiavndgcM/giphy.gif",
  "https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif",
];

// Happy/celebration GIFs that cycle
const happyGifs = [
  "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/5xaOcLGvzHxDKjufnLW/giphy.gif",
  "https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif",
];

// Theme-specific holographic gradient classes
const holoThemes = {
  cute: "bg-gradient-holographic-cute",
  minimal: "bg-gradient-holographic-minimal",
  dark: "bg-gradient-holographic-dark",
  pastel: "bg-gradient-holographic-pastel",
  chaotic: "bg-gradient-holographic-chaotic",
};

const themeStyles = {
  cute: {
    text: "text-white",
    subtext: "text-white/90",
    buttonYes: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/40",
    buttonNo: "bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30",
    badge: "bg-pink-500/80 text-white",
  },
  minimal: {
    text: "text-gray-800",
    subtext: "text-gray-600",
    buttonYes: "bg-gray-900 hover:bg-gray-800 text-white shadow-lg",
    buttonNo: "bg-white/50 backdrop-blur-sm hover:bg-white/70 text-gray-800 border border-gray-300",
    badge: "bg-gray-800 text-white",
  },
  dark: {
    text: "text-white",
    subtext: "text-purple-200",
    buttonYes: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/40",
    buttonNo: "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-purple-400/30",
    badge: "bg-purple-600/80 text-white",
  },
  pastel: {
    text: "text-purple-900",
    subtext: "text-purple-700",
    buttonYes: "bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-400/40",
    buttonNo: "bg-white/50 backdrop-blur-sm hover:bg-white/70 text-purple-800 border border-purple-300",
    badge: "bg-purple-400/80 text-white",
  },
  chaotic: {
    text: "text-white",
    subtext: "text-white/90",
    buttonYes: "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-700 text-white animate-pulse shadow-lg shadow-pink-500/40",
    buttonNo: "bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/40",
    badge: "bg-gradient-to-r from-yellow-400 to-pink-500 text-white",
  },
};

export default function TeddyBearPreview({ 
  config, 
  datePlanningConfig,
  backgroundPhotos,
  photoDisplayMode = "background",
  onYesClick,
  onDateFormSubmit,
}: TeddyBearPreviewProps) {
  const [noIndex, setNoIndex] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isHoveringNo, setIsHoveringNo] = useState(false);
  const [currentHappyGif, setCurrentHappyGif] = useState(0);
  const [floatingSadGifs, setFloatingSadGifs] = useState<Array<{ id: number; gif: string; x: number; y: number }>>([]);

  const styles = themeStyles[config.theme];
  const holoClass = holoThemes[config.theme];

  const handleNoClick = () => {
    setNoIndex((prev) => Math.min(prev + 1, NO_BUTTON_VARIANTS.length - 1));
    setYesScale((prev) => Math.min(prev + 0.2, 3));
    
    // Add floating sad GIF
    const newSadGif = {
      id: Date.now(),
      gif: sadGifs[Math.floor(Math.random() * sadGifs.length)],
      x: Math.random() * 60 + 20,
      y: Math.random() * 40 + 30,
    };
    setFloatingSadGifs((prev) => [...prev.slice(-4), newSadGif]);
  };

  const handleYesClick = () => {
    setShowSuccess(true);
    if (onYesClick) onYesClick();
  };

  // Cycle happy GIFs in success state
  useEffect(() => {
    if (showSuccess) {
      const interval = setInterval(() => {
        setCurrentHappyGif((prev) => (prev + 1) % happyGifs.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [showSuccess]);

  // Clean up old floating GIFs
  useEffect(() => {
    if (floatingSadGifs.length > 0) {
      const timeout = setTimeout(() => {
        setFloatingSadGifs((prev) => prev.slice(1));
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [floatingSadGifs]);

  // Reset on config change
  useEffect(() => {
    setNoIndex(0);
    setYesScale(1);
    setShowSuccess(false);
    setFloatingSadGifs([]);
  }, [config.theme]);

  const showDatePlanningForm = datePlanningConfig?.enableDatePlanning && 
    datePlanningConfig.timeSlots.length > 0;
  
  const handleDateFormSubmit = onDateFormSubmit || (async () => {
    // Preview mode - just log
    console.log("Date form submitted (preview mode)");
  });

  if (showSuccess) {
    const showPhotosAfterYes = photoDisplayMode === "after_yes" && backgroundPhotos && backgroundPhotos.length > 0;
    const showPhotosInBackground = photoDisplayMode === "background" && backgroundPhotos && backgroundPhotos.length > 0;
    
    return (
      <div className={`h-full flex flex-col items-center justify-center p-4 ${holoClass} relative overflow-y-auto`}>
        {/* Background Photos - only in background mode */}
        {showPhotosInBackground && (
          <PhotoBackground photos={backgroundPhotos} />
        )}
        {/* Marquee text */}
        <div className="absolute top-4 left-0 right-0 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className={`text-lg font-bold ${styles.text} mx-4`}>💕 YAAAY! 💕</span>
            <span className={`text-lg font-bold ${styles.text} mx-4`}>💖 I LOVE YOU! 💖</span>
            <span className={`text-lg font-bold ${styles.text} mx-4`}>💕 YAAAY! 💕</span>
            <span className={`text-lg font-bold ${styles.text} mx-4`}>💖 I LOVE YOU! 💖</span>
          </div>
        </div>

        <div className="text-center z-10 max-w-md w-full mt-12">
          <div className="w-56 h-56 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={happyGifs[currentHappyGif]}
              alt="Celebration"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold ${styles.text} mb-3`}>
            {config.successHeadline || "Yay! You said Yes! 🎉"}
          </h1>
          <p className={`text-xl ${styles.subtext} mb-6`}>
            {config.successSubtext || "I knew you couldn't resist! See you soon! 💕"}
          </p>

          {/* Photo Gallery - only in after_yes mode */}
          {showPhotosAfterYes && (
            <PhotoGallery photos={backgroundPhotos} className="mb-6" />
          )}

          {showDatePlanningForm && (
            <DatePlanningForm
              timeSlots={datePlanningConfig.timeSlots}
              foodOptions={datePlanningConfig.foodOptions}
              activityOptions={datePlanningConfig.activityOptions}
              onSubmit={handleDateFormSubmit}
              theme={config.theme}
            />
          )}
        </div>

        {/* Floating hearts */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-float-up"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            {["💕", "💖", "💗", "💓", "💝"][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
    );
  }

  const showPhotosInBackground = photoDisplayMode === "background" && backgroundPhotos && backgroundPhotos.length > 0;

  return (
    <div className={`h-full flex flex-col items-center justify-center p-4 ${holoClass} relative overflow-hidden`}>
      {/* Background Photos - only in background mode */}
      {showPhotosInBackground && (
        <PhotoBackground photos={backgroundPhotos} />
      )}
      {/* Floating sad GIFs */}
      {floatingSadGifs.map((item) => (
        <div
          key={item.id}
          className="absolute w-16 h-16 rounded-lg overflow-hidden shadow-lg animate-float-fade pointer-events-none z-20"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
        >
          <img src={item.gif} alt="Sad" className="w-full h-full object-cover" />
        </div>
      ))}

      <div className="max-w-md w-full text-center z-10">
        {/* Theme-specific GIF */}
        <div className="w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/30">
          <img
            src={NEUTRAL_GIFS_BY_THEME[config.theme] || NEUTRAL_GIFS_BY_THEME.cute}
            alt="Valentine"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <h1 className={`text-2xl md:text-3xl font-bold ${styles.text} mb-2 drop-shadow-lg`}>
          {config.headline || "Will You Be My Valentine?"}
        </h1>
        <p className={`text-lg ${styles.subtext} mb-8 drop-shadow-md`}>
          {config.subtext || "I really like you... 💕"}
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div
            className="flex items-center justify-center transition-all"
            style={{
              minWidth: `${140 * yesScale}px`,
              minHeight: `${52 * yesScale}px`,
            }}
          >
            <button
              onClick={handleYesClick}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all whitespace-nowrap ${styles.buttonYes}`}
              style={{
                transform: `scale(${yesScale})`,
              }}
            >
              {config.yesButtonText || "Yes! 💕"}
            </button>
          </div>

          <button
            onClick={handleNoClick}
            onMouseEnter={() => setIsHoveringNo(true)}
            onMouseLeave={() => setIsHoveringNo(false)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${styles.buttonNo}`}
            style={{
              transform: `scale(${Math.max(0.6, 1 - noIndex * 0.05)})`,
              opacity: Math.max(0.4, 1 - noIndex * 0.04),
            }}
          >
            {NO_BUTTON_VARIANTS[noIndex] || config.noButtonText || "No"}
          </button>
        </div>
      </div>

      {/* Background floating hearts */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute text-3xl opacity-30 animate-float pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          💕
        </div>
      ))}
    </div>
  );
}
