"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './Range.module.css';

type Product = { name: string; image: string };
type Brand = {
  name: string;
  description: string;
  logo: string;
  products: Product[];
};

export default function BrandSection({ brand }: { brand: Brand }) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className={styles.brand}
      id={brand.name.toLowerCase().replace(/\s+/g, '-')}
    >
      <button
        className={styles.brandHeader}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className={styles.brandLogoWrap}>
          <Image
            src={brand.logo}
            alt={`${brand.name} logo`}
            className={styles.brandLogo}
            width={140}
            height={140}
          />
        </div>
        <div className={styles.brandMeta}>
          <h2 className={styles.brandName}>{brand.name}</h2>
          <p className={styles.brandDesc}>{brand.description}</p>
        </div>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
          ▾
        </span>
      </button>

      <div
        className={`${styles.dropdown} ${open ? styles.dropdownOpen : ''}`}
      >
        <ul className={styles.grid}>
          {brand.products.map((prod) => (
            <li key={`${brand.name}-${prod.name}`} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image
                src={prod.image}
                alt={prod.name}
                className={styles.productImg}
                width={240}          // smaller than before
                height={360}
                sizes="(max-width: 900px) 50vw, (max-width: 600px) 80vw, 200px"
                />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.prodName}>{prod.name}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
