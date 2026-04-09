import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Sparkles, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    loading,
    signIn,
    signUp,
    signInWithOAuth
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");

  useEffect(() => {
    if (loading || user || location.pathname !== "/auth/callback") return;

    toast.error("Google sign-in failed. Please try again.");
    navigate("/auth", { replace: true });
  }, [loading, user, location.pathname, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-love">
        <div className="animate-pulse">
          <Heart className="w-16 h-16 text-white animate-float" fill="currentColor" />
        </div>
      </div>;
  }
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const {
      error
    } = await signIn(loginEmail, loginPassword);
    if (error) {
      toast.error(error.message || "Failed to sign in");
    } else {
      toast.success("Welcome back! 💕");
    }
    setIsLoading(false);
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const {
      error
    } = await signUp(signupEmail, signupPassword, signupName);
    if (error) {
      toast.error(error.message || "Failed to create account");
    } else {
      toast.success("Account created! Check your email to verify 💌");
    }
    setIsLoading(false);
  };
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const {
      error
    } = await signInWithOAuth("google");
    if (error) {
      toast.error(error.message || "Failed to sign in with Google");
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-love relative overflow-hidden">
      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => <Heart key={i} className="absolute text-primary-foreground/20 animate-float" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${20 + Math.random() * 40}px`,
        height: `${20 + Math.random() * 40}px`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${3 + Math.random() * 2}s`
      }} fill="currentColor" />)}
      </div>

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 z-10">
        <div className="relative">
          <Heart className="w-12 h-12 text-primary-foreground" fill="currentColor" />
          <Sparkles className="w-6 h-6 text-accent absolute -top-1 -right-1" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">Love Link</h1>
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-md z-10 shadow-2xl border-0 backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-gradient-love bg-clip-text">
            Create Magic ✨
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Build your own "Will You Be My Valentine?" site
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="space-y-4">
                <Button type="button" variant="outline" className="w-full h-12 text-lg font-medium" onClick={handleGoogleSignIn} disabled={isLoading}>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input id="login-email" type="email" placeholder="you@example.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <Input id="login-password" type="password" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required className="h-12" />
                  </div>
                  <Button type="submit" className="w-full h-12 text-lg font-semibold bg-gradient-love hover:opacity-90 transition-opacity glow-pink" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In 💕"}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <div className="space-y-4">
                <Button type="button" variant="outline" className="w-full h-12 text-lg font-medium" onClick={handleGoogleSignIn} disabled={isLoading}>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Display Name
                    </Label>
                    <Input id="signup-name" type="text" placeholder="Your name" value={signupName} onChange={e => setSignupName(e.target.value)} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input id="signup-email" type="email" placeholder="you@example.com" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <Input id="signup-password" type="password" placeholder="••••••••" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required minLength={6} className="h-12" />
                  </div>
                  <Button type="submit" className="w-full h-12 text-lg font-semibold bg-gradient-love hover:opacity-90 transition-opacity glow-pink" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account ✨"}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="mt-6 text-white/80 text-sm z-10">
        Made with 💕 for spreading love
      </p>
    </div>;
}