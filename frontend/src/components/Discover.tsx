'use client';

import styles from './Discover.module.css';

export default function Discover() {
  return (
    <section className={styles.discover} aria-labelledby="discover-heading">
      <div className={styles.inner}>
        <h2 id="discover-heading">Discover a World of Exceptional Liquor</h2>
        <p>
          Indulge in the finest selection of premium beverages, including exquisite gins, rare rums,
          exceptional whiskies, smooth vodkas, carefully curated wines, and a diverse range of craft beers,
          sourced from around the globe.
        </p>
        <a href="/range" className={styles.cta}>Explore Our Range</a>
      </div>
    </section>
  );
}
