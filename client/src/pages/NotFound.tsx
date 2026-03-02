import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <button
        onClick={() => setLocation("/")}
        className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Go Home
      </button>
    </div>
  );
}
