import { ChatCompletionRequest } from '@/types/openai';
import { TGIGenerateStreamRequest } from '@/types/tgi';



export async function transferTGIRequestToOpenAI(
  code: string,
  request: ChatCompletionRequest
): Promise<TGIGenerateStreamRequest> {
  const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

  // 简化包装代码，减少 try-catch 开销
  const wrappedCode = `
    return await (async (request) => {
      ${code}
    })(${JSON.stringify(request)});
  `;

  // 直接执行，不使用 Promise.race 和 timeout
  const result = await new AsyncFunction(wrappedCode)();
  return result;
}


// const test = async () => {
//   const code = `
//   // 在这里可以直接使用 request 对象
//   return {
//     model: request.model,
//     messages: request.messages,
//     test: "nihao"
//     // 转换为 TGI 格式的其他必要字段
//   };
// `;
//   const request: any = {
//     model: "gpt-3.5-turbo",
//     messages: [{ role: "user", content: "Hello" }]
//   };
//   const result = await transferTGIRequestToOpenAI(code, request);
//   console.log(result)
// }
// test()