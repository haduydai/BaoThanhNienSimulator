
export const decodeHTML = (html: string): string => {
    if (!html) return '';
    // Nếu chuỗi không chứa ký tự '&' thì không có entity nào cần giải mã
    if (!html.includes('&')) return html;

    try {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    } catch {
        // Fallback giải mã thủ công nếu chạy ngoài môi trường DOM
        return html
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&apos;/g, "'")
            .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
            .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    }
};

export const decodeHTMLEntities = decodeHTML;
export default decodeHTML;

