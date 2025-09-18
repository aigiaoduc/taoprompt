import React, 'react';
import { useState, useEffect } from 'react';
import { CopyIcon, DownloadIcon, EditIcon, SaveIcon, ChatGptIcon, GeminiIcon, GrokIcon } from './icons';

interface OutputSectionProps {
  prompt: string;
  isLoading: boolean;
  error: string | null;
}

const LoadingIndicator: React.FC = () => {
    // Start progress at a cleaner initial state
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("Khởi tạo...");

    // Define the sequence of steps for the loading process
    const loadingSteps = [
        { text: "Bắt đầu quá trình phân tích...", progress: 10, delay: 200 },
        { text: "Đang phân tích cấu trúc tài liệu...", progress: 25, delay: 800 },
        { text: "Xác định các yếu tố và biến số chính...", progress: 50, delay: 1500 },
        { text: "Xây dựng prompt tối ưu dựa trên phân tích...", progress: 80, delay: 2000 },
        { text: "Hoàn tất và chuẩn bị hiển thị...", progress: 95, delay: 1200 },
    ];

    useEffect(() => {
        // Use a ref to track if the component is mounted. This is a safe way to
        // prevent state updates after the component has been unmounted.
        const isMounted = { current: true };

        const runLoadingSequence = async () => {
            // Iterate through each step of the loading sequence
            for (const step of loadingSteps) {
                // Wait for the duration specified by the step's delay
                await new Promise(resolve => setTimeout(resolve, step.delay));

                // If the component has unmounted during the delay, stop the sequence
                if (!isMounted.current) {
                    return;
                }
                
                // Update the progress bar and status text
                setProgress(step.progress);
                setStatusText(step.text);
            }
        };

        // Start the loading animation
        runLoadingSequence();

        // Cleanup function: This is called when the component unmounts
        return () => {
            isMounted.current = false;
        };
    }, []); // The empty dependency array ensures this effect runs only once on mount.

    return (
        <div className="flex flex-col items-center justify-center h-full w-full text-center p-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">AI đang làm việc...</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 w-full max-w-md min-h-[2em]">{statusText}</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-blue-500 to-teal-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    role="progressbar"
                    aria-label="Tiến trình phân tích"
                ></div>
            </div>
        </div>
    );
};


export const OutputSection: React.FC<OutputSectionProps> = ({ prompt, isLoading, error }) => {
  const [editablePrompt, setEditablePrompt] = useState(prompt);
  const [isEditing, setIsEditing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setEditablePrompt(prompt);
    if(prompt) {
      setIsEditing(false);
    }
  }, [prompt]);

  const handleCopy = () => {
    if (!editablePrompt) return;
    navigator.clipboard.writeText(editablePrompt).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }, (err) => {
      console.error('Không thể sao chép văn bản: ', err);
      alert('Không thể sao chép vào clipboard.');
    });
  };

  const handleDownload = () => {
    const blob = new Blob([editablePrompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-prompt.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg w-full" role="alert">
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        </div>
      );
    }

    if (!prompt && !isLoading) {
      return (
        <div className="flex items-center justify-center h-full text-center">
          <p className="text-gray-500 dark:text-gray-500">Prompt được tạo sẽ xuất hiện ở đây sau khi bạn cung cấp nội dung và nhấn "Tạo Prompt".</p>
        </div>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Prompt đã tạo</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              title={copySuccess ? "Đã sao chép!" : "Sao chép"}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!editablePrompt}
            >
              <CopyIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              title="Tải xuống (.txt)"
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!editablePrompt}
            >
              <DownloadIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleEditToggle}
              title={isEditing ? "Lưu" : "Chỉnh sửa"}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!editablePrompt}
            >
              {isEditing ? <SaveIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" /> : <EditIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <textarea
          className={`w-full flex-grow bg-gray-50 dark:bg-gray-900 border rounded-lg p-4 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none min-h-[300px] sm:min-h-[310px]`}
          value={editablePrompt}
          onChange={(e) => setEditablePrompt(e.target.value)}
          readOnly={!isEditing}
          placeholder="Prompt được tạo sẽ xuất hiện ở đây..."
        />
        {copySuccess && <div className="text-green-600 dark:text-green-400 text-sm mt-2 text-right animate-pulse">Đã sao chép vào clipboard!</div>}
        
        {editablePrompt && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 text-center">Sử dụng prompt này với:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                    href="https://chat.openai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
                >
                    <ChatGptIcon className="w-5 h-5 mr-2" />
                    ChatGPT
                </a>
                <a
                    href="https://gemini.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
                >
                    <GeminiIcon className="w-5 h-5 mr-2" />
                    Gemini
                </a>
                <a
                    href="https://x.com/grok"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
                >
                    <GrokIcon className="w-5 h-5 mr-2" />
                    Grok
                </a>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 flex flex-col h-full border border-gray-200 dark:border-gray-700">
      {renderContent()}
    </div>
  );
};