import { useRef, useEffect, memo } from "react";

interface CrossfadeVisualizerProps {
  crossfadeMs: number;
  progress: number;
  duration: number;
}

export const CrossfadeVisualizer = memo(function CrossfadeVisualizer({
  crossfadeMs,
  progress,
  duration,
}: CrossfadeVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const fadeStartRatio = Math.max(0, 1 - crossfadeMs / 1000 / duration);
    const fadeStartX = fadeStartRatio * w;

    // Current track fade-out region
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, 2);
    ctx.lineTo(fadeStartX, 2);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = "#00c8ff30";
    ctx.fill();

    // Next track fade-in region
    ctx.beginPath();
    ctx.moveTo(fadeStartX, h);
    ctx.lineTo(w, 2);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = "#ff604030";
    ctx.fill();

    // Progress line
    const px = Math.min(progress * w, w);
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, h);
    ctx.strokeStyle = "#ffffff80";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [crossfadeMs, progress, duration]);

  if (crossfadeMs <= 0) return null;

  return (
    <canvas
      ref={canvasRef}
      width={64}
      height={20}
      className="crossfade-canvas"
      title={`Crossfade: ${crossfadeMs / 1000}s`}
    />
  );
});
