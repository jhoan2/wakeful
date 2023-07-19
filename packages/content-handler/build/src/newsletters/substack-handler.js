"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.SubstackHandler = void 0;
var addressparser_1 = require("addressparser");
var content_handler_1 = require("../content-handler");
var SubstackHandler = /** @class */ (function (_super) {
    __extends(SubstackHandler, _super);
    function SubstackHandler() {
        var _this = _super.call(this) || this;
        _this.name = 'substack';
        return _this;
    }
    SubstackHandler.prototype.shouldPreParse = function (url, dom) {
        var _a, _b;
        var host = this.name + '.com';
        var cdnHost = 'substackcdn.com';
        // check if url ends with substack.com
        // or has a profile image hosted at substack.com or substackcdn.com
        return (new URL(url).hostname.endsWith(host) ||
            !!((_b = (_a = dom
                .querySelector('.email-body img')) === null || _a === void 0 ? void 0 : _a.getAttribute('src')) === null || _b === void 0 ? void 0 : _b.includes(host || cdnHost)));
    };
    SubstackHandler.prototype.preParse = function (url, dom) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_k) {
                body = dom.querySelector('.email-body-container');
                // this removes header and profile avatar
                (_a = body === null || body === void 0 ? void 0 : body.querySelector('.header')) === null || _a === void 0 ? void 0 : _a.remove();
                (_b = body === null || body === void 0 ? void 0 : body.querySelector('.preamble')) === null || _b === void 0 ? void 0 : _b.remove();
                (_c = body === null || body === void 0 ? void 0 : body.querySelector('.meta-author-wrap')) === null || _c === void 0 ? void 0 : _c.remove();
                // this removes meta button
                (_d = body === null || body === void 0 ? void 0 : body.querySelector('.post-meta')) === null || _d === void 0 ? void 0 : _d.remove();
                // this removes footer
                (_e = body === null || body === void 0 ? void 0 : body.querySelector('.post-cta')) === null || _e === void 0 ? void 0 : _e.remove();
                (_f = body === null || body === void 0 ? void 0 : body.querySelector('.container-border')) === null || _f === void 0 ? void 0 : _f.remove();
                (_g = body === null || body === void 0 ? void 0 : body.querySelector('.footer')) === null || _g === void 0 ? void 0 : _g.remove();
                // this removes the "restack" button
                (_h = body === null || body === void 0 ? void 0 : body.querySelector('.email-ufi-2-bottom')) === null || _h === void 0 ? void 0 : _h.remove();
                // this removes the "share" button
                (_j = body === null || body === void 0 ? void 0 : body.querySelector('.email-ufi-2-top')) === null || _j === void 0 ? void 0 : _j.remove();
                dom = this.fixupStaticTweets(dom);
                return [2 /*return*/, Promise.resolve(dom)];
            });
        });
    };
    SubstackHandler.prototype.findNewsletterHeaderHref = function (dom) {
        // Substack header links
        var postLink = dom.querySelector('h1 a');
        if (postLink) {
            return postLink.getAttribute('href') || undefined;
        }
        return undefined;
    };
    SubstackHandler.prototype.isNewsletter = function (_a) {
        var headers = _a.headers, dom = _a.dom;
        return __awaiter(this, void 0, void 0, function () {
            var href, oldHeartIcon, oldRecommendIcon, heartIcon, commentsIcon;
            return __generator(this, function (_b) {
                if (headers['list-post']) {
                    return [2 /*return*/, Promise.resolve(true)];
                }
                // substack newsletter emails have tables with a *post-meta class
                if (dom.querySelector('table[class$="post-meta"]')) {
                    return [2 /*return*/, true];
                }
                href = this.findNewsletterHeaderHref(dom);
                oldHeartIcon = dom.querySelector('table tbody td span a img[src*="HeartIcon"]');
                oldRecommendIcon = dom.querySelector('table tbody td span a img[src*="RecommendIconRounded"]');
                heartIcon = dom.querySelector('a img[src*="LucideHeart"]');
                commentsIcon = dom.querySelector('a img[src*="LucideComments"]');
                return [2 /*return*/, Promise.resolve(!!(href &&
                        (oldHeartIcon || oldRecommendIcon || heartIcon || commentsIcon)))];
            });
        });
    };
    SubstackHandler.prototype.parseNewsletterUrl = function (headers, html) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var postHeader;
            return __generator(this, function (_b) {
                postHeader = (_a = headers['list-post']) === null || _a === void 0 ? void 0 : _a.toString();
                if (postHeader && (0, addressparser_1["default"])(postHeader).length > 0) {
                    return [2 /*return*/, Promise.resolve((0, addressparser_1["default"])(postHeader)[0].name)];
                }
                return [2 /*return*/, this.findNewsletterUrl(html)];
            });
        });
    };
    SubstackHandler.prototype.fixupStaticTweets = function (dom) {
        var preClassName = '_omnivore-static-';
        var staticTweets = dom.querySelectorAll('div[class="tweet static"]');
        if (staticTweets.length < 1) {
            return dom;
        }
        var recurse = function (node, f) {
            for (var i = 0; i < node.children.length; i++) {
                var child = node.children[i];
                recurse(child, f);
                f(child);
            }
        };
        for (var _i = 0, _a = Array.from(staticTweets); _i < _a.length; _i++) {
            var tweet = _a[_i];
            tweet.className = preClassName + 'tweet';
            tweet.removeAttribute('style');
            // get all children, rename their class, remove style
            // elements (style will be handled in the reader)
            recurse(tweet, function (n) {
                var className = n.className;
                if (className.startsWith('tweet-') ||
                    className.startsWith('quote-tweet')) {
                    n.className = preClassName + className;
                }
                n.removeAttribute('style');
            });
        }
        return dom;
    };
    return SubstackHandler;
}(content_handler_1.ContentHandler));
exports.SubstackHandler = SubstackHandler;
