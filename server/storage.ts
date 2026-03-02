import { db } from "./db";
import { eq, and, desc, ilike, sql } from "drizzle-orm";
import {
  users,
  workspaces,
  leads,
  callLogs,
  tasks,
  campaigns,
  type User,
  type InsertUser,
  type Workspace,
  type InsertWorkspace,
  type Lead,
  type InsertLead,
  type CallLog,
  type InsertCallLog,
  type Task,
  type InsertTask,
  type Campaign,
  type InsertCampaign,
} from "@shared/schema";
import bcrypt from "bcrypt";

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.username, username));
  return user;
}

export async function getUserById(id: number): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function createUser(data: InsertUser): Promise<User> {
  const hashed = await bcrypt.hash(data.password, 10);
  const [user] = await db
    .insert(users)
    .values({ ...data, password: hashed })
    .returning();
  return user;
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// ─── Workspaces ──────────────────────────────────────────────────────────────

export async function getWorkspace(id: number): Promise<Workspace | undefined> {
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, id));
  return ws;
}

export async function createWorkspace(data: InsertWorkspace): Promise<Workspace> {
  const [ws] = await db.insert(workspaces).values(data).returning();
  return ws;
}

// ─── Leads ───────────────────────────────────────────────────────────────────

export async function getLeads(
  workspaceId: number,
  opts?: { search?: string; status?: string; quality?: string; page?: number; limit?: number }
): Promise<{ leads: Lead[]; total: number }> {
  const limit = opts?.limit ?? 20;
  const offset = ((opts?.page ?? 1) - 1) * limit;

  const conditions = [eq(leads.workspaceId, workspaceId)];
  if (opts?.status) conditions.push(eq(leads.status, opts.status));
  if (opts?.quality) conditions.push(eq(leads.quality, opts.quality));
  if (opts?.search) conditions.push(ilike(leads.name, `%${opts.search}%`));

  const where = and(...conditions);
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(where);

  const rows = await db
    .select()
    .from(leads)
    .where(where)
    .orderBy(desc(leads.updatedAt))
    .limit(limit)
    .offset(offset);

  return { leads: rows, total: Number(count) };
}

export async function getLeadById(id: number): Promise<Lead | undefined> {
  const [lead] = await db.select().from(leads).where(eq(leads.id, id));
  return lead;
}

export async function createLead(data: InsertLead): Promise<Lead> {
  const [lead] = await db.insert(leads).values(data).returning();
  return lead;
}

export async function updateLead(id: number, data: Partial<InsertLead>): Promise<Lead | undefined> {
  const [lead] = await db
    .update(leads)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(leads.id, id))
    .returning();
  return lead;
}

export async function deleteLead(id: number): Promise<void> {
  await db.delete(leads).where(eq(leads.id, id));
}

// ─── Call Logs ────────────────────────────────────────────────────────────────

export async function createCallLog(data: InsertCallLog): Promise<CallLog> {
  const [log] = await db.insert(callLogs).values(data).returning();
  return log;
}

export async function getCallLogsByLead(leadId: number): Promise<CallLog[]> {
  return db.select().from(callLogs).where(eq(callLogs.leadId, leadId)).orderBy(desc(callLogs.calledAt));
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export async function getTasks(workspaceId: number): Promise<Task[]> {
  return db.select().from(tasks).where(eq(tasks.workspaceId, workspaceId)).orderBy(desc(tasks.createdAt));
}

export async function createTask(data: InsertTask): Promise<Task> {
  const [task] = await db.insert(tasks).values(data).returning();
  return task;
}

export async function updateTask(id: number, data: Partial<InsertTask>): Promise<Task | undefined> {
  const [task] = await db.update(tasks).set(data).where(eq(tasks.id, id)).returning();
  return task;
}

export async function deleteTask(id: number): Promise<void> {
  await db.delete(tasks).where(eq(tasks.id, id));
}

// ─── Campaigns ───────────────────────────────────────────────────────────────

export async function getCampaigns(workspaceId: number): Promise<Campaign[]> {
  return db.select().from(campaigns).where(eq(campaigns.workspaceId, workspaceId)).orderBy(desc(campaigns.createdAt));
}

export async function createCampaign(data: InsertCampaign): Promise<Campaign> {
  const [campaign] = await db.insert(campaigns).values(data).returning();
  return campaign;
}

export async function updateCampaign(id: number, data: Partial<InsertCampaign>): Promise<Campaign | undefined> {
  const [campaign] = await db.update(campaigns).set(data).where(eq(campaigns.id, id)).returning();
  return campaign;
}
