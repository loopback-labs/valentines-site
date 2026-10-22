// Random layouts for purely decorative elements. Call these from a lazy
// useState initializer, or from an event handler to reshuffle on purpose
// (the templates move their hearts on each "No"), never during render.

export function randomFloatingHearts(count: number, minSize = 20, sizeRange = 40) {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: minSize + Math.random() * sizeRange,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
  }));
}

const CONFETTI_COLORS = ["#ff69b4", "#ff1493", "#ff6347", "#ffd700", "#9370db"];

export function randomConfetti(count: number) {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 2,
    round: Math.random() > 0.5,
  }));
}

const HEART_EMOJIS = ["💕", "💖", "💗", "💓", "💝"];

export function randomRisingHearts(count: number) {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
  }));
}
