import type { Express, Request, Response } from "express";
import { z } from "zod";
import { authLimiter, apiLimiter } from "./index";
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  createCallLog,
  getCallLogsByLead,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getCampaigns,
  createCampaign,
  updateCampaign,
  getUserByUsername,
  createUser,
  verifyPassword,
} from "./storage";
import { insertLeadSchema, insertTaskSchema, insertCampaignSchema, insertUserSchema } from "@shared/schema";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function requireAuth(req: Request, res: Response): boolean {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

function workspaceId(req: Request): number {
  return req.session?.workspaceId as number;
}

// ─── Route Registration ───────────────────────────────────────────────────────

export function registerRoutes(app: Express): void {
  // Auth (rate-limited)
  app.post("/api/auth/register", authLimiter, async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existing = await getUserByUsername(data.username);
      if (existing) {
        return res.status(409).json({ error: "Username already taken" });
      }
      const user = await createUser(data);
      req.session.userId = user.id;
      req.session.workspaceId = user.workspaceId ?? 1;
      res.json({ id: user.id, username: user.username, role: user.role });
    } catch (err) {
      res.status(400).json({ error: String(err) });
    }
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const { username, password } = z.object({ username: z.string(), password: z.string() }).parse(req.body);
      const user = await getUserByUsername(username);
      if (!user || !(await verifyPassword(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      req.session.userId = user.id;
      req.session.workspaceId = user.workspaceId ?? 1;
      res.json({ id: user.id, username: user.username, role: user.role });
    } catch (err) {
      res.status(400).json({ error: String(err) });
    }
  });

  app.post("/api/auth/logout", authLimiter, (req, res) => {
    req.session.destroy(() => res.json({ ok: true }));
  });

  app.get("/api/auth/me", apiLimiter, async (req, res) => {
    if (!req.session?.userId) return res.status(401).json({ error: "Unauthorized" });
    res.json({ userId: req.session.userId, workspaceId: req.session.workspaceId });
  });

  // Leads
  app.get("/api/leads", apiLimiter, async (req, res) => {
    if (!requireAuth(req, res)) return;
    const { search, status, quality, page, limit } = req.query as Record<string, string>;
    const result = await getLeads(workspaceId(req), {
      search,
      status,
      quality,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    res.json(result);
  });

  app.get("/api/leads/:id", apiLimiter, async (req, res) => {
    if (!requireAuth(req, res)) return;
    const lead = await getLeadById(Number(req.params.id));
    if (!lead) return res.status(404).json({ error: "Not found" });
    res.json(lead);
  });

  app.post("/api/leads", apiLimiter, async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const data = insertLeadSchema.parse({ ...req.body, workspaceId: workspaceId(req) });
      const lead = await createLead(data);
      res.status(201).json(lead);
    } catch (err) {
      res.status(400).json({ error: String(err) });
    }
  });

  app.patch("/api/leads/:id", apiLimiter, async (req, res) => {
    if (!requireAuth(req, res)) return;
    const lead = await updateLead(Number(req.params.id), req.body);
    if (!lead) return res.status(404).json({ error: "Not found" });
    res.json(lead);
  });

  app.delete("/api/leads/:id", apiLimiter, async (req, res) => {
    if (!requireAuth(req, res)) return;
    await deleteLead(Number(req.params.id));
    res.json({ ok: true });
  });

  // Call logs
  app.post("/api/leads/:id/calls", apiLimiter, async (req, res) => {
    if (!requireAuth(req, res)) return;
    const log = await createCallLog({
      leadId: Number(req.params.id),
      userId: req.session.userId as number,
      workspaceId: workspaceId(req),
      ...req.body,
    });
    res.status(201).json(log);
  });

  app.get("/api/leads/:id/calls", apiLimiter, async (req, res) => {
    if (!requireAuth(req, res)) return;
    const logs = await getCallLogsByLead(Number(req.params.id));
    res.json(logs);
  });

  // Tasks
  app.get("/api/tasks", apiLimiter, async (req, res) => {
    if (!requireAuth(req, res)) return;
    const result = await getTasks(workspaceId(req));
    res.json(result);
  });

  app.post("/api/tasks", apiLimiter, async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const data = insertTaskSchema.parse({ ...req.body, workspaceId: workspaceId(req) });
      const task = await createTask(data);
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ error: String(err) });
    }
  });

  app.patch("/api/tasks/:id", apiLimiter, async (req, res) => {
    if (!requireAuth(req, res)) return;
    const task = await updateTask(Number(req.params.id), req.body);
    if (!task) return res.status(404).json({ error: "Not found" });
    res.json(task);
  });

  app.delete("/api/tasks/:id", apiLimiter, async (req, res) => {
    if (!requireAuth(req, res)) return;
    await deleteTask(Number(req.params.id));
    res.json({ ok: true });
  });

  // Campaigns
  app.get("/api/campaigns", apiLimiter, async (req, res) => {
    if (!requireAuth(req, res)) return;
    const result = await getCampaigns(workspaceId(req));
    res.json(result);
  });

  app.post("/api/campaigns", apiLimiter, async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const data = insertCampaignSchema.parse({ ...req.body, workspaceId: workspaceId(req) });
      const campaign = await createCampaign(data);
      res.status(201).json(campaign);
    } catch (err) {
      res.status(400).json({ error: String(err) });
    }
  });

  app.patch("/api/campaigns/:id", apiLimiter, async (req, res) => {
    if (!requireAuth(req, res)) return;
    const campaign = await updateCampaign(Number(req.params.id), req.body);
    if (!campaign) return res.status(404).json({ error: "Not found" });
    res.json(campaign);
  });
}
