import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export default function Login() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const login = useMutation({
    mutationFn: async (data: typeof form) => {
      // Fetch CSRF token via a safe GET request before the mutating POST
      const csrfRes = await fetch("/api/auth/me", { credentials: "include" });
      if (!csrfRes.ok && csrfRes.status !== 401) {
        throw new Error("Could not obtain CSRF token");
      }
      const csrfToken = csrfRes.headers.get("x-csrf-token") ?? "";

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Login failed");
      }
      return res.json();
    },
    onSuccess: () => setLocation("/"),
    onError: (err: Error) => setError(err.message),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="glass-panel w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">SPREAD VERSE V4</h1>
          <p className="text-sm text-muted-foreground">Banking CRM Platform</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            login.mutate(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={login.isPending}
            className={cn(
              "w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground",
              "hover:bg-primary/90 transition-colors disabled:opacity-60"
            )}
          >
            {login.isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
