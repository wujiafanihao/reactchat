import React, { useState, useEffect } from 'react'; // 引入 React 库中的 useState 和 useEffect 钩子函数
import '../../styles/index.css'; // 引入全局样式表
import styled from 'styled-components'; // 引入 styled-components 库
import { RiSunFill, RiMoonFill } from 'react-icons/ri'; // 引入太阳和月亮的图标组件

const StyledButton = styled.button`
  /* 添加你想要的按钮样式 */ // 样式化按钮组件
  cursor: pointer; // 鼠标悬停时显示指针
  /* Transition for smooth background color change */ // 过渡效果使背景颜色变化平滑
  transition: background-color 0.3s ease;
`;

const StyledIcon = styled.div`
    /* 添加你想要的图标样式 */ // 样式化图标组件
    /* Transition for smooth color change */ // 过渡效果使颜色变化平滑
    transition: color 0.3s ease;
`;

const Header: React.FC = () => { // 定义 Header 组件为函数组件
    const [darkMode, setDarkMode] = useState(false); // 使用 useState 钩子函数声明 darkMode 状态，并初始化为 false

    useEffect(() => { // 使用 useEffect 钩子函数监听组件的挂载和卸载
        const bodyClass = document.body.classList; // 获取页面 body 元素的 class 列表
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)'); // 获取系统是否处于暗黑模式的媒体查询对象

        if (darkModeMediaQuery.matches) { // 如果系统处于暗黑模式
            bodyClass.add('dark-mode'); // 向页面 body 元素添加 'dark-mode' 类
            setDarkMode(true); // 设置 darkMode 状态为 true
        } else { // 如果系统不处于暗黑模式
            bodyClass.remove('dark-mode'); // 从页面 body 元素移除 'dark-mode' 类
        }

        const handleChange = (e: MediaQueryListEvent) => { // 定义媒体查询变化时的处理函数
            setDarkMode(e.matches); // 根据媒体查询结果设置 darkMode 状态
            if (e.matches) { // 如果处于暗黑模式
                bodyClass.add('dark-mode'); // 向页面 body 元素添加 'dark-mode' 类
            } else { // 如果不处于暗黑模式
                bodyClass.remove('dark-mode'); // 从页面 body 元素移除 'dark-mode' 类
            }
        };

        darkModeMediaQuery.addEventListener('change', handleChange); // 添加媒体查询变化事件监听器

        return () => { // 在组件卸载时执行清理操作的回调函数
            darkModeMediaQuery.removeEventListener('change', handleChange); // 移除媒体查询变化事件监听器
            bodyClass.remove('dark-mode'); // 从页面 body 元素移除 'dark-mode' 类
        };
    }, []); // useEffect 的依赖项为空数组，表示仅在组件挂载和卸载时执行

    const toggleDarkMode = () => { // 定义切换暗黑模式的函数
        setDarkMode(!darkMode); // 切换 darkMode 状态
        const bodyClass = document.body.classList; // 获取页面 body 元素的 class 列表
        if (!darkMode) { // 如果 darkMode 为 false，表示当前为亮色模式
            bodyClass.add('dark-mode'); // 向页面 body 元素添加 'dark-mode' 类
        } else { // 如果 darkMode 为 true，表示当前为暗黑模式
            bodyClass.remove('dark-mode'); // 从页面 body 元素移除 'dark-mode' 类
        }
    };

    return (
        <header className="app-header"> {/* 头部容器 */}
            <h1>ImitativeChat</h1> {/* 标题 */}
                <StyledButton className="switch" onClick={toggleDarkMode}> {/* 切换暗黑模式按钮 */}
                <StyledIcon>
                     {darkMode ? <RiSunFill /> : <RiMoonFill />} {/* 根据 darkMode 状态选择显示太阳或月亮图标 */}
                </StyledIcon>
                </StyledButton> 
        </header>
    );
};

export default Header; // 导出 Header 组件
