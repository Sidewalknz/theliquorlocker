'use client';

import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Left: Logo + Social */}
        <div className={`${styles.column} ${styles.centered}`}>
          <Image
            src="/logo.svg"
            alt="The Liquor Locker logo"
            width={150}
            height={150}
            className={styles.logo}
          />
          <div className={styles.socials}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Image
                src="/icons/facebook.svg"
                alt="Facebook"
                width={20}
                height={20}
              />
            </a>
            <a
              href="https://www.instagram.com/theliquorlocker___/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Image
                src="/icons/instagram.svg"
                alt="Instagram"
                width={20}
                height={20}
              />
            </a>
          </div>
        </div>

        {/* Middle: Contact */}
        <div className={`${styles.column} ${styles.centered}`}>
          <p>
            <a href="mailto:Ben@thespiritsnetwork.co.nz">
              Ben@thespiritsnetwork.co.nz
            </a>
          </p>
          <p>
            <a href="tel:+64276256220">+64 27 625 6220</a>
          </p>
          <p>Auckland, New Zealand</p>
        </div>

        {/* Right: Agency */}
        <div className={`${styles.column} ${styles.centered}`}>
          <p>
            <a
              href="https://sidewalks.co.nz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Created by Sidewalk
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
