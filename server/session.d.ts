// Augment express-session to include custom session fields
import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    workspaceId?: number;
    csrfToken?: string;
  }
}
