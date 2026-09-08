"use client";
import { useEffect, useRef } from "react";

interface AmbientParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  swaySpeed: number;
  swayDist: number;
  angle: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  color: string;
  kind: "orb" | "star" | "heart";
}

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = [
      "255, 182, 193", // Light Pink
      "255, 105, 180", // Hot Pink
      "192, 132, 252", // Soft Purple
      "251, 191, 36",  // Warm Amber
      "147, 197, 253", // Soft Sky Blue
      "244, 114, 182", // Rose Pink
    ];

    let particles: AmbientParticle[] = [];
    let animationFrameId: number;

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Adjust count based on screen width
      const count = Math.min(Math.floor(width / 25), 45);

      for (let i = 0; i < count; i++) {
        const kinds: Array<"orb" | "star" | "heart"> = ["orb", "star", "heart", "orb", "star"];
        const kind = kinds[Math.floor(Math.random() * kinds.length)];
        const baseAlpha = Math.random() * 0.35 + 0.15;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: kind === "orb" ? Math.random() * 18 + 8 : Math.random() * 8 + 6,
          speedY: -(Math.random() * 0.4 + 0.2), // gentle upward float
          swaySpeed: Math.random() * 0.02 + 0.01,
          swayDist: Math.random() * 1.5 + 0.5,
          angle: Math.random() * Math.PI * 2,
          alpha: baseAlpha,
          baseAlpha,
          pulseSpeed: Math.random() * 0.03 + 0.01,
          color: colors[Math.floor(Math.random() * colors.length)],
          kind,
        });
      }
    };

    const drawHeart = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
      c.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
    };

    const drawStar = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
        c.lineTo(
          Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.35),
          Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.35)
        );
      }
      c.closePath();
      c.fill();
    };

    const drawOrb = (c: CanvasRenderingContext2D, p: AmbientParticle) => {
      const grad = c.createRadialGradient(0, 0, 0, 0, 0, p.size);
      grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
      grad.addColorStop(0.5, `rgba(${p.color}, ${p.alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${p.color}, 0)`);
      c.fillStyle = grad;
      c.beginPath();
      c.arc(0, 0, p.size, 0, Math.PI * 2);
      c.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.angle += p.swaySpeed;
        p.x += Math.sin(p.angle) * p.swayDist;
        p.alpha = p.baseAlpha + Math.sin(p.angle * 2) * 0.12;

        // Wrap around when exiting top
        if (p.y < -p.size * 2) {
          p.y = height + p.size;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);

        if (p.kind === "orb") {
          drawOrb(ctx, p);
        } else if (p.kind === "heart") {
          ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.alpha)})`;
          drawHeart(ctx, p.size);
        } else if (p.kind === "star") {
          ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.alpha)})`;
          ctx.rotate(p.angle * 0.5);
          drawStar(ctx, p.size);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
