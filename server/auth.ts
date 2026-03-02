import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import type { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { z } from "zod";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

declare module "express-session" {
  interface SessionData {
    userId: string;
    workspaceId: string;
  }
}

const PgSession = connectPgSimple(session);

export function setupAuth(app: Express) {
  if (!process.env.SESSION_SECRET) {
    throw new Error(
      "SESSION_SECRET environment variable must be set. Add it to your .env file."
    );
  }

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  app.use(
    session({
      store: new PgSession({
        pool: pool as any,
        tableName: "session",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
      proxy: process.env.NODE_ENV === "production",
    })
  );

  const googleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  function getCallbackURL(req: Request): string {
    const forwardedHost = req.headers["x-forwarded-host"] as string | undefined;
    const forwardedProto = req.headers["x-forwarded-proto"] as string | undefined;

    if (forwardedHost && forwardedHost !== "localhost" && !forwardedHost.startsWith("localhost:")) {
      const protocol = forwardedProto || "https";
      return `${protocol}://${forwardedHost}/api/auth/google/callback`;
    }

    const host = req.headers.host || "localhost:5000";
    const protocol = req.protocol;
    return `${protocol}://${host}/api/auth/google/callback`;
  }

  if (googleEnabled) {
    app.use(passport.initialize());

    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: "/api/auth/google/callback",
          proxy: true,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error("No email found in Google profile"), undefined);
            }
            const displayName = profile.displayName || email.split("@")[0];

            let user = await storage.getUserByEmail(email);
            if (!user) {
              const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
              user = await storage.createUser({
                username: email,
                password: randomPassword,
                name: displayName,
                email,
              });

              const workspace = await storage.createWorkspace({
                ownerUserId: user.id,
                name: `${displayName}'s Workspace`,
              });

              await storage.createWorkspaceMember({
                workspaceId: workspace.id,
                userId: user.id,
                role: "owner",
              });

              await storage.seedDefaultSegments(workspace.id);
            }

            done(null, user);
          } catch (err) {
            done(err as Error, undefined);
          }
        }
      )
    );

    app.get("/api/auth/google", (req: Request, res: Response, next: NextFunction) => {
      const dynamicCallbackURL = getCallbackURL(req);
      console.log("Google OAuth redirect_uri:", dynamicCallbackURL);

      (passport.authenticate as any)("google", {
        scope: ["profile", "email"],
        session: false,
        callbackURL: dynamicCallbackURL,
      })(req, res, next);
    });

    app.get("/api/auth/google/callback", (req: Request, res: Response, next: NextFunction) => {
      const dynamicCallbackURL = getCallbackURL(req);
      console.log("Google callback hit. Query params:", req.query);

      (passport.authenticate as any)("google", {
        failureRedirect: "/?error=google_auth_failed",
        session: false,
        callbackURL: dynamicCallbackURL,
      })(req, res, (err: any) => {
        if (err) {
          console.error("Google auth passport error:", err.message || err);
          return res.redirect("/?error=google_auth_failed");
        }
        next();
      });
    }, async (req: Request, res: Response) => {
      try {
        const user = req.user as any;
        if (!user) {
          console.error("Google callback: no user on req after passport auth");
          return res.redirect("/?error=google_auth_failed");
        }

        const memberships = await storage.getUserWorkspaces(user.id);
        const workspaceId = memberships.length > 0 ? memberships[0].workspaceId : "";

        req.session.userId = user.id;
        req.session.workspaceId = workspaceId;

        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.redirect("/?error=google_auth_failed");
          }
          res.redirect("/");
        });
      } catch (error) {
        console.error("Google callback error:", error);
        res.redirect("/?error=google_auth_failed");
      }
    });
  }

  app.get("/api/auth/providers", (_req: Request, res: Response) => {
    res.json({ google: googleEnabled });
  });

  const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password } = registerSchema.parse(req.body);

      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username: email,
        password: passwordHash,
        name,
        email,
      });

      const workspace = await storage.createWorkspace({
        ownerUserId: user.id,
        name: `${name}'s Workspace`,
      });

      await storage.createWorkspaceMember({
        workspaceId: workspace.id,
        userId: user.id,
        role: "owner",
      });

      await storage.seedDefaultSegments(workspace.id);

      req.session.userId = user.id;
      req.session.workspaceId = workspace.id;

      res.status(201).json({
        user: { id: user.id, name: user.name, email: user.email },
        workspace: { id: workspace.id, name: workspace.name },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Register error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const memberships = await storage.getUserWorkspaces(user.id);
      const workspaceId = memberships.length > 0 ? memberships[0].workspaceId : null;

      req.session.userId = user.id;
      req.session.workspaceId = workspaceId || "";

      res.json({
        user: { id: user.id, name: user.name, email: user.email },
        workspace: workspaceId ? { id: workspaceId } : null,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ ok: true });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const memberships = await storage.getUserWorkspaces(user.id);
    const currentWorkspace = req.session.workspaceId
      ? await storage.getWorkspace(req.session.workspaceId)
      : null;

    const currentMembership = req.session.workspaceId
      ? memberships.find(m => m.workspaceId === req.session.workspaceId)
      : null;

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      workspace: currentWorkspace ? { id: currentWorkspace.id, name: currentWorkspace.name } : null,
      role: currentMembership?.role || "owner",
      workspaces: memberships,
    });
  });

  app.post("/api/auth/switch-workspace", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { workspaceId } = req.body;
    const member = await storage.getWorkspaceMember(workspaceId, req.session.userId);
    if (!member) {
      return res.status(403).json({ error: "Not a member of this workspace" });
    }

    req.session.workspaceId = workspaceId;
    res.json({ ok: true });
  });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

export function requireRole(...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId || !req.session.workspaceId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const member = await storage.getWorkspaceMember(req.session.workspaceId, req.session.userId);
    if (!member || !roles.includes(member.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}
