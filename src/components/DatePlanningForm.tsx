import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Loader2, Heart, Check, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Theme } from "@/types/site";

export interface DatePreferences {
  selectedDate: Date;
  selectedTime: string;
  foodPreference: string;
  activityPreference: string;
}

interface DatePlanningFormProps {
  timeSlots: string[];
  foodOptions: string[];
  activityOptions: string[];
  onSubmit: (preferences: DatePreferences) => Promise<void>;
  theme?: Theme;
}

const themeStyles = {
  cute: {
    card: "bg-white/90 backdrop-blur border border-pink-200",
    text: "text-pink-800",
    textMuted: "text-pink-600",
    button: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white",
    buttonOutline: "border-pink-300 text-pink-600 hover:bg-pink-50",
    optionCard: "border-pink-200 hover:border-pink-400 hover:bg-pink-50 data-[selected=true]:border-pink-500 data-[selected=true]:bg-pink-50",
    optionSelected: "border-pink-500 bg-pink-50",
    success: "text-pink-600",
  },
  minimal: {
    card: "bg-white border border-gray-200",
    text: "text-gray-900",
    textMuted: "text-gray-600",
    button: "bg-gray-900 hover:bg-gray-800 text-white",
    buttonOutline: "border-gray-300 text-gray-700 hover:bg-gray-50",
    optionCard: "border-gray-200 hover:border-gray-400 hover:bg-gray-50 data-[selected=true]:border-gray-900 data-[selected=true]:bg-gray-50",
    optionSelected: "border-gray-900 bg-gray-50",
    success: "text-gray-700",
  },
  dark: {
    card: "bg-gray-800/90 backdrop-blur border border-purple-500/30",
    text: "text-white",
    textMuted: "text-purple-300",
    button: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white",
    buttonOutline: "border-purple-500 text-purple-300 hover:bg-purple-900/50",
    optionCard: "border-purple-500/30 hover:border-purple-400 hover:bg-purple-900/30 data-[selected=true]:border-purple-500 data-[selected=true]:bg-purple-900/50",
    optionSelected: "border-purple-500 bg-purple-900/50",
    success: "text-purple-300",
  },
  pastel: {
    card: "bg-white/80 backdrop-blur border border-purple-200",
    text: "text-purple-800",
    textMuted: "text-purple-600",
    button: "bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white",
    buttonOutline: "border-purple-300 text-purple-600 hover:bg-purple-50",
    optionCard: "border-purple-200 hover:border-purple-400 hover:bg-purple-50 data-[selected=true]:border-purple-500 data-[selected=true]:bg-purple-50",
    optionSelected: "border-purple-500 bg-purple-50",
    success: "text-purple-600",
  },
  chaotic: {
    card: "bg-white/20 backdrop-blur border border-white/30",
    text: "text-white",
    textMuted: "text-yellow-200",
    button: "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-600 text-white",
    buttonOutline: "border-white/50 text-white hover:bg-white/20",
    optionCard: "border-white/30 hover:border-yellow-300 hover:bg-white/10 data-[selected=true]:border-yellow-400 data-[selected=true]:bg-white/20",
    optionSelected: "border-yellow-400 bg-white/20",
    success: "text-yellow-300",
  },
};

type Step = "cta" | "date" | "time" | "food" | "activity" | "submitted";

export default function DatePlanningForm({
  timeSlots,
  foodOptions,
  activityOptions,
  onSubmit,
  theme = "cute",
}: DatePlanningFormProps) {
  const [step, setStep] = useState<Step>("cta");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [foodPreference, setFoodPreference] = useState<string>("");
  const [activityPreference, setActivityPreference] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = themeStyles[theme];

  const handleNext = () => {
    if (step === "cta") setStep("date");
    else if (step === "date" && selectedDate) setStep("time");
    else if (step === "time" && selectedTime) setStep("food");
    else if (step === "food" && foodPreference) setStep("activity");
    else if (step === "activity" && activityPreference) handleSubmit();
  };

  const handleBack = () => {
    if (step === "date") setStep("cta");
    else if (step === "time") setStep("date");
    else if (step === "food") setStep("time");
    else if (step === "activity") setStep("food");
  };

  const handleSubmit = async () => {
    if (!selectedDate) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        selectedDate,
        selectedTime,
        foodPreference,
        activityPreference,
      });
      setStep("submitted");
    } catch (error) {
      console.error("Failed to submit preferences:", error);
    }
    setIsSubmitting(false);
  };

  const canProceed = () => {
    if (step === "cta") return true;
    if (step === "date") return !!selectedDate;
    if (step === "time") return !!selectedTime;
    if (step === "food") return !!foodPreference;
    if (step === "activity") return !!activityPreference;
    return false;
  };

  const getStepNumber = () => {
    const steps: Step[] = ["date", "time", "food", "activity"];
    const idx = steps.indexOf(step as Step);
    return idx >= 0 ? idx + 1 : 0;
  };

  const totalSteps = 4;

  // CTA Screen
  if (step === "cta") {
    return (
      <div className={`rounded-xl p-6 text-center ${styles.card}`}>
        <Sparkles className={`w-10 h-10 mx-auto mb-3 ${styles.text}`} />
        <h3 className={`text-xl font-bold mb-2 ${styles.text}`}>
          Now let's plan our date! 📅
        </h3>
        <p className={`text-sm mb-4 ${styles.textMuted}`}>
          Answer a few quick questions to pick the perfect time
        </p>
        <Button
          onClick={handleNext}
          className={`w-full ${styles.button}`}
        >
          Let's Go!
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  // Submitted Screen
  if (step === "submitted") {
    return (
      <div className={`rounded-xl p-6 text-center ${styles.card}`}>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
          <Check className="w-6 h-6 text-green-600" />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${styles.text}`}>
          Perfect! 💕
        </h3>
        <p className={styles.textMuted}>
          Can't wait for our date!
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 ${styles.card}`}>
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`w-2 h-2 rounded-full transition-all ${
              n <= getStepNumber()
                ? styles.button.includes("gradient")
                  ? "bg-gradient-to-r from-pink-500 to-rose-500"
                  : "bg-gray-900"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Date Step */}
      {step === "date" && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className={`text-lg font-bold mb-1 ${styles.text}`}>
              When works for you? 📅
            </h3>
            <p className={`text-sm ${styles.textMuted}`}>
              Pick a date that works best
            </p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Choose a date..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Time Step */}
      {step === "time" && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className={`text-lg font-bold mb-1 ${styles.text}`}>
              What time? ⏰
            </h3>
            <p className={`text-sm ${styles.textMuted}`}>
              Pick your preferred time slot
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                data-selected={selectedTime === slot}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${styles.optionCard} ${
                  selectedTime === slot ? styles.optionSelected : ""
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Food Step */}
      {step === "food" && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className={`text-lg font-bold mb-1 ${styles.text}`}>
              What are you craving? 🍽️
            </h3>
            <p className={`text-sm ${styles.textMuted}`}>
              Pick your food preference
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {foodOptions.map((option) => (
              <button
                key={option}
                onClick={() => setFoodPreference(option)}
                data-selected={foodPreference === option}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${styles.optionCard} ${
                  foodPreference === option ? styles.optionSelected : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Activity Step */}
      {step === "activity" && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className={`text-lg font-bold mb-1 ${styles.text}`}>
              What should we do? 🎯
            </h3>
            <p className={`text-sm ${styles.textMuted}`}>
              Pick an activity you'd enjoy
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {activityOptions.map((option) => (
              <button
                key={option}
                onClick={() => setActivityPreference(option)}
                data-selected={activityPreference === option}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${styles.optionCard} ${
                  activityPreference === option ? styles.optionSelected : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-2 mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          className={`flex-1 ${styles.buttonOutline}`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className={`flex-1 ${styles.button}`}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : step === "activity" ? (
            <Heart className="w-4 h-4 mr-2" fill="currentColor" />
          ) : (
            <ArrowRight className="w-4 h-4 mr-2" />
          )}
          {isSubmitting ? "Saving..." : step === "activity" ? "Lock It In! 💕" : "Next"}
        </Button>
      </div>
    </div>
  );
}
