export interface TGIInstance {
  id: string;
  url: string;
  modelId: string;
  notes: string;
}

export interface TGIGenerateStreamRequest {
  inputs: string;
  parameters?: {
    max_new_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    repetition_penalty?: number;
    stop?: string[];
    seed?: number;
    truncate?: number;
    typical_p?: number;
    watermark?: boolean;
    decoder_input_details?: boolean;
    do_sample?: boolean;
  };
  stream?: boolean;
}

export interface TGIStreamResponse {
  token: {
    text: string;
    id: number;
    logprob: number;
    special: boolean;
  };
  generated_text: string | null;
  details?: {
    finish_reason: string;
    generated_tokens: number;
    seed: number;
  };
}

export interface TGIStreamError {
  error: string;
  error_type: string;
}
