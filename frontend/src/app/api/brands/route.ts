// app/api/brands/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

type Product = { name: string; image: string };
type Brand = {
  name: string;
  description: string;
  logo: string;
  products: Product[];
};

export async function GET() {
  try {
    // Correct path since data.json is inside src/data
    const filePath = path.join(process.cwd(), 'src', 'data', 'data.json');

    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const brands: Brand[] = JSON.parse(fileContents);

    return NextResponse.json({ brands });
  } catch (err) {
    console.error('Error reading brands data.json:', err);
    return NextResponse.json({ brands: [] });
  }
}
