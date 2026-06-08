import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/post-job")({
  head: () => ({ meta: [{ title: "Post a Job - HireHub" }] }),
  component: PostJob,
});

function PostJob() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", company: "", location: "", job_type: "Full-time", salary: "", description: "", requirements: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && !user) navigate({ to: "/login" }); }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { data, error } = await supabase.from("jobs").insert({ ...form, posted_by: user.id }).select().single();
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Job posted successfully!");
    navigate({ to: "/jobs/$id", params: { id: data.id } });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Post a New Job</CardTitle>
            <p className="text-sm text-muted-foreground">Reach thousands of qualified candidates</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="t">Job Title</Label>
                  <Input id="t" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Frontend Developer" />
                </div>
                <div>
                  <Label htmlFor="c">Company</Label>
                  <Input id="c" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="l">Location</Label>
                  <Input id="l" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Karachi, Pakistan" />
                </div>
                <div>
                  <Label htmlFor="jt">Job Type</Label>
                  <select id="jt" value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })} className="w-full h-10 px-3 rounded-md border bg-background">
                    <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Remote</option><option>Internship</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="s">Salary (optional)</Label>
                <Input id="s" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="e.g. $50,000 - $70,000" />
              </div>
              <div>
                <Label htmlFor="d">Description</Label>
                <Textarea id="d" required rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="r">Requirements (optional)</Label>
                <Textarea id="r" rows={4} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>{busy ? "Posting..." : "Publish Job"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
