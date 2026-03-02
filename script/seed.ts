#!/usr/bin/env tsx
/**
 * seed.ts – Seeds the database with a default admin user and workspace.
 * Usage: npx tsx script/seed.ts
 */
import { db } from "../server/db";
import { users, workspaces } from "../shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Seeding database…");

  const [workspace] = await db
    .insert(workspaces)
    .values({ name: "Default Workspace", ownerId: 1 })
    .onConflictDoNothing()
    .returning();

  const password = await bcrypt.hash("admin123", 10);
  await db
    .insert(users)
    .values({
      username: "admin",
      password,
      email: "admin@spreadverse.com",
      role: "admin",
      workspaceId: workspace?.id ?? 1,
    })
    .onConflictDoNothing();

  console.log("✅ Seeded: admin / admin123");
}

seed().catch(console.error).finally(() => process.exit());
