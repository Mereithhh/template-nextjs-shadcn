import { ChatCompletionRequest } from "@/types/openai";
import { TGIGenerateStreamRequest, TGIStreamResponse } from "@/types/tgi";

export function TGI2OpenAI(
  request: ChatCompletionRequest
): TGIGenerateStreamRequest {
  // 将消息数组转换为字符串
  const prompt = request.messages.reduce((acc, message) => {
    let role = message.role;
    if (role == "developer") {
      role = "system"
    }
    const content = message.content as string;

    // 根据不同的角色添加对应的标记
    return acc + `<|${role}|>\n${content}`;
  }, '');

  // 返回 TGI 格式的请求
  return {
    inputs: prompt,
    parameters: {
      max_new_tokens: request.max_tokens,
      temperature: request.temperature,
      top_p: request.top_p || undefined,
      do_sample: false,
      stop: ["<|endoftext|>", "<|user|>", "<|observation|>"],
      details: true,
      return_full_text: false,
      seend: null,
      best_of: 1
    }
  } as TGIGenerateStreamRequest
}

export function ResponseToOpenAI(tgiChunk: TGIStreamResponse) {
  // 如果是最后一个块（包含完整生成文本和详情）
  if (tgiChunk.details) {
    return {
      id: "chatcmpl-" + Date.now(),
      object: "chat.completion.chunk",
      created: Math.floor(Date.now() / 1000),
      model: "tgi-model",
      choices: [
        {
          index: 0,
          delta: {},
          finish_reason: tgiChunk.details.finish_reason
        }
      ]
    };
  }

  // 普通的文本块
  return {
    id: "chatcmpl-" + Date.now(),
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1000),
    model: "tgi-model",
    choices: [
      {
        index: 0,
        delta: {
          content: tgiChunk.token.text
        },
        finish_reason: null
      }
    ]
  };
}

// const test = () => {
//   // 创建一个示例 ChatCompletionRequest
//   const sampleRequest: ChatCompletionRequest = {
//     messages: [
//       {
//         role: "system",
//         content: "你是一个有帮助的助手。"
//       },
//       {
//         role: "user",
//         content: "你好！"
//       },
//       {
//         role: "assistant",
//         content: "你好！我能帮你什么忙吗？"
//       }
//     ],
//     max_tokens: 1000,
//     temperature: 0.8,
//     top_p: 0.9,
//     model: "11"
//   };

//   // 调用转换函数
//   const tgiRequest = TGI2OpenAI(sampleRequest);

//   // 打印转换结果
//   console.log('转换后的 TGI 请求:', JSON.stringify(tgiRequest, null, 2));
// }

// 执行测试
// test();