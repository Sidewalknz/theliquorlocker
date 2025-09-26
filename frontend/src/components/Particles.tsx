'use client';

import { useEffect, useRef } from 'react';
import styles from './Particles.module.css';

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasEl: HTMLCanvasElement = canvas;
    const ctxEl: CanvasRenderingContext2D = ctx;

    let particles: { x:number;y:number;size:number;speedY:number;driftX:number;alpha:number; }[] = [];
    let width = 0, height = 0, rafId = 0;
    const PARTICLE_COUNT = 60;

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1,
          speedY: Math.random() * 0.5 + 0.2,
          driftX: (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.15 + 0.15,
        });
      }
    }
    function resize() {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      width = window.innerWidth;
      height = window.innerHeight;
      canvasEl.width = Math.floor(width * dpr);
      canvasEl.height = Math.floor(height * dpr);
      canvasEl.style.width = '100vw';
      canvasEl.style.height = '100vh';
      ctxEl.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }
    function animate() {
      ctxEl.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speedY;
        p.x += p.driftX;
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        ctxEl.globalAlpha = p.alpha;
        ctxEl.fillStyle = '#ffffff';
        ctxEl.beginPath();
        ctxEl.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctxEl.fill();
      }
      rafId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.particlesCanvas} />;
}
