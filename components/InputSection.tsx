import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  onGenerate: () => void;
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  apiKey: string;
}

export const InputSection: React.FC<InputSectionProps> = ({
  inputText,
  setInputText,
  onGenerate,
  onFileUpload,
  isLoading,
  apiKey,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 flex flex-col h-full border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Nội dung gốc</h2>
      <textarea
        className="w-full flex-grow bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none min-h-[300px] sm:min-h-[400px]"
        placeholder="Dán nội dung văn bản của bạn vào đây..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        disabled={isLoading}
      />
      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleUploadClick}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          <UploadIcon className="w-5 h-5 mr-2" />
          Tải lên tệp Word (.docx)
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".docx"
        />
        <button
          onClick={onGenerate}
          className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !inputText.trim() || !apiKey.trim()}
        >
          {isLoading ? 'Đang phân tích...' : 'Tạo Prompt'}
        </button>
      </div>
    </div>
  );
};