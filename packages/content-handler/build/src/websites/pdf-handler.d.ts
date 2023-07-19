import { ContentHandler, PreHandleResult } from '../content-handler';
export declare class PdfHandler extends ContentHandler {
    constructor();
    shouldPreHandle(url: string): boolean;
    preHandle(url: string): Promise<PreHandleResult>;
}
