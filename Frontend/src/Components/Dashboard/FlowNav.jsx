import React from "react";
import { useDashboard } from "../../Context/DashboardContext";

const STAGES = [
  { n: 1, name: "Commercial approval", sub: "Awaiting sign-off",         value: "Pending",       color: "#f0a13c", tint: "#fdeed9", keyName: "commercialApproval", deltaKey: "commercialApprovalDelta", fallbackDelta: "+2" },
  { n: 2, name: "Order approved",      sub: "Docs ready to generate",    value: "Approved",      color: "#6c5ce7", tint: "#e8e2fb", keyName: "orderApproved",      deltaKey: "orderApprovedDelta",      fallbackDelta: "+1" },
  { n: 3, name: "Implementation",      sub: "Provisioning in field",     value: "Generation",    color: "#3aa0e0", tint: "#dcecfa", keyName: "implementation",     deltaKey: "implementationDelta",     fallbackDelta: "+11" },
  { n: 4, name: "Active links",        sub: "Live and billing",          value: "Active",        color: "#2fb47c", tint: "#daf1e4", keyName: "activeLinks",        deltaKey: "activeLinksDelta",        fallbackDelta: "+37", chipKey: "activationRate", chipSuffix: "% activation" },
  { n: "L", name: "Termination pending", sub: "Notice served, still billing", value: "Notice Period", color: "#e08a4a", tint: "transparent", keyName: "terminationPending", deltaKey: "terminationPendingDelta", fallbackDelta: "-3", exit: true, dashed: true },
  { n: "L", name: "Churned",           sub: "Disconnected this year",    value: "Disconnected",  color: "#e2604f", tint: "#faf7fb", keyName: "churnLink",          deltaKey: "churnLinkDelta",          fallbackDelta: "+4", exit: true, chipKey: "churnRate", chipSuffix: "% churn rate" },
];

function StageCard({ stage, count, chip, delta, loading, onSelect }) {
  const muted = stage.exit;
  const negative = String(delta).trim().startsWith("-");

  return (
    <div
      style={{
        position: "relative",
        flex: "1 1 0",
        minWidth: 172,
        minHeight: 196,
        display: "flex",
        flexDirection: "column",
        padding: "16px 18px 18px",
        borderRadius: 20,
        background: muted ? (stage.dashed ? "transparent" : "#fbf9fc") : stage.tint,
        border: stage.dashed ? "1px dashed #d9d3e6" : muted ? "1px solid #ece8f3" : "1px solid transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 26, height: 26, borderRadius: 9,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: muted ? "#fff" : stage.color,
            border: muted ? `1px solid ${stage.color}33` : "none",
            color: muted ? stage.color : "#fff",
            fontSize: 12, fontWeight: 700, lineHeight: 1,
          }}
        >
          {stage.n}
        </span>
        <span
          style={{
            padding: "3px 8px", borderRadius: 99,
            background: "#ffffffcc",
            fontSize: 11, fontWeight: 600, fontVariantNumeric: "tabular-nums",
            color: negative ? "#e2604f" : "#2fb47c",
          }}
        >
          {loading ? "··" : delta}
        </span>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: "#1e1a33", letterSpacing: "-.01em" }}>{stage.name}</div>
        <div style={{ marginTop: 4, fontSize: 12.5, color: muted ? "#9a92ad" : "#7d7595" }}>{stage.sub}</div>
      </div>

      <div style={{ marginTop: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
        <div>
          {chip && (
            <span
              style={{
                display: "inline-block", marginBottom: 8,
                padding: "5px 11px", borderRadius: 99,
                background: "#fff", fontSize: 11.5, fontWeight: 600, color: "#3d3557",
              }}
            >
              {chip}
            </span>
          )}
          <div style={{ fontSize: 32, fontWeight: 650, lineHeight: 1, color: "#1e1a33", fontVariantNumeric: "tabular-nums" }}>
            {loading ? "—" : count}
          </div>
        </div>

        <button
          type="button"
          aria-label={`Filter connections by ${stage.name}`}
          onClick={() => onSelect(stage.value)}
          style={{
            flex: "0 0 auto",
            width: muted ? 30 : 36, height: muted ? 30 : 36,
            borderRadius: 99, border: 0,
            background: muted ? "#2a2440" : "#16121f",
            color: "#fff", fontSize: muted ? 12 : 14, lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", opacity: muted ? .85 : 1,
            transition: "transform .15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
        >
          ↗
        </button>
      </div>
    </div>
  );
}

function FlowNav() {
  const { metrics, loadingMetrics, setActiveTab, fetchConnectionsList } = useDashboard();

  const filterSelect = (statusValue) => {
    setActiveTab("connections");
    fetchConnectionsList(1, statusValue, false);
  };

  const countOf = (k) => metrics?.counters?.[k] ?? 0;
  const deltaOf = (s) => metrics?.counters?.[s.deltaKey] ?? s.fallbackDelta;
  const chipOf = (s) => {
    if (!s.chipKey) return null;
    const v = metrics?.performance?.[s.chipKey];
    return v === undefined ? null : `${v}${s.chipSuffix}`;
  };

  const journey = STAGES.filter((s) => !s.exit);
  const exits = STAGES.filter((s) => s.exit);

  return (
    <section style={{ userSelect: "none", display: "flex", alignItems: "stretch", gap: 22, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 640px", display: "flex", gap: 14 }}>
        {journey.map((s) => (
          <StageCard key={s.keyName} stage={s} count={countOf(s.keyName)} delta={deltaOf(s)} chip={chipOf(s)} loading={loadingMetrics} onSelect={filterSelect} />
        ))}
      </div>
      <div style={{ flex: "1 1 360px", display: "flex", gap: 14 }}>
        {exits.map((s) => (
          <StageCard key={s.keyName} stage={s} count={countOf(s.keyName)} delta={deltaOf(s)} chip={chipOf(s)} loading={loadingMetrics} onSelect={filterSelect} />
        ))}
      </div>
    </section>
  );
}

export default FlowNav;