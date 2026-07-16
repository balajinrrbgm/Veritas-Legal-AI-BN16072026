import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull(), // 'pending' | 'analyzed' | 'failed'
  riskScore: integer("risk_score"), // 0 to 100
  analysisResult: text("analysis_result"), // JSON string
  createdAt: text("created_at").notNull(),
});

export const complianceChecklists = sqliteTable("compliance_checklists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  state: text("state").notNull(),
  businessType: text("business_type").notNull(),
  checklistItems: text("checklist_items").notNull(), // JSON string representing checklist tasks
  createdAt: text("created_at").notNull(),
});

export const agentLogs = sqliteTable("agent_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agentName: text("agent_name").notNull(), // 'AnalysisAgent' | 'ResearchAgent' | 'DraftingAgent' | 'OpsSupervisor'
  taskType: text("task_type").notNull(), // 'audit', 'search', 'draft', 'system'
  message: text("message").notNull(),
  status: text("status").notNull(), // 'info' | 'warning' | 'success' | 'working'
  timestamp: text("timestamp").notNull(),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  plan: text("plan").notNull(), // 'Growth Monthly' | 'Compliance Custom' | 'Audit Basic'
  amount: integer("amount").notNull(), // Amount in cents
  status: text("status").notNull(), // 'succeeded' | 'pending' | 'refunded'
  createdAt: text("created_at").notNull(),
});
