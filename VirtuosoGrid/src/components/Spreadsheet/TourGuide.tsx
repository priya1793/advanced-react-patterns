import React, { useState, useCallback } from "react";
import "./TourGuide.css";

const TOUR_STEPS = [
  {
    title: "Welcome to VirtSheet! 🎉",
    description:
      "A high-performance spreadsheet with 1 million rows and 100 columns — all virtualized for buttery-smooth scrolling.",
    icon: "📊",
  },
  {
    title: "Navigate Cells",
    description:
      "Click any cell to select it, or use Arrow Keys to move around. The selected cell is highlighted with a blue outline.",
    icon: "🧭",
  },
  {
    title: "Edit Cells",
    description:
      "Double-click a cell or press Enter to start editing. Type your value and press Enter to confirm, or Escape to cancel.",
    icon: "✏️",
  },
  {
    title: "Formulas",
    description:
      'Start with "=" to enter a formula. Try:\n• =A1+B1 (arithmetic)\n• =SUM(A1:A10)\n• =AVG(B1:B5)\n• =MIN(), =MAX(), =COUNT()',
    icon: "🧮",
  },
  {
    title: "Formula Bar",
    description:
      "The bar at the top shows the selected cell reference and its raw content. You can also edit formulas directly here.",
    icon: "📝",
  },
  {
    title: "Resize Columns",
    description:
      "Drag the right edge of any column header to resize it. Columns have a minimum width of 40px.",
    icon: "↔️",
  },
  {
    title: "Keyboard Shortcuts",
    description:
      "• Arrow keys — Navigate\n• Enter — Edit / Confirm\n• Escape — Cancel edit\n• Tab — Confirm & move right\n• Delete/Backspace — Clear cell\n• Just start typing — Quick edit",
    icon: "⌨️",
  },
  {
    title: "Infinite Scroll",
    description:
      "Scroll vertically through 1,000,000 rows and horizontally through 100 columns. Only visible cells are rendered for peak performance.",
    icon: "🚀",
  },
  {
    title: "Status Bar",
    description:
      "The bottom bar shows grid dimensions, how many cells contain data, and the currently selected cell.",
    icon: "📋",
  },
];

interface TourGuideProps {
  onClose: () => void;
}

export function TourGuide({ onClose }: TourGuideProps) {
  const [step, setStep] = useState(0);
  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;
  const isFirst = step === 0;

  const handleNext = useCallback(() => {
    if (isLast) {
      onClose();
    } else {
      setStep((s) => s + 1);
    }
  }, [isLast, onClose]);

  const handlePrev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" || e.key === "Enter") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
    },
    [onClose, handleNext, handlePrev],
  );

  return (
    <div
      className="tour-overlay"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
    >
      <div className="tour-backdrop" onClick={onClose} />
      <div className="tour-card">
        <button className="tour-close" onClick={onClose} title="Close tour">
          ✕
        </button>
        <div className="tour-icon">{current.icon}</div>
        <h2 className="tour-title">{current.title}</h2>
        <p className="tour-description">{current.description}</p>
        <div className="tour-progress">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`tour-dot${i === step ? " tour-dot--active" : i < step ? " tour-dot--done" : ""}`}
              onClick={() => setStep(i)}
            />
          ))}
        </div>
        <div className="tour-actions">
          {!isFirst && (
            <button
              className="tour-btn tour-btn--secondary"
              onClick={handlePrev}
            >
              ← Back
            </button>
          )}
          <button className="tour-btn tour-btn--primary" onClick={handleNext}>
            {isLast ? "Get Started!" : "Next →"}
          </button>
        </div>
        <div className="tour-step-count">
          {step + 1} of {TOUR_STEPS.length}
        </div>
      </div>
    </div>
  );
}
