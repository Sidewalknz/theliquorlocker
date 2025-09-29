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
  const [revealed, setRevealed] = useState<number | null>(null); // track which card is revealed
  const fetchedOnce = useRef(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  // Fetch brands
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
        // noop
      }
    })();
  }, []);

  // Trigger animations once visible
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // handle mobile tap
  function handleTap(e: React.MouseEvent, index: number) {
    if (window.innerWidth > 480) return; // only intercept on mobile
    if (revealed === index) {
      // second tap → go to link
      window.location.href = '/range';
    } else {
      // first tap → unblur
      e.preventDefault();
      setRevealed(index);
    }
  }

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
              className={`${styles.card} ${visible ? styles.visible : ''}`}
              onClick={(e) => handleTap(e, i)}
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
                className={`${styles.productImg} ${
                  revealed === i ? styles.revealed : ''
                }`}
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
