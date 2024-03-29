import React, {ReactNode } from 'react';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import '../../styles/index.css';
import Header from './Header';
import useChatBot from '../../hook/useChatBot';

// 定义 ChatApp 组件的属性类型
interface Props {
  children?: ReactNode;
}

const ChatApp: React.FC<Props> = ({ children }) => {
  const { messages, sendMessage } = useChatBot();

  return (
    <div className="chat-app"> {/* 添加样式类名 */}
      <div className="heading">
        <Header />
      </div>
      {children}
      {/* 渲染聊天窗口 */}
      <ChatWindow messages={messages} />
      {/* 渲染消息输入组件 */}
      <MessageInput sendMessage={sendMessage} />
      <div className="input-text">ChatGPT can make mistakes. Consider checking important information.</div>
    </div>
  );
};

export default ChatApp;