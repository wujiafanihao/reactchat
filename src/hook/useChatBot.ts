import { useState} from 'react';
import { ChatAPI } from '../utils/ChatAPI';
import { Message } from '../type/types';
import chatgpt from '../assets/gpt3.5.png';
import user from '../assets/user.png';


// 创建 ChatAPI 实例,指定 API 地址
const chatAPI = new ChatAPI('http://0.0.0.0:8088/v1/chat/completions');

const useChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: { text: string; isFormatted: boolean }) => {
    // 创建新消息对象
    const newMessage: Message = {
      role: 'you',
      content: message.text,
      isContinuing: false,
      avatar: user,
    };

    // 将新消息添加到消息列表
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setError(null); // 清除之前的错误信息

    try {
      // 发送消息到 ChatAPI
      await chatAPI.sendMessage(message.text, (chunk) => {
        // 如果数据块以 'data:' 开头,则表示它是一个 JSON 数据块
        if (chunk.startsWith('data:')) {
          try {
            const data = JSON.parse(chunk.slice(5));
            // 如果数据块中包含 'content' 字段,则更新消息列表
            if (data.content) {
              setMessages(prevMessages => {
                const lastMessage = prevMessages[prevMessages.length - 1];
                // 如果上一条消息是 bot 发送的,且正在进行中
                if (lastMessage.role === 'bot' && lastMessage.isContinuing) {
                  // 创建上一条消息的副本,并更新内容
                  const updatedLastMessage = { ...lastMessage, content: lastMessage.content + data.content };
                  // 替换上一条消息
                  return [...prevMessages.slice(0, -1), updatedLastMessage];
                } else {
                  // 如果上一条消息不是 bot 发送的,或者不是正在进行中的消息
                  // 创建新的 bot 消息
                  const newBotMessage: Message = {
                    role: 'bot',
                    content: data.content,
                    isContinuing: true,
                    avatar: chatgpt,
                  };
                  // 将新 bot 消息添加到消息列表
                  return [...prevMessages, newBotMessage];
                }
              });
            }
          } catch (error) {
            console.error('Failed to parse data chunk:', error);
            setError(`Failed to parse data chunk: ${error}`);
          }
        } else {
          // 如果数据块不是 JSON 数据,则将其作为普通文本处理
          setMessages(prevMessages => {
            const lastMessage = prevMessages[prevMessages.length - 1];

            // 如果上一条消息是 bot 发送的,且正在进行中
            if (lastMessage.role === 'bot' && lastMessage.isContinuing) {
              // 创建上一条消息的副本,并更新内容
              const updatedLastMessage = { ...lastMessage, content: lastMessage.content + chunk };
              // 替换上一条消息
              return [...prevMessages.slice(0, -1), updatedLastMessage];
            } else {
              // 如果上一条消息不是 bot 发送的,或者不是正在进行中的消息
              // 创建新的 bot 消息
              const newBotMessage: Message = {
                role: 'bot',
                content: chunk,
                isContinuing: true,
                avatar: chatgpt,
              };
              // 将新 bot 消息添加到消息列表
              return [...prevMessages, newBotMessage];
            }
          });
        }
      });

      // 标记上一条消息结束
      setMessages(prevMessages => {
        // 创建上一条消息的副本,并更新 isContinuing
        const lastMessage = { ...prevMessages[prevMessages.length - 1], isContinuing: false };
        // 替换上一条消息
        return [...prevMessages.slice(0, -1), lastMessage];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setError(`Error sending message: ${error}`);
    }
  };

  return { messages, sendMessage, error };
};

export default useChatBot;