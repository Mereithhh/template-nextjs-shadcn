import { NextResponse } from 'next/server';
import { tgiService } from '@/lib/data';


export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const instances = tgiService.getAllInstances();
    return NextResponse.json(instances);
  } catch (error) {
    return NextResponse.json({ error: '获取实例失败: ' + error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newInstance = tgiService.createInstance(body);
    return NextResponse.json(newInstance);
  } catch (error) {
    return NextResponse.json({ error: '创建实例失败: ' + error }, { status: 500 });

  }
}