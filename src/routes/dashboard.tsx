import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase, FileText, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard - HireHub" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (!loading && !user) navigate({ to: "/login" }); }, [user, loading, navigate]);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  const { data: myJobs } = useQuery({
    queryKey: ["my-jobs", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("*").eq("posted_by", user!.id).order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: myApps } = useQuery({
    queryKey: ["my-apps", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("applications").select("*, jobs(title, company)").eq("applicant_id", user!.id).order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: receivedApps } = useQuery({
    queryKey: ["received-apps", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("applications").select("*, jobs!inner(title, company, posted_by)").eq("jobs.posted_by", user!.id).order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {profile?.full_name || user.email}</h1>
            <p className="text-muted-foreground capitalize">{profile?.role || "user"}</p>
          </div>
          <Link to="/post-job"><Button><Plus className="h-4 w-4 mr-1" />Post a Job</Button></Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Applications submitted */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />My Applications ({myApps?.length ?? 0})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {myApps && myApps.length === 0 && <p className="text-sm text-muted-foreground">No applications yet. <Link to="/jobs" className="text-primary underline">Browse jobs</Link></p>}
              {myApps?.map((a: any) => (
                <div key={a.id} className="p-3 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{a.jobs?.title}</p>
                      <p className="text-xs text-muted-foreground">{a.jobs?.company}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-accent capitalize">{a.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Jobs posted */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" />My Job Posts ({myJobs?.length ?? 0})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {myJobs && myJobs.length === 0 && <p className="text-sm text-muted-foreground">You haven't posted any jobs.</p>}
              {myJobs?.map((j: any) => (
                <Link key={j.id} to="/jobs/$id" params={{ id: j.id }}>
                  <div className="p-3 border rounded-md hover:border-primary">
                    <p className="font-medium">{j.title}</p>
                    <p className="text-xs text-muted-foreground">{j.location} · {j.job_type}</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Received applications */}
        {receivedApps && receivedApps.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Applications Received ({receivedApps.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {receivedApps.map((a: any) => (
                <div key={a.id} className="p-4 border rounded-md">
                  <div className="flex justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-medium">{a.full_name} <span className="text-sm text-muted-foreground">({a.email})</span></p>
                      <p className="text-xs text-muted-foreground">Applied for: {a.jobs?.title}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-accent self-start capitalize">{a.status}</span>
                  </div>
                  {a.cover_letter && <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{a.cover_letter}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
