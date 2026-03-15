import { memo } from "react";

export const NotificationSkeleton = memo(function NotificationSkeleton() {
  return (
    <div style={{ padding: "10px 12px", display: "flex", gap: 10 }}>
      <div
        className="skeleton"
        style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <div
          className="skeleton"
          style={{ height: 13, width: "80%", marginBottom: 6 }}
        />
        <div className="skeleton" style={{ height: 13, width: "55%" }} />
        <div
          className="skeleton"
          style={{ height: 11, width: "25%", marginTop: 6 }}
        />
      </div>
    </div>
  );
});
