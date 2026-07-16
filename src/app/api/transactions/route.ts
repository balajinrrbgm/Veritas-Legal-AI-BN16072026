import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions, agentLogs } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const records = await db.select()
      .from(transactions)
      .orderBy(desc(transactions.id));

    return NextResponse.json(records);
  } catch (error: any) {
    console.error("Fetch Transactions Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { customerName, customerEmail, plan, amount } = await req.json();
    
    if (!customerName || !customerEmail || !plan || !amount) {
      return NextResponse.json({ error: "Missing checkout parameters" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    const [record] = await db.insert(transactions).values({
      customerName,
      customerEmail,
      plan,
      amount,
      status: "succeeded",
      createdAt: timestamp,
    }).returning();

    // Log the transaction in the Agent Logs
    await db.insert(agentLogs).values({
      agentName: "OpsSupervisor",
      taskType: "system",
      message: `Checkout Complete. Customer ${customerName} (${customerEmail}) subscribed to ${plan} for $${(amount / 100).toFixed(2)}.`,
      status: "success",
      timestamp,
    });

    return NextResponse.json(record);
  } catch (error: any) {
    console.error("Record Transaction Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
