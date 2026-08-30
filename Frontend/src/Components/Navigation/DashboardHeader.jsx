import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { useAuth } from "../../Context/AuthContext";

function DashboardHeader() {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  const date = now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const firstName = (user?.name || "there").split(" ")[0];

  return (
    <header style={{ display: "flex", alignItems: "center", gap: 24, padding: "4px 0" }}>
      <div style={{ flex: "1 1 auto", maxWidth: 560 }}>
        <SearchBar />
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 18, flex: "0 0 auto" }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#1e1a33", letterSpacing: "-.01em" }}>
          Hello, {firstName}
        </span>
        <div
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "8px 18px", borderRadius: 16, background: "#f4f2fb", minWidth: 128,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: ".04em", color: "#1e1a33", fontVariantNumeric: "tabular-nums" }}>
            {time}
          </span>
          <span style={{ fontSize: 11.5, color: "#8a82a3", marginTop: 1 }}>{date}</span>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;