import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, Briefcase, Building2, Users, TrendingUp, MapPin, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HireHub - Find Your Dream Job Today" },
      { name: "description", content: "Search thousands of job listings from top companies. Apply with one click and land your next role." },
    ],
  }),
  component: Home,
});

function Home() {
  const [q, setQ] = useState("");
  const { data: jobs } = useQuery({
    queryKey: ["recent-jobs"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("*").order("created_at", { ascending: false }).limit(6);
      return data ?? [];
    },
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Find the job <br />made for you
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl">
              Browse thousands of opportunities from leading companies. Your next career move starts here.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); window.location.href = `/jobs?q=${encodeURIComponent(q)}`; }}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Job title, company or keyword"
                  className="pl-10 h-12 bg-background text-foreground"
                />
              </div>
              <Button type="submit" size="lg" variant="secondary" className="h-12 px-8">Search Jobs</Button>
            </form>
            <div className="mt-6 flex flex-wrap gap-2 text-sm text-primary-foreground/80">
              <span>Popular:</span>
              {["Designer", "Developer", "Marketing", "Remote"].map((t) => (
                <Link key={t} to="/jobs" search={{ q: t } as any} className="underline hover:text-white">{t}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Briefcase, label: "Active Jobs", value: "12,000+" },
          { icon: Building2, label: "Companies", value: "3,500+" },
          { icon: Users, label: "Candidates", value: "85,000+" },
          { icon: TrendingUp, label: "Hires Made", value: "24,000+" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="p-2 rounded-md bg-accent text-accent-foreground"><s.icon className="h-5 w-5" /></div>
            <div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Recent jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Recent Job Openings</h2>
            <p className="text-muted-foreground mt-1">Fresh opportunities posted by top employers</p>
          </div>
          <Link to="/jobs"><Button variant="outline">View all <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
        </div>
        {jobs && jobs.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-card">
            <p className="text-muted-foreground">No jobs posted yet. <Link to="/post-job" className="text-primary underline">Be the first to post one!</Link></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs?.map((j: any) => (
              <Link key={j.id} to="/jobs/$id" params={{ id: j.id }}>
                <Card className="h-full hover:shadow-lg hover:border-primary transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-1 rounded bg-accent text-accent-foreground">{j.job_type}</span>
                      <span className="text-xs text-muted-foreground">{new Date(j.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-semibold text-lg leading-tight">{j.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{j.company}</p>
                    <div className="mt-4 flex items-center text-sm text-muted-foreground gap-1">
                      <MapPin className="h-4 w-4" /> {j.location}
                    </div>
                    {j.salary && <p className="mt-2 text-sm font-medium text-primary">{j.salary}</p>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <h3 className="text-2xl font-bold">Looking for a job?</h3>
            <p className="mt-2 text-primary-foreground/80">Create a free account and apply to jobs in seconds.</p>
            <Link to="/signup"><Button variant="secondary" className="mt-5">Get Started</Button></Link>
          </div>
          <div className="p-8 rounded-2xl border-2 bg-card">
            <h3 className="text-2xl font-bold">Hiring talent?</h3>
            <p className="mt-2 text-muted-foreground">Post a job and reach thousands of qualified candidates.</p>
            <Link to="/post-job"><Button className="mt-5">Post a Job</Button></Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
