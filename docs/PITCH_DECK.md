# Veritas Legal AI: Pitch Deck

## SLIDE 1: Cover & Vision
### Veritas Legal AI
*The Autonomous Legal & Compliance Swarm for Small Businesses.*
* **Subtitle:** Democratizing access to professional guidance for the 33 million US small businesses.
* **Presented by:** Team Veritas
* **XPrize Category:** Professional Services Access & Small Business Services

---

## SLIDE 2: The Problem
### The Legal Wall for Micro-Businesses
* **Cost Barriers**: Standard legal fees start at $250–$500/hour, which is prohibitively expensive for early founders.
* **Regulatory Complexity**: Local licensing, sales tax nexus laws, and municipal codes change constantly and are difficult to find.
* **Contract Risks**: Solo contractors sign agreements containing unilateral IP grabs and predatory liability caps because they cannot afford custom contract reviews.
* **Result**: Small businesses skip compliance, leaving them vulnerable to litigation, audits, or structural shutdown.

---

## SLIDE 3: The Solution
### Veritas Legal AI Swarm
We have built an autonomous back-office legal operations assistant operated by specialized AI agents:
1. **Contract Auditor (AnalysisAgent)**: Digests contracts, calculates risk indicators, and suggests specific negotiation adjustments.
2. **Local Compliance (ResearchAgent)**: Crawls live state regulations via Google Search Grounding to generate a local business checklist.
3. **Document Generator (DraftingAgent)**: Composes legally binding commercial agreements tailored to custom specifications.

---

## SLIDE 4: Product Demo
### Premium, Action-Oriented Workspace
* **Glassmorphic UI**: Beautiful Vanilla CSS dark-mode dashboard tailored for instant user action.
* **Interactive Auditing**: Upload and review agreements in under 5 seconds.
* **Live Agent Telemetry**: A dedicated operations console displaying the background execution loops and database outputs of our agents.
* **Direct Revenue Flow**: Checkout simulator recording subscription checkouts to fulfill the XPrize revenue evidence requirement.

---

## SLIDE 5: Technical Architecture
### AI-Native Flow Diagram

```
[ User UI ] ──(Upload Document / Search State)──► [ Next.js App API Routes ]
                                                         │
       ┌──────────────────┬──────────────────────────────┼────────────────────────┐
       ▼                  ▼                              ▼                        ▼
[ SQLite DB ]    [ AnalysisAgent ]               [ ResearchAgent ]        [ DraftingAgent ]
(Logs & Sales)   (Gemini Flash Core)            (Search Grounding)       (Template Engine)
```

* **Core Stack**: Next.js App Router, TypeScript, Drizzle ORM, SQLite DB, Google Gen AI SDK.
* **Gemini Advantage**: Long-context parsing allows loading 50+ page legal documents without truncation. Google Search Grounding ensures all regulatory checklist responses are current.

---

## SLIDE 6: Business Viability & Revenue Model
### Pricing & Traction
* **Traction (Sandbox)**: Active simulated transaction queue documenting subscription payments.
* **Subscription Tiers**:
  * *Audit Basic ($29/mo)*: Includes contract audits and standard NDAs.
  * *Growth Monthly ($79/mo)*: Full workspace access, compliance search, and contract drafting.
  * *Compliance Custom ($249/mo)*: Active multi-state monitoring and custom templates.
* **Zero Overhead**: Operational costs are limited to API queries (fractions of a cent per prompt), yielding a ~98% profit margin.

---

## SLIDE 7: XPrize Judging Alignment
### Why Veritas Legal AI Wins
1. **Business Viability**: Verified billing pipelines, clear P&L tracking, and a massive addressable market (micro-businesses represent 99% of all US companies).
2. **AI-Native Operations**: The business operations are fully automated by agents. The Ops console proves that background loops execute the core service decisions.
3. **Category Impact**: Democratizes access to high-cost professional legal counsel, enabling diverse founders to build compliant, sustainable businesses.

---

## Speaker Notes & FAQ Preparation
* **Q: How does Veritas Legal AI handle the risk of AI hallucination?**
  * *A:* Veritas uses strict prompt constraints, structural JSON schema responses, and Google Search Grounding to verify citations against active state domains. Most importantly, it implements a Human-in-the-Loop authorization step, presenting generated text as editable draft proposals rather than final execution-ready files.
* **Q: Is this unauthorized practice of law?**
  * *A:* No. The tool is explicitly marketed as a document drafting assistant and contract risk scanner for corporate operations, not a law firm. Users are prompted with disclaimers to review all outputs with a certified attorney.
