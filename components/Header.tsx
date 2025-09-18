import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="relative text-center">
      <div className="absolute top-0 right-0">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 dark:from-blue-400 dark:to-teal-300">
        Trình tạo Prompt Chuẩn
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
        Tải lên tài liệu hoặc dán văn bản để AI phân tích và tạo ra một prompt tối ưu, giúp bạn yêu cầu các AI khác tạo ra nội dung tương tự một cách chính xác.
      </p>
    </header>
  );
};