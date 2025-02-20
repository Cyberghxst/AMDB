export interface InstagramResponse {
    results_number: number;
    url_list: string[];
    post_info: {
        owner_username: string;
        owner_fullname: string;
        is_verified: boolean;
        is_private: boolean;
        likes: number;
        is_ad: boolean;
        caption: string;
    };
    media_details: {
        type: string;
        dimensions: {
            height: number;
            width: number;
        };
        url: string;
        video_view_count?: number;
        thumbnail?: string;
    }[];
}
export interface InstagramError {
    error: string;
}
export declare function instagramGetUrl(url_media: string): Promise<InstagramResponse>;
