import { useState, useEffect, useCallback, type CSSProperties } from "react";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: "bottom" | "left" | "top";
}

const STEPS: TourStep[] = [
  {
    target: "#notification-bell",
    title: "🔔 Notification Bell",
    content:
      "Click here to open the notification dropdown. A badge shows unread count.",
    position: "bottom",
  },
  {
    target: "#theme-toggle",
    title: "🌗 Theme Toggle",
    content:
      "Switch between light and dark mode for a comfortable viewing experience.",
    position: "bottom",
  },
  {
    target: "#post-composer",
    title: "✍️ Post Composer",
    content:
      "Type here to compose a new post. This is where you share your thoughts!",
    position: "bottom",
  },
];

const TOUR_STORAGE_KEY = "tour-completed";

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  zIndex: 9998,
  transition: "opacity 300ms",
};

const tooltipBase: CSSProperties = {
  position: "fixed",
  zIndex: 9999,
  background: "var(--surface-color)",
  color: "var(--text-main-color)",
  borderRadius: 12,
  padding: "20px 24px",
  maxWidth: 320,
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  transition: "all 300ms cubic-bezier(0.25, 0.1, 0.25, 1)",
};

const titleStyle: CSSProperties = {
  fontSize: "1rem",
  fontWeight: 700,
  marginBottom: 8,
};

const contentTextStyle: CSSProperties = {
  fontSize: "0.875rem",
  lineHeight: 1.6,
  opacity: 0.85,
  marginBottom: 16,
};

const footerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
};

const dotContainerStyle: CSSProperties = {
  display: "flex",
  gap: 6,
};

const btnBase: CSSProperties = {
  padding: "6px 16px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontSize: "0.8125rem",
  fontWeight: 600,
  transition: "all 150ms",
};

export function TourGuide() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const isActive = currentStep >= 0 && currentStep < STEPS.length;

  useEffect(() => {
    try {
      if (localStorage.getItem(TOUR_STORAGE_KEY)) return;
    } catch {}
    const timer = setTimeout(() => setCurrentStep(0), 1200);
    return () => clearTimeout(timer);
  }, []);

  const positionTooltip = useCallback(() => {
    if (currentStep < 0 || currentStep >= STEPS.length) return;
    const step = STEPS[currentStep];
    const el = document.querySelector(step.target);
    if (!el) return;
    const rect = el.getBoundingClientRect();

    let top = 0;
    let left = 0;
    if (step.position === "bottom") {
      top = rect.bottom + 12;
      left = Math.max(16, rect.left + rect.width / 2 - 160);
    } else if (step.position === "left") {
      top = rect.top;
      left = rect.left - 340;
    } else {
      top = rect.top - 140;
      left = rect.left;
    }

    // Keep on screen
    left = Math.min(left, window.innerWidth - 340);
    left = Math.max(16, left);

    setTooltipPos({ top, left });
  }, [currentStep]);

  useEffect(() => {
    positionTooltip();
    window.addEventListener("resize", positionTooltip);
    return () => window.removeEventListener("resize", positionTooltip);
  }, [positionTooltip]);

  // Highlight the target element
  useEffect(() => {
    if (!isActive) return;
    const step = STEPS[currentStep];
    const el = document.querySelector(step.target) as HTMLElement | null;
    if (el) {
      el.style.position = "relative";
      el.style.zIndex = "9999";
      el.style.borderRadius = "8px";
    }
    return () => {
      if (el) {
        el.style.zIndex = "";
      }
    };
  }, [currentStep, isActive]);

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    setCurrentStep(-1);
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
    } catch {}
  };

  if (!isActive) return null;

  const step = STEPS[currentStep];

  return (
    <>
      <div style={overlayStyle} onClick={finish} />
      <div
        style={{ ...tooltipBase, top: tooltipPos.top, left: tooltipPos.left }}
      >
        <div style={titleStyle}>{step.title}</div>
        <div style={contentTextStyle}>{step.content}</div>
        <div style={footerStyle}>
          <div style={dotContainerStyle}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    i === currentStep ? "hsl(217 100% 52%)" : "hsl(0 0% 75%)",
                  transition: "background 200ms",
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                ...btnBase,
                background: "transparent",
                color: "var(--text-main-color)",
                opacity: 0.6,
              }}
              onClick={finish}
            >
              Skip
            </button>
            <button
              style={{
                ...btnBase,
                background: "hsl(217 100% 52%)",
                color: "#fff",
              }}
              onClick={next}
            >
              {currentStep === STEPS.length - 1 ? "Got it!" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/** Reset tour so it shows again */
export function resetTour() {
  try {
    localStorage.removeItem(TOUR_STORAGE_KEY);
  } catch {}
}
