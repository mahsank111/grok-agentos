import { integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  credits: integer("credits").default(5)
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  authorId: serial("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const AgentConfig = pgTable('agentConfig', {
  id: serial('id').primaryKey(),
  agentId: varchar('agentId').notNull().unique(),
  name: varchar('name').notNull(),
  description: text('description'),
  agentImage: text('agentImage'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  userEmail: text('userEmail').notNull().references(() => users.email),
});

// export const AgentConfig = pgTable('agentConfig', {
//   id: serial('id').primaryKey(),
//   name: varchar('name').notNull(),
//   description: text('description'),
//   agentImage: text('agentImage'),
//   tools: jsonb('tools'),
//   composioSessionId: varchar('composioSessionId'),
//   e2bSandboxId: varchar('e2bSandboxId'),
//   e2bSandboxStatus: varchar('e2bSandboxStatus', { length: 32 }).default('inactive'),
//   e2bLastActiveAt: timestamp("e2b_last_active_at", { withTimezone: true }),
//   e2bPausedAt: timestamp("e2b_paused_at", { withTimezone: true }),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   userEmail: text('userEmail').notNull().references(() => users.email)
// })

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type AgentConfig = typeof AgentConfig.$inferSelect;
export type NewAgentConfig = typeof AgentConfig.$inferInsert;
