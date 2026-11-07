import { XMLParser } from 'fast-xml-parser';

export interface NewsArticle {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    description: string;
    thumbnail: string;
    category: string;
}

export const RSS_FEEDS: Record<string, string> = {
    'trang-chu': 'https://thanhnien.vn/rss/home.rss',
    'thoi-su': 'https://thanhnien.vn/rss/thoi-su.rss',
    'the-gioi': 'https://thanhnien.vn/rss/the-gioi.rss',
    'kinh-te': 'https://thanhnien.vn/rss/kinh-te.rss',
    'doi-song': 'https://thanhnien.vn/rss/doi-song.rss',
    'giai-tri': 'https://thanhnien.vn/rss/giai-tri.rss',
    'the-thao': 'https://thanhnien.vn/rss/the-thao.rss',
    'giao-duc': 'https://thanhnien.vn/rss/giao-duc.rss',
    'suc-khoe': 'https://thanhnien.vn/rss/suc-khoe.rss',
    'xe': 'https://thanhnien.vn/rss/xe.rss',
    'cong-nghe': 'https://thanhnien.vn/rss/cong-nghe.rss',
    'du-lich': 'https://thanhnien.vn/rss/du-lich.rss',
};

export const CATEGORY_LABELS: Record<string, string> = {
    'trang-chu': 'Trang chủ',
    'thoi-su': 'Thời sự',
    'the-gioi': 'Thế giới',
    'kinh-te': 'Kinh tế',
    'doi-song': 'Đời sống',
    'giai-tri': 'Giải trí',
    'the-thao': 'Thể thao',
    'giao-duc': 'Giáo dục',
    'suc-khoe': 'Sức khỏe',
    'xe': 'Xe',
    'cong-nghe': 'Công nghệ',
    'du-lich': 'Du lịch',
};

const DEFAULT_IMAGE = 'https://thanhnien-static.mediacdn.vn/thanhnien.vn/image/logo_tn.png';

function extractText(val: unknown): string {
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (val && typeof val === 'object') {
        const obj = val as Record<string, unknown>;
        if (typeof obj['__cdata'] === 'string') return obj['__cdata'];
        if (typeof obj['#text'] === 'string') return obj['#text'];
    }
    return '';
}

function getThumbnail(item: Record<string, unknown>, desc: string): string {
    const match = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match?.[1]) return match[1];

    const media = item['media:content'] as Record<string, unknown> | undefined;
    if (media) {
        const url = (media['@_url'] ?? media['url']) as string | undefined;
        if (url) return url;
    }

    const enc = item['enclosure'] as Record<string, unknown> | undefined;
    if (enc) {
        const url = (enc['@_url'] ?? enc['url']) as string | undefined;
        if (url) return url;
    }

    return DEFAULT_IMAGE;
}

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    isArray: (name) => name === 'item' || name === 'entry',
    trimValues: true,
});

function parseArticles(xmlString: string, category: string): NewsArticle[] {
    const parsed = parser.parse(xmlString) as {
        rss?: { channel?: { item?: Record<string, unknown>[] } };
        feed?: { entry?: Record<string, unknown>[] };
    };

    const items = parsed?.rss?.channel?.item ?? parsed?.feed?.entry ?? [];
    if (!items.length) return [];

    return items.map((item, idx) => {
        const link = extractText(item['link']) || extractText(item['guid']) || '';
        const id = extractText(item['guid']) || link || `art-${category}-${idx}`;
        const title = extractText(item['title']);
        const rawDesc = extractText(item['description'] ?? item['content:encoded'] ?? '');
        const thumbnail = getThumbnail(item, rawDesc);
        const description = rawDesc.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

        let pubDate = extractText(item['pubDate']);
        try {
            const date = new Date(pubDate);
            if (!isNaN(date.getTime())) {
                pubDate = date.toISOString();
            }
        } catch {
            pubDate = new Date().toISOString();
        }

        return {
            id,
            title,
            link,
            pubDate,
            description,
            thumbnail,
            category,
        };
    }).filter(a => a.title.trim().length > 0);
}

async function fetchXml(slug: string): Promise<string> {
    const feedUrl = RSS_FEEDS[slug];
    if (!feedUrl) throw new Error('Chuyên mục không hợp lệ');

    // Ưu tiên dev proxy
    try {
        const proxyUrl = `/api-tn-rss/rss/${slug === 'trang-chu' ? 'home' : slug}.rss`;
        const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
            const text = await res.text();
            if (text.includes('<rss') || text.includes('<feed')) return text;
        }
    } catch {}

    // Fallback qua allorigins raw
    try {
        const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`, {
            signal: AbortSignal.timeout(6000),
        });
        if (res.ok) {
            const text = await res.text();
            if (text.includes('<rss') || text.includes('<feed')) return text;
        }
    } catch {}

    // Fallback qua codetabs
    try {
        const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(feedUrl)}`, {
            signal: AbortSignal.timeout(6000),
        });
        if (res.ok) {
            const text = await res.text();
            if (text.includes('<rss') || text.includes('<feed')) return text;
        }
    } catch {}

    // Direct fetch
    try {
        const res = await fetch(feedUrl, { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
            const text = await res.text();
            if (text.includes('<rss') || text.includes('<feed')) return text;
        }
    } catch {}

    throw new Error('Lỗi tải RSS');
}

export async function fetchRssFeed(categorySlug: string): Promise<NewsArticle[]> {
    try {
        const xml = await fetchXml(categorySlug);
        const data = parseArticles(xml, categorySlug);
        if (data.length > 0) return data;
    } catch (e) {
        console.warn('Lỗi fetch RSS:', categorySlug, e);
    }
    return getBackupNews(categorySlug);
}

export async function fetchMultipleFeeds(categorySlugs: string[] = ['trang-chu']): Promise<NewsArticle[]> {
    if (categorySlugs.includes('trang-chu')) {
        const homeList = await fetchRssFeed('trang-chu');
        if (homeList.length >= 8) return homeList;
    }

    const results = await Promise.allSettled(categorySlugs.map(s => fetchRssFeed(s)));
    const all: NewsArticle[] = [];
    results.forEach(r => {
        if (r.status === 'fulfilled') all.push(...r.value);
    });

    const uniqueMap = new Map<string, NewsArticle>();
    all.forEach(item => uniqueMap.set(item.id, item));
    const list = Array.from(uniqueMap.values());

    list.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    return list.length ? list : getBackupNews('trang-chu');
}

function getBackupNews(category: string): NewsArticle[] {
    const now = new Date();
    return [
        {
            id: 'demo-1',
            title: 'Syria sắp điều hàng ngàn binh sĩ chống Houthi?',
            link: 'https://thanhnien.vn/thoi-su.htm',
            pubDate: new Date(now.getTime() - 15 * 60000).toISOString(),
            description: 'Một số quan chức Yemen tiết lộ rằng hàng ngàn binh sĩ Syria chuẩn bị được triển khai tới Ả Rập Xê Út và Yemen để hỗ trợ quốc tế.',
            thumbnail: 'https://images2.thanhnien.vn/zoom/600_315/528068263637045248/2026/11/7/binh-si-o-yemen-1794062699575793627091-11-0-761-1200-crop-17940627731581360967239.jpg',
            category: category || 'thoi-su'
        },
        {
            id: 'demo-2',
            title: 'Kinh tế Việt Nam tiếp tục đà tăng trưởng tích cực trong quý 4',
            link: 'https://thanhnien.vn/kinh-te.htm',
            pubDate: new Date(now.getTime() - 40 * 60000).toISOString(),
            description: 'Các chỉ số xuất nhập khẩu và thu hút đầu tư nước ngoài FDI đều ghi nhận mức tăng trưởng ấn tượng so với cùng kỳ.',
            thumbnail: 'https://images2.thanhnien.vn/zoom/600_315/528068263637045248/2024/3/29/kinh-te-viet-nam-1711681283626154562096.jpg',
            category: 'kinh-te'
        },
        {
            id: 'demo-3',
            title: 'Tuyển Việt Nam tích cực chuẩn bị cho các giải đấu quốc tế quan trọng',
            link: 'https://thanhnien.vn/the-thao.htm',
            pubDate: new Date(now.getTime() - 80 * 60000).toISOString(),
            description: 'Ban huấn luyện đưa ra nhiều giáo án rèn thể lực và chiến thuật mới nhằm tăng cường khả năng tranh chấp.',
            thumbnail: 'https://images2.thanhnien.vn/zoom/600_315/528068263637045248/2024/1/15/doi-tuyen-viet-nam-1705307524953163353521.jpg',
            category: 'the-thao'
        },
        {
            id: 'demo-4',
            title: 'Xu hướng ứng dụng Trí tuệ nhân tạo (AI) trong giáo dục và đời sống số',
            link: 'https://thanhnien.vn/cong-nghe.htm',
            pubDate: new Date(now.getTime() - 120 * 60000).toISOString(),
            description: 'Các giải pháp công nghệ mới giúp cá nhân hoá trải nghiệm học tập và hỗ trợ đắc lực cho công việc của giới trẻ.',
            thumbnail: 'https://images2.thanhnien.vn/zoom/600_315/528068263637045248/2024/4/12/ai-cong-nghe-1712918815124110398048.jpg',
            category: 'cong-nghe'
        }
    ];
}
