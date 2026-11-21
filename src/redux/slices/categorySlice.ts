
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    categories: [
        {
            id: 1,
            name: "Chính trị",
            link: "/chinh-tri",
            items: [
                { name: "Xã hội", link: "/chinh-tri/xa-hoi" },
                { name: "Vấn đề nóng trong ngày", link: "/chinh-tri/van-de-nong" },
                { name: "Thời luận", link: "/chinh-tri/thoi-luan" },
            ],
        },
        {
            id: 2,
            name: "Thế giới",
            link: "/the-gioi",
            items: [
                { name: "Phân tích", link: "/the-gioi/phan-tich" },
                { name: "Điểm nóng", link: "/the-gioi/diem-nong" },
                { name: "Liên động - Xung đột", link: "/the-gioi/xung-dot" },
                { name: "Chuyện được kể", link: "/the-gioi/chuyen-duoc-ke" },
                { name: "Phóng sự / Góc nhìn", link: "/the-gioi/goc-nhin" },
            ],
        },
        {
            id: 3,
            name: "Thời sự",
            link: "/thoi-su",
            items: [
                { name: "Kinh tế - Xã hội", link: "/thoi-su/kinh-te-xa-hoi" },
                { name: "Chính trị", link: "/thoi-su/chinh-tri" },
                { name: "Giáo dục", link: "/thoi-su/giao-duc" },
                { name: "Hồ sơ", link: "/thoi-su/ho-so" },
            ],
        },
        {
            id: 4,
            name: "Kinh tế",
            link: "/kinh-te",
            items: [
                { name: "Kinh tế Việt Nam", link: "/kinh-te/viet-nam" },
                { name: "Doanh nghiệp", link: "/kinh-te/doanh-nghiep" },
                { name: "Ngân hàng", link: "/kinh-te/ngan-hang" },
                { name: "Chứng khoán", link: "/kinh-te/chung-khoan" },
            ],
        },
        {
            id: 5,
            name: "Đời sống",
            link: "/doi-song",
            items: [
                { name: "Thanh Niên và Tôi", link: "/doi-song/thanh-nien-va-toi" },
                { name: "Thế giới sống", link: "/doi-song/the-gioi-song" },
                { name: "Người sống đẹp", link: "/doi-song/nguoi-song-dep" },
                { name: "Gia đình", link: "/doi-song/gia-dinh" },
            ],
        },
        {
            id: 6,
            name: "Sức khỏe",
            link: "/suc-khoe",
            items: [
                { name: "Khỏe đẹp mỗi ngày", link: "/suc-khoe/khoe-dep" },
                { name: "Làm đẹp", link: "/suc-khoe/lam-dep" },
                { name: "Giới tính", link: "/suc-khoe/gioi-tinh" },
                { name: "Y tế thông minh", link: "/suc-khoe/y-te" },
            ],
        },
        {
            id: 7,
            name: "Giải trí",
            link: "/giai-tri",
            items: [
                { name: "Showbiz - Văn hóa - Âm nhạc", link: "/giai-tri/showbiz" },
                { name: "Truyền hình", link: "/giai-tri/truyen-hinh" },
                { name: "Câu chuyện nghệ sĩ", link: "/giai-tri/nghe-si" },
                { name: "Games - Đẹp", link: "/giai-tri/games" },
            ],
        },
        {
            id: 8,
            name: "Giáo dục",
            link: "/giao-duc",
            items: [
                { name: "Tuyển sinh", link: "/giao-duc/tuyen-sinh" },
                { name: "Du học - Học bổng", link: "/giao-duc/du-hoc" },
                { name: "Du học", link: "/giao-duc/du-hoc" },
                { name: "Nhà trường", link: "/giao-duc/nha-truong" },
            ],
        },
    ],

    utilities: [
        { id: 1, name: "Chào ngày mới", icon: "fa-sun", link: "/chao-ngay-moi" },
        { id: 2, name: "Tin 24h", icon: "fa-clock", link: "/tin-24h" },
        { id: 3, name: "Tin thị trường", icon: "fa-chart-column", link: "/thi-truong" },
        { id: 4, name: "Tin 360", icon: "fa-globe", link: "/tin-360" },
        { id: 5, name: "Video", icon: "fa-video", link: "/video" },
        { id: 6, name: "Magazine", icon: "fa-book-open", link: "/magazine" },
    ],

    quickLinks: [
        { id: 1, name: "Tiện ích", icon: "fa-gift", link: "/tien-ich" },
        { id: 2, name: "Bạn cần biết", icon: "fa-lightbulb", link: "/ban-can-biet" },
        { id: 3, name: "Liên hệ", icon: "fa-phone", link: "/lien-he" },
        { id: 4, name: "Thông tin tòa soạn", icon: "fa-building", link: "/toa-soan" },
        { id: 5, name: "Liên hệ quảng cáo", icon: "fa-rectangle-ad", link: "/quang-cao" },
    ],
};

const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
});
export default categorySlice.reducer;
