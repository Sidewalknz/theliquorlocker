'use client';

import { useId } from 'react';
import React from 'react';
import styles from './WaveDivider.module.css';

type WaveDividerProps = {
  /** Flip vertically (points downward; overlaps the section above). */
  flip?: boolean;
  /** Wave fill color (defaults to var(--background)). */
  color?: string;
  /** Visual height in px (default 100). */
  height?: number;
};

/** Allow CSS var on inline style */
type WaveVars = React.CSSProperties & { ['--wave-h']?: string };

export default function WaveDivider({
  flip = false,
  color,
  height = 100,
}: WaveDividerProps) {
  const patternId = useId();
  const style: WaveVars = {
    ['--wave-h']: `${height}px`,
    color: color || 'var(--background)', // SVG uses currentColor
  };

  return (
    <div
      className={`${styles.wrapper} ${flip ? styles.flip : styles.normal}`}
      style={style}
      aria-hidden="true"
    >
      <svg
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="1000"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 0v4l250 64 125-32 250 64 375-96V0H0z"
              fill="currentColor"
              transform={flip ? 'scale(1,-1) translate(0,-100)' : undefined}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
