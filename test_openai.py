import os
from openai import OpenAI

# 初始化 OpenAI 客户端
client = OpenAI(
    api_key="11",  # 从环境变量获取 API key
    base_url="http://localhost:3000/api/v1"
)

def stream_chat_completion():
    try:
        # 创建流式聊天完成请求
        stream = client.chat.completions.create(
            model="test",
            messages=[
                {"role": "user", "content": "讲个简短的笑话"}
            ],
            stream=True  # 启用流式输出
        )

        # 逐个接收并打印响应片段
        print("AI 回答: ", end="", flush=True)
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                print(chunk.choices[0].delta.content, end="", flush=True)
        print()  # 最后打印换行

    except Exception as e:
        print(f"发生错误: {str(e)}")

if __name__ == "__main__":
    stream_chat_completion()
