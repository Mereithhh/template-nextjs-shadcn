// 基础消息类型
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool' | "developer";
  content: string | null;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
  tool_calls?: ToolCall[];
}

// 工具调用类型
export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

// 函数定义类型
export interface FunctionDefinition {
  name: string;
  description?: string;
  parameters: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
    [key: string]: any;
  };
}

// 工具定义类型
export interface ToolDefinition {
  type: 'function';
  function: FunctionDefinition;
}

// 请求类型
export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string | string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  user?: string;
  functions?: FunctionDefinition[];  // 旧版函数调用
  function_call?: 'auto' | 'none' | { name: string };  // 旧版函数调用
  tools?: ToolDefinition[];  // 新版工具调用
  tool_choice?: 'auto' | 'none' | {
    type: 'function';
    function: { name: string };
  };
}

// Token 使用统计类型
export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// 完整的使用统计类型
export interface Usage extends TokenUsage {
  system_fingerprint?: string;
}

// 非流式响应类型
export interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  system_fingerprint?: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: 'stop' | 'length' | 'function_call' | 'tool_calls' | 'content_filter' | null;
  }>;
  usage: Usage;
}

// 流式响应类型
export interface ChatCompletionStreamResponse {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: Partial<ChatMessage>;
    finish_reason: 'stop' | 'length' | 'function_call' | 'tool_calls' | 'content_filter' | null;
  }>;
}

// 错误响应类型
export interface ErrorResponse {
  error: {
    message: string;
    type: string;
    param?: string;
    code?: string;
  };
}

// 用于类型保护的工具函数
export function isStreamResponse(
  response: ChatCompletionResponse | ChatCompletionStreamResponse
): response is ChatCompletionStreamResponse {
  return response.object === 'chat.completion.chunk';
}
