'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './FeaturedProducts.module.css';
import Particles from './Particles';

type Product = {
  src: string;
  x: number;
  y: number;
  depth: number;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const productElsRef = useRef<HTMLDivElement[]>([]);

  // Fake fetch: replace with your API or static list
  useEffect(() => {
    const items = [
      '/products/item1.png',
      '/products/item2.png',
      '/products/item3.png',
      '/products/item4.png',
      '/products/item5.png',
    ];
    const prods: Product[] = items.map((src, i) => ({
      src,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 300,
      depth: Math.random() * 0.6 + 0.4,
    }));
    setProducts(prods);
  }, []);

  // Floating animation
  useEffect(() => {
    let rafId = 0;
    const loop = () => {
      productElsRef.current.forEach((el, i) => {
        const prod = products[i];
        if (!el || !prod) return;
        const floatY = Math.sin(Date.now() / 1000 + i) * 10 * prod.depth;
        el.style.transform = `translate3d(calc(50vw + ${prod.x}px), calc(50vh + ${prod.y + floatY}px), 0)`;
      });
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [products]);

  return (
    <section className={styles.featured}>
      <Particles />
      <div className={styles.content}>
        <h2 className={styles.title}>Some of our finest beverages</h2>
        <div className={styles.items}>
          {products.map((p, i) => (
            <div
              key={p.src + i}
              className={styles.item}
              ref={(el) => { if (el) productElsRef.current[i] = el; }}
            >
              <img src={p.src} alt="" className={styles.productImg} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
