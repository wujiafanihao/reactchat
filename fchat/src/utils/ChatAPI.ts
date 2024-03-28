class ChatAPI {
  // API服务器地址
  address: string;
  
  // 构造函数，初始化时传入服务器地址
  constructor(address: string) {
    this.address = address;
    console.log('Sending request to:', this.address);
  }

  // 该函数用于向服务器发送POST请求
  async sendMessage(message: string, handleStream: (chunk: string, errorMessage: void) => void) {
    try {
      // 设置超时时间为3秒
      const TIMEOUT_MS = 3000;
      let timeoutId: NodeJS.Timeout | null = null; // 初始化为 null

      const responsePromise = new Promise<Response>(async (resolve, reject) => {
        try {
          const response = await fetch(this.address, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: message })
          });

          resolve(response);
        } catch (error) {
          reject(error);
        }
      });

      // 设置超时定时器
      const timeoutPromise = new Promise<void>((resolve) => {
        timeoutId = setTimeout(() => {
          resolve();
        }, TIMEOUT_MS);
      });

      // 等待响应或超时
      const response = await Promise.race([responsePromise, timeoutPromise]);

      // 如果已经超时，则取消请求
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // 判断是否收到响应
      if (!response) {
        throw new Error('Request timed out');
      }

      // 判断服务器响应是否正常，如果不正常则抛出错误
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        
        handleStream(chunk); 
        console.log('Received chunk:', chunk);
      }
    } catch (error) {
      console.error('Error sending request:', error);
      const errorMessage = `Error: ${error instanceof Error ? error.message : error}`;
      handleStream(errorMessage);
    }
  }
}

// 导出 ChatAPI 类，以便在其他地方使用
export { ChatAPI }
