import { ContentHandler, PreHandleResult } from '../content-handler';
export declare const getYoutubeVideoId: (url: string) => string;
export declare const getYoutubePlaylistId: (url: string) => string;
export declare const escapeTitle: (title: string) => any;
export declare class YoutubeHandler extends ContentHandler {
    constructor();
    shouldPreHandle(url: string): boolean;
    preHandle(url: string): Promise<PreHandleResult>;
}
