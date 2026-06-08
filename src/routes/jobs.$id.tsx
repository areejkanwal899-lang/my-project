import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Building2, Briefcase, Calendar, DollarSign } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs/$id")({
  component: JobDetail,
});

function JobDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [app, setApp] = useState({ full_name: "", email: "", cover_letter: "" });

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("*").eq("id", id).single();
      return data;
    },
  });

  const apply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate({ to: "/login" }); return; }
    setSubmitting(true);
    const { error } = await supabase.from("applications").insert({
      job_id: id,
      applicant_id: user.id,
      full_name: app.full_name,
      email: app.email,
      cover_letter: app.cover_letter,
    });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") toast.error("You've already applied to this job");
      else toast.error(error.message);
      return;
    }
    toast.success("Application submitted! The employer will be in touch.");
    setOpen(false);
  };

  if (isLoading) return <Layout><div className="max-w-4xl mx-auto p-8">Loading...</div></Layout>;
  if (!job) return <Layout><div className="max-w-4xl mx-auto p-8">Job not found</div></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span className="text-xs px-2 py-1 rounded bg-accent text-accent-foreground">{job.job_type}</span>
                <h1 className="mt-3 text-2xl md:text-3xl font-bold">{job.title}</h1>
                <p className="text-lg text-muted-foreground mt-1 flex items-center gap-2"><Building2 className="h-4 w-4" />{job.company}</p>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" onClick={() => { if (!user) navigate({ to: "/login" }); else { setApp({ ...app, email: user.email ?? "" }); } }}>
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Apply for {job.title}</DialogTitle></DialogHeader>
                  <form onSubmit={apply} className="space-y-3">
                    <div>
                      <Label htmlFor="fn">Full Name</Label>
                      <Input id="fn" required value={app.full_name} onChange={(e) => setApp({ ...app, full_name: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="em">Email</Label>
                      <Input id="em" type="email" required value={app.email} onChange={(e) => setApp({ ...app, email: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="cl">Cover Letter</Label>
                      <Textarea id="cl" rows={6} value={app.cover_letter} onChange={(e) => setApp({ ...app, cover_letter: e.target.value })} placeholder="Tell the employer why you're a great fit..." />
                    </div>
                    <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "Submitting..." : "Submit Application"}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{job.location}</div>
              <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" />{job.job_type}</div>
              {job.salary && <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" />{job.salary}</div>}
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{new Date(job.created_at).toLocaleDateString()}</div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Job Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </div>
            {job.requirements && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Requirements</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.requirements}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
