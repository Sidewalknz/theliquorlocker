// app/api/products/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'products');
    const exts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
    const files = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(f => f.isFile() && exts.has(path.extname(f.name).toLowerCase()))
      .map(f => `/products/${encodeURIComponent(f.name)}`);

    return NextResponse.json({ images: files });
  } catch (e) {
    // Fallback to empty list if folder missing or not readable
    return NextResponse.json({ images: [] });
  }
}
