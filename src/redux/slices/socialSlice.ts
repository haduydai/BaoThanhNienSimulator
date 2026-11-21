import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    socialLinks: [
        {
            id: 1,
            name: "YouTube",
            link: "https://www.youtube.com/channel/UCIW9cGgoRuGJnky3K3tbzNg",
            image: "https://thanhnien-static.mediacdn.vn/thanhnien.vn/image/icon_youtube_fill.svg",
        },
        {
            id: 2,
            name: "Facebook",
            link: "https://www.facebook.com/thanhnien",
            image: "https://thanhnien-static.mediacdn.vn/thanhnien.vn/image/icon_facebook_full_color.svg",
        },
        {
            id: 3,
            name: "TikTok",
            link: "https://www.tiktok.com/@baothanhnien.official",
            image: "https://thanhnien-static.mediacdn.vn/thanhnien.vn/image/Icon_Tiktok_fill.svg",
        },
        {
            id: 4,
            name: "Zalo",
            link: "https://zalo.me/2431025964363015388",
            image: "https://thanhnien-static.mediacdn.vn/thanhnien.vn/image/icon_zalo_full_color.svg",
        },
    ],
};

const socialSlice = createSlice({
    name: "social",
    initialState,
    reducers: {},
});

export default socialSlice.reducer;