// src/app/range/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import styles from './Range.module.css';
import Particles from '@/components/Particles';
import WaveDivider from '@/components/WaveDivider';

type Product = { name: string; image: string };
type Brand = {
  name: string;
  description: string;
  logo: string;
  products: Product[];
};

async function getBrands(): Promise<Brand[]> {
  try {
    // Relative fetch works in App Router server components and in prod
    const res = await fetch('/api/brands', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = (await res.json()) as { brands: Brand[] };
    return data?.brands ?? [];
  } catch {
    return [];
  }
}

export default async function RangePage() {
  const brands = await getBrands();

  return (
    <>
      {/* HERO-LIKE HEADER WITH PARTICLES */}
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
              Register to Range
            </Link>
            <Link href="/contact" className={styles.ctaSecondary}>
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      {/* DIVIDER AFTER HERO */}
      <WaveDivider flip height={100} color="var(--background)" />

      {/* BRAND LOGO STRIP */}
      {brands.length > 0 && (
        <section className={styles.logoStrip} aria-label="Our brands">
          <ul className={styles.logoList}>
            {brands
              .filter((b) => !!b.logo)
              .map((b) => (
                <li key={b.name} className={styles.logoItem} title={b.name}>
                  <Image
                    src={b.logo}
                    alt={`${b.name} logo`}
                    className={styles.stripLogo}
                    width={160}
                    height={60}
                    sizes="(max-width: 900px) 22vw, 160px"
                    priority
                  />
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* BRANDS LIST */}
      <main className={styles.main}>
        {brands.length === 0 ? (
          <div className={styles.empty}>No brands found yet.</div>
        ) : (
          brands.map((brand) => (
            <section
              key={brand.name}
              className={styles.brand}
              id={brand.name.toLowerCase().replace(/\s+/g, '-')}
            >
              <div className={styles.brandHeader}>
                <div className={styles.brandLogoWrap}>
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className={styles.brandLogo}
                    width={140}
                    height={140}
                    priority={false}
                  />
                </div>
                <div className={styles.brandMeta}>
                  <h2 className={styles.brandName}>{brand.name}</h2>
                  <p className={styles.brandDesc}>{brand.description}</p>
                </div>
              </div>

              <ul className={styles.grid}>
                {brand.products.map((prod) => (
                  <li key={`${brand.name}-${prod.name}`} className={styles.card}>
                    <div className={styles.imageWrap}>
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        className={styles.productImg}
                        width={420}
                        height={560}
                        sizes="(max-width: 900px) 50vw, (max-width: 600px) 80vw, 280px"
                      />
                    </div>
                    <div className={styles.cardBody}>
                      <h3 className={styles.prodName}>{prod.name}</h3>
                      <Link href="/register" className={styles.cardCta}>
                        Range this product
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </main>
    </>
  );
}
