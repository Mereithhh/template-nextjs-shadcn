import aiohttp
import asyncio

url = "http://172.24.0.158:8080/generate_stream"

data = {
    "inputs": "<|system|>\n你是一个智谱 AI 公司训练的人工智能助手，你的任务是针对用户的问题和要求提供适当的答复和支持。\n<|user|>你好啊<|assistant|>",
    "parameters": {
        "best_of": 1,
        "decoder_input_details": False,
        "details": True,
        "stop": ["<|endoftext|>", "<|user|>", "<|observation|>"],
        "do_sample": False,
        "return_full_text": False,
        "seed": None,
        
    },
}

async def make_request():
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=data) as response:
            return await response.text()

# 运行异步请求
async def main():
    result = await make_request()
    print(result)

if __name__ == "__main__":
    asyncio.run(main())


