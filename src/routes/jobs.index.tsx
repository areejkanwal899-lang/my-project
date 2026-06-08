import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/jobs/")({
  head: () => ({ meta: [{ title: "Browse Jobs - HireHub" }, { name: "description", content: "Browse all open job listings across industries and locations." }] }),
  component: Jobs,
});

function Jobs() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const filtered = (jobs ?? []).filter((j: any) => {
    const matches = !q || j.title.toLowerCase().includes(q.toLowerCase()) || j.company.toLowerCase().includes(q.toLowerCase()) || j.location.toLowerCase().includes(q.toLowerCase());
    const matchesType = !type || j.job_type === type;
    return matches && matchesType;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl md:text-4xl font-bold">Browse Jobs</h1>
        <p className="text-muted-foreground mt-2">Find your next opportunity from {jobs?.length ?? 0} open positions</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_200px] gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, company, location..." className="pl-10 h-11" />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)} className="h-11 px-3 rounded-md border bg-background">
            <option value="">All Types</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Remote</option>
            <option>Internship</option>
          </select>
        </div>

        <div className="mt-8 space-y-3">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-16 border rounded-lg bg-card">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No jobs match your search.</p>
            </div>
          )}
          {filtered.map((j: any) => (
            <Link key={j.id} to="/jobs/$id" params={{ id: j.id }}>
              <Card className="hover:shadow-md hover:border-primary transition-all">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{j.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-accent text-accent-foreground">{j.job_type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{j.company}</p>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{j.location}</span>
                      {j.salary && <span className="font-medium text-primary">{j.salary}</span>}
                      <span>{new Date(j.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="outline">View</Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
