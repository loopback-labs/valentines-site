import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Loader2, Heart, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface DatePreferences {
  selectedDate: Date;
  selectedTime: string;
  foodPreference: string;
  activityPreference: string;
}

interface DatePlanningFormProps {
  availableDates: Date[];
  timeSlots: string[];
  foodOptions: string[];
  activityOptions: string[];
  onSubmit: (preferences: DatePreferences) => Promise<void>;
  theme?: "cute" | "minimal" | "dark" | "pastel" | "chaotic";
}

const themeStyles = {
  cute: {
    card: "bg-white/90 backdrop-blur border border-pink-200",
    text: "text-pink-800",
    textMuted: "text-pink-600",
    button: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white",
    radio: "border-pink-300 text-pink-500 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500",
    success: "text-pink-600",
  },
  minimal: {
    card: "bg-white border border-gray-200",
    text: "text-gray-900",
    textMuted: "text-gray-600",
    button: "bg-gray-900 hover:bg-gray-800 text-white",
    radio: "border-gray-300 text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900",
    success: "text-gray-700",
  },
  dark: {
    card: "bg-gray-800/90 backdrop-blur border border-purple-500/30",
    text: "text-white",
    textMuted: "text-purple-300",
    button: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white",
    radio: "border-purple-500 text-purple-400 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500",
    success: "text-purple-300",
  },
  pastel: {
    card: "bg-white/80 backdrop-blur border border-purple-200",
    text: "text-purple-800",
    textMuted: "text-purple-600",
    button: "bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white",
    radio: "border-purple-300 text-purple-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500",
    success: "text-purple-600",
  },
  chaotic: {
    card: "bg-white/20 backdrop-blur border border-white/30",
    text: "text-white",
    textMuted: "text-yellow-200",
    button: "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-600 text-white animate-pulse",
    radio: "border-yellow-300 text-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400",
    success: "text-yellow-300",
  },
};

export default function DatePlanningForm({
  availableDates,
  timeSlots,
  foodOptions,
  activityOptions,
  onSubmit,
  theme = "cute",
}: DatePlanningFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [foodPreference, setFoodPreference] = useState<string>("");
  const [activityPreference, setActivityPreference] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const styles = themeStyles[theme];

  const isFormValid =
    selectedDate && selectedTime && foodPreference && activityPreference;

  const handleSubmit = async () => {
    if (!isFormValid || !selectedDate) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        selectedDate,
        selectedTime,
        foodPreference,
        activityPreference,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit preferences:", error);
    }
    setIsSubmitting(false);
  };

  // Filter to only show available dates
  const isDateAvailable = (date: Date) => {
    return availableDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
  };

  if (isSubmitted) {
    return (
      <div className={`rounded-xl p-6 text-center ${styles.card}`}>
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4`}>
          <Check className="w-6 h-6 text-green-600" />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${styles.text}`}>
          Perfect! 💕
        </h3>
        <p className={`${styles.textMuted}`}>
          Can't wait for our date!
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 space-y-6 ${styles.card}`}>
      <div className="text-center">
        <h3 className={`text-lg font-bold mb-1 ${styles.text}`}>
          Let's plan our date! 📅
        </h3>
        <p className={`text-sm ${styles.textMuted}`}>
          Pick what works best for you
        </p>
      </div>

      {/* Date Selection */}
      <div className="space-y-2">
        <Label className={`text-sm font-medium ${styles.text}`}>
          Pick a Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Choose a date..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => !isDateAvailable(date)}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Selection */}
      {timeSlots.length > 0 && (
        <div className="space-y-2">
          <Label className={`text-sm font-medium ${styles.text}`}>
            Pick a Time
          </Label>
          <RadioGroup
            value={selectedTime}
            onValueChange={setSelectedTime}
            className="grid grid-cols-2 gap-2"
          >
            {timeSlots.map((slot) => (
              <div key={slot} className="flex items-center space-x-2">
                <RadioGroupItem value={slot} id={`time-${slot}`} className={styles.radio} />
                <Label htmlFor={`time-${slot}`} className={`text-sm cursor-pointer ${styles.textMuted}`}>
                  {slot}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Food Preference */}
      {foodOptions.length > 0 && (
        <div className="space-y-2">
          <Label className={`text-sm font-medium ${styles.text}`}>
            Food Preference 🍽️
          </Label>
          <RadioGroup
            value={foodPreference}
            onValueChange={setFoodPreference}
            className="grid grid-cols-2 gap-2"
          >
            {foodOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`food-${option}`} className={styles.radio} />
                <Label htmlFor={`food-${option}`} className={`text-sm cursor-pointer ${styles.textMuted}`}>
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Activity Preference */}
      {activityOptions.length > 0 && (
        <div className="space-y-2">
          <Label className={`text-sm font-medium ${styles.text}`}>
            Activity Preference 🎯
          </Label>
          <RadioGroup
            value={activityPreference}
            onValueChange={setActivityPreference}
            className="grid grid-cols-2 gap-2"
          >
            {activityOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`activity-${option}`} className={styles.radio} />
                <Label htmlFor={`activity-${option}`} className={`text-sm cursor-pointer ${styles.textMuted}`}>
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!isFormValid || isSubmitting}
        className={`w-full ${styles.button}`}
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Heart className="w-4 h-4 mr-2" fill="currentColor" />
        )}
        {isSubmitting ? "Saving..." : "Lock It In! 💕"}
      </Button>
    </div>
  );
}
