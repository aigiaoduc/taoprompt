import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { generatePromptTemplate } from './services/geminiService';
import { readDocxFile } from './utils/fileReader';
import { ApiKeySection } from './components/ApiKeySection';
import { FacebookIcon, WebsiteIcon } from './components/icons';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'dark'; // Default to dark
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleGenerate = useCallback(async () => {
    if (!apiKey.trim()) {
      setError('Vui lòng nhập API Key của Google AI Studio.');
      return;
    }
    if (!inputText.trim()) {
      setError('Vui lòng nhập văn bản hoặc tải lên tài liệu.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    try {
      const prompt = await generatePromptTemplate(inputText, apiKey);
      setGeneratedPrompt(prompt);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.';
      setError(`Lỗi: ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, apiKey]);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const text = await readDocxFile(file);
      setInputText(text);
    } catch (e) {
      setError('Không thể đọc tệp Word. Vui lòng thử lại với tệp khác.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <ApiKeySection apiKey={apiKey} setApiKey={setApiKey} />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputSection
            inputText={inputText}
            setInputText={setInputText}
            onGenerate={handleGenerate}
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
            apiKey={apiKey}
          />
          <OutputSection
            prompt={generatedPrompt}
            isLoading={isLoading}
            error={error}
          />
        </main>
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-500 text-sm">
          <p className="mb-2">Sản phẩm được tạo bởi Hồng Quân.</p>
          <div className="flex justify-center items-center gap-4">
            <a
              href="https://www.facebook.com/tran.hong.quan.216221/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook của Hồng Quân"
              className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
            >
              <FacebookIcon className="w-6 h-6" />
            </a>
            <a
              href="https://www.aigiaoduc.io.vn/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website AIGiaoDuc.io.vn"
              className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-500 transition-colors"
            >
              <WebsiteIcon className="w-6 h-6" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;