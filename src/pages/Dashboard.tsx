import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Plus,
  Eye,
  MousePointerClick,
  LogOut,
  Sparkles,
  ExternalLink,
  Trash2,
  Copy,
  ChevronDown,
  Calculator,
  Image as ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
interface ValentineSite {
  id: string;
  slug: string;
  headline: string;
  template: string;
  theme: string;
  is_published: boolean;
  view_count: number;
  yes_count: number;
  created_at: string;
}
export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const [sites, setSites] = useState<ValentineSite[]>([]);
  const [loadingSites, setLoadingSites] = useState(true);
  useEffect(() => {
    if (user) {
      fetchSites();
    }
  }, [user]);
  const fetchSites = async () => {
    const { data, error } = await supabase
      .from("valentine_sites")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", {
        ascending: false,
      });
    if (error) {
      toast.error("Failed to load your sites");
      console.error(error);
    } else {
      setSites(data || []);
    }
    setLoadingSites(false);
  };
  const handleSignOut = async () => {
    await signOut();
    toast.success("See you soon! 💕");
  };
  const deleteSite = async (siteId: string) => {
    const { error } = await supabase.from("valentine_sites").delete().eq("id", siteId);
    if (error) {
      toast.error("Failed to delete site");
    } else {
      toast.success("Site deleted");
      setSites(sites.filter((s) => s.id !== siteId));
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <Heart className="w-16 h-16 text-primary animate-float" fill="currentColor" />
        </div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  const themeEmojis: Record<string, string> = {
    cute: "💕",
    minimal: "⬜",
    dark: "🌙",
    pastel: "🍬",
    chaotic: "🎪",
  };
  const templateLabels: Record<
    string,
    {
      name: string;
      emoji: string;
    }
  > = {
    classic: {
      name: "Classic",
      emoji: "💕",
    },
    meme_gif: {
      name: "Meme GIF",
      emoji: "🐱",
    },
    teddy_bear: {
      name: "Teddy Bear",
      emoji: "🧸",
    },
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 hover-grow">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
            <span className="text-xl font-bold text-gradient-love bg-clip-text">Love Link</span>
          </Link>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm text-muted-foreground hover:text-primary transition-colors hidden sm:flex items-center gap-1 outline-none">
                <Sparkles className="w-4 h-4" />
                More Tools
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a
                    href="https://lovemeter.merchandice.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Calculator className="w-4 h-4" />
                    Love Calculator
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href="https://memorywall.merchandice.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Memory Wall
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Hey there! <span className="animate-wiggle inline-block">👋</span>
          </h1>
          <p className="text-muted-foreground text-lg">Ready to make someone's heart skip a beat?</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-love text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Sites</p>
                  <p className="text-3xl font-bold">{sites.length}</p>
                </div>
                <Heart className="w-10 h-10 opacity-80" fill="currentColor" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-sunset text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Views</p>
                  <p className="text-3xl font-bold">{sites.reduce((acc, s) => acc + s.view_count, 0)}</p>
                </div>
                <Eye className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-dreamy text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">"Yes!" Clicks</p>
                  <p className="text-3xl font-bold">{sites.reduce((acc, s) => acc + s.yes_count, 0)}</p>
                </div>
                <MousePointerClick className="w-10 h-10 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sites Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Valentine Sites</h2>
          <Button asChild className="bg-gradient-love hover:opacity-90 glow-pink">
            <Link to="/create">
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Link>
          </Button>
        </div>

        {loadingSites ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sites.length === 0 ? (
          <Card className="border-dashed border-2 bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-4">
                <Heart className="w-16 h-16 text-primary/30" />
                <Sparkles className="w-8 h-8 text-primary absolute -top-2 -right-2" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No sites yet!</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first Valentine site and spread some love ✨
              </p>
              <Button asChild className="bg-gradient-love hover:opacity-90">
                <Link to="/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Site
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.map((site) => (
              <Card key={site.id} className="group hover:shadow-lg transition-shadow hover-grow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>{themeEmojis[site.theme] || "💕"}</span>
                        {site.headline.slice(0, 30)}
                        {site.headline.length > 30 && "..."}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1 flex-wrap">
                        /{site.slug}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground ml-2">
                          {templateLabels[site.template]?.emoji || "💕"}{" "}
                          {templateLabels[site.template]?.name || "Classic"}
                        </span>
                        {site.is_published && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground ml-1">
                            Live
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {site.view_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" fill="currentColor" />
                      {site.yes_count}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/edit/${site.id}`}>Edit</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/responses/${site.id}`}>Responses</Link>
                    </Button>
                    {site.is_published && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const url = `${window.location.origin}/${site.slug}`;
                            navigator.clipboard.writeText(url);
                            toast.success("Link copied! 📋");
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <a href={`/${site.slug}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSite(site.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
