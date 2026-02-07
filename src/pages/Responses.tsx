import { useEffect, useState } from "react";
import { Navigate, Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Heart, ArrowLeft, Calendar, Clock, Utensils, Sparkles, Eye, MousePointerClick } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface DatePreference {
  id: string;
  selected_date: string;
  selected_time: string;
  food_preference: string;
  activity_preference: string;
  created_at: string;
}

interface SiteResponse {
  id: string;
  response_type: string;
  created_at: string;
}

interface SiteInfo {
  id: string;
  headline: string;
  slug: string;
  view_count: number;
  yes_count: number;
}

export default function Responses() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const [site, setSite] = useState<SiteInfo | null>(null);
  const [datePreferences, setDatePreferences] = useState<DatePreference[]>([]);
  const [responses, setResponses] = useState<SiteResponse[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user && id) {
      fetchData();
    }
  }, [user, id]);

  const fetchData = async () => {
    // Fetch site info
    const { data: siteData, error: siteError } = await supabase
      .from("valentine_sites")
      .select("id, headline, slug, view_count, yes_count")
      .eq("id", id)
      .maybeSingle();

    if (siteError || !siteData) {
      toast.error("Site not found");
      setLoadingData(false);
      return;
    }

    setSite(siteData);

    // Fetch date preferences
    const { data: prefsData, error: prefsError } = await supabase
      .from("date_preferences")
      .select("*")
      .eq("site_id", id)
      .order("created_at", { ascending: false });

    if (prefsError) {
      console.error("Error fetching preferences:", prefsError);
    } else {
      setDatePreferences(prefsData || []);
    }

    // Fetch recent responses
    const { data: respData, error: respError } = await supabase
      .from("site_responses")
      .select("*")
      .eq("site_id", id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (respError) {
      console.error("Error fetching responses:", respError);
    } else {
      setResponses(respData || []);
    }

    setLoadingData(false);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 hover-grow">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
            <span className="text-xl font-bold text-gradient-love bg-clip-text">Valentine Maker</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        {loadingData ? (
          <div className="flex items-center justify-center py-12">
            <Heart className="w-12 h-12 text-primary animate-pulse" fill="currentColor" />
          </div>
        ) : !site ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Site not found</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Site Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{site.headline}</h1>
              <p className="text-muted-foreground">/{site.slug}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-gradient-sunset text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Total Views</p>
                      <p className="text-3xl font-bold">{site.view_count}</p>
                    </div>
                    <Eye className="w-10 h-10 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-love text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">"Yes!" Clicks</p>
                      <p className="text-3xl font-bold">{site.yes_count}</p>
                    </div>
                    <MousePointerClick className="w-10 h-10 opacity-80" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-dreamy text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Date Plans</p>
                      <p className="text-3xl font-bold">{datePreferences.length}</p>
                    </div>
                    <Calendar className="w-10 h-10 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Date Preferences Table */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Date Preferences
                </CardTitle>
                <CardDescription>
                  Responses from visitors who said yes and planned a date
                </CardDescription>
              </CardHeader>
              <CardContent>
                {datePreferences.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No date preferences yet</p>
                    <p className="text-sm">They'll appear here when someone fills out the date planning form</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Date
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Time
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex items-center gap-2">
                              <Utensils className="w-4 h-4" />
                              Food
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Activity
                            </div>
                          </TableHead>
                          <TableHead>Submitted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {datePreferences.map((pref) => (
                          <TableRow key={pref.id}>
                            <TableCell className="font-medium">
                              {format(new Date(pref.selected_date), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>{pref.selected_time}</TableCell>
                            <TableCell>{pref.food_preference}</TableCell>
                            <TableCell>{pref.activity_preference}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {format(new Date(pref.created_at), "MMM d, h:mm a")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest 50 interactions with your site
                </CardDescription>
              </CardHeader>
              <CardContent>
                {responses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No activity yet</p>
                    <p className="text-sm">Share your site to start seeing activity</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {responses.map((resp) => (
                      <div
                        key={resp.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        {resp.response_type === "view" ? (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Heart className="w-4 h-4 text-primary" fill="currentColor" />
                        )}
                        <span className="flex-1">
                          {resp.response_type === "view" ? "Someone viewed your site" : "Someone clicked Yes! 💕"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(resp.created_at), "MMM d, h:mm a")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
