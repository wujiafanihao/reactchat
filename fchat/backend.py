from dotenv import load_dotenv
from call_openai import call_openai
from fastapi import FastAPI
import uvicorn
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
# from testprintjs import printjson
from colorama import init, Fore

# 加载环境变量
load_dotenv()
# 初始化 colorama
init()

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
@app.post("/v1/chat/completions",response_class=StreamingResponse)
async def ask(body: dict):
    # 调用 printjson 函数
    # await printjson(body)
    question = body.get('question')
    return StreamingResponse(call_openai(question), media_type="text/event-stream")

# 程序入口点
if __name__ == "__main__":
    uvicorn.run("backend:app", host="0.0.0.0", port=8088, reload=True, log_level="debug")
