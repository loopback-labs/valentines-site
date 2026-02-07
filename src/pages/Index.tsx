import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Zap, Share2, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
export default function Index() {
  const {
    user,
    loading
  } = useAuth();
  return <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-love opacity-10" />
        
        {/* Floating hearts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => <Heart key={i} className="absolute text-primary opacity-10 animate-float" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${20 + Math.random() * 40}px`,
          height: `${20 + Math.random() * 40}px`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }} fill="currentColor" />)}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Heart className="w-16 h-16 text-primary" fill="hsl(var(--primary))" />
              <Sparkles className="w-8 h-8 text-accent absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-gradient-love bg-clip-text">Love Link</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create the cutest "Will You Be My Valentine?" website where 
            <span className="text-primary font-semibold"> No is not an option! </span>
            💕
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {loading ? <Button size="lg" disabled className="h-14 px-8 text-lg">
                Loading...
              </Button> : user ? <Button asChild size="lg" className="h-14 px-8 text-lg bg-gradient-love hover:opacity-90 glow-pink hover-grow">
                <Link to="/dashboard">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Link>
              </Button> : <Button asChild size="lg" className="h-14 px-8 text-lg bg-gradient-love hover:opacity-90 glow-pink hover-grow">
                <Link to="/auth">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Your Site
                </Link>
              </Button>}
          </div>

          {/* Demo preview */}
          <div className="relative max-w-md mx-auto">
            <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 rounded-2xl p-8 shadow-2xl border transform hover:scale-105 transition-transform">
              <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" fill="currentColor" />
              <h3 className="text-xl font-bold text-pink-800 mb-2">
                Will You Be My Valentine?
              </h3>
              <p className="text-pink-600 mb-4">I really like you... 💕</p>
              <div className="flex gap-3 justify-center">
                <span className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-sm font-semibold">
                  Yes! 💕
                </span>
                <span className="px-6 py-2 bg-white border-2 border-pink-300 text-pink-600 rounded-full text-sm font-semibold">
                  No
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why Choose Love Link?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            The easiest way to create a fun, shareable Valentine's message
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border hover:shadow-lg transition-shadow hover-grow">
              <div className="w-14 h-14 bg-gradient-love rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Super Easy</h3>
              <p className="text-muted-foreground">
                No coding required. Just pick your text, choose a theme, and publish in seconds!
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border hover:shadow-lg transition-shadow hover-grow">
              <div className="w-14 h-14 bg-gradient-sunset rounded-xl flex items-center justify-center mb-4">
                <Share2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Sharing</h3>
              <p className="text-muted-foreground">
                Get your own unique URL to share with that special someone. QR codes included!
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border hover:shadow-lg transition-shadow hover-grow">
              <div className="w-14 h-14 bg-gradient-dreamy rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Responses</h3>
              <p className="text-muted-foreground">
                See when someone views your site and clicks "Yes!" (spoiler: they will! 💕)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Love Calculator CTA */}
      <section className="py-12 px-4 bg-gradient-dreamy/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-card p-8 rounded-2xl border shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Curious about your compatibility?</h3>
            <p className="text-muted-foreground mb-4">
              Try our fun Love Calculator to see how strong your connection is! 💘
            </p>
            <Button asChild variant="outline" className="hover-grow">
              <a href="https://crush-scale.lovable.app/" target="_blank" rel="noopener noreferrer">
                <Heart className="w-4 h-4 mr-2" />
                Try Love Calculator
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-card">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            <span className="font-semibold">Love Link</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Made with 💕 for spreading love
          </p>
        </div>
      </footer>
    </div>;
}