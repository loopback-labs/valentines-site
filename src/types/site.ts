export type Theme = "cute" | "minimal" | "dark" | "pastel" | "chaotic";

export type ThemeMeta = {
  id: Theme;
  name: string;
  emoji: string;
  description: string;
};

export const THEMES: ThemeMeta[] = [
  { id: "cute", name: "Cute", emoji: "💕", description: "Soft pinks, hearts, romantic" },
  { id: "minimal", name: "Minimal", emoji: "✨", description: "Clean, modern, understated" },
  { id: "dark", name: "Dark", emoji: "🌙", description: "Moody, elegant, mysterious" },
  { id: "pastel", name: "Pastel", emoji: "🍬", description: "Soft colors, dreamy" },
  { id: "chaotic", name: "Chaotic", emoji: "🎪", description: "Extra animations, playful" },
];

export const THEME_EMOJIS: Record<Theme, string> = Object.fromEntries(
  THEMES.map((t) => [t.id, t.emoji]),
) as Record<Theme, string>;
