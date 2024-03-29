from dotenv import load_dotenv
from call_openai import call_openai
import json
from colorama import init, Fore

init()
# 调用 OpenAI 模型生成文本
async def printjson(body):
    response = call_openai(body['question'])   
    # 等待异步生成器生成所有的值
    generated_texts = []
    async for reply in response:
        print(reply)
        generated_texts.append(reply)
    content = ''.join(generated_texts)
    response_json = {
        "request": body,
        "response": {
            "content": content
        }
    }
    print(Fore.RED + "Request and Response JSON:", json.dumps(response_json))