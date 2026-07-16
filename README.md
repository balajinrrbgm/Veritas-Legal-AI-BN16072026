# Veritas Legal AI ⚖️

### The Autonomous Legal & Compliance Swarm for Small Businesses

Veritas Legal AI is an AI-agent-operated legal compliance and contract operations hub built for the **Build with Gemini XPrize**. It democratizes access to professional guidance for micro-businesses, freelancers, and startups by automating contract audits, state-level regulatory checks, and contract drafting using the Google Gemini architecture.

---

## 🌟 Key Features

1. **Contract Auditor (AnalysisAgent)**: paste service contracts or NDAs. The agent leverages Gemini's long-context capabilities to scan agreements, calculate a risk index, summarize terms, and map clause-by-clause remedies.
2. **Regulatory Compliance Checklist (ResearchAgent)**: Select your state and input your industry. The agent uses Google Search Grounding to research live state registry guidelines and construct an up-to-date compliance task list (licenses, tax permits, entity formation).
3. **Document Generator (DraftingAgent)**: Instantly compose legally structured Contractor Agreements, NDAs, or Cease and Desist notices tailored to custom variables.
4. **AI Operations logs (OpsSupervisor)**: A live-streaming dashboard that displays background agent execution logs, tool queries, database entries, and telemetry events to prove the business runs autonomously.
5. **XPrize Billing Sandbox**: An interactive subscription payment simulator that commits records directly to our database transaction ledger, providing empirical proof of gross revenue as required by Devpost guidelines.

---

## 🛠️ Technology Stack

* **Core Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
* **AI Core**: [Google Generative AI SDK](https://github.com/google-gemini/generative-ai-js) (`gemini-1.5-flash` model)
* **Database & ORM**: [Drizzle ORM](https://orm.drizzle.team/) with [LibSQL Client](https://github.com/tursadatabase/libsql-client-ts) (SQLite)
* **Styling**: Premium Dark Glassmorphic Theme using **Pure Vanilla CSS**
* **Iconography**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Quick Start

Follow these steps to set up and run Veritas Legal AI locally on your system:

### 1. Prerequisites
Ensure you have [Node.js v20+](https://nodejs.org/) installed.

### 2. Configure Environment
1. Copy the `.env.local` template:
   ```bash
   cp .env.local.example .env.local
   ```
2. Open `.env.local` and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
> 💡 **Note:** If no Gemini API key is provided, the application will automatically fall back to its internal local database simulation models, allowing you to test all frontend features and operations telemetry completely offline.

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup and Seed the Database
Synchronize the Drizzle schema and populate the SQLite database with starting logs and revenue transaction history:
```bash
# Push schema changes to sqlite.db
npm run db:push

# Run seed script to insert default data
npm run db:seed
```

### 5. Launch the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

---

## 📂 Project Structure

```
/veritas-legal-ai
├── /docs                    # Written narrative and pitch slides
│   ├── NARRATIVE.md         # 500-1000 word case study narrative
│   └── PITCH_DECK.md        # Pitch deck slide presentation guides
├── /src
│   ├── /app
│   │   ├── /api
│   │   │   ├── /analyze     # AnalysisAgent endpoint
│   │   │   ├── /draft       # DraftingAgent endpoint
│   │   │   ├── /logs        # Agent log telemetry controller
│   │   │   ├── /research    # ResearchAgent lookup endpoint
│   │   │   └── /transactions# Checkout simulator endpoint
│   │   ├── /dashboard       # Main user dashboard page
│   │   ├── /operations      # Ops telemetry console view
│   │   ├── globals.css      # Custom dark-theme glassmorphism CSS
│   │   ├── layout.tsx       # HTML5 layouts & metadata
│   │   └── page.tsx         # Premium landing page and billing sandbox
│   └── /db
│       ├── index.ts         # SQLite LibSQL connection setup
│       ├── schema.ts        # SQLite table declarations
│       └── seed.ts          # Database seed script
├── drizzle.config.ts        # Drizzle ORM layout configurations
├── package.json             # NPM package declarations
└── tsconfig.json            # TypeScript compiler configuration
```

---

## ⚖️ License
Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
