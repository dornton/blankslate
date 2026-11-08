import { useEffect, useRef } from 'react';

const RAMP = '.:-=+*xX';

/**
 * A restrained ASCII light field: glyphs brighten toward a drifting glow that
 * sits low in the frame, so the type above it stays on black.
 */
export default function AsciiField({ cellSize = 12, opacity = 0.42, origin = 'bottom' }) {
  const anchor = origin === 'top' ? 0.03 : origin === 'center' ? 0.5 : 0.97;
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let lastStamp = 0;

    const draw = stamp => {
      const t = stamp / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = `400 ${cellSize}px "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#e8e2d6';

      const cols = Math.max(1, Math.ceil(width / cellSize));
      const rows = Math.max(1, Math.ceil(height / cellSize));

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const nx = (col + 0.5) / cols;
          const ny = (row + 0.5) / rows;
          const wobble =
            Math.sin(nx * 7.2 + t * 0.5) * 0.5 + Math.sin(ny * 5.4 - t * 0.34 + nx * 2.1) * 0.5;
          const dx = (nx - 0.5) * 1.45;
          const dy = (ny - anchor) * 1.1;
          const radius = Math.hypot(dx, dy);
          const glow = Math.max(0, 1 - radius / 0.72);
          let value = glow * glow * (0.9 + wobble * 0.3);
          if (value < 0.1) continue;
          value = Math.min(1, value);
          const noise = Math.sin(col * 12.9898 + row * 78.233) * 43758.5453;
          const sparse = noise - Math.floor(noise);
          if (sparse > 0.35 + value * 0.75) continue;
          const index = Math.min(RAMP.length - 1, Math.floor(value * RAMP.length));
          ctx.globalAlpha = Math.min(1, Math.pow(value, 2.2)) * opacity;
          ctx.fillText(RAMP[index], col * cellSize + cellSize / 2, row * cellSize + cellSize / 2);
        }
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      draw(reduce ? 0 : performance.now());
    };

    const frame = stamp => {
      raf = 0;
      if (document.hidden) return;
      if (stamp - lastStamp < 42) {
        raf = requestAnimationFrame(frame);
        return;
      }
      lastStamp = stamp;
      draw(stamp);
      raf = requestAnimationFrame(frame);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [cellSize, opacity, anchor]);

  return <canvas ref={canvasRef} className="ascii-field" aria-hidden="true" />;
}
