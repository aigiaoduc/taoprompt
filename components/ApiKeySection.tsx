import React from 'react';

interface ApiKeySectionProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const ApiKeySection: React.FC<ApiKeySectionProps> = ({ apiKey, setApiKey }) => {
  return (
    <section className="mt-8 bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Cấu hình API Key</h2>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-grow w-full">
          <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Google AI Studio API Key
          </label>
          <input
            id="api-key-input"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Dán API Key của bạn vào đây..."
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            aria-describedby="api-key-help"
          />
        </div>
        <a
          href="https://www.aigiaoduc.io.vn/2025/09/huong-dan-lay-api-key-cua-google-gemini.html"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 md:mt-0 md:self-end whitespace-nowrap inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-teal-500 transition-colors"
        >
          Hướng dẫn lấy API Key
        </a>
      </div>
       <p id="api-key-help" className="mt-2 text-xs text-gray-500 dark:text-gray-500">
        API Key của bạn sẽ chỉ được lưu trữ tạm thời trong trình duyệt và không được gửi đi bất cứ đâu ngoại trừ Google.
      </p>
    </section>
  );
};