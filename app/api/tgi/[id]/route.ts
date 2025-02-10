import { NextResponse } from 'next/server';
import { tgiService } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const instance = tgiService.getInstance(params.id);
    if (!instance) {
      return NextResponse.json({ error: '实例不存在' }, { status: 404 });
    }
    return NextResponse.json(instance);
  } catch (error) {
    return NextResponse.json({ error: '获取实例失败: ' + error }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedInstance = tgiService.updateInstance({ ...body, id: params.id });
    return NextResponse.json(updatedInstance);
  } catch (error) {
    return NextResponse.json({ error: '更新实例失败: ' + error }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    tgiService.deleteInstance(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '删除实例失败: ' + error }, { status: 500 });
  }
} 