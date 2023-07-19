import { ContentHandler, PreHandleResult } from '../content-handler';
export declare class PipedVideoHandler extends ContentHandler {
    PIPED_URL_MATCH: RegExp;
    constructor();
    getYoutubeVideoId: (url: string) => string;
    escapeTitle: (title: string) => any;
    shouldPreHandle(url: string): boolean;
    preHandle(url: string): Promise<PreHandleResult>;
}
