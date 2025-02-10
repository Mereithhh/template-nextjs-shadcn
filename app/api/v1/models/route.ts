import { NextResponse } from 'next/server';
import { tgiService } from '@/lib/data';

export interface OpenAIModel {
  id: string;
  object: 'model';
  created: number;
  owned_by: string;
  permission: Array<{
    id: string;
    object: 'model_permission';
    created: number;
    allow_create_engine: boolean;
    allow_sampling: boolean;
    allow_logprobs: boolean;
    allow_search_indices: boolean;
    allow_view: boolean;
    allow_fine_tuning: boolean;
    organization: string;
    group: null;
    is_blocking: boolean;
  }>;
}

export async function GET() {
  try {
    const instances = tgiService.getAllInstances();

    // 将 tgi 实例转换为 OpenAI 模型格式
    const models: OpenAIModel[] = instances.map(instance => ({
      id: instance.modelId,
      object: 'model',
      created: Date.now(),
      owned_by: 'tgi',
      permission: [{
        id: `modelperm-${instance.id}`,
        object: 'model_permission',
        created: Date.now(),
        allow_create_engine: true,
        allow_sampling: true,
        allow_logprobs: true,
        allow_search_indices: false,
        allow_view: true,
        allow_fine_tuning: false,
        organization: '*',
        group: null,
        is_blocking: false,
      }],
    }));

    // 去重，因为可能有多个实例使用相同的模型ID
    const uniqueModels = Array.from(
      new Map(models.map(model => [model.id, model])).values()
    );

    return NextResponse.json({
      object: 'list',
      data: uniqueModels,
    });
  } catch (error) {
    console.error('获取模型列表失败:', error);
    return NextResponse.json(
      { error: { message: '获取模型列表失败' } },
      { status: 500 }
    );
  }
}
