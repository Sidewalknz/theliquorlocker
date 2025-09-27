'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Track scroll to toggle header background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleNavClick = useCallback(() => setOpen(false), []);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <nav className={styles.navbar} aria-label="Primary">
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/" aria-label="The Liquor Locker home">
              <Image src="/logo3.svg" alt="The Liquor Locker" width={150} height={60} priority />
            </Link>
          </div>

          {/* Desktop links */}
          <ul className={styles.navLinks}>
            <li><Link href="/range">Range</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li>
              <Link href="/register" className={styles.cta}>
                Register
              </Link>
            </li>
          </ul>

          {/* Burger button (mobile) */}
          <button
            className={`${styles.burger} ${open ? styles.open : ''}`}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(v => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </nav>
      </header>

      {/* Drop-from-top mobile menu */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${open ? styles.menuOpen : ''}`}
      >
        <ul className={styles.mobileList}>
          <li><Link href="/range" onClick={handleNavClick}>Range</Link></li>
          <li><Link href="/contact" onClick={handleNavClick}>Contact</Link></li>
          <li>
            <Link href="/register" onClick={handleNavClick} className={styles.ctaMobile}>
              Register
            </Link>
          </li>
        </ul>
      </div>

      {/* Scrim behind menu */}
      <button
        type="button"
        className={`${styles.scrim} ${open ? styles.scrimVisible : ''}`}
        aria-hidden={!open}
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />
    </>
  );
}
