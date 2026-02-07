import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type TemplateId = "classic" | "meme_gif" | "teddy_bear";

interface Template {
  id: TemplateId;
  name: string;
  emoji: string;
  description: string;
  features: string[];
}

const templates: Template[] = [
  {
    id: "classic",
    name: "Classic",
    emoji: "💕",
    description: "The 'No' button escapes your cursor",
    features: ["Floating hearts", "Escaping button", "5 themes"],
  },
  {
    id: "meme_gif",
    name: "Meme GIF",
    emoji: "🐱",
    description: "Growing 'Yes' button with animated GIFs",
    features: ["Animated banners", "Growing button", "Meme style"],
  },
  {
    id: "teddy_bear",
    name: "Teddy Bear",
    emoji: "🧸",
    description: "Cute bear with holographic background",
    features: ["Holographic BG", "Floating GIFs", "Growing Yes"],
  },
];

interface TemplateSelectorProps {
  selected: TemplateId;
  onSelect: (template: TemplateId) => void;
}

export default function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={`cursor-pointer transition-all hover-grow ${
            selected === template.id
              ? "border-primary ring-2 ring-primary/20 bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{template.emoji}</span>
                <h3 className="font-semibold text-lg">{template.name}</h3>
              </div>
              {selected === template.id && (
                <div className="bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-3">{template.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {template.features.map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs font-normal">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
