import { useRef, useEffect, useState, memo } from "react";

interface WaveformCanvasProps {
  waveform: number[];
  progress?: number;
  activeColor?: string;
  inactiveColor?: string;
  height?: number;
  onClick?: (progress: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const WaveformCanvas = memo(function WaveformCanvas({
  waveform,
  progress = 0,
  activeColor = "#00c8ff",
  inactiveColor = "#2a2a42",
  height = 32,
  onClick,
  className,
  style,
}: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w > 0) setContainerWidth(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || containerWidth <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, containerWidth, height);

    const barCount = waveform.length;
    const barW = Math.max(1, (containerWidth / barCount) * 0.65);
    const progressX = progress * containerWidth;

    for (let i = 0; i < barCount; i++) {
      const x = (i / barCount) * containerWidth;
      const barH = waveform[i] * height * 0.85;
      const y = (height - barH) / 2;
      ctx.fillStyle = x < progressX ? activeColor : inactiveColor;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 1);
      ctx.fill();
    }
  }, [waveform, progress, activeColor, inactiveColor, height, containerWidth]);

  const handleClick = (e: React.MouseEvent) => {
    if (!onClick || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    onClick((e.clientX - rect.left) / rect.width);
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        height,
        cursor: onClick ? "pointer" : "default",
        overflow: "hidden",
      }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: containerWidth, height }}
      />
    </div>
  );
});
