import asyncio
from typing import AsyncIterable, Awaitable
from dotenv import load_dotenv
from fastapi import FastAPI
import uvicorn
from fastapi.responses import StreamingResponse
from langchain.callbacks import AsyncIteratorCallbackHandler
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage
from fastapi.middleware.cors import CORSMiddleware

# 加载环境变量
load_dotenv()

# 定义一个等待任务完成的异步函数
async def wait_done(fn: Awaitable, event: asyncio.Event):
    try:
        await fn  # 等待异步任务完成
    except Exception as e:
        print(e)  # 打印异常信息
        event.set()  # 设置事件状态为已完成
    finally:
        event.set()  # 设置事件状态为已完成

# 定义一个异步函数，用于调用OpenAI模型并返回生成的文本
async def call_openai(question: str) -> AsyncIterable[str]:
    # 创建回调处理器
    callback = AsyncIteratorCallbackHandler()
    # 初始化ChatOpenAI模型，并设置为流模式和详细输出
    model = ChatOpenAI(streaming=True, verbose=True, callbacks=[callback])

    # 设置初始消息
    initial_message = '{"role": "system", "content": "吴嘉发的助手"}\n'

    # 创建等待任务，调用模型生成响应
    coroutine = wait_done(model.agenerate(messages=[[HumanMessage(content=initial_message), HumanMessage(content=question)]]), callback.done)
    task = asyncio.create_task(coroutine)

    # 收集生成的所有文本片段
    generated_texts = []

    # 异步迭代处理每个生成的文本片段
    async for token in callback.aiter():
        generated_texts.append(token)
        #print(f"Received token: {token}")  # 在控制台打印生成的文本片段
        yield f"{token}"  # 返回生成的文本片段

    # 等待任务完成
    await task

    # 将所有文本片段连接成一个字符串
    complete_text = ''.join(generated_texts)

    # 在终端打印完整的文本结果
    print(complete_text)

# 创建FastAPI应用实例
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源
    allow_credentials=True,  # 允许包含cookies的请求
    allow_methods=["*"],  # 允许所有HTTP方法
    allow_headers=["*"],  # 允许所有HTTP头
)

# 定义一个POST路由，用于处理用户提问
@app.post("/v1/chat/completions")
def ask(body: dict):
    # 返回一个流响应，将生成的文本作为事件流输出
    return StreamingResponse(call_openai(body['question']), media_type="text/event-stream")

# 程序入口点
if __name__ == "__main__":
    # 运行FastAPI应用
    uvicorn.run(host="0.0.0.0", port=8088, app=app)