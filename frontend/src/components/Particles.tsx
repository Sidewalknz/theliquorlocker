'use client';

import { useEffect, useRef } from 'react';
import styles from './Particles.module.css';

type Mode = 'section' | 'global';

export default function Particles({
  mode = 'section',
  color = '#ffffff',
  count = 60,
}: {
  mode?: Mode;
  color?: string;
  count?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    parentRef.current = canvas.parentElement as HTMLElement | null;

    const dpr = () => Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    let particles: { x:number;y:number;size:number;speedY:number;driftX:number;alpha:number; }[] = [];
    let width = 0, height = 0, rafId = 0;

    const initParticles = () => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedY: Math.random() * 0.5 + 0.2,
        driftX: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.15 + 0.15,
      }));
    };

    const sizeToTarget = () => {
      const ratio = dpr();
      if (mode === 'global') {
        width = window.innerWidth;
        height = window.innerHeight;
      } else {
        const host = parentRef.current;
        const rect = host?.getBoundingClientRect();
        width = Math.max(1, Math.floor(rect?.width ?? 0));
        height = Math.max(1, Math.floor(rect?.height ?? 0));
      }
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      initParticles();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speedY;
        p.x += p.driftX;
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(animate);
    };

    // Resize handling
    const ro = mode === 'section' && parentRef.current
      ? new ResizeObserver(sizeToTarget)
      : null;

    const onWinResize = () => { if (mode === 'global') sizeToTarget(); };

    if (ro && parentRef.current) ro.observe(parentRef.current);
    window.addEventListener('resize', onWinResize);

    sizeToTarget();
    rafId = requestAnimationFrame(animate);

    // Pause when section is off-screen (section mode)
    let io: IntersectionObserver | null = null;
    if (mode === 'section') {
      io = new IntersectionObserver(entries => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(rafId);
        }
      }, { threshold: 0.05 });
      io.observe(canvas);
    }

    return () => {
      window.removeEventListener('resize', onWinResize);
      ro?.disconnect();
      io?.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [mode, color, count]);

  return (
    <canvas
      ref={canvasRef}
      className={mode === 'global' ? styles.particlesGlobal : styles.particlesSection}
      aria-hidden
    />
  );
}
