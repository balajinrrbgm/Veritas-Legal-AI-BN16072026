"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Search, FileText, Activity, LogOut, UploadCloud, AlertTriangle, HelpCircle, CheckCircle, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const [activeSubTab, setActiveSubTab] = useState<"audit" | "compliance" | "draft">("audit");
  
  // 1. Audit State
  const [docName, setDocName] = useState("");
  const [docContent, setDocContent] = useState("");
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  // 2. Compliance State
  const [compState, setCompState] = useState("California");
  const [compIndustry, setCompIndustry] = useState("");
  const [complianceLoading, setComplianceLoading] = useState(false);
  const [complianceResult, setComplianceResult] = useState<any>(null);

  // 3. Draft State
  const [draftType, setDraftType] = useState("Independent Contractor Agreement");
  const [draftDetails, setDraftDetails] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftResult, setDraftResult] = useState<string>("");

  // Handler for Document Audit
  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docContent) return;
    setAuditLoading(true);
    setAuditResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: docName, content: docContent }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuditResult(data.analysisResult);
      } else {
        alert(`Error: ${data.error || "Analysis failed"}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setAuditLoading(false);
    }
  };

  // Handler for Compliance Research
  const handleCompliance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compIndustry) return;
    setComplianceLoading(true);
    setComplianceResult(null);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: compState, businessType: compIndustry }),
      });
      const data = await res.json();
      if (res.ok) {
        setComplianceResult(data);
      } else {
        alert(`Error: ${data.error || "Search failed"}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setComplianceLoading(false);
    }
  };

  // Handler for Document Drafting
  const handleDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftDetails) return;
    setDraftLoading(true);
    setDraftResult("");

    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType: draftType, details: draftDetails }),
      });
      const data = await res.json();
      if (res.ok) {
        setDraftResult(data.draftedContent);
      } else {
        alert(`Error: ${data.error || "Draft generation failed"}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setDraftLoading(false);
    }
  };

  // Render Risk Color Indicator
  const getRiskClass = (score: number) => {
    if (score >= 60) return "risk-high";
    if (score >= 30) return "risk-medium";
    return "risk-low";
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">V</div>
          <span className="logo-text">Veritas Legal AI</span>
        </div>
        
        <ul className="nav-list">
          <li>
            <button className="nav-item active" style={{ width: "100%", border: "none", cursor: "pointer", textAlign: "left" }}>
              <Shield className="nav-icon" /> Workspace
            </button>
          </li>
          <li>
            <Link href="/operations" className="nav-item">
              <Activity className="nav-icon" /> AI Agent Logs
            </Link>
          </li>
          <li>
            <Link href="/" className="nav-item">
              <LogOut className="nav-icon" /> Exit Dashboard
            </Link>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">SB</div>
            <div className="user-info">
              <span className="user-name">Small Biz Founder</span>
              <span className="user-role">Premium Member</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content body */}
      <main className="main-content">
        <div className="bg-glow-1"></div>
        <div className="content-inner">
          
          <header className="page-header">
            <h1 className="page-title">Client Operations Workspace</h1>
            <p className="page-subtitle">Interact with specialized legal agents to analyze risk, search regulations, and generate contracts.</p>
          </header>

          {/* Sub-tabs workspace selection */}
          <div style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "0.5rem"
          }}>
            <button
              className={`btn ${activeSubTab === "audit" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveSubTab("audit")}
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
            >
              <Shield size={14} style={{ marginRight: "0.35rem" }} /> Contract Auditor
            </button>
            <button
              className={`btn ${activeSubTab === "compliance" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveSubTab("compliance")}
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
            >
              <Search size={14} style={{ marginRight: "0.35rem" }} /> Compliance Search
            </button>
            <button
              className={`btn ${activeSubTab === "draft" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveSubTab("draft")}
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
            >
              <FileText size={14} style={{ marginRight: "0.35rem" }} /> Document Generator
            </button>
          </div>

          {/* Tab 1: Contract Auditor */}
          {activeSubTab === "audit" && (
            <div className="grid-main-aside">
              <div className="glass-card">
                <h3 style={{ marginBottom: "1.25rem" }}>Legal Document Ingestion</h3>
                <form onSubmit={handleAudit}>
                  <div className="input-group">
                    <label className="input-label">Document Title / File Name</label>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="e.g., NDA_Contract_Draft.txt"
                      required
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Document Content (Paste text)</label>
                    <textarea
                      className="input-textarea"
                      placeholder="Paste contract paragraphs here..."
                      required
                      value={docContent}
                      onChange={(e) => setDocContent(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={auditLoading}>
                    {auditLoading ? (
                      <>
                        <div className="spinner"></div> AnalysisAgent Reviewing...
                      </>
                    ) : "Audit Contract Clauses"}
                  </button>
                </form>
              </div>

              {/* Analysis Result Side panel */}
              <div>
                {auditResult ? (
                  <div className="glass-card" style={{ animation: "pulseGlow 4s infinite" }}>
                    <div className="risk-gauge-container">
                      <div className="risk-title">Calculated Legal Risk</div>
                      <div className={`risk-circle ${getRiskClass(auditResult.riskScore)}`}>
                        <div className="risk-value">{auditResult.riskScore}</div>
                        <div className="risk-label">Score</div>
                      </div>
                    </div>

                    <h4 style={{ marginBottom: "0.75rem" }}>Executive Summary</h4>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                      {auditResult.summary}
                    </p>

                    <h4 style={{ marginBottom: "0.75rem" }}>Clause Risk Breakdown</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {auditResult.clauses?.map((clause: any, index: number) => (
                        <div key={index} style={{ borderLeft: "3px solid " + (clause.severity === "high" ? "var(--error)" : clause.severity === "medium" ? "var(--warning)" : "var(--success)"), paddingLeft: "0.75rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{clause.title}</span>
                            <span className={`badge ${clause.severity === "high" ? "badge-error" : clause.severity === "medium" ? "badge-warning" : "badge-success"}`}>
                              {clause.severity}
                            </span>
                          </div>
                          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                            <strong>Issue:</strong> {clause.issue}
                          </p>
                          <p style={{ fontSize: "0.8rem", color: "var(--accent-cyan)", marginTop: "0.25rem" }}>
                            <strong>Remedy:</strong> {clause.remedy}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="glass-card" style={{ textAlign: "center", color: "var(--text-secondary)", padding: "3rem 1rem" }}>
                    <UploadCloud size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
                    <h4>Awaiting Ingestion</h4>
                    <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Paste a legal document to trigger agent reviews.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Compliance Research */}
          {activeSubTab === "compliance" && (
            <div className="grid-main-aside">
              <div className="glass-card">
                <h3 style={{ marginBottom: "1.25rem" }}>Local Compliance Lookup</h3>
                <form onSubmit={handleCompliance}>
                  <div className="input-group">
                    <label className="input-label">Select State Jurisdiction</label>
                    <select className="input-select" value={compState} onChange={(e) => setCompState(e.target.value)}>
                      <option value="California">California</option>
                      <option value="New York">New York</option>
                      <option value="Texas">Texas</option>
                      <option value="Florida">Florida</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Business Sector / Industry</label>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="e.g., E-Commerce Apparel, Coffee Shop, Freelance Copywriting"
                      required
                      value={compIndustry}
                      onChange={(e) => setCompIndustry(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={complianceLoading}>
                    {complianceLoading ? (
                      <>
                        <div className="spinner"></div> ResearchAgent Querying...
                      </>
                    ) : "Run Compliance Search"}
                  </button>
                </form>
              </div>

              {/* Compliance checklist results */}
              <div>
                {complianceResult ? (
                  <div className="glass-card">
                    <h3 style={{ marginBottom: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
                      {complianceResult.state} Checklist
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                      Target: <strong>{complianceResult.businessType}</strong>
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {complianceResult.items?.map((item: any) => (
                        <div key={item.id} style={{ display: "flex", gap: "1rem", background: "rgba(0, 0, 0, 0.15)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                          <div style={{ marginTop: "0.2rem" }}>
                            {item.urgency === "high" ? (
                              <AlertTriangle size={18} style={{ color: "var(--error)" }} />
                            ) : (
                              <HelpCircle size={18} style={{ color: "var(--warning)" }} />
                            )}
                          </div>
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.title}</span>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <span className="badge badge-info">{item.category}</span>
                                <span className={`badge ${item.urgency === "high" ? "badge-error" : item.urgency === "medium" ? "badge-warning" : "badge-success"}`}>
                                  {item.urgency}
                                </span>
                              </div>
                            </div>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem", lineHeight: 1.4 }}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="glass-card" style={{ textAlign: "center", color: "var(--text-secondary)", padding: "3rem 1rem" }}>
                    <Search size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
                    <h4>Checklist Engine Standby</h4>
                    <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Enter state and industry details to query regulatory rules.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Document Drafting */}
          {activeSubTab === "draft" && (
            <div className="grid-main-aside">
              <div className="glass-card">
                <h3 style={{ marginBottom: "1.25rem" }}>Contract Draft Request</h3>
                <form onSubmit={handleDraft}>
                  <div className="input-group">
                    <label className="input-label">Select Document Template</label>
                    <select className="input-select" value={draftType} onChange={(e) => setDraftType(e.target.value)}>
                      <option value="Independent Contractor Agreement">Independent Contractor Agreement</option>
                      <option value="Cease and Desist Letter">Cease and Desist Letter</option>
                      <option value="Mutual Non-Disclosure Agreement">Mutual Non-Disclosure Agreement</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Contract Custom Details</label>
                    <textarea
                      className="input-textarea"
                      placeholder="E.g., Freelancer Jane Doe, rate $50/hr, starting next Monday. Governed by California law..."
                      required
                      value={draftDetails}
                      onChange={(e) => setDraftDetails(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={draftLoading}>
                    {draftLoading ? (
                      <>
                        <div className="spinner"></div> DraftingAgent Writing...
                      </>
                    ) : "Generate Document"}
                  </button>
                </form>
              </div>

              {/* Draft generator results */}
              <div>
                {draftResult ? (
                  <div className="glass-card" style={{ maxHeight: "500px", overflowY: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
                      <h4 style={{ color: "var(--accent-cyan)" }}>Compiled Document Output</h4>
                      <button className="badge badge-success" style={{ cursor: "pointer" }} onClick={() => {
                        navigator.clipboard.writeText(draftResult);
                        alert("Copied to clipboard!");
                      }}>
                        Copy Text
                      </button>
                    </div>
                    <pre style={{
                      fontFamily: "var(--font-sans)",
                      whiteSpace: "pre-wrap",
                      fontSize: "0.85rem",
                      lineHeight: 1.6,
                      color: "var(--text-primary)"
                    }}>
                      {draftResult}
                    </pre>
                  </div>
                ) : (
                  <div className="glass-card" style={{ textAlign: "center", color: "var(--text-secondary)", padding: "3rem 1rem" }}>
                    <FileText size={48} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
                    <h4>Draft Compiler Standby</h4>
                    <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Input the details to let specialized drafting agents compose contracts.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}


