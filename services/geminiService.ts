import { GoogleGenAI } from "@google/genai";

/**
 * Phân tích văn bản đầu vào và tạo ra một prompt tối ưu bằng Gemini API.
 * Prompt được tạo ra có thể được sử dụng để hướng dẫn một AI khác tạo ra nội dung tương tự.
 *
 * @param inputText Nội dung văn bản gốc cần phân tích.
 * @param apiKey API Key của Google AI Studio do người dùng cung cấp.
 * @returns Một promise phân giải ra chuỗi prompt đã được tạo.
 * @throws Ném ra lỗi nếu lệnh gọi API thất bại hoặc đầu vào không hợp lệ.
 */
export const generatePromptTemplate = async (inputText: string, apiKey: string): Promise<string> => {
  if (!apiKey || !apiKey.trim()) {
    throw new Error("Vui lòng nhập API Key của Google AI Studio.");
  }
  if (!inputText || !inputText.trim()) {
    throw new Error("Nội dung đầu vào không được để trống.");
  }

  // Khởi tạo client GoogleGenAI với key của người dùng cho mỗi yêu cầu.
  const ai = new GoogleGenAI({ apiKey });

  // Chỉ dẫn hệ thống để định hướng mô hình hoạt động một cách thông minh và tự chủ.
  const getSystemInstruction = () => `
Bạn là một chuyên gia phân tích tài liệu và kỹ sư prompt AI. Nhiệm vụ của bạn là đọc một tài liệu gốc và tạo ra một "prompt tối ưu" duy nhất. Prompt này sẽ được người dùng cuối đưa cho một AI khác (ví dụ: Gemini, GPT-4) để tạo ra một tài liệu mới tương tự.

**QUY TRÌNH BẮT BUỘC:**

1.  **PHÂN TÍCH SÂU:**
    *   Đọc kỹ tài liệu gốc.
    *   Xác định mục đích, đối tượng, cấu trúc (tiêu đề, đề mục), văn phong (trang trọng, thân mật), và các định dạng đặc biệt (danh sách, bảng biểu).
    *   Phân biệt rõ ràng giữa **nội dung cố định (boilerplate)** và **thông tin thay đổi (biến số)**. Nội dung cố định là những phần văn bản sẽ luôn xuất hiện trong mọi tài liệu tương tự. Biến số là những thông tin cốt lõi mà người dùng sẽ phải cung cấp (ví dụ: tên dự án, ngày tháng, tên người nhận, số liệu cụ thể).
    *   **Tối thiểu hóa biến số:** Chỉ xác định những biến số thực sự cần thiết. Nếu một thông tin có thể được AI tự suy luận hoặc tìm kiếm, đừng biến nó thành một biến số.

2.  **SỬ DỤNG TƯ DUY TÌM KIẾM:**
    *   Xác định các chủ đề hoặc khái niệm trong tài liệu mà AI có thể tự tìm kiếm trên Google để làm phong phú nội dung. Ví dụ: nếu tài liệu là một giáo án về "quang hợp", AI có thể được chỉ thị tự tìm kiếm thông tin chi tiết về quá trình quang hợp.
    *   Tích hợp các lệnh tìm kiếm này vào prompt.

3.  **TẠO PROMPT CÓ CẤU TRÚC (BẮT BUỘC):**
    *   Prompt bạn tạo ra PHẢI có 2 phần rõ rệt: \`[ PHẦN CẤU HÌNH CHO NGƯỜI DÙNG ]\` và \`[ PHẦN HƯỚNG DẪN CHO AI ]\`.

    *   **\`[ PHẦN CẤU HÌNH CHO NGƯỜI DÙNG ]\`:**
        *   Phần này phải nằm ở trên cùng.
        *   Liệt kê tất cả các **biến số tối thiểu** bạn đã xác định ở bước 1.
        *   Mỗi biến số phải ở định dạng: \`Tên_Biến_Dễ_Hiểu = "[Nhập giá trị ở đây]"\`
        *   Ví dụ:
            \`\`\`
            [ PHẦN CẤU HÌNH CHO NGƯỜI DÙNG ]
            // Vui lòng điền các thông tin dưới đây:
            Ten_Bai_Day = "[Nhập tên bài dạy]"
            So_Tiet_Hoc = "[Nhập số tiết]"
            \`\`\`

    *   **\`[ PHẦN HƯỚNG DẪN CHO AI ]\`:**
        *   Phần này chứa logic chính cho AI thực thi.
        *   Bắt đầu bằng việc xác định vai trò của AI (ví dụ: "Bạn là một giáo viên chuyên soạn giáo án...").
        *   Hướng dẫn AI sử dụng các biến số từ phần cấu hình.
        *   Tích hợp **nội dung cố định (boilerplate)** trực tiếp vào đây.
        *   Chèn các lệnh yêu cầu AI **tự tìm kiếm thông tin** nếu cần.
        *   Chỉ định rõ cấu trúc, định dạng và văn phong của tài liệu đầu ra.

**ĐẦU RA:**
*   Chỉ trả về chuỗi prompt hoàn chỉnh.
*   Không thêm bất kỳ lời giải thích, ghi chú hay câu giới thiệu nào.
*   Toàn bộ đầu ra phải tuân thủ nghiêm ngặt cấu trúc 2 phần đã nêu.
`;

  const userContent = `Vui lòng phân tích văn bản sau và tạo ra một prompt template tối ưu theo đúng quy trình và cấu trúc đã hướng dẫn:\n\n---\n\n${inputText}`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userContent,
      config: {
        systemInstruction: getSystemInstruction(),
        tools: [{googleSearch: {}}],
      },
    });

    const generatedPrompt = response.text;
    
    if (!generatedPrompt) {
        throw new Error("API đã trả về một phản hồi trống.");
    }

    return generatedPrompt.trim();

  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);

    if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('api key not valid')) {
             throw new Error("API Key không hợp lệ. Vui lòng kiểm tra lại và đảm bảo key có quyền truy cập Gemini API.");
        }
        
        if (errorMessage.includes('quota') || errorMessage.includes('resource has been exhausted')) {
            throw new Error("Hạn ngạch (quota) của bạn đã hết. Vui lòng thử lại sau hoặc kiểm tra tài khoản Google AI Studio của bạn.");
        }

        if (errorMessage.includes('500') || errorMessage.includes('503') || errorMessage.includes('internal error')) {
            throw new Error("Máy chủ của Google đang gặp sự cố tạm thời. Vui lòng thử lại sau ít phút.");
        }
        
        if (errorMessage.includes('blocked')) {
            throw new Error("Yêu cầu của bạn đã bị chặn do vi phạm chính sách an toàn. Vui lòng điều chỉnh nội dung đầu vào.");
        }

        // Lỗi chung kèm theo thông báo gốc
        throw new Error(`Tạo prompt thất bại: ${error.message}`);
    }

    // Lỗi dự phòng cho các đối tượng không phải là Error
    throw new Error("Đã xảy ra lỗi không xác định khi giao tiếp với Gemini API.");
  }
};
