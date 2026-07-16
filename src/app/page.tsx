"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Search, FileText, ChevronRight, Play, CheckCircle, Database } from "lucide-react";

export default function LandingPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("Growth Monthly");
  const [amount, setAmount] = useState(7900); // $79.00 in cents
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPlan(val);
    if (val === "Audit Basic") {
      setAmount(2900);
    } else if (val === "Growth Monthly") {
      setAmount(7900);
    } else {
      setAmount(24900);
    }
  };

  const handleSimulateCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail) return;

    setLoading(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          plan: selectedPlan,
          amount,
        }),
      });

      if (res.ok) {
        setSuccessMsg(`Simulated payment of $${(amount / 100).toFixed(2)} received! Transaction recorded.`);
        setCustomerName("");
        setCustomerEmail("");
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || "Failed to record transaction"}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", paddingBottom: "3rem" }}>
      {/* Decorative Glows */}
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      {/* Header / Nav */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.5rem 3rem",
        borderBottom: "1px solid var(--border-color)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(6, 9, 14, 0.7)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="logo-icon">V</div>
          <span className="logo-text">Veritas Legal AI</span>
        </div>
        <nav style={{ display: "flex", gap: "2rem" }}>
          <Link href="/dashboard" className="nav-item" style={{ padding: "0.25rem 0.5rem" }}>Client Workspace</Link>
          <Link href="/operations" className="nav-item" style={{ padding: "0.25rem 0.5rem" }}>AI Operations Logs</Link>
        </nav>
        <Link href="/dashboard" className="btn btn-primary" style={{ padding: "0.6rem 1.25rem", borderRadius: "8px" }}>
          Enter App
        </Link>
      </header>

      {/* Hero Section */}
      <main className="content-inner" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <section className="hero-section">
          <div className="hero-badge">
            <Shield size={14} style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
            Build with Gemini XPrize Submission
          </div>
          <h1 className="hero-title">The Autonomous Legal operations Swarm</h1>
          <p className="hero-subtitle">
            Democratizing professional guidance. Ingest complex contracts, research localized state compliance registries, and draft customized legal documents—powered by Gemini agents.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="btn btn-primary">
              Launch Workspace <ChevronRight size={16} />
            </Link>
            <Link href="/operations" className="btn btn-secondary">
              <Play size={16} style={{ fill: "currentColor" }} /> Explore Agent Telemetry
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section style={{ margin: "4rem 0" }}>
          <h2 style={{ textAlign: "center", marginBottom: "3rem", fontSize: "2.25rem" }}>Meet the Agent Swarm</h2>
          <div className="grid-3">
            <div className="glass-card">
              <div style={{ color: "var(--accent-cyan)", marginBottom: "1.25rem" }}>
                <Shield size={36} />
              </div>
              <h3 style={{ marginBottom: "0.75rem" }}>AnalysisAgent</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                Leverages Gemini's huge context window to parse contracts, identifying liability gaps, hidden clauses, and negotiating opportunities in seconds.
              </p>
            </div>

            <div className="glass-card">
              <div style={{ color: "var(--accent-violet)", marginBottom: "1.25rem" }}>
                <Search size={36} />
              </div>
              <h3 style={{ marginBottom: "0.75rem" }}>ResearchAgent</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                Uses Google Search Grounding to research state department regulations and local taxes to draft a comprehensive, up-to-date regional compliance checklist.
              </p>
            </div>

            <div className="glass-card">
              <div style={{ color: "var(--accent-pink)", marginBottom: "1.25rem" }}>
                <FileText size={36} />
              </div>
              <h3 style={{ marginBottom: "0.75rem" }}>DraftingAgent</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                Compiles fully articulated, legally robust contractor agreements, NDAs, or letters tailored to custom specifications.
              </p>
            </div>
          </div>
        </section>

        {/* Revenue Simulator Section */}
        <section style={{ margin: "6rem 0" }} id="revenue-checkout">
          <div className="grid-2">
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h2 style={{ fontSize: "2.25rem", marginBottom: "1.5rem", lineHeight: 1.2 }}>
                XPrize Revenue Evidence & Billing Simulator
              </h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Under XPrize regulations, submissions must showcase real operational cash flow and transactions. 
              </p>
              <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.6 }}>
                Use this dashboard form to submit simulated payments. This triggers a real SQLite database transaction write, registers the license, and logs the customer event on our agent operations timeline.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <CheckCircle size={18} style={{ color: "var(--success)" }} />
                  <span>Records actual revenue data entries locally</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <CheckCircle size={18} style={{ color: "var(--success)" }} />
                  <span>Streams customer purchase signals directly to background agents</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Database size={18} style={{ color: "var(--success)" }} />
                  <span>Simulates P&L reporting ledger automatically</span>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: "2.25rem" }}>
              <h3 style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
                Secure Checkout Sandbox
              </h3>
              
              <form onSubmit={handleSimulateCheckout}>
                <div className="input-group">
                  <label className="input-label">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    className="input-text"
                    placeholder="E.g., Jane Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Customer Email Address</label>
                  <input
                    type="email"
                    required
                    className="input-text"
                    placeholder="E.g., jane@mycompany.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div className="input-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="input-label">Select Plan</label>
                    <select className="input-select" value={selectedPlan} onChange={handlePlanChange}>
                      <option value="Audit Basic">Audit Basic ($29)</option>
                      <option value="Growth Monthly">Growth Monthly ($79)</option>
                      <option value="Compliance Custom">Compliance Custom ($249)</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Payment Amount</label>
                    <div className="input-text" style={{ background: "rgba(0,0,0,0.3)", opacity: 0.85 }}>
                      ${(amount / 100).toFixed(2)} USD
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                  {loading ? "Authorizing with Sandbox..." : `Simulate Purchase ($${(amount / 100).toFixed(2)})`}
                </button>

                {successMsg && (
                  <div className="badge badge-success" style={{ display: "block", marginTop: "1.5rem", padding: "0.75rem", fontSize: "0.85rem", textAlign: "center" }}>
                    {successMsg}
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 Veritas Legal AI. Built for the Google & XPrize Build with Gemini Hackathon. All rights reserved.</p>
      </footer>
    </div>
  );
}
