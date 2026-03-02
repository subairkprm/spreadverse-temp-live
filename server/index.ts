import express from "express";
import session from "express-session";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";
import { csrfProtection } from "./csrf";
import "./session.d";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 5000;

// ─── Rate Limiters ────────────────────────────────────────────────────────────

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "spreadverse-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use(csrfProtection);
registerRoutes(app);

// ─── Static / SPA ─────────────────────────────────────────────────────────────

if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../dist/public");
  app.use(express.static(distPath));
  app.get("*", apiLimiter, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[server] SPREAD VERSE V4 running on port ${PORT}`);
});

export default app;
