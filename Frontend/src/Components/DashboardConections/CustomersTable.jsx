import React from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "../../Context/DashboardContext";

const AVATAR_TINTS = ["#e8e2fb", "#fdeed9", "#dcecfa", "#daf1e4", "#f9e9e6"];
const tintFor = (s = "") =>
  AVATAR_TINTS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_TINTS.length];

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

const COLS = "minmax(200px,1.5fr) minmax(150px,1fr) minmax(200px,1.3fr) 130px 68px";

const CustomersTable = () => {
  const { customers, loadingCustomers, custHasMore, custPage, fetchCustomersList, custFilter } =
    useDashboard();

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !loadingCustomers && custHasMore) {
      fetchCustomersList(custPage + 1, custFilter, true);
    }
  };

  return (
    <div
      onScroll={handleScroll}
      style={{ maxHeight: "80vh", overflowY: "auto", overflowX: "auto", position: "relative" }}
    >
      <div style={{ minWidth: 780 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: COLS,
            alignItems: "center",
            gap: 14,
            position: "sticky",
            top: 0,
            zIndex: 2,
            padding: "0 14px 10px",
            background: "#fbfaff",
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: ".07em",
            textTransform: "uppercase",
            color: "#a8a3bb",
          }}
        >
          <span>Company</span>
          <span>Contact</span>
          <span>Email</span>
          <span>Mobile</span>
          <span style={{ textAlign: "right" }}>Action</span>
        </div>

        {customers.map((cust) => (
          <div
            key={cust._id}
            style={{
              display: "grid",
              gridTemplateColumns: COLS,
              alignItems: "center",
              gap: 14,
              padding: "11px 14px",
              borderRadius: 14,
              transition: "background .12s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f3fd"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <span
                style={{
                  flex: "0 0 auto", width: 28, height: 28, borderRadius: 10,
                  background: tintFor(cust.name), color: "#4a4262",
                  fontSize: 10.5, fontWeight: 700, letterSpacing: ".02em",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {initials(cust.name)}
              </span>
              <span
                style={{
                  fontSize: 13.5, fontWeight: 500, color: "#1e1a33",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}
              >
                {cust.name || "—"}
              </span>
            </span>

            <span style={{ fontSize: 13, color: "#3d3557", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {cust.person || "—"}
            </span>

            <span style={{ minWidth: 0 }}>
              {cust.email ? (
                <a
                  href={`mailto:${cust.email}`}
                  style={{
                    fontSize: 13, color: "#6f6890", textDecoration: "none",
                    display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#6c5ce7"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#6f6890"; }}
                >
                  {cust.email}
                </a>
              ) : (
                <span style={{ fontSize: 13, color: "#c4bfd6" }}>—</span>
              )}
            </span>

            <span
              style={{
                fontSize: 13,
                fontVariantNumeric: "tabular-nums",
                color: cust.mobile ? "#3d3557" : "#c4bfd6",
                whiteSpace: "nowrap",
              }}
            >
              {cust.mobile || "—"}
            </span>

            <span style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link
                to={`/customer/${cust?._id}`}
                style={{
                  height: 28, padding: "0 13px", borderRadius: 9,
                  display: "flex", alignItems: "center",
                  background: "#fff", border: "1px solid #e9e5f6",
                  fontSize: 11.5, fontWeight: 600, color: "#4a3fb0", textDecoration: "none",
                  transition: "background .12s ease, border-color .12s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#efecfd"; e.currentTarget.style.borderColor = "#ded6f7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e9e5f6"; }}
              >
                View
              </Link>
            </span>
          </div>
        ))}
      </div>

      {loadingCustomers && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: 16, fontSize: 12, color: "#9a92ad" }}>
          <span
            style={{
              width: 13, height: 13, borderRadius: 99,
              border: "2px solid #6c5ce733", borderBottomColor: "#6c5ce7",
              animation: "spin .7s linear infinite",
            }}
          />
          Loading more
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default CustomersTable;