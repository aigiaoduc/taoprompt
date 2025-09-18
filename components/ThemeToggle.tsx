import React from 'react';
import { SunIcon, MoonIcon } from './icons';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-8 w-14 p-1 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500 bg-teal-500 dark:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      <span className="sr-only">Chuyển chế độ sáng/tối</span>
      <span
        className={`${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        } inline-flex items-center justify-center w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ease-in-out shadow-lg`}
      >
        {theme === 'dark' ? (
          <MoonIcon className="h-4 w-4 text-gray-700" />
        ) : (
          <SunIcon className="h-4 w-4 text-yellow-500" />
        )}
      </span>
    </button>
  );
};
