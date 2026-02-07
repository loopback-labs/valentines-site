import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

interface PasswordProtectionConfigProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  password: string;
  onPasswordChange: (password: string) => void;
}

export function PasswordProtectionConfig({
  enabled,
  onEnabledChange,
  password,
  onPasswordChange,
}: PasswordProtectionConfigProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <div>
            <Label htmlFor="password-toggle" className="text-sm font-medium">
              Password Protection
            </Label>
            <p className="text-xs text-muted-foreground">
              Require a password to view this site
            </p>
          </div>
        </div>
        <Switch
          id="password-toggle"
          checked={enabled}
          onCheckedChange={onEnabledChange}
        />
      </div>

      {enabled && (
        <div className="space-y-3 pl-6 border-l-2 border-primary/20">
          <div className="rounded-lg bg-muted/50 p-3 border border-border">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-primary mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Visitors will need to enter this password before they can see your Valentine message
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="site-password" className="text-sm">
              Site Password
            </Label>
            <div className="relative">
              <Input
                id="site-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="Enter a password..."
                className="pr-10"
                maxLength={50}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this password with your Valentine so they can access the site
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface PasswordEntryScreenProps {
  onSubmit: (password: string) => void;
  error?: string;
  isLoading?: boolean;
  theme?: "cute" | "minimal" | "dark" | "pastel" | "chaotic";
}

export function PasswordEntryScreen({
  onSubmit,
  error,
  isLoading,
  theme = "cute",
}: PasswordEntryScreenProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const themeStyles = {
    cute: "bg-gradient-love",
    minimal: "bg-gradient-to-br from-gray-100 to-gray-200",
    dark: "bg-gradient-to-br from-gray-900 to-gray-800",
    pastel: "bg-gradient-dreamy",
    chaotic: "bg-gradient-sunset",
  };

  const textColor = theme === "dark" || theme === "cute" || theme === "chaotic" ? "text-white" : "text-gray-900";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onSubmit(password);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${themeStyles[theme]}`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <Lock className={`w-8 h-8 ${textColor}`} />
          </div>
          <h1 className={`text-2xl font-bold ${textColor}`}>
            This site is password protected 🔒
          </h1>
          <p className={`mt-2 ${textColor} opacity-80`}>
            Enter the password to view this Valentine message
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder:text-gray-500 pr-10"
              maxLength={50}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-200 bg-red-500/20 rounded-lg p-2 text-center">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={!password.trim() || isLoading}
            className="w-full bg-white text-primary hover:bg-white/90"
          >
            {isLoading ? "Checking..." : "Unlock 💕"}
          </Button>
        </form>
      </div>
    </div>
  );
}
