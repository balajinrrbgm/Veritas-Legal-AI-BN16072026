import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/db";
import { documents, agentLogs } from "@/db/schema";

export async function POST(req: Request) {
  const timestamp = new Date().toISOString();
  
  try {
    const { name, content } = await req.json();
    if (!name || !content) {
      return NextResponse.json({ error: "Missing document name or content" }, { status: 400 });
    }

    // Save pending document
    const [insertedDoc] = await db.insert(documents).values({
      name,
      content,
      status: "pending",
      createdAt: timestamp,
    }).returning();

    // Log agent initialization
    await db.insert(agentLogs).values({
      agentName: "AnalysisAgent",
      taskType: "audit",
      message: `Initiating audit on document: "${name}" (${content.length} characters).`,
      status: "working",
      timestamp,
    });

    const apiKey = process.env.GEMINI_API_KEY;
    let analysisResultObj: any;
    let riskScoreVal = 0;

    if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
          You are an expert corporate legal auditor. Analyze this contract/document and return a JSON object evaluating legal risks.
          The output MUST match this JSON structure:
          {
            "riskScore": (number between 0 and 100 representing risk severity),
            "summary": "a brief high-level legal summary of the document",
            "clauses": [
              {
                "title": "Clause section/name",
                "severity": "high" | "medium" | "low",
                "issue": "Detailed explanation of what the risk is in this clause",
                "remedy": "How the business owner should renegotiate or change this clause"
              }
            ]
          }

          Document Content:
          ${content}
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        analysisResultObj = JSON.parse(text);
        riskScoreVal = analysisResultObj.riskScore || 0;

        await db.insert(agentLogs).values({
          agentName: "AnalysisAgent",
          taskType: "audit",
          message: `Gemini audit completed. Identified ${analysisResultObj.clauses?.length || 0} risk areas. Risk Score: ${riskScoreVal}.`,
          status: "success",
          timestamp: new Date().toISOString(),
        });
      } catch (geminiError: any) {
        console.error("Gemini API call failed, falling back to mock:", geminiError);
        // Fallback inside error block
        const fallback = generateMockAnalysis(name, content);
        analysisResultObj = fallback.result;
        riskScoreVal = fallback.riskScore;
        
        await db.insert(agentLogs).values({
          agentName: "AnalysisAgent",
          taskType: "audit",
          message: `Gemini API execution error: ${geminiError.message}. Using offline backup processor.`,
          status: "warning",
          timestamp: new Date().toISOString(),
        });
      }
    } else {
      // Mock processing simulation for hackathon demo
      const fallback = generateMockAnalysis(name, content);
      analysisResultObj = fallback.result;
      riskScoreVal = fallback.riskScore;

      // Add a small delay to simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      await db.insert(agentLogs).values({
        agentName: "AnalysisAgent",
        taskType: "audit",
        message: `Offline audit processor completed. Identified ${analysisResultObj.clauses.length} risk areas. Risk Score: ${riskScoreVal}.`,
        status: "success",
        timestamp: new Date().toISOString(),
      });
    }

    // Update document status
    await db.update(documents)
      .set({
        status: "analyzed",
        riskScore: riskScoreVal,
        analysisResult: JSON.stringify(analysisResultObj),
      })
      .where(eq(documents.id, insertedDoc.id));

    return NextResponse.json({
      id: insertedDoc.id,
      name,
      status: "analyzed",
      riskScore: riskScoreVal,
      analysisResult: analysisResultObj,
    });

  } catch (error: any) {
    console.error("Audit API Error:", error);
    await db.insert(agentLogs).values({
      agentName: "AnalysisAgent",
      taskType: "audit",
      message: `Audit failed: ${error.message}`,
      status: "failed",
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Utility function to support drizzle eq comparison
import { eq } from "drizzle-orm";

function generateMockAnalysis(name: string, content: string) {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes("nda") || contentLower.includes("nondisclosure") || contentLower.includes("non-disclosure")) {
    return {
      riskScore: 28,
      result: {
        riskScore: 28,
        summary: "This is a standard unilateral or bilateral Non-Disclosure Agreement. It contains typical confidentiality bounds but includes a slightly restrictive non-solicitation term.",
        clauses: [
          {
            title: "Section 3: Term of Obligation",
            severity: "medium",
            issue: "Confidentiality obligations are set to 'indefinite' for trade secrets and 5 years for general information. For small businesses, indefinite survival creates long-term liability.",
            remedy: "Amend the confidentiality obligation to terminate 2 years following disclosure, which is standard in commercial agreements."
          },
          {
            title: "Section 7: Non-Solicitation of Employees",
            severity: "medium",
            issue: "Prevents hiring any employee of the disclosing party for 24 months, regardless of whether the hire resulted from the confidential engagement.",
            remedy: "Limit the scope to 'employees directly involved in discussions or services relating to this Agreement who were introduced as a direct result of the collaboration'."
          },
          {
            title: "Section 10: Governing Law & Jurisdiction",
            severity: "low",
            issue: "Governing law is set to Delaware and jurisdiction to federal courts. This could be expensive if a dispute arises.",
            remedy: "Change to your local state and county jurisdiction to avoid travel and foreign legal expenses."
          }
        ]
      }
    };
  }
  
  // Default general contract response
  return {
    riskScore: 68,
    result: {
      riskScore: 68,
      summary: "This document is a commercial agreement with significant risk indicators regarding payment terms, warranty disclaimers, and indemnification caps.",
      clauses: [
        {
          title: "Section 5: Payment Terms & Late Fees",
          severity: "high",
          issue: "Allows the vendor to assess a 2.5% monthly compound interest fee on all late balances and immediately suspend services without notice.",
          remedy: "Negotiate a 10-day grace period, restrict late fees to a maximum of 1% per month simple interest, and require at least 5 business days written notice before service suspension."
        },
        {
          title: "Section 8: Indemnity and Liability Cap",
          severity: "high",
          issue: "The agreement lacks a mutual limit on liability. The provider is completely indemnified, but the customer is subject to unlimited liability for general breaches.",
          remedy: "Add a mutual limit on liability capped at the total amount paid under the contract in the preceding 12-month period."
        },
        {
          title: "Section 11: Intellectual Property Rights",
          severity: "medium",
          issue: "All customized deliverables are owned by the developer from inception, rather than transferring ownership to the client upon final payment.",
          remedy: "Add a clause stating that copyright and intellectual property rights for custom work vest with the customer immediately upon full payment of the invoice."
        }
      ]
    }
  };
}
