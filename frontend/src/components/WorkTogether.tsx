'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './WorkTogether.module.css';
import Particles from './Particles';

export default function WorkTogether() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  // IntersectionObserver to trigger animation
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

  return (
    <section className={styles.workTogether} ref={sectionRef}>
      <Particles />
      <div className={styles.content}>
        <h2 className={`${styles.title} ${visible ? styles.visible : ''}`}>
          Want To Work Together?
        </h2>
        <p className={`${styles.text} ${visible ? styles.visible : ''}`}>
          Do you want to range some of our epic products? It has never been easier to get your
          account set up than it is today. Fill out the form and start ordering today.
        </p>
        <a
          href="/register"
          className={`${styles.cta} ${visible ? styles.visible : ''}`}
        >
          Get Started
        </a>
      </div>
    </section>
  );
}
