import { NextRequest, NextResponse } from 'next/server';
import { ChatCompletionRequest } from "@/types/openai";
import { TGI2OpenAI, ResponseToOpenAI } from "@/lib/t2o";
import { TGIStreamResponse } from "@/types/tgi";
import { tgiService } from '@/lib/data';


export async function POST(req: NextRequest) {
  try {
    // 解析请求体
    const request: ChatCompletionRequest = await req.json();

    // 验证必要的参数
    if (!request.messages || request.messages.length === 0) {
      return NextResponse.json({
        error: {
          message: "请提供消息内容",
          type: "invalid_request_error",
          param: "messages",
          code: null
        }
      }, { status: 400 });
    }
    const modelId = request.model;
    const instance = tgiService.getInstanceByModel(modelId)
    if (!instance) {
      return NextResponse.json({
        error: {
          message: "不存在此模型",
          type: "invalid_request_error",
          param: "model",
          code: null
        }
      }, { status: 400 });
    }

    // 转换为 TGI 请求格式
    const tgiRequest = await TGI2OpenAI(request);
    console.log(tgiRequest)


    // 调用 TGI API
    const tgiResponse = await fetch(`${instance.url}/generate_stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tgiRequest),
    });

    if (!tgiResponse.ok) {
      throw new Error(`TGI API 错误: ${tgiResponse.statusText}`);
    }

    // 创建响应流
    const stream = new TransformStream({
      async transform(chunk: string, controller) {
        try {
          // 跳过空行
          if (!chunk.trim()) return;
          console.log("chunk:", chunk)

          // 移除 "data: " 前缀并解析 JSON
          const jsonStr = chunk.replace(/^data: /, '').trim();
          if (jsonStr === '[DONE]') return;

          // 解析 TGI 响应
          const data: TGIStreamResponse = JSON.parse(jsonStr);

          // 转换为 OpenAI 格式
          const openAIChunk = ResponseToOpenAI(data);

          // 发送数据
          controller.enqueue(`data: ${JSON.stringify(openAIChunk)}\n\n`);
        } catch (error) {
          console.error('处理块时出错:', error, 'chunk:', chunk);
        }
      },
      flush(controller) {
        controller.enqueue('data: [DONE]\n\n');
      }
    });

    // 将 TGI 响应管道连接到转换流
    tgiResponse.body?.pipeThrough(new TextDecoderStream()).pipeThrough(stream);

    // 返回流式响应
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('API 错误:', error);
    return NextResponse.json({
      error: {
        message: "服务器内部错误",
        type: "internal_server_error",
        param: null,
        code: null
      }
    }, { status: 500 });
  }
}
