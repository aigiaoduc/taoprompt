import mammoth from 'mammoth';

interface Mammoth {
  extractRawText: ({ arrayBuffer }: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string; messages: any[] }>;
}

export const readDocxFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = async (event) => {
        if (event.target && event.target.result) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          try {
            const result = await (mammoth as Mammoth).extractRawText({ arrayBuffer });
            resolve(result.value); // The raw text
          } catch (error) {
            console.error("Lỗi khi xử lý tệp DOCX bằng Mammoth:", error);
            reject(new Error("Đã xảy ra lỗi khi xử lý tệp .docx."));
          }
        } else {
          reject(new Error("Không thể đọc tệp."));
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
};
