import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/db";
import { agentLogs } from "@/db/schema";

export async function POST(req: Request) {
  const timestamp = new Date().toISOString();

  try {
    const { documentType, details } = await req.json();
    if (!documentType || !details) {
      return NextResponse.json({ error: "Missing documentType or details" }, { status: 400 });
    }

    // Log agent initialization
    await db.insert(agentLogs).values({
      agentName: "DraftingAgent",
      taskType: "draft",
      message: `Received drafting commission. Document Type: "${documentType}". Inputs: "${details.substring(0, 100)}...".`,
      status: "working",
      timestamp,
    });

    const apiKey = process.env.GEMINI_API_KEY;
    let draftedText = "";

    if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          You are a professional corporate lawyer. Write a complete, comprehensive, and legally robust document/contract.
          Include formal titles, standard boilerplate clauses (governing law, severability, entire agreement), and address all custom specifications provided below.
          Do NOT use placeholders or instructions like [Insert Name Here]; deduce the logical details from the prompt or create realistic commercial terms.
          Return ONLY the plain text document with clean typography. Use markdown headers.

          Document Type: ${documentType}
          Custom Specifications: ${details}
        `;

        const result = await model.generateContent(prompt);
        draftedText = result.response.text();

        await db.insert(agentLogs).values({
          agentName: "DraftingAgent",
          taskType: "draft",
          message: `Gemini contract generation completed successfully (${draftedText.length} characters generated).`,
          status: "success",
          timestamp: new Date().toISOString(),
        });
      } catch (geminiError: any) {
        console.error("Gemini Drafting call failed, falling back to mock:", geminiError);
        draftedText = generateMockDraft(documentType, details);
        
        await db.insert(agentLogs).values({
          agentName: "DraftingAgent",
          taskType: "draft",
          message: `Gemini API execution error: ${geminiError.message}. Initiating fallback template engine.`,
          status: "warning",
          timestamp: new Date().toISOString(),
        });
      }
    } else {
      // Mock generation simulation
      draftedText = generateMockDraft(documentType, details);

      // Delay to simulate drafting execution
      await new Promise(resolve => setTimeout(resolve, 1500));

      await db.insert(agentLogs).values({
        agentName: "DraftingAgent",
        taskType: "draft",
        message: `Offline template compiler finished. Formatted contract sections.`,
        status: "success",
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      documentType,
      draftedContent: draftedText,
    });

  } catch (error: any) {
    console.error("Drafting API Error:", error);
    await db.insert(agentLogs).values({
      agentName: "DraftingAgent",
      taskType: "draft",
      message: `Drafting failed: ${error.message}`,
      status: "failed",
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateMockDraft(documentType: string, details: string): string {
  const cleanDetails = details.trim();
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  
  if (documentType.toLowerCase().includes("contractor") || documentType.toLowerCase().includes("service")) {
    return `# INDEPENDENT CONTRACTOR SERVICES AGREEMENT

**Effective Date:** ${dateStr}
**Governing Jurisdiction:** New York State

This Independent Contractor Services Agreement ("Agreement") is entered into by and between the Client as detailed in user requests, and the Independent Contractor specified in the registration dashboard.

## 1. SERVICES TO BE PERFORMED
The Contractor agrees to perform the following services for the Client (the "Services"):
* ${cleanDetails || "General technical consulting, design, and software programming tasks."}
* Deliver completed milestones as defined in scheduled sprint backlogs.

## 2. COMPENSATION AND PAYMENTS
* The Client shall compensate the Contractor at a rate of fifty US Dollars ($50.00) per hour, billed bi-weekly.
* Invoices shall be paid net-15 days from receipt.
* Late balances shall bear interest at 1.0% per month simple interest.

## 3. TERM AND TERMINATION
* This Agreement commences on the Effective Date and shall remain active until terminated.
* Either party may terminate this Agreement at any time, with or without cause, upon providing ten (10) business days written notice to the other party.
* Upon termination, the Contractor shall cease all work and the Client shall pay for all hours worked up to the date of termination.

## 4. INTELLECTUAL PROPERTY RIGHTS
* All custom materials, source code, designs, and deliverables created by the Contractor for the Client under this Agreement shall belong solely to the Client.
* Property ownership rights shall transfer from the Contractor to the Client immediately and fully upon receipt of complete payment of invoices relating to those deliverables.

## 5. CONFIDENTIALITY
* The Contractor agrees to hold all business plans, passwords, databases, and customer records in strict confidence and shall not disclose any Client information to third parties without prior written consent.

## 6. INDEPENDENT CONTRACTOR STATUS
* The Contractor is an independent contractor. Nothing in this Agreement creates an employee, partner, or joint-venture relationship. The Contractor is responsible for all local, state, and federal income taxes.

## 7. GOVERNING LAW & SEVERABILITY
* This Agreement is governed by the laws of the State of New York.
* If any clause is found invalid, the remaining terms shall continue in full force.

**IN WITNESS WHEREOF**, the Parties execute this Agreement as of the date first written above.`;
  }

  if (documentType.toLowerCase().includes("cease") || documentType.toLowerCase().includes("desist")) {
    return `# FORMAL NOTICE OF CEASE AND DESIST
## Intellectual Property Infringement & Defamation

**Date:** ${dateStr}
**TO:** Infringing Party / Unauthorized Operator

**SENT VIA REGISTERED MAIL AND ELECTRONIC TRANSMISSION**

**RE: Demands concerning intellectual property violations, trademark infringement, and unfair business practices.**

Dear Sir/Madam,

This law firm acts as independent corporate counsel for the Claimant (the "Claimant"). It has come to our attention that your business entity is engaging in unauthorized actions violating the Claimant's rights.

Specifically:
* ${cleanDetails || "Unauthorized replication of the Claimant's registered brand graphics, trade dress, and copyrighted software interface designs."}

### NOTICE TO CEASE AND DESIST
You are hereby ordered to immediately cease and desist from any and all unauthorized usage of copyright assets, trademark elements, or proprietary designs belonging to the Claimant.

### DEMANDS FOR COMPLIANCE
To prevent immediate legal escalation, you must comply with the following demands within five (5) business days from the date of this notice:
1. Remove all matching logo assets, design files, and text blocks from your active domains and social media.
2. Confirm in writing that all infringing materials have been permanently deleted and will not be deployed in the future.
3. Provide an accounting of any revenues derived from the unauthorized use of the Claimant's branding.

### CONSEQUENCES OF NON-COMPLIANCE
If you do not complete these terms by the compliance deadline, we will advise the Claimant to file an immediate civil action in federal district court seeking injunctive relief, statutory damages of up to $150,000 per violation, and recovery of attorney fees.

This letter is sent without prejudice to the Claimant’s rights, all of which are expressly reserved.

Sincerely,

**Veritas Legal Agent**
*On behalf of the Claimant*`;
  }

  // Fallback NDA
  return `# MUTUAL NON-DISCLOSURE AGREEMENT

**Effective Date:** ${dateStr}
**Governing Jurisdiction:** Delaware State

The Parties enter into this Mutual Non-Disclosure Agreement ("Agreement") to protect confidential information shared for the purpose of exploring a mutual business transaction.

## 1. CONFIDENTIAL INFORMATION
"Confidential Information" includes all proprietary technical, financial, and operational details shared, whether written, oral, or electronic, which are marked confidential or should logically be understood as private.

## 2. OBLIGATIONS OF RECEIVING PARTY
* Keep information strictly confidential and use it solely to evaluate the business transaction.
* Restrict access to employees and contractors who have signed matching NDA covenants.
* Protect the information using the same degree of care (but no less than reasonable care) as they use for their own confidential data.

## 3. TERM
* The obligations under this Agreement shall survive for a period of two (2) years following the disclosure date, after which obligations expire.

## 4. REMEDIES
* The parties agree that breach of this Agreement would cause irreparable harm, and the disclosing party is entitled to seek injunctive relief in addition to monetary damages.

**EXECUTED BY** the authorized representatives of the Parties.`;
}
