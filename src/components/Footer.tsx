import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-6 px-4 border-t bg-card/50">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Made With Love</span>
        <Heart className="w-4 h-4 text-primary fill-primary" />
      </div>
    </footer>
  );
}
