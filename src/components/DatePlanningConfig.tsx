import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CalendarIcon, X, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const DEFAULT_TIME_SLOTS = [
  "7-10 AM",
  "10 AM-12 PM",
  "12-2 PM",
  "2-5 PM",
  "5-8 PM",
  "8-10 PM",
  "Post 10 PM",
];

export const DEFAULT_FOOD_OPTIONS = [
  "Indian",
  "Asian",
  "North Indian",
  "South Indian",
];

export const DEFAULT_ACTIVITY_OPTIONS = [
  "Movie night",
  "Dinner date",
  "Walk in the park",
  "Cozy night in",
  "Arcade",
];

interface DatePlanningConfigProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  availableDates: Date[];
  onAvailableDatesChange: (dates: Date[]) => void;
  timeSlots: string[];
  onTimeSlotsChange: (slots: string[]) => void;
  foodOptions: string[];
  onFoodOptionsChange: (options: string[]) => void;
  activityOptions: string[];
  onActivityOptionsChange: (options: string[]) => void;
}

export default function DatePlanningConfig({
  enabled,
  onEnabledChange,
  availableDates,
  onAvailableDatesChange,
  timeSlots,
  onTimeSlotsChange,
  foodOptions,
  onFoodOptionsChange,
  activityOptions,
  onActivityOptionsChange,
}: DatePlanningConfigProps) {
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [newFoodOption, setNewFoodOption] = useState("");
  const [newActivityOption, setNewActivityOption] = useState("");

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const exists = availableDates.some(
      d => d.toDateString() === date.toDateString()
    );
    
    if (exists) {
      onAvailableDatesChange(
        availableDates.filter(d => d.toDateString() !== date.toDateString())
      );
    } else {
      onAvailableDatesChange([...availableDates, date]);
    }
  };

  const removeDate = (date: Date) => {
    onAvailableDatesChange(
      availableDates.filter(d => d.toDateString() !== date.toDateString())
    );
  };

  const toggleArrayItem = (
    array: string[],
    item: string,
    onChange: (items: string[]) => void
  ) => {
    if (array.includes(item)) {
      onChange(array.filter(i => i !== item));
    } else {
      onChange([...array, item]);
    }
  };

  const addCustomOption = (
    value: string,
    currentOptions: string[],
    onChange: (options: string[]) => void,
    clearInput: () => void
  ) => {
    const trimmed = value.trim();
    if (trimmed && !currentOptions.includes(trimmed)) {
      onChange([...currentOptions, trimmed]);
      clearInput();
    }
  };

  const removeCustomOption = (
    option: string,
    currentOptions: string[],
    onChange: (options: string[]) => void
  ) => {
    onChange(currentOptions.filter(o => o !== option));
  };

  // Get all options (defaults + custom ones already in the list)
  const allTimeSlots = [...new Set([...DEFAULT_TIME_SLOTS, ...timeSlots])];
  const allFoodOptions = [...new Set([...DEFAULT_FOOD_OPTIONS, ...foodOptions])];
  const allActivityOptions = [...new Set([...DEFAULT_ACTIVITY_OPTIONS, ...activityOptions])];

  return (
    <div className="space-y-6">
      {/* Enable Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="date-planning-toggle" className="text-base font-medium">
            Enable Date Planning Form
          </Label>
          <p className="text-sm text-muted-foreground">
            Show a form after "Yes" to collect date preferences
          </p>
        </div>
        <Switch
          id="date-planning-toggle"
          checked={enabled}
          onCheckedChange={onEnabledChange}
        />
      </div>

      {enabled && (
        <div className="space-y-6 pt-4 border-t border-border">
          {/* Available Dates */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Available Dates</Label>
            <p className="text-xs text-muted-foreground">
              Select which dates you're available for the date
            </p>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {availableDates.length > 0 
                    ? `${availableDates.length} date(s) selected` 
                    : "Pick dates..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={undefined}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                  modifiers={{
                    selected: availableDates,
                  }}
                  modifiersStyles={{
                    selected: {
                      backgroundColor: "hsl(var(--primary))",
                      color: "hsl(var(--primary-foreground))",
                    },
                  }}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {availableDates.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {availableDates
                  .sort((a, b) => a.getTime() - b.getTime())
                  .map((date) => (
                    <Badge key={date.toISOString()} variant="secondary" className="gap-1">
                      {format(date, "MMM d, yyyy")}
                      <button
                        type="button"
                        onClick={() => removeDate(date)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
              </div>
            )}
          </div>

          {/* Time Slots */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Time Slots</Label>
            <p className="text-xs text-muted-foreground">
              Select which time slots are available
            </p>
            <div className="grid grid-cols-2 gap-2">
              {allTimeSlots.map((slot) => (
                <label
                  key={slot}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Checkbox
                    checked={timeSlots.includes(slot)}
                    onCheckedChange={() => toggleArrayItem(timeSlots, slot, onTimeSlotsChange)}
                  />
                  <span className="text-sm">{slot}</span>
                  {!DEFAULT_TIME_SLOTS.includes(slot) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeCustomOption(slot, timeSlots, onTimeSlotsChange);
                      }}
                      className="ml-auto text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom time slot..."
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomOption(newTimeSlot, timeSlots, onTimeSlotsChange, () => setNewTimeSlot(""));
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addCustomOption(newTimeSlot, timeSlots, onTimeSlotsChange, () => setNewTimeSlot(""))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Food Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Food Options</Label>
            <p className="text-xs text-muted-foreground">
              Select which food options to offer
            </p>
            <div className="grid grid-cols-2 gap-2">
              {allFoodOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Checkbox
                    checked={foodOptions.includes(option)}
                    onCheckedChange={() => toggleArrayItem(foodOptions, option, onFoodOptionsChange)}
                  />
                  <span className="text-sm">{option}</span>
                  {!DEFAULT_FOOD_OPTIONS.includes(option) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeCustomOption(option, foodOptions, onFoodOptionsChange);
                      }}
                      className="ml-auto text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom food option..."
                value={newFoodOption}
                onChange={(e) => setNewFoodOption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomOption(newFoodOption, foodOptions, onFoodOptionsChange, () => setNewFoodOption(""));
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addCustomOption(newFoodOption, foodOptions, onFoodOptionsChange, () => setNewFoodOption(""))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Activity Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Activity Options</Label>
            <p className="text-xs text-muted-foreground">
              Select which activities to offer
            </p>
            <div className="grid grid-cols-2 gap-2">
              {allActivityOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Checkbox
                    checked={activityOptions.includes(option)}
                    onCheckedChange={() => toggleArrayItem(activityOptions, option, onActivityOptionsChange)}
                  />
                  <span className="text-sm">{option}</span>
                  {!DEFAULT_ACTIVITY_OPTIONS.includes(option) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeCustomOption(option, activityOptions, onActivityOptionsChange);
                      }}
                      className="ml-auto text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom activity..."
                value={newActivityOption}
                onChange={(e) => setNewActivityOption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomOption(newActivityOption, activityOptions, onActivityOptionsChange, () => setNewActivityOption(""));
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addCustomOption(newActivityOption, activityOptions, onActivityOptionsChange, () => setNewActivityOption(""))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
