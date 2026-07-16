"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Shield, Trash2, ArrowLeft, RefreshCw, DollarSign, ActivitySquare, Server, Cpu } from "lucide-react";

interface LogLine {
  id: number;
  agentName: string;
  taskType: string;
  message: string;
  status: string;
  timestamp: string;
}

interface TransactionRecord {
  id: number;
  customerName: string;
  customerEmail: string;
  plan: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function OperationsConsole() {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [txs, setTxs] = useState<TransactionRecord[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      if (res.ok) {
        const data = await res.json();
        setTxs(data);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  // Poll database logs and transaction updates
  useEffect(() => {
    fetchLogs();
    fetchTransactions();

    const interval = setInterval(() => {
      fetchLogs();
      fetchTransactions();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleClearLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });
      if (res.ok) {
        setLogs([]);
      }
    } catch (err) {
      alert("Failed to clear logs");
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleSimulateAgentTask = async () => {
    setSimulating(true);
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      });
      if (res.ok) {
        await fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  // Compute total revenue
  const totalRevenue = txs.reduce((acc, curr) => acc + curr.amount, 0) / 100;

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
            <Link href="/dashboard" className="nav-item">
              <Shield className="nav-icon" /> Workspace
            </Link>
          </li>
          <li>
            <button className="nav-item active" style={{ width: "100%", border: "none", cursor: "pointer", textAlign: "left" }}>
              <Activity className="nav-icon" /> AI Agent Logs
            </button>
          </li>
          <li>
            <Link href="/" className="nav-item">
              <ArrowLeft className="nav-icon" /> Back to Home
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

      {/* Main panel content */}
      <main className="main-content">
        <div className="bg-glow-2"></div>
        <div className="content-inner">

          <header className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 className="page-title">AI Operations Console</h1>
              <p className="page-subtitle">Real-time status check on agent loops and business transactional activity.</p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={handleSimulateAgentTask} disabled={simulating} className="btn btn-secondary" style={{ fontSize: "0.85rem", padding: "0.6rem 1.15rem" }}>
                <RefreshCw size={14} className={simulating ? "spinner" : ""} /> Trigger Agent Task
              </button>
              <button onClick={handleClearLogs} disabled={loadingLogs} className="btn btn-secondary" style={{ fontSize: "0.85rem", padding: "0.6rem 1.15rem", color: "var(--error)" }}>
                <Trash2 size={14} /> Reset Terminal
              </button>
            </div>
          </header>

          {/* Grid: Console and Stats */}
          <div className="grid-main-aside">
            <div>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <ActivitySquare size={20} style={{ color: "var(--accent-cyan)" }} />
                    Live Agent Telemetry Feed
                  </h3>
                  <span className="badge badge-success">
                    <span style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "currentColor",
                      marginRight: "0.35rem",
                      display: "inline-block"
                    }}></span>
                    System Live
                  </span>
                </div>

                <div className="logs-console">
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <div key={log.id} className={`log-line ${log.status}`}>
                        <span className="log-time">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className="log-agent">&lt;{log.agentName}&gt;</span>
                        <span className="log-message">{log.message}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "var(--text-muted)", textAlign: "center", paddingTop: "8rem" }}>
                      --- Console empty. Trigger a workspace action or checkout simulation ---
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column sidebar telemetry */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              
              {/* Agent Health Monitor */}
              <div className="glass-card">
                <h3 style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Cpu size={18} style={{ color: "var(--accent-violet)" }} />
                  Agent Core States
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.9rem" }}>AnalysisAgent</span>
                    <span className="badge badge-success">online</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.9rem" }}>ResearchAgent</span>
                    <span className="badge badge-success">online</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.9rem" }}>DraftingAgent</span>
                    <span className="badge badge-success">online</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.9rem" }}>OpsSupervisor</span>
                    <span className="badge badge-success">active</span>
                  </div>
                </div>
              </div>

              {/* Revenue metrics cards */}
              <div className="glass-card">
                <h3 style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <DollarSign size={18} style={{ color: "var(--success)" }} />
                  XPrize Business Ledger
                </h3>
                <div style={{ background: "rgba(0,0,0,0.2)", padding: "1.25rem", borderRadius: "8px", marginBottom: "1.5rem", textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.05em" }}>
                    Gross Sandbox Revenue
                  </div>
                  <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--success)", margin: "0.25rem 0" }}>
                    ${totalRevenue.toFixed(2)}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {txs.length} client subscriptions registered
                  </div>
                </div>

                <h4 style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>Recent Sales Log</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "250px", overflowY: "auto" }}>
                  {txs.length > 0 ? (
                    txs.map((tx) => (
                      <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: 600 }}>{tx.customerName}</span>
                          <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{tx.plan}</span>
                        </div>
                        <span style={{ color: "var(--success)", fontWeight: "bold" }}>
                          +${(tx.amount / 100).toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", padding: "1rem" }}>
                      No transactions recorded yet
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
