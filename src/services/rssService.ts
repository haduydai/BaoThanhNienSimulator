
import { XMLParser } from 'fast-xml-parser';
import { decodeHTML, decodeHTMLEntities } from '../utils/decodeHTML';

export { decodeHTML, decodeHTMLEntities };

export interface NewsArticle {
    id: string;           // GUID hoặc link bài viết
    title: string;        // Tiêu đề bài viết
    link: string;         // Link gốc bài viết trên thanhnien.vn
    pubDate: string;      // Ngày xuất bản ISO
    description: string;  // Tóm tắt nội dung thuần text
    thumbnail: string;    // URL ảnh đại diện
    category: string;     // Chuyên mục slug
}
//12 chuyên mục chính thức Báo Thanh Niên
export const RSS_FEEDS: Record<string, string> = {
    'trang-chu':  'https://thanhnien.vn/rss/home.rss',
    'thoi-su':    'https://thanhnien.vn/rss/thoi-su.rss',
    'the-gioi':   'https://thanhnien.vn/rss/the-gioi.rss',
    'kinh-te':    'https://thanhnien.vn/rss/kinh-te.rss',
    'doi-song':   'https://thanhnien.vn/rss/doi-song.rss',
    'giai-tri':   'https://thanhnien.vn/rss/giai-tri.rss',
    'the-thao':   'https://thanhnien.vn/rss/the-thao.rss',
    'giao-duc':   'https://thanhnien.vn/rss/giao-duc.rss',
    'suc-khoe':   'https://thanhnien.vn/rss/suc-khoe.rss',
    'xe':         'https://thanhnien.vn/rss/xe.rss',
    'cong-nghe':  'https://thanhnien.vn/rss/cong-nghe.rss',
    'du-lich':    'https://thanhnien.vn/rss/du-lich.rss',
};

export const CATEGORY_LABELS: Record<string, string> = {
    'trang-chu':  'Trang chủ',
    'thoi-su':    'Thời sự',
    'the-gioi':   'Thế giới',
    'kinh-te':    'Kinh tế',
    'doi-song':   'Đời sống',
    'giai-tri':   'Giải trí',
    'the-thao':   'Thể thao',
    'giao-duc':   'Giáo dục',
    'suc-khoe':   'Sức khỏe',
    'xe':         'Xe',
    'cong-nghe':  'Công nghệ',
    'du-lich':    'Du lịch',
};

// Ảnh đại diện mặc định
const DEFAULT_THUMBNAIL = 'https://thanhnien-static.mediacdn.vn/thanhnien.vn/image/logo_tn.png';

//Chuẩn hóa và so sánh ID ,Link của bài viết với param từ URL
export function isMatchingArticle(article: NewsArticle, targetId: string): boolean {
    if (!article || !targetId) return false;

    const normalize = (str: string): string => {
        try {
            return decodeURIComponent(str).trim().toLowerCase().replace(/\/+$/, '');
        } catch {
            return str.trim().toLowerCase().replace(/\/+$/, '');
        }
    };

    const targetNorm = normalize(targetId);
    const targetRaw = targetId.trim().toLowerCase().replace(/\/+$/, '');

    const candidates = [
        article.id,
        article.link,
        normalize(article.id),
        normalize(article.link),
        article.id.trim().toLowerCase().replace(/\/+$/, ''),
        article.link.trim().toLowerCase().replace(/\/+$/, ''),
    ];

    if (candidates.some((c) => c === targetNorm || c === targetRaw)) {
        return true;
    }

    // So sánh đuôi slug
    try {
        const getSlug = (u: string) => {
            const parts = u.split('/');
            return parts[parts.length - 1]?.split('?')[0] || '';
        };
        const targetSlug = getSlug(targetNorm);
        const articleSlug = getSlug(normalize(article.link || article.id));
        if (targetSlug && articleSlug && targetSlug === articleSlug) {
            return true;
        }
    } catch {
        // bỏ qua
    }

    return false;
}

 //Trích xuất chuỗi giá trị XML là string hoặc object chứa CDATA
function toText(val: unknown): string {
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (val && typeof val === 'object') {
        const obj = val as Record<string, unknown>;
        if (typeof obj['__cdata'] === 'string') return obj['__cdata'];
        if (typeof obj['#text'] === 'string') return obj['#text'];
    }
    return '';
}
// Lấy URL ảnh đại diện từ item XML hoặc nội dung description
function extractThumbnail(item: Record<string, unknown>, rawDesc: string): string {

    const imgMatch = rawDesc.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1]) {
        return imgMatch[1];
    }

    const mediaContent = item['media:content'] as Record<string, unknown> | undefined;
    if (mediaContent) {
        const url = (mediaContent['@_url'] ?? mediaContent['url']) as string | undefined;
        if (url) return url;
    }

    const enclosure = item['enclosure'] as Record<string, unknown> | undefined;
    if (enclosure) {
        const url = (enclosure['@_url'] ?? enclosure['url']) as string | undefined;
        if (url) return url;
    }

    return DEFAULT_THUMBNAIL;
}

    // Parser XML cấu hình , auto xử lý CDATA và namespaces
const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    isArray: (name) => name === 'item' || name === 'entry',
    trimValues: true,
});


 //Chuyển đổi dữ liệu thô sang mảng NewsArticle chuẩn

function parseXmlToArticles(xmlString: string, categorySlug: string): NewsArticle[] {
    const result = parser.parse(xmlString) as {
        rss?: { channel?: { item?: Record<string, unknown>[] } };
        feed?: { entry?: Record<string, unknown>[] };
    };

    const rawItems: Record<string, unknown>[] =
        result?.rss?.channel?.item ??
        result?.feed?.entry ??
        [];

    if (rawItems.length === 0) return [];

    return rawItems.map((item, idx) => {
        const link = toText(item['link']) || toText(item['guid']) || '';
        const guid = toText(item['guid']) || link || `tn-${categorySlug}-${idx}-${Date.now()}`;
        const rawTitle = toText(item['title']);
        const rawDesc = toText(item['description'] ?? item['content:encoded'] ?? '');

        const thumbnail = extractThumbnail(item, rawDesc);

        const cleanDesc = rawDesc
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const pubDateRaw = toText(item['pubDate']);
        let pubDate = pubDateRaw;
        try {
            const parsedDate = new Date(pubDateRaw);
            if (!isNaN(parsedDate.getTime())) {
                pubDate = parsedDate.toISOString();
            }
        } catch {
            pubDate = new Date().toISOString();
        }

        return {
            id: guid,
            title: decodeHTMLEntities(rawTitle),
            link: decodeHTMLEntities(link),
            pubDate,
            description: decodeHTMLEntities(cleanDesc),
            thumbnail,
            category: categorySlug,
        };
    }).filter(article => article.title.length > 0);
}
 // 1. Vite Proxy  (/api-tn-rss)
 // 2. allorigins raw proxy
 // 3. codetabs proxy
 /// 4. direct fetch

async function fetchXmlString(slug: string): Promise<string> {
    const originalUrl = RSS_FEEDS[slug];
    if (!originalUrl) throw new Error(`Chuyên mục "${slug}" không tồn tại.`);

    // Tầng 1: Vite Proxy (/api-tn-rss/rss/...)
    try {
        const localProxyUrl = `/api-tn-rss/rss/${slug === 'trang-chu' ? 'home' : slug}.rss`;
        const res = await fetch(localProxyUrl, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
            const text = await res.text();
            if (text.includes('<rss') || text.includes('<feed')) {
                return text;
            }
        }
    } catch {
    }

    // Tầng 2: allorigins.win (chế độ /raw trả về XML trực tiếp)
    try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(originalUrl)}`;
        const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
        if (res.ok) {
            const text = await res.text();
            if (text.includes('<rss') || text.includes('<feed')) {
                return text;
            }
        }
    } catch {
    }

    //Tầng 3: codetabs proxy
    try {
        const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(originalUrl)}`;
        const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
        if (res.ok) {
            const text = await res.text();
            if (text.includes('<rss') || text.includes('<feed')) {
                return text;
            }
        }
    } catch {
    }

    //Tầng 4:Fetch trực tiếp
    try {
        const res = await fetch(originalUrl, { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
            const text = await res.text();
            if (text.includes('<rss') || text.includes('<feed')) {
                return text;
            }
        }
    } catch {
        //nỏ qua
    }

    throw new Error(`Không thể kết nối đến máy chủ tin tức cho chuyên mục: ${slug}`);
}

 // Fetch RSS cho 1 Feedc cụ thể
export async function fetchRssFeed(categorySlug: string): Promise<NewsArticle[]> {
    try {
        const xml = await fetchXmlString(categorySlug);
        const articles = parseXmlToArticles(xml, categorySlug);
        if (articles.length > 0) return articles;
    } catch (err) {
        console.warn(`[rssService] Lỗi tải tin ${categorySlug}:`, err);
    }

    // tải thất bại hoặc rỗng->trả về dữ liệu mẫu thực tế dự phòng
    return getFallbackArticles(categorySlug);
}
 //fetch tổng hợp nhiều chuyên mục (cho Trang chủ)
export async function fetchMultipleFeeds(
    categorySlugs: string[] = ['trang-chu']
): Promise<NewsArticle[]> {
    //có trang-chu ưu tiên tải feed trang-chu
    if (categorySlugs.includes('trang-chu')) {
        const homeArticles = await fetchRssFeed('trang-chu');
        if (homeArticles.length >= 10) {
            return homeArticles;
        }
    }
    const results = await Promise.allSettled(
        categorySlugs.map((slug) => fetchRssFeed(slug))
    );

    const articles: NewsArticle[] = [];
    results.forEach((res) => {
        if (res.status === 'fulfilled') {
            articles.push(...res.value);
        }
    });

    //=lọc trùng ID
    const unique = Array.from(new Map(articles.map(a => [a.id, a])).values());

    //Sắp xếp bài mới nhất trước
    unique.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return unique.length > 0 ? unique : getFallbackArticles('trang-chu');
}

export function getFallbackArticles(category: string): NewsArticle[] {
    const now = new Date();
    return [
        {
            id: 'tn-fb-1',
            title: 'Syria sắp điều hàng ngàn binh sĩ chống Houthi?',
            link: 'https://thanhnien.vn/thoi-su.htm',
            pubDate: new Date(now.getTime() - 15 * 60000).toISOString(),
            description: 'Một số quan chức Yemen tiết lộ rằng hàng ngàn binh sĩ Syria chuẩn bị được triển khai tới Ả Rập Xê Út và Yemen để hỗ trợ quốc tế.',
            thumbnail: 'https://images2.thanhnien.vn/zoom/600_315/528068263637045248/2026/11/7/binh-si-o-yemen-1794062699575793627091-11-0-761-1200-crop-17940627731581360967239.jpg',
            category: category || 'thoi-su'
        },
        {
            id: 'tn-fb-2',
            title: 'Kinh tế Việt Nam tiếp tục đà tăng trưởng tích cực trong quý 4',
            link: 'https://thanhnien.vn/kinh-te.htm',
            pubDate: new Date(now.getTime() - 45 * 60000).toISOString(),
            description: 'Các chỉ số xuất nhập khẩu và thu hút đầu tư nước ngoài FDI đều ghi nhận mức tăng trưởng ấn tượng so với cùng kỳ năm trước.',
            thumbnail: 'https://images2.thanhnien.vn/zoom/600_315/528068263637045248/2024/3/29/kinh-te-viet-nam-1711681283626154562096.jpg',
            category: 'kinh-te'
        },
        {
            id: 'tn-fb-3',
            title: 'Tuyển Việt Nam tích cực chuẩn bị cho các giải đấu quốc tế quan trọng',
            link: 'https://thanhnien.vn/the-thao.htm',
            pubDate: new Date(now.getTime() - 90 * 60000).toISOString(),
            description: 'Ban huấn luyện đưa ra nhiều giáo án rèn thể lực và chiến thuật mới nhằm tăng cường khả năng tranh chấp và tính gắn kết của đội hình.',
            thumbnail: 'https://images2.thanhnien.vn/zoom/600_315/528068263637045248/2024/1/15/doi-tuyen-viet-nam-1705307524953163353521.jpg',
            category: 'the-thao'
        },
        {
            id: 'tn-fb-4',
            title: 'Xu hướng ứng dụng Trí tuệ nhân tạo (AI) trong giáo dục và đời sống số',
            link: 'https://thanhnien.vn/cong-nghe.htm',
            pubDate: new Date(now.getTime() - 150 * 60000).toISOString(),
            description: 'Các giải pháp công nghệ mới giúp cá nhân hoá trải nghiệm học tập và hỗ trợ đắc lực cho công việc của giới trẻ trong kỷ nguyên chuyển đổi số.',
            thumbnail: 'https://images2.thanhnien.vn/zoom/600_315/528068263637045248/2024/4/12/ai-cong-nghe-1712918815124110398048.jpg',
            category: 'cong-nghe'
        },
        {
            id: 'tn-fb-5',
            title: 'Khám phá những điểm du lịch sinh thái hấp dẫn dịp cuối năm',
            link: 'https://thanhnien.vn/du-lich.htm',
            pubDate: new Date(now.getTime() - 210 * 60000).toISOString(),
            description: 'Nhiều tour trải nghiệm văn hoá bản địa và hòa mình vào thiên nhiên đang thu hút đông đảo du khách trẻ đăng ký khám phá.',
            thumbnail: 'https://images2.thanhnien.vn/zoom/600_315/528068263637045248/2024/2/20/du-lich-1708415714782163984365.jpg',
            category: 'du-lich'
        },
        {
            id: 'tn-fb-6',
            title: 'Nhịp sống đô thị: Những không gian sáng tạo thu hút giới trẻ cuối tuần',
            link: 'https://thanhnien.vn/doi-song.htm',
            pubDate: new Date(now.getTime() - 300 * 60000).toISOString(),
            description: 'Các triển lãm nghệ thuật, workshop làm đồ thủ công và không gian cà phê mở mang lại năng lượng tích cực cho ngày nghỉ.',
            thumbnail: 'https://images2.thanhnien.vn/zoom/600_315/528068263637045248/2024/3/10/gioi-tre-sang-tao-1710041285324128945621.jpg',
            category: 'doi-song'
        }
    ];
}