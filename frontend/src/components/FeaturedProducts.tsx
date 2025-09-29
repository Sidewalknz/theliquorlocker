'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './FeaturedProducts.module.css';
import Particles from './Particles';

type ProductPick = { src: string; rotDeg: number; name: string };
type Product = { name: string; image: string };
type Brand = {
  name: string;
  description: string;
  logo: string;
  products: Product[];
};

export default function FeaturedProducts() {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<ProductPick[]>([]);
  const fetchedOnce = useRef(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<HTMLAnchorElement[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    (async () => {
      try {
        const res = await fetch('/api/brands', { cache: 'no-store' });
        const data = (await res.json()) as { brands: Brand[] };
        const brands = data?.brands ?? [];
        if (!brands.length) return;

        const chosenBrand = brands[Math.floor(Math.random() * brands.length)];
        const picks = [...chosenBrand.products]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        setBrand(chosenBrand);
        setProducts(
          picks.map((p) => ({
            src: p.image,
            name: p.name,
            rotDeg: Math.round(Math.random() * 40 - 20),
          }))
        );
      } catch {
        /* ignore */
      }
    })();
  }, []);

  // Reveal section animation when in view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Mobile scroll-focus blur control
  useEffect(() => {
    let raf = 0;

    const updateFocus = () => {
      // Only apply on mobile
      if (window.innerWidth > 480) {
        // Reset any custom focus so desktop hover takes over
        cardRefs.current.forEach((el) => el?.style.removeProperty('--focus'));
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      const falloff = 180; // px from center → fully blurred when beyond this

      cardRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const dist = Math.abs(cardCenter - viewportCenter);
        const focus = Math.max(0, Math.min(1, 1 - dist / falloff));
        el.style.setProperty('--focus', String(focus));
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateFocus);
    };
    const onResize = onScroll;

    updateFocus();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [products.length]);

  return (
    <section className={styles.featured} ref={sectionRef}>
      <Particles />
      <div className={styles.content}>
        <h2 className={`${styles.title} ${visible ? styles.visible : ''}`}>
          {brand
            ? `Some of our finest from ${brand.name}`
            : 'Some of our finest beverages'}
        </h2>

        <div className={styles.row}>
          {products.map((p, i) => (
            <a
              key={p.src + i}
              href="/range"
              ref={(el) => {
                if (el) cardRefs.current[i] = el;
              }}
              className={`${styles.card} ${visible ? styles.visible : ''}`}
              style={
                {
                  '--rot': `${p.rotDeg}deg`,
                  '--i': i.toString(),
                  '--phase': `${i * 0.6}s`,
                } as React.CSSProperties
              }
            >
              <Image
                src={p.src}
                alt={p.name}
                className={styles.productImg}
                width={220}
                height={320}
                draggable={false}
                priority={i === 0}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
