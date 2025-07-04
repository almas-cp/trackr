import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    const value = await redis.get("foo");
    return NextResponse.json({ success: true, value });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json();
    
    if (!key || !value) {
      return NextResponse.json(
        { success: false, error: "Both key and value are required" },
        { status: 400 }
      );
    }
    
    await redis.set(key, value);
    return NextResponse.json({ success: true, message: `Set ${key}=${value}` });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 