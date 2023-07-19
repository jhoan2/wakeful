"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ContentHandler = exports.generateUniqueUrl = exports.FAKE_URL_PREFIX = void 0;
var addressparser_1 = require("addressparser");
var axios_1 = require("axios");
var linkedom_1 = require("linkedom");
var uuid_1 = require("uuid");
exports.FAKE_URL_PREFIX = 'https://omnivore.app/no_url?q=';
var generateUniqueUrl = function () { return exports.FAKE_URL_PREFIX + (0, uuid_1.v4)(); };
exports.generateUniqueUrl = generateUniqueUrl;
var ContentHandler = /** @class */ (function () {
    function ContentHandler() {
        this.senderRegex = new RegExp(/NEWSLETTER_SENDER_REGEX/);
        this.urlRegex = new RegExp(/NEWSLETTER_URL_REGEX/);
        this.name = 'Handler name';
    }
    ContentHandler.prototype.shouldResolve = function (url) {
        return false;
    };
    ContentHandler.prototype.resolve = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve(url)];
            });
        });
    };
    ContentHandler.prototype.shouldPreHandle = function (url) {
        return false;
    };
    ContentHandler.prototype.preHandle = function (url, browser) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve({ url: url })];
            });
        });
    };
    ContentHandler.prototype.shouldPreParse = function (url, dom) {
        return false;
    };
    ContentHandler.prototype.preParse = function (url, dom) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve(dom)];
            });
        });
    };
    ContentHandler.prototype.isNewsletter = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var re, postHeader, unSubHeader;
            return __generator(this, function (_a) {
                re = new RegExp(this.senderRegex);
                postHeader = input.headers['list-post'];
                unSubHeader = input.headers['list-unsubscribe'];
                return [2 /*return*/, Promise.resolve(re.test(input.from) && (!!postHeader || !!unSubHeader))];
            });
        });
    };
    ContentHandler.prototype.findNewsletterHeaderHref = function (dom) {
        return undefined;
    };
    // Given an HTML blob tries to find a URL to use for
    // a canonical URL.
    ContentHandler.prototype.findNewsletterUrl = function (html) {
        return __awaiter(this, void 0, void 0, function () {
            var dom, href, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dom = (0, linkedom_1.parseHTML)(html).document;
                        href = this.findNewsletterHeaderHref(dom);
                        if (!href) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1["default"].head(href, { timeout: 5000 })];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, Promise.resolve(
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            response.request.res.responseUrl)];
                    case 3:
                        e_1 = _a.sent();
                        console.log('error making HEAD request', e_1);
                        return [2 /*return*/, Promise.resolve(href)];
                    case 4: return [2 /*return*/, Promise.resolve(undefined)];
                }
            });
        });
    };
    ContentHandler.prototype.parseNewsletterUrl = function (headers, html) {
        return __awaiter(this, void 0, void 0, function () {
            var url, matches;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findNewsletterUrl(html)];
                    case 1:
                        url = _a.sent();
                        if (url) {
                            return [2 /*return*/, url];
                        }
                        matches = html.match(this.urlRegex);
                        if (matches) {
                            return [2 /*return*/, matches[1]];
                        }
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    ContentHandler.prototype.parseAuthor = function (from) {
        // get author name from email
        // e.g. 'Jackson Harper from Omnivore App <jacksonh@substack.com>'
        // or 'Mike Allen <mike@axios.com>'
        var parsed = (0, addressparser_1["default"])(from);
        if (parsed.length > 0 && parsed[0].name) {
            return parsed[0].name;
        }
        return from;
    };
    ContentHandler.prototype.parseUnsubscribe = function (unSubHeader) {
        var _a, _b;
        // parse list-unsubscribe header
        // e.g. List-Unsubscribe: <https://omnivore.com/unsub>, <mailto:unsub@omnivore.com>
        return {
            httpUrl: (_a = unSubHeader.match(/<(https?:\/\/[^>]*)>/)) === null || _a === void 0 ? void 0 : _a[1],
            mailTo: (_b = unSubHeader.match(/<mailto:([^>]*)>/)) === null || _b === void 0 ? void 0 : _b[1]
        };
    };
    ContentHandler.prototype.handleNewsletter = function (_a) {
        var from = _a.from, to = _a.to, subject = _a.subject, html = _a.html, headers = _a.headers;
        return __awaiter(this, void 0, void 0, function () {
            var url, author, unsubscribe;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('handleNewsletter', from, to, subject, headers, from);
                        if (!from || !html || !subject || !to) {
                            console.log('invalid newsletter email');
                            throw new Error('invalid newsletter email');
                        }
                        return [4 /*yield*/, this.parseNewsletterUrl(headers, html)];
                    case 1:
                        url = (_b.sent()) || (0, exports.generateUniqueUrl)();
                        author = this.parseAuthor(from);
                        unsubscribe = headers['list-unsubscribe']
                            ? this.parseUnsubscribe(headers['list-unsubscribe'].toString())
                            : undefined;
                        return [2 /*return*/, {
                                email: to,
                                content: html,
                                url: url,
                                title: subject,
                                author: author,
                                unsubMailTo: (unsubscribe === null || unsubscribe === void 0 ? void 0 : unsubscribe.mailTo) || '',
                                unsubHttpUrl: (unsubscribe === null || unsubscribe === void 0 ? void 0 : unsubscribe.httpUrl) || ''
                            }];
                }
            });
        });
    };
    return ContentHandler;
}());
exports.ContentHandler = ContentHandler;
