"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll(); // init on load
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <nav className={styles.navbar}>
          {/* Logo on the left */}
          <div className={styles.logo}>
            <Link href="/" aria-label="The Liquor Locker home">
              <Image src="/logo.svg" alt="The Liquor Locker" width={40} height={40} />
            </Link>
          </div>

          {/* Links on the right */}
          <ul className={styles.navLinks}>
            <li><Link href="/range">Range</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/register">Register</Link></li>
          </ul>
        </nav>
      </header>

      {/* Spacer to offset the fixed header height */}
      <div className={styles.spacer} aria-hidden="true" />
    </>
  );
}
