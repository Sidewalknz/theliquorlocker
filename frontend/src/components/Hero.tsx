'use client';

import { useEffect, useRef, useState, CSSProperties } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';
import Particles from './Particles';

type Layer = {
  src: string;
  depth: number;
  baseX: number;
  baseY: number;
  scale: number;
  opacity: number;
  blur: number;
  rotate: number;
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [layers, setLayers] = useState<Layer[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const interpRef = useRef({ x: 0, y: 0 });
  const scrollYRef = useRef(0);
  const rafIdRef = useRef(0);
  const parallaxElsRef = useRef<HTMLDivElement[]>([]);
  const slotsRef = useRef<
    { xPct: number; yPct: number; jitterVW: number; jitterVH: number }[]
  >([]);

  function buildSlots() {
    return [
      { xPct: 18, yPct: 18, jitterVW: 6, jitterVH: 4 },
      { xPct: 82, yPct: 30, jitterVW: 6, jitterVH: 4 },
      { xPct: 22, yPct: 72, jitterVW: 6, jitterVH: 4 },
      { xPct: 78, yPct: 68, jitterVW: 6, jitterVH: 4 },
    ];
  }

  function computeBaseFromSlots(slot: {
    xPct: number;
    yPct: number;
    jitterVW: number;
    jitterVH: number;
  }) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const jitterX = ((Math.random() * 2 - 1) * slot.jitterVW) / 100 * w;
    const jitterY = ((Math.random() * 2 - 1) * slot.jitterVH) / 100 * h;
    const x = (slot.xPct / 100) * w - w / 2 + jitterX;
    const y = (slot.yPct / 100) * h - h / 2 + jitterY;
    return { baseX: x, baseY: y };
  }

  useEffect(() => {
    let mounted = true;

    async function getImages() {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        const all: string[] = Array.isArray(data.images) ? data.images : [];
        const pick = all.sort(() => Math.random() - 0.5).slice(0, 4);

        const depths = [0.25, 0.45, 0.7, 1.0];
        const slots = buildSlots()
          .slice(0, pick.length)
          .sort(() => Math.random() - 0.5);
        slotsRef.current = slots;

        const layersInit: Layer[] = pick.map((src, i) => {
          const d = depths[i] ?? 0.6;
          const { baseX, baseY } = computeBaseFromSlots(slots[i]);
          const scale = 0.95 + d * 0.35 + Math.random() * 0.08;
          const opacity = 0.22 + d * 0.55;
          const blur = (1 - d) * 4.5;
          const rotate = Math.random() * 60 - 30;
          return { src, depth: d, baseX, baseY, scale, opacity, blur, rotate };
        });

        if (mounted) setLayers(layersInit);
      } catch {
        if (mounted) setLayers([]);
      }
    }

    getImages();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function onResize() {
      setLayers((prev) => {
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

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouseRef.current.x = e.clientX / w - 0.5;
      mouseRef.current.y = e.clientY / h - 0.5;
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

        el.style.transform = `translate3d(calc(50vw + ${tx}px), calc(50vh + ${ty}px), 0) translate(-50%, -50%) rotate(${layer.rotate}deg) scale(${layer.scale})`;
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

  return (
    <section className={styles.hero} ref={sectionRef}>
      <div className={styles.layers} aria-hidden>
        {layers.map((l, i) => {
          const sizeClass =
            l.depth >= 0.85
              ? styles.large
              : l.depth >= 0.6
              ? styles.medium
              : styles.small;

          const customStyle: CSSProperties & { ['--i']?: number } = {
            ['--i']: i,
          };

          return (
            <div
              key={l.src + i}
              className={styles.layer}
              ref={(el) => {
                if (el) parallaxElsRef.current[i] = el;
              }}
            >
              <Image
                src={l.src}
                alt={`Decorative floating product ${i + 1}`}
                className={`${styles.layerImg} ${sizeClass}`}
                style={customStyle}
                width={480}
                height={480}
                priority
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      <Particles />

      <div className={styles.content}>
        <h1>
          <span className={styles.tagline}>- Premium Alcohol Distributor -</span>
          <span className={styles.firstLine}>BRANDS WITH A STORY</span>
          <span className={styles.secondLine}>and we are here to tell it.</span>
        </h1>
        <div className={styles.ctas}>
          <a href="/range" className={styles.cta}>
            Explore Our Range
          </a>
          <a href="/register" className={`${styles.cta} ${styles.secondaryCta}`}>
            Want To Work Together?
          </a>
        </div>
      </div>
    </section>
  );
}
