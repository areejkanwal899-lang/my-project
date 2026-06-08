import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Briefcase, LogOut, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const nav = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Browse Jobs" },
    { to: "/post-job", label: "Post a Job" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Briefcase className="h-6 w-6" />
            <span>HireHub</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className={`text-sm font-medium transition-colors hover:text-primary ${path === n.to ? "text-primary" : "text-muted-foreground"}`}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}><LogOut className="h-4 w-4 mr-1" />Sign out</Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
              </>
            )}
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t bg-card px-4 py-3 space-y-2">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">
                {n.label}
              </Link>
            ))}
            <div className="pt-2 border-t flex gap-2">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="flex-1"><Button variant="outline" className="w-full" size="sm">Dashboard</Button></Link>
                  <Button size="sm" onClick={handleSignOut} className="flex-1">Sign out</Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1"><Button variant="outline" className="w-full" size="sm">Login</Button></Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="flex-1"><Button className="w-full" size="sm">Sign Up</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-card mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-primary mb-3">
              <Briefcase className="h-5 w-5" /> HireHub
            </div>
            <p className="text-sm text-muted-foreground">Find your next career opportunity or your next great hire.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/jobs" className="hover:text-primary">Browse Jobs</Link></li>
              <li><Link to="/signup" className="hover:text-primary">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">For Employers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/post-job" className="hover:text-primary">Post a Job</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary">Employer Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} HireHub. All rights reserved.</div>
      </footer>
    </div>
  );
}
