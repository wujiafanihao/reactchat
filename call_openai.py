import asyncio
import os
from wait_done import wait_done
from typing import AsyncIterable
from dotenv import load_dotenv
from langchain.callbacks import AsyncIteratorCallbackHandler
# from langchain.chat_models import ChatOpenAI
# 从 langchain_community 中导入 ChatOpenAI
from langchain_community.chat_models import ChatOpenAI
from langchain.schema import HumanMessage

# 加载环境变量
load_dotenv()
temperature = float(os.environ.get("TEMPERATURE"))
max_tokens = int(os.environ.get("MAX_TOKENS"))

# 定义一个异步函数，用于调用OpenAI模型并返回生成的文本
async def call_openai(question: str) -> AsyncIterable[str]:
    # 创建回调处理器
    callback = AsyncIteratorCallbackHandler()
    try:
        # 初始化ChatOpenAI模型，并设置为流模式和详细输出
        model = ChatOpenAI(streaming=True, verbose=True, 
        callbacks=[callback],temperature=temperature,max_tokens=max_tokens)

        # 设置初始消息
        initial_message = '{"role": "system", "content": "永远都用markdown来回答"}\n'

        # 创建等待任务，调用模型生成响应
        coroutine = wait_done(model.agenerate(messages=[[HumanMessage(content=initial_message), HumanMessage(content=question)]]), callback.done)
        task = asyncio.create_task(coroutine)

        # 收集生成的所有文本片段
        generated_texts = []

        # 异步迭代处理每个生成的文本片段
        async for token in callback.aiter():
            generated_texts.append(token)
            # print(f"Received token: {token}")  # 在控制台打印生成的文本片段
            yield f"{token}"  # 返回生成的文本片段

        # 等待任务完成
        await task
        # 将所有文本片段连接成一个字符串
        content = ''.join(generated_texts)
        # yield f"data: {{'question': '{question}', 'content': '{content}'}}\n\n"
    except Exception as e:  # 捕获所有可能的异常
        error_message = str(e)
        yield f"出错了，请联系管理人员{error_message}"
        