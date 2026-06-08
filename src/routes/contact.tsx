import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact - HireHub" }] }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-4xl font-bold">Get in touch</h1>
          <p className="mt-3 text-muted-foreground">Have a question, suggestion, or partnership idea? We'd love to hear from you.</p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /> hello@hirehub.com</div>
            <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /> +92 300 1234567</div>
            <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /> Karachi, Pakistan</div>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={submit} className="space-y-3">
              <div><Label htmlFor="n">Name</Label><Input id="n" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label htmlFor="e">Email</Label><Input id="e" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label htmlFor="m">Message</Label><Textarea id="m" rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
