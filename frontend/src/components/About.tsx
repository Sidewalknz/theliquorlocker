'use client';

import Image from 'next/image';
import styles from './About.module.css';

export default function About() {
  return (
    <section className={styles.about} aria-labelledby="about-heading">
      <div className={styles.inner}>
        <h2 id="about-heading">Our Story</h2>
        <p className={styles.subheading}>
          Premium Liquor Distributor<br />
          Est. 2025
        </p>
        <p>
          Welcome to <strong>The Liquor Locker</strong>, your premium beverage distributor in New Zealand. 
          We specialize in importing and distributing a curated selection of premium spirits, wines, 
          and craft beers. From top-shelf gin, rum, whiskey, and vodka to handpicked wines and 
          exceptional local and international brews, we&apos;re dedicated to bringing the finest beverages 
          to all New Zealanders. Whether you&apos;re a liquor store, bar, or restaurant, we ensure you have 
          access to an exclusive portfolio tailored to elevate your offering.
        </p>
        <p>
          At The Liquor Locker, we take pride in our dedicated team that is passionate about delivering 
          exceptional service. With a focus on quality and craftsmanship, we strive to set ourselves 
          apart from our competitors by curating a portfolio of liquor that embodies excellence. 
          Our commitment to excellence is what defines us and sets us apart in the industry.
        </p>

        {/* Social media icons */}
        <div className={styles.socials}>
          <a
            href="https://www.facebook.com/people/The-Liquor-Locker/61572703876000/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <Image
              src="/icons/facebook2.svg"
              alt="Facebook"
              width={28}
              height={28}
              className={styles.icon}
            />
          </a>
          <a
            href="https://www.instagram.com/theliquorlocker___/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Image
              src="/icons/instagram2.svg"
              alt="Instagram"
              width={28}
              height={28}
              className={styles.icon}
            />
          </a>
        </div>
      </div>
    </section>
  );
}
