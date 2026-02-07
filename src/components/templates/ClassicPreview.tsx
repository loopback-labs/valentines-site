import { useState, useRef, useEffect } from "react";
import { Heart } from "lucide-react";

interface ValentinePreviewProps {
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

const themeStyles = {
  cute: {
    bg: "bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100",
    text: "text-pink-800",
    buttonYes: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white",
    buttonNo: "bg-white border-2 border-pink-300 text-pink-600 hover:bg-pink-50",
    accent: "text-pink-500",
  },
  minimal: {
    bg: "bg-white",
    text: "text-gray-900",
    buttonYes: "bg-gray-900 hover:bg-gray-800 text-white",
    buttonNo: "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
    accent: "text-gray-600",
  },
  dark: {
    bg: "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900",
    text: "text-white",
    buttonYes: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white",
    buttonNo: "bg-gray-800 border-2 border-purple-500/50 text-purple-300 hover:bg-gray-700",
    accent: "text-purple-400",
  },
  pastel: {
    bg: "bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100",
    text: "text-purple-800",
    buttonYes: "bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white",
    buttonNo: "bg-white/80 border-2 border-purple-300 text-purple-600 hover:bg-white",
    accent: "text-purple-500",
  },
  chaotic: {
    bg: "bg-gradient-chaotic",
    text: "text-white",
    buttonYes: "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-600 text-white animate-pulse",
    buttonNo: "bg-white/20 backdrop-blur border-2 border-white/50 text-white hover:bg-white/30",
    accent: "text-yellow-300",
  },
};

export default function ValentinePreview({ config, isLive = false, onYesClick }: ValentinePreviewProps) {
  const [noIndex, setNoIndex] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const styles = themeStyles[config.theme];

  const moveNoButton = () => {
    if (!containerRef.current || !noButtonRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const button = noButtonRef.current.getBoundingClientRect();
    
    // Calculate the button's original position (center of container)
    const buttonWidth = button.width;
    const buttonHeight = button.height;
    
    // Safe padding from edges
    const padding = 20;
    
    // Calculate max bounds relative to button's starting position
    // The button starts roughly in the center, so we need to calculate
    // how far it can move in each direction
    const maxLeft = -(container.width / 2 - buttonWidth / 2 - padding);
    const maxRight = container.width / 2 - buttonWidth / 2 - padding;
    const maxTop = -(container.height / 2 - buttonHeight - padding);
    const maxBottom = container.height / 2 - buttonHeight - padding;
    
    // Generate random position within bounds
    const newX = Math.random() * (maxRight - maxLeft) + maxLeft;
    const newY = Math.random() * (maxBottom - maxTop) + maxTop;
    
    setNoPosition({ x: newX, y: newY });
    setNoIndex((prev) => Math.min(prev + 1, noButtonVariants.length - 1));
    setYesScale((prev) => Math.min(prev + 0.1, 1.8));
  };

  const handleYesClick = () => {
    setShowSuccess(true);
    if (onYesClick) onYesClick();
  };

  // Reset on config change (for preview)
  useEffect(() => {
    setNoIndex(0);
    setNoPosition({ x: 0, y: 0 });
    setYesScale(1);
    setShowSuccess(false);
  }, [config.theme]);

  if (showSuccess) {
    return (
      <div className={`h-full flex flex-col items-center justify-center p-8 ${styles.bg} relative overflow-hidden`}>
        {/* Confetti */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: ["#ff69b4", "#ff1493", "#ff6347", "#ffd700", "#9370db"][
                Math.floor(Math.random() * 5)
              ],
              animationDelay: `${Math.random() * 2}s`,
              borderRadius: Math.random() > 0.5 ? "50%" : "0",
            }}
          />
        ))}
        
        <Heart
          className={`w-24 h-24 ${styles.accent} animate-bounce mb-6`}
          fill="currentColor"
        />
        <h1 className={`text-3xl md:text-4xl font-bold ${styles.text} text-center mb-4`}>
          Yay! 🎉
        </h1>
        <p className={`text-xl ${styles.text} opacity-80 text-center`}>
          I knew you'd say yes! 💕
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`h-full flex flex-col items-center justify-center p-8 ${styles.bg} relative overflow-hidden`}
    >
      {/* Floating hearts for cute/chaotic themes */}
      {(config.theme === "cute" || config.theme === "chaotic") && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <Heart
              key={i}
              className={`absolute ${styles.accent} opacity-20 animate-float`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${15 + Math.random() * 25}px`,
                height: `${15 + Math.random() * 25}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
              fill="currentColor"
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="text-center z-10 max-w-md">
        <Heart
          className={`w-16 h-16 mx-auto mb-6 ${styles.accent} ${
            config.theme === "chaotic" ? "animate-bounce" : "animate-pulse"
          }`}
          fill="currentColor"
        />

        <h1
          className={`text-2xl md:text-3xl lg:text-4xl font-bold ${styles.text} mb-4 ${
            config.theme === "chaotic" ? "animate-wiggle" : ""
          }`}
        >
          {config.headline || "Will You Be My Valentine?"}
        </h1>

        <p className={`text-lg ${styles.text} opacity-80 mb-8`}>
          {config.subtext || "I really like you... 💕"}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
          <button
            onClick={handleYesClick}
            className={`px-8 py-3 rounded-full font-semibold transition-all shadow-lg ${styles.buttonYes}`}
            style={{ transform: `scale(${yesScale})` }}
          >
            {config.yesButtonText || "Yes! 💕"}
          </button>

          <button
            ref={noButtonRef}
            onMouseEnter={moveNoButton}
            onClick={moveNoButton}
            className={`px-8 py-3 rounded-full font-semibold transition-all ${styles.buttonNo}`}
            style={{
              transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
              transition: "transform 0.2s ease-out",
            }}
          >
            {noButtonVariants[noIndex] || config.noButtonText || "No"}
          </button>
        </div>
      </div>
    </div>
  );
}
