import asyncio
from typing import Awaitable
# 定义一个等待任务完成的异步函数
async def wait_done(fn: Awaitable, event: asyncio.Event):
    try:
        await fn  # 等待异步任务完成
    except Exception as e:
        print(e)  # 打印异常信息
        event.set()  # 设置事件状态为已完成
    finally:
        event.set()  # 设置事件状态为已完成