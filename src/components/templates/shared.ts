import type { Theme } from "@/types/site";

export const NO_BUTTON_VARIANTS = [
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
] as const;

export const NEUTRAL_GIFS_BY_THEME: Record<Theme, string> = {
  cute:
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm1jN2tiem55bXBrbTlja3Q1MHNwc2wzM3podzd1OXYzejFvNXd0byZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8QbwUh40Hl96yMgvOx/giphy.gif",
  minimal: "https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif",
  dark: "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif",
  pastel: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif",
  chaotic: "https://media.giphy.com/media/nR4L10XlJcSeQ/giphy.gif",
};
