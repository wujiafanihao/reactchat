import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface Props {
  // 定义一个 Props 接口，包含一个 sendMessage 函数，用于发送消息
  sendMessage: (message: { text: string; isFormatted: boolean }) => void;
}

const MessageInput: React.FC<Props> = ({ sendMessage }) => {
  const [inputValue, setInputValue] = useState(''); // 定义输入框的值
  const [isFormatted, setIsFormatted] = useState(false); // 定义是否包含格式化的标志
  const inputRef = useRef<HTMLTextAreaElement>(null); // 创建输入框的引用

  // 当输入框的值发生变化时，调整输入框的高度以适应内容
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '10px'; // 设置初始高度为 10px
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; // 调整高度以适应内容
    }
  }, [inputValue]);

  // 处理输入框值的变化事件
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value); // 更新输入框的值
    setIsFormatted(e.target.value.includes('\\n')); // 检查输入框的值中是否包含换行符
  };

  // 处理提交表单事件
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 阻止默认提交行为
    if (inputValue.trim() !== '') { // 如果输入框的值不为空
      sendMessage({ text: inputValue.trim(), isFormatted }); // 调用 sendMessage 函数发送消息
      setInputValue(''); // 清空输入框的值
      setIsFormatted(false); // 重置格式化标志
    }
  };

  // 处理键盘按下事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { // 如果按下的是回车键并且没有按下 Shift 键
      e.preventDefault(); // 阻止默认行为
      handleSubmit(e); // 提交表单
    } else if (e.key === 'Enter' && e.shiftKey) { // 如果按下的是回车键并且同时按下了 Shift 键
      setInputValue(prevValue => prevValue + '\n'); // 插入换行符
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <textarea
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Message ChatGPT..."
        ref={inputRef} // 绑定引用
      />
      <button type="submit">
        <FontAwesomeIcon icon={faPaperPlane} /> {/* 显示发送按钮 */}
      </button>
    </form>
  );
};

export default MessageInput;
