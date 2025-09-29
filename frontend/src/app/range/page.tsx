// src/app/range/page.tsx
import styles from './Range.module.css';
import Particles from '@/components/Particles';
import WaveDivider from '@/components/WaveDivider';
import path from 'path';
import { promises as fs } from 'fs';
import Link from 'next/link';
import BrandSection from './BrandSection';

type Product = { name: string; image: string };
type Brand = {
  name: string;
  description: string;
  logo: string;
  products: Product[];
};

async function getBrands(): Promise<Brand[]> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'data.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const brands = JSON.parse(raw) as Brand[];
    return Array.isArray(brands) ? brands : [];
  } catch (err) {
    console.error('Error reading brands data.json:', err);
    return [];
  }
}

export default async function RangePage() {
  const brands = await getBrands();

  return (
    <>
      {/* HERO */}
      <section className={styles.heroWrap} aria-labelledby="range-hero-title">
        <Particles />
        <div className={styles.heroInner}>
          <h1 id="range-hero-title" className={styles.heroTitle}>
            Explore Our Range
          </h1>
          <p className={styles.heroSubtitle}>
            Premium spirits, wines, and craft beers from our partner brands.
          </p>

          <div className={styles.heroActions}>
            <Link href="/register" className={styles.ctaPrimary}>
              Work With Us
            </Link>
            <Link
              href="/other/Liquor-Locker-Portfolio.pdf"
              className={styles.ctaSecondary}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <WaveDivider flip height={100} color="var(--background)" />

      {/* BRANDS */}
      <main className={styles.main}>
        {brands.length === 0 ? (
          <div className={styles.empty}>No brands found yet.</div>
        ) : (
          brands.map((brand) => <BrandSection key={brand.name} brand={brand} />)
        )}
      </main>
    </>
  );
}
