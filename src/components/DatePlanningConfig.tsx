import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

export const DEFAULT_TIME_SLOTS = [
  "7-10 AM",
  "10 AM-12 PM",
  "12-2 PM",
  "2-5 PM",
  "5-8 PM",
  "8-10 PM",
  "Post 10 PM",
];

export const DEFAULT_FOOD_OPTIONS = ["Indian", "Asian", "North Indian", "South Indian"];

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
  timeSlots: string[];
  onTimeSlotsChange: (slots: string[]) => void;
  foodOptions: string[];
  onFoodOptionsChange: (options: string[]) => void;
  activityOptions: string[];
  onActivityOptionsChange: (options: string[]) => void;
}

function OptionEditor({
  sectionLabel,
  sectionHint,
  defaultPresets,
  options,
  onOptionsChange,
  addPlaceholder,
}: {
  sectionLabel: string;
  sectionHint: string;
  defaultPresets: readonly string[];
  options: string[];
  onOptionsChange: (items: string[]) => void;
  addPlaceholder: string;
}) {
  const [newValue, setNewValue] = useState("");

  const allChoices = [...new Set([...defaultPresets, ...options])];

  const toggleArrayItem = (item: string) => {
    if (options.includes(item)) {
      onOptionsChange(options.filter((i) => i !== item));
    } else {
      onOptionsChange([...options, item]);
    }
  };

  const addCustomOption = () => {
    const trimmed = newValue.trim();
    if (trimmed && !options.includes(trimmed)) {
      onOptionsChange([...options, trimmed]);
      setNewValue("");
    }
  };

  const removeCustomOption = (option: string) => {
    onOptionsChange(options.filter((o) => o !== option));
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{sectionLabel}</Label>
      <p className="text-xs text-muted-foreground">{sectionHint}</p>
      <div className="grid grid-cols-2 gap-2">
        {allChoices.map((choice) => (
          <label key={choice} className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={options.includes(choice)}
              onCheckedChange={() => toggleArrayItem(choice)}
            />
            <span className="text-sm">{choice}</span>
            {!defaultPresets.includes(choice) && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  removeCustomOption(choice);
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
          placeholder={addPlaceholder}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustomOption();
            }
          }}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="icon" onClick={addCustomOption}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function DatePlanningConfig({
  enabled,
  onEnabledChange,
  timeSlots,
  onTimeSlotsChange,
  foodOptions,
  onFoodOptionsChange,
  activityOptions,
  onActivityOptionsChange,
}: DatePlanningConfigProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="date-planning-toggle" className="text-base font-medium">
            Enable Date Planning Form
          </Label>
          <p className="text-sm text-muted-foreground">
            Show a form after "Yes" to collect date preferences
          </p>
        </div>
        <Switch id="date-planning-toggle" checked={enabled} onCheckedChange={onEnabledChange} />
      </div>

      {enabled && (
        <div className="space-y-6 pt-4 border-t border-border">
          <div className="rounded-lg bg-muted/50 p-4 border border-border">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-primary">📅</div>
              <div>
                <p className="text-sm font-medium">Date Selection</p>
                <p className="text-xs text-muted-foreground">
                  Visitors will see a date picker to choose any future date for the date
                </p>
              </div>
            </div>
          </div>

          <OptionEditor
            sectionLabel="Time Slots"
            sectionHint="Select which time slots are available"
            defaultPresets={DEFAULT_TIME_SLOTS}
            options={timeSlots}
            onOptionsChange={onTimeSlotsChange}
            addPlaceholder="Add custom time slot..."
          />

          <OptionEditor
            sectionLabel="Food Options"
            sectionHint="Select which food options to offer"
            defaultPresets={DEFAULT_FOOD_OPTIONS}
            options={foodOptions}
            onOptionsChange={onFoodOptionsChange}
            addPlaceholder="Add custom food option..."
          />

          <OptionEditor
            sectionLabel="Activity Options"
            sectionHint="Select which activities to offer"
            defaultPresets={DEFAULT_ACTIVITY_OPTIONS}
            options={activityOptions}
            onOptionsChange={onActivityOptionsChange}
            addPlaceholder="Add custom activity..."
          />
        </div>
      )}
    </div>
  );
}
