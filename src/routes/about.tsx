import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Zap, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About - HireHub" }, { name: "description", content: "Learn about HireHub's mission to connect talent with opportunity." }] }),
  component: About,
});

function About() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold">About HireHub</h1>
        <p className="mt-4 text-lg text-muted-foreground">We're on a mission to connect talented people with great companies. Whether you're hiring or job hunting, HireHub makes it simple.</p>

        <div className="mt-12 grid md:grid-cols-2 gap-4">
          {[
            { icon: Target, title: "Our Mission", text: "Empower every professional to find work they love and every company to find the talent they need." },
            { icon: Heart, title: "Our Values", text: "Honesty, transparency, and respect. We treat candidates and employers as partners — not products." },
            { icon: Zap, title: "What We Do", text: "We curate quality job listings, simplify applications, and help employers reach the right candidates fast." },
            { icon: Users, title: "Our Community", text: "Join 85,000+ candidates and 3,500+ companies who trust HireHub for their next big move." },
          ].map((v) => (
            <Card key={v.title}>
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3"><v.icon className="h-5 w-5" /></div>
                <h3 className="font-semibold text-lg">{v.title}</h3>
                <p className="mt-2 text-muted-foreground">{v.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
