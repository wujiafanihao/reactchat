import React, { useEffect, useRef, useState } from "react"; // 引入 React 库中的 useEffect、useRef 和 useState 钩子函数
import { Message } from "../../type/types"; // 导入消息类型
import "../../styles/index.css"; // 导入样式文件
import userAvatar from "../../assets/user.png"; // 导入用户头像
import chatgptAvatar from "../../assets/gpt3.5.png"; // 导入ChatGPT头像
import { faArrowDown,faCopy,faCheck } from '@fortawesome/free-solid-svg-icons'; // 导入向下箭头图标
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 导入Font Awesome图标组件
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-go';

interface Props {
  messages: Message[]; // 定义Props接口，包含消息数组
}

const ChatWindow: React.FC<Props> = ({ messages }) => { // 定义 ChatWindow 组件
  const chatWindowRef = useRef<HTMLDivElement>(null); // 创建聊天窗口的引用
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false); // 定义显示滚动到底部按钮的状态
  const [copySuccess, setCopySuccess] = useState(false);

  // 当消息发生变化时，滚动到聊天窗口底部
  useEffect(() => {
    if (chatWindowRef.current) { // 如果聊天窗口引用存在
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight; // 将滚动条滚动到最底部
    }
  }, [messages]); // 依赖于 messages 数组的变化
      
  // 使用effect高亮所有代码块
    useEffect(() => {
        Prism.highlightAll();
    }, [messages]); // 当messages变动时重新高亮

  // 处理滚动事件
  const handleScroll = () => {
    if (chatWindowRef.current) { // 如果聊天窗口引用存在
      const { scrollTop, clientHeight, scrollHeight } = chatWindowRef.current; // 获取滚动相关属性
      setShowScrollToBottomButton(scrollTop + clientHeight < scrollHeight); // 判断是否显示滚动到底部按钮
    }
  };

  // 滚动到底部
  const scrollToBottom = () => {
    if (chatWindowRef.current) { // 如果聊天窗口引用存在
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight; // 将滚动条滚动到最底部
      setShowScrollToBottomButton(false); // 隐藏滚动到底部按钮
    }
  };

  // 复制到剪贴板
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 1000); // 显示1秒后消失
    }, (err) => {
      console.error('无法复制文本: ', err);
      setCopySuccess(false);
    });
  };

  return (
    <div className="chat-window" ref={chatWindowRef} onScroll={handleScroll}>
      {messages.map((message, index) => ( // 遍历消息数组，渲染每一条消息
        <div key={index} className={`message ${message.role}`}> {/* 根据消息的角色添加不同的类 */}
          {/* 根据角色显示不同的头像和发送者名称 */}
          <div className="message-content">
            <div className="avatar-wrapper">
              <img
                src={message.role === "you" ? userAvatar : chatgptAvatar} // 根据角色选择显示用户头像或ChatGPT头像
                alt="Avatar"
                className="avatar"
              />
              <p className="sender-name">{message.role === "you" ? "You" : "ChatGPT"}</p> {/* 根据角色显示发送者名称 */}
            </div>
            <p className="message-text">
            <React.Fragment>
            <ReactMarkdown
              className="message_bot"
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  // 显示复制按钮或复制成功的图标
                  const copyIcon = copySuccess ? faCheck : faCopy;
                  return match ? (
                    <div style={{ position: 'relative' }}>
                      <button
                        className="copy-button"
                        onClick={() => copyToClipboard(String(children))}
                        disabled={copySuccess}
                      >
                        <FontAwesomeIcon icon={copyIcon} />
                      </button>
                    <pre className={`language-${match[1]}`}>
                      
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </React.Fragment>  
            </p>
          </div>
        </div>
      ))}
      {/* 显示滚动到底部按钮 */}
      {showScrollToBottomButton && (
        <div className="scroll-to-bottom" onClick={scrollToBottom}>
          <FontAwesomeIcon icon={faArrowDown} /> {/* 使用 Font Awesome 图标 */}
        </div>
      )}
    </div>
  );
};

export default ChatWindow; // 导出 ChatWindow 组件
