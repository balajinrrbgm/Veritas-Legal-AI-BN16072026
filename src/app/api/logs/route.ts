import { NextResponse } from "next/server";
import { db } from "@/db";
import { agentLogs } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const logs = await db.select()
      .from(agentLogs)
      .orderBy(desc(agentLogs.id))
      .limit(80);

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("Fetch Logs Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { action } = await req.json();

    if (action === "clear") {
      // Clear logs by deleting all entries in SQLite
      await db.delete(agentLogs);
      return NextResponse.json({ message: "Logs cleared successfully" });
    }

    if (action === "generate") {
      const timestamp = new Date().toISOString();
      const agents = ["AnalysisAgent", "ResearchAgent", "DraftingAgent", "OpsSupervisor"];
      const statuses = ["info", "success", "warning", "working"];
      
      const simulatedLogs = [
        {
          agentName: "OpsSupervisor",
          taskType: "system",
          message: "Performing background integrity audit on pending legal queries.",
          status: "info",
        },
        {
          agentName: "ResearchAgent",
          taskType: "search",
          message: "Scraping state department portal: checking active LLC filing fees for New York.",
          status: "working",
        },
        {
          agentName: "AnalysisAgent",
          taskType: "audit",
          message: "Flagged Section 8.4 in NDA draft: indemnification clause is unilateral.",
          status: "warning",
        },
        {
          agentName: "DraftingAgent",
          taskType: "draft",
          message: "Document generated successfully. Initiated structural linting checklist.",
          status: "success",
        }
      ];

      // Choose a random log to insert
      const randomLog = simulatedLogs[Math.floor(Math.random() * simulatedLogs.length)];
      
      const [newLog] = await db.insert(agentLogs).values({
        agentName: randomLog.agentName,
        taskType: randomLog.taskType,
        message: randomLog.message,
        status: randomLog.status,
        timestamp,
      }).returning();

      return NextResponse.json(newLog);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Modify Logs Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
