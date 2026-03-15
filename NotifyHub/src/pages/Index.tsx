import { NotificationNavbar } from "../components/NotificationNavbar";
import { TourGuide, resetTour } from "../components/TourGuide";
import { useState, useRef, type CSSProperties } from "react";

const pageStyle: CSSProperties = {
  paddingTop: 60,
  minHeight: "100vh",
  background: "hsl(var(--background))",
  transition: "background 300ms",
};

const contentStyle: CSSProperties = {
  maxWidth: 680,
  margin: "0 auto",
  padding: "24px 16px",
};

const cardStyle: CSSProperties = {
  background: "var(--surface-color)",
  borderRadius: "var(--radius-outer)",
  boxShadow: "var(--card-shadow)",
  padding: "20px",
  marginBottom: 16,
  transition: "background 300ms, box-shadow 300ms",
};

const Index = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={pageStyle}>
      <NotificationNavbar />
      <TourGuide />
      <div style={contentStyle}>
        {/* Post Composer Card */}
        <div id="post-composer" style={cardStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, hsl(217 100% 52%), hsl(270 80% 60%))",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.875rem",
              }}
            >
              You
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="What's on your mind?"
              style={{
                flex: 1,
                background: isSearchFocused
                  ? "var(--surface-color)"
                  : "var(--input-bg)",
                borderRadius: 24,
                padding: "12px 18px",
                color: "var(--text-main-color)",
                fontSize: "0.9375rem",
                cursor: "text",
                border: isSearchFocused
                  ? "2px solid hsl(217 100% 52%)"
                  : "2px solid transparent",
                outline: "none",
                transition: "all 200ms",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: 12,
              fontSize: "0.8125rem",
              color: "var(--text-muted-color)",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Click the 🔔 bell icon to see notifications • New ones arrive
            automatically
          </div>
        </div>

        {/* Sample Feed Cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} style={cardStyle}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, hsl(${i * 80} 60% 55%), hsl(${i * 80 + 40} 50% 65%))`,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "var(--text-main-color)",
                  }}
                >
                  Sample User {i}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted-color)",
                  }}
                >
                  {i * 3}h ago
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.6,
                margin: 0,
                color: "var(--text-main-color)",
              }}
            >
              This is a sample post to demonstrate the feed layout. The
              notification system is fully functional — try clicking the bell!
            </p>
          </div>
        ))}

        {/* Restart Tour Button */}
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <button
            onClick={() => {
              resetTour();
              window.location.reload();
            }}
            style={{
              background: "none",
              border: "1px solid var(--border-color)",
              color: "var(--text-muted-color)",
              padding: "8px 20px",
              borderRadius: "var(--radius-inner)",
              cursor: "pointer",
              fontSize: "0.8125rem",
              fontWeight: 500,
              transition: "all 150ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "hsl(217 100% 52%)";
              e.currentTarget.style.borderColor = "hsl(217 100% 52%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted-color)";
              e.currentTarget.style.borderColor = "var(--border-color)";
            }}
          >
            🎯 Restart Tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
