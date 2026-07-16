import { db } from "./index";
import { agentLogs, transactions } from "./schema";

async function main() {
  console.log("Seeding database records...");
  const timestamp = new Date().toISOString();

  try {
    // 1. Seed initial logs
    await db.insert(agentLogs).values([
      {
        agentName: "OpsSupervisor",
        taskType: "system",
        message: "Veritas Legal AI system supervisor initialized and checking local database health.",
        status: "success",
        timestamp,
      },
      {
        agentName: "AnalysisAgent",
        taskType: "audit",
        message: "Analysis Swarm models connected. Document context window size optimized to 1M tokens.",
        status: "info",
        timestamp,
      },
      {
        agentName: "ResearchAgent",
        taskType: "search",
        message: "Research Agent indexed state statutes. Local Search Grounding tool active.",
        status: "success",
        timestamp,
      },
      {
        agentName: "DraftingAgent",
        taskType: "draft",
        message: "Contract compiler templates loaded. Standard NDAs, Contractor Agreements hot-loaded.",
        status: "info",
        timestamp,
      }
    ]);

    // 2. Seed initial transactions (Revenue evidence)
    await db.insert(transactions).values([
      {
        customerName: "Alice Miller",
        customerEmail: "alice.m@millerdesign.com",
        plan: "Growth Monthly",
        amount: 7900, // $79.00
        status: "succeeded",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
      {
        customerName: "Robert Garcia",
        customerEmail: "robert@garciaconsulting.co",
        plan: "Audit Basic",
        amount: 2900, // $29.00
        status: "succeeded",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      },
      {
        customerName: "Chloe Chen",
        customerEmail: "chloe@chenventures.net",
        plan: "Compliance Custom",
        amount: 24900, // $249.00
        status: "succeeded",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      }
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));
