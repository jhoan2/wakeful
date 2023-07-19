import { Browser } from 'puppeteer-core';
import { ContentHandler, PreHandleResult } from '../content-handler';
export declare class TwitterHandler extends ContentHandler {
    constructor();
    shouldPreHandle(url: string): boolean;
    preHandle(url: string, browser: Browser): Promise<PreHandleResult>;
}
