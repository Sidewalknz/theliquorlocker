// app/api/products/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // ensure fresh read of filesystem

export async function GET() {
  try {
    const brandsDir = path.join(process.cwd(), 'public', 'brands');
    const exts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

    // Recursively walk the brands directory and collect image files
    const files: string[] = [];
    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(abs);
        } else if (entry.isFile() && exts.has(path.extname(entry.name).toLowerCase())) {
          files.push(abs);
        }
      }
    };

    // If brandsDir is missing, this will throw and we’ll fall back below
    walk(brandsDir);

    // Convert absolute paths to URL paths under /brands/, with safe encoding
    const urls = files.map((absPath) => {
      const rel = path.relative(brandsDir, absPath); // e.g. "kakapo/manuka.webp"
      // Encode each segment to preserve spaces/unicode safely in URLs
      const encoded = rel.split(path.sep).map(encodeURIComponent).join('/');
      return `/brands/${encoded}`;
    });

    return NextResponse.json({ images: urls });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
