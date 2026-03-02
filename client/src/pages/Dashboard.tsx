import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar p-4 md:flex">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold text-sidebar-foreground">SPREAD VERSE</h1>
          <p className="text-xs text-sidebar-foreground/60">Banking CRM v4</p>
        </div>
        <nav className="flex flex-col gap-1">
          {[
            { label: "CRM", icon: "👥" },
            { label: "Calling", icon: "📞" },
            { label: "Tasks", icon: "✅" },
            { label: "Campaigns", icon: "📣" },
            { label: "Data Import", icon: "📊" },
          ].map(({ label, icon }) => (
            <button
              key={label}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80",
                "hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              )}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Welcome to SPREAD VERSE V4</p>
          </div>
        </header>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Leads", value: "—", icon: "👥" },
            { label: "Active Tasks", value: "—", icon: "✅" },
            { label: "Campaigns", value: "—", icon: "📣" },
            { label: "Calls Today", value: "—", icon: "📞" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="glass-panel p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <span className="text-2xl">{icon}</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
