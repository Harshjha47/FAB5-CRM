import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import dashboardService from "../../Services/dashboard.service";

const ACCENT = "#6c5ce7";

const SearchBar = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState({ connections: [], customers: [], users: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") setQuery("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ connections: [], customers: [], users: [] });
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await dashboardService.search(query);
        if (response.success) setResults(response.results);
      } catch (err) {
        console.error("Global dashboard search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const empty =
    !results.connections?.length && !results.customers?.length && !results.users?.length;

  return (
    <div style={{ position: "relative", width: "100%", userSelect: "none" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          height: 52,
          padding: "0 18px",
          borderRadius: 99,
          background: focused ? "#f2effc" : "#f4f2fb",
          border: `1px solid ${focused ? "#ded6f7" : "transparent"}`,
          transition: "background .15s ease, border-color .15s ease",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a29cb8" strokeWidth="2" strokeLinecap="round" style={{ flex: "0 0 auto" }}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search or type a command"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            minWidth: 0,
            border: 0,
            outline: "none",
            background: "transparent",
            fontSize: 15.5,
            color: "#1e1a33",
            letterSpacing: "-.01em",
          }}
        />

        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            style={{
              flex: "0 0 auto", width: 22, height: 22, borderRadius: 99, border: 0,
              background: "#e4dff5", color: "#6f6890", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={12} />
          </button>
        ) : (
          <span style={{ flex: "0 0 auto", fontSize: 12, color: "#a29cb8", letterSpacing: ".02em" }}>
            ⌘F
          </span>
        )}
      </div>

      {query.trim() && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 50,
            maxHeight: 460, overflowY: "auto",
            background: "#fff", borderRadius: 20,
            border: "1px solid #efecfa",
            boxShadow: "0 28px 60px -30px rgba(38,26,84,.45)",
            padding: 8,
          }}
        >
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: 26, fontSize: 13, color: "#9a92ad" }}>
              <span
                style={{
                  width: 14, height: 14, borderRadius: 99,
                  border: `2px solid ${ACCENT}33`, borderBottomColor: ACCENT,
                  animation: "spin .7s linear infinite",
                }}
              />
              Searching…
            </div>
          ) : empty ? (
            <div style={{ padding: 26, textAlign: "center", fontSize: 13, color: "#9a92ad" }}>
              No matches for “{query}”
            </div>
          ) : (
            <>
              {results.connections?.length > 0 && (
                <Section title="Opportunities" items={results.connections} render={(item) => (
                  <Link to={`/customer/${item?.customer?._id}/connection/${item?._id}/history`} style={rowLink}>
                    <span style={{ fontWeight: 500, color: "#1e1a33" }}>
                      {item?.customer?.name || "Unknown"}
                      <span style={{ color: "#9a92ad", fontWeight: 400 }}> · {item?.serviceType}</span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#7d7595" }}>
                      <span style={{ width: 7, height: 7, borderRadius: 99, background: statusColor(item?.status) }} />
                      {item?.status}
                    </span>
                  </Link>
                )} />
              )}

              {(user?.role === "employee" || user?.role === "admin") && results.customers?.length > 0 && (
                <Section title="Customers" items={results.customers} render={(item) => (
                  <Link to={`/customer/${item?._id}`} style={{ ...rowLink, flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                    <span style={{ fontWeight: 500, color: "#1e1a33" }}>{item?.name}</span>
                    <span style={{ fontSize: 12, color: "#9a92ad" }}>{item?.email}</span>
                  </Link>
                )} />
              )}

              {user?.role === "admin" && results.users?.length > 0 && (
                <Section title="Team" items={results.users} render={(item) => (
                  <Link to={`/employees/${item?._id}`} style={{ ...rowLink, justifyContent: "flex-start", gap: 10 }}>
                    <span
                      style={{
                        width: 24, height: 24, borderRadius: 99, background: "#e8e2fb",
                        color: ACCENT, fontSize: 10.5, fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {item?.name?.charAt(0).toUpperCase()}
                    </span>
                    <span style={{ fontWeight: 500, color: "#1e1a33" }}>
                      {item?.name}
                      <span style={{ color: "#9a92ad", fontWeight: 400 }}> · {item?.role}</span>
                    </span>
                  </Link>
                )} />
              )}
            </>
          )}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

const rowLink = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  width: "100%", gap: 12, textDecoration: "none", fontSize: 13.5,
};

function statusColor(s) {
  const map = {
    Pending: "#f0a13c", Approved: "#6c5ce7", Generation: "#3aa0e0",
    Active: "#2fb47c", "Notice Period": "#e08a4a", Disconnected: "#e2604f",
  };
  return map[s] || "#a29cb8";
}

const Section = ({ title, items, render }) => (
  <div style={{ padding: "6px 4px 8px" }}>
    <div style={{ padding: "6px 12px", fontSize: 10.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#a29cb8" }}>
      {title}
    </div>
    {items?.map((item) => (
      <div
        key={item?._id}
        style={{ padding: "9px 12px", borderRadius: 12, cursor: "pointer", transition: "background .12s ease" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#f6f4fd"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        {render(item)}
      </div>
    ))}
  </div>
);

export default SearchBar;