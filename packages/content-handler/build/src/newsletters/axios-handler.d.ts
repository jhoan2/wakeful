import { ContentHandler } from '../content-handler';
export declare class AxiosHandler extends ContentHandler {
    constructor();
    shouldPreParse(url: string, dom: Document): boolean;
    preParse(url: string, dom: Document): Promise<Document>;
}
