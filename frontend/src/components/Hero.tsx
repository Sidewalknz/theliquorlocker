'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

type Layer = {
  src: string;
  depth: number;      // 0 (far) → 1 (near)
  baseX: number;      // px offset from center
  baseY: number;      // px offset from center
  scale: number;
  opacity: number;
  blur: number;       // px
  rotate: number;     // deg
};

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const [layers, setLayers] = useState<Layer[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });        // -0.5..0.5
  const interpRef = useRef({ x: 0, y: 0 });       // smoothed
  const scrollYRef = useRef(0);
  const rafIdRef = useRef(0);
  const parallaxElsRef = useRef<HTMLDivElement[]>([]);
  const slotsRef = useRef<{xPct:number;yPct:number;jitterVW:number;jitterVH:number;}[]>([]);

  // Create fixed “slots” around the hero (percent of viewport).
  function buildSlots() {
    const s = [
      { xPct: 18, yPct: 28, jitterVW: 6, jitterVH: 4 },  // top-left
      { xPct: 82, yPct: 30, jitterVW: 6, jitterVH: 4 },  // top-right
      { xPct: 22, yPct: 72, jitterVW: 6, jitterVH: 4 },  // bottom-left
      { xPct: 78, yPct: 68, jitterVW: 6, jitterVH: 4 },  // bottom-right
    ];
    return s;
  }

  // Compute px base positions from slot %s + jitter
  function computeBaseFromSlots(slot: {xPct:number;yPct:number;jitterVW:number;jitterVH:number}) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const jitterX = ((Math.random() * 2 - 1) * slot.jitterVW / 100) * w; // ±vw
    const jitterY = ((Math.random() * 2 - 1) * slot.jitterVH / 100) * h; // ±vh
    const x = (slot.xPct / 100) * w - w / 2 + jitterX;
    const y = (slot.yPct / 100) * h - h / 2 + jitterY;
    return { baseX: x, baseY: y };
  }

  // ------- Fetch 4 random images from /public/products -------
  useEffect(() => {
    let mounted = true;

    async function getImages() {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        const all: string[] = Array.isArray(data.images) ? data.images : [];
        const pick = all.sort(() => Math.random() - 0.5).slice(0, 4);

        // Depths: farther → nearer
        const depths = [0.25, 0.45, 0.7, 1.0];

        // build slots and randomize assignment
        const slots = buildSlots().slice(0, pick.length).sort(() => Math.random() - 0.5);
        slotsRef.current = slots;

        const layersInit: Layer[] = pick.map((src, i) => {
          const d = depths[i] ?? 0.6;
          const { baseX, baseY } = computeBaseFromSlots(slots[i]);

          const scale = 0.95 + d * 0.35 + Math.random() * 0.08; // near → a bit bigger
          const opacity = 0.22 + d * 0.55;
          const blur = (1 - d) * 4.5;
          const rotate = Math.random() * 60 - 30; // -30° .. 30°

          return { src, depth: d, baseX, baseY, scale, opacity, blur, rotate };
        });

        if (mounted) setLayers(layersInit);
      } catch {
        if (mounted) setLayers([]);
      }
    }

    getImages();
    return () => { mounted = false; };
  }, []);

  // ------- Recompute base positions on resize to keep layout tidy -------
  useEffect(() => {
    function onResize() {
      setLayers(prev => {
        if (!prev.length) return prev;
        return prev.map((layer, i) => {
          const slot = slotsRef.current[i];
          if (!slot) return layer;
          const { baseX, baseY } = computeBaseFromSlots(slot);
          return { ...layer, baseX, baseY };
        });
      });
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ------- Parallax animation (mouse + scroll) -------
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouseRef.current.x = (e.clientX / w) - 0.5;
      mouseRef.current.y = (e.clientY / h) - 0.5;
    };

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const localScroll = Math.min(0, Math.max(-window.innerHeight, rect.top));
      scrollYRef.current = localScroll;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });

    let rafId = 0;
    const loop = () => {
      // ease mouse
      interpRef.current.x += (mouseRef.current.x - interpRef.current.x) * 0.08;
      interpRef.current.y += (mouseRef.current.y - interpRef.current.y) * 0.08;

      parallaxElsRef.current.forEach((el, i) => {
        const layer = layers[i];
        if (!el || !layer) return;

        const d = layer.depth;
        const swayX = interpRef.current.x * (24 * d);
        const swayY = interpRef.current.y * (16 * d);
        const scrollOffsetY = scrollYRef.current * (0.15 * (1 - d));

        const tx = layer.baseX + swayX;
        const ty = layer.baseY + swayY + scrollOffsetY;

        el.style.transform =
          `translate3d(calc(50vw + ${tx}px), calc(50vh + ${ty}px), 0) ` +
          `translate(-50%, -50%) rotate(${layer.rotate}deg) scale(${layer.scale})`;
        el.style.opacity = String(layer.opacity);
        el.style.filter = layer.blur > 0 ? `blur(${layer.blur}px)` : 'none';
      });

      rafId = requestAnimationFrame(loop);
      rafIdRef.current = rafId;
    };

    rafId = requestAnimationFrame(loop);
    rafIdRef.current = rafId;

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [layers]);

  // ------- Particles (TS-safe) -------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // After the guards above, fix types by capturing non-null locals:
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

  return (
<section className={styles.hero} ref={sectionRef}>
  {/* LAYERED PARALLAX IMAGES (around the hero) */}
  <div className={styles.layers} aria-hidden>
    {layers.map((l, i) => {
      const sizeClass =
        l.depth >= 0.85 ? styles.large :
        l.depth >= 0.6  ? styles.medium :
                           styles.small;

      return (
        <div
          key={l.src + i}
          className={styles.layer}
          ref={(el) => { if (el) parallaxElsRef.current[i] = el; }}
        >
          <img
            src={l.src}
            alt=""
            className={`${styles.layerImg} ${sizeClass}`}
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>
      );
    })}
  </div>

  {/* particles */}
  <canvas ref={canvasRef} className={styles.particlesCanvas} />

  {/* content */}
  <div className={styles.content}>
    <h1>
      <span className={styles.firstLine}>BRANDS WITH A STORY</span>
      <span className={styles.secondLine}>and we are here to tell it.</span>
    </h1>
    <a href="/range" className={styles.cta}>Explore Our Range</a>
  </div>
</section>
  );
}
