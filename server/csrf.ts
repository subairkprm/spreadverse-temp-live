import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

const CSRF_HEADER = "x-csrf-token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Lightweight CSRF protection using the synchronizer token pattern.
 * - Safe methods (GET/HEAD/OPTIONS) are passed through and a token is set in the session.
 * - Mutating methods must include the token in the `x-csrf-token` header.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Skip for safe HTTP methods
  if (SAFE_METHODS.has(req.method)) {
    // Ensure session has a CSRF token
    if (!req.session.csrfToken) {
      req.session.csrfToken = crypto.randomBytes(32).toString("hex");
    }
    // Expose it so clients can read it via a dedicated endpoint
    res.setHeader("X-CSRF-Token", req.session.csrfToken);
    next();
    return;
  }

  const sessionToken = req.session?.csrfToken as string | undefined;
  const requestToken = req.headers[CSRF_HEADER] as string | undefined;

  if (!sessionToken || !requestToken || sessionToken !== requestToken) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }

  next();
}
