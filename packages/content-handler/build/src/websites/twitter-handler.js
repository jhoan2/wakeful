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
exports.TwitterHandler = void 0;
var axios_1 = require("axios");
var lodash_1 = require("lodash");
var luxon_1 = require("luxon");
var underscore_1 = require("underscore");
var content_handler_1 = require("../content-handler");
var TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
var TWITTER_URL_MATCH = /twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)(?:\/.*)?/;
var MAX_THREAD_DEPTH = 100;
var getTweetFields = function () {
    var TWEET_FIELDS = '&tweet.fields=attachments,author_id,conversation_id,created_at,' +
        'entities,geo,in_reply_to_user_id,lang,possibly_sensitive,public_metrics,referenced_tweets,' +
        'source,withheld';
    var EXPANSIONS = '&expansions=author_id,attachments.media_keys';
    var USER_FIELDS = '&user.fields=created_at,description,entities,location,pinned_tweet_id,profile_image_url,protected,public_metrics,url,verified,withheld';
    var MEDIA_FIELDS = '&media.fields=duration_ms,height,preview_image_url,url,media_key,public_metrics,width';
    return "".concat(TWEET_FIELDS).concat(EXPANSIONS).concat(USER_FIELDS).concat(MEDIA_FIELDS);
};
// unroll recent tweet thread
var getTweetThread = function (conversationId) { return __awaiter(void 0, void 0, void 0, function () {
    var BASE_ENDPOINT, apiUrl, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                BASE_ENDPOINT = 'https://api.twitter.com/2/tweets/search/recent';
                apiUrl = new URL(BASE_ENDPOINT +
                    '?query=' +
                    encodeURIComponent("conversation_id:".concat(conversationId)) +
                    getTweetFields() +
                    "&max_results=".concat(MAX_THREAD_DEPTH));
                if (!TWITTER_BEARER_TOKEN) {
                    throw new Error('No Twitter bearer token found');
                }
                return [4 /*yield*/, axios_1["default"].get(apiUrl.toString(), {
                        headers: {
                            Authorization: "Bearer ".concat(TWITTER_BEARER_TOKEN),
                            redirect: 'follow'
                        }
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); };
var getTweetById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var BASE_ENDPOINT, apiUrl, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                BASE_ENDPOINT = 'https://api.twitter.com/2/tweets/';
                apiUrl = new URL(BASE_ENDPOINT + id + '?' + getTweetFields());
                if (!TWITTER_BEARER_TOKEN) {
                    throw new Error('No Twitter bearer token found');
                }
                return [4 /*yield*/, axios_1["default"].get(apiUrl.toString(), {
                        headers: {
                            Authorization: "Bearer ".concat(TWITTER_BEARER_TOKEN),
                            redirect: 'follow'
                        }
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); };
var getTweetsByIds = function (ids) { return __awaiter(void 0, void 0, void 0, function () {
    var BASE_ENDPOINT, apiUrl, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                BASE_ENDPOINT = 'https://api.twitter.com/2/tweets?ids=';
                apiUrl = new URL(BASE_ENDPOINT + ids.join() + getTweetFields());
                if (!TWITTER_BEARER_TOKEN) {
                    throw new Error('No Twitter bearer token found');
                }
                return [4 /*yield*/, axios_1["default"].get(apiUrl.toString(), {
                        headers: {
                            Authorization: "Bearer ".concat(TWITTER_BEARER_TOKEN),
                            redirect: 'follow'
                        }
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); };
var titleForTweet = function (author, text) {
    return "".concat(author.name, " on Twitter: ").concat((0, lodash_1.truncate)(text.replace(/http\S+/, ''), {
        length: 100
    }));
};
var tweetIdFromStatusUrl = function (url) {
    var match = url.toString().match(TWITTER_URL_MATCH);
    return match === null || match === void 0 ? void 0 : match[2];
};
var formatTimestamp = function (timestamp) {
    return luxon_1.DateTime.fromJSDate(new Date(timestamp)).toLocaleString(luxon_1.DateTime.DATETIME_FULL);
};
var getTweetsFromResponse = function (response) {
    var _a;
    var tweets = [];
    var _loop_1 = function (t) {
        var media = (_a = response.includes.media) === null || _a === void 0 ? void 0 : _a.filter(function (m) { var _a, _b; return (_b = (_a = t.attachments) === null || _a === void 0 ? void 0 : _a.media_keys) === null || _b === void 0 ? void 0 : _b.includes(m.media_key); });
        var tweet = {
            data: t,
            includes: {
                users: response.includes.users,
                media: media
            }
        };
        tweets.push(tweet);
    };
    for (var _i = 0, _b = response.data; _i < _b.length; _i++) {
        var t = _b[_i];
        _loop_1(t);
    }
    return tweets;
};
var getOldTweets = function (browser, conversationId, username) { return __awaiter(void 0, void 0, void 0, function () {
    var tweetIds, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getTweetIds(browser, conversationId, username)];
            case 1:
                tweetIds = _a.sent();
                if (tweetIds.length === 0) {
                    return [2 /*return*/, []];
                }
                return [4 /*yield*/, getTweetsByIds(tweetIds)];
            case 2:
                response = _a.sent();
                return [2 /*return*/, getTweetsFromResponse(response)];
        }
    });
}); };
var getRecentTweets = function (conversationId) { return __awaiter(void 0, void 0, void 0, function () {
    var thread;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getTweetThread(conversationId)];
            case 1:
                thread = _a.sent();
                if (thread.meta.result_count === 0) {
                    return [2 /*return*/, []];
                }
                // tweets are in reverse chronological order in the thread
                return [2 /*return*/, getTweetsFromResponse(thread).reverse()];
        }
    });
}); };
/**
 * Wait for `ms` amount of milliseconds
 * @param {number} ms
 */
var waitFor = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
/**
 * Get tweets(even older than 7 days) using puppeteer
 * @param browser
 * @param {string} tweetId
 * @param {string} author
 */
var getTweetIds = function (browser, tweetId, author) { return __awaiter(void 0, void 0, void 0, function () {
    var pageURL, context, page, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pageURL = "https://twitter.com/".concat(author, "/status/").concat(tweetId);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, 7, 10]);
                return [4 /*yield*/, browser.createIncognitoBrowserContext()];
            case 2:
                context = _a.sent();
                return [4 /*yield*/, context.newPage()];
            case 3:
                page = _a.sent();
                return [4 /*yield*/, page.goto(pageURL, {
                        waitUntil: 'networkidle0',
                        timeout: 60000
                    })];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.evaluate(function (author) { return __awaiter(void 0, void 0, void 0, function () {
                        var waitFor, ids, distance, scrollHeight, currentHeight, timeNodes, i, timeContainerAnchor, href, match, id, username, showRepliesButton;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    waitFor = function (ms) {
                                        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
                                    };
                                    ids = new Set();
                                    distance = 1080;
                                    scrollHeight = document.body.scrollHeight;
                                    currentHeight = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(currentHeight < scrollHeight)) return [3 /*break*/, 5];
                                    timeNodes = Array.from(document.querySelectorAll('time'));
                                    for (i = 0; i < timeNodes.length; i++) {
                                        timeContainerAnchor = timeNodes[i].parentElement;
                                        if (!timeContainerAnchor)
                                            continue;
                                        if (timeContainerAnchor.tagName === 'SPAN')
                                            continue;
                                        href = timeContainerAnchor.getAttribute('href');
                                        if (!href)
                                            continue;
                                        match = href.match(/\/([^/]+)\/status\/(\d+)/);
                                        if (!match)
                                            continue;
                                        id = match[2];
                                        username = match[1];
                                        // stop at non-author replies
                                        if (username !== author)
                                            return [2 /*return*/, Array.from(ids)];
                                        ids.add(id);
                                    }
                                    window.scrollBy(0, distance);
                                    return [4 /*yield*/, waitFor(500)];
                                case 2:
                                    _a.sent();
                                    currentHeight += distance;
                                    if (!(currentHeight >= scrollHeight)) return [3 /*break*/, 4];
                                    showRepliesButton = Array.from(document.querySelectorAll('div[dir]'))
                                        .filter(function (node) { return node.children[0] && node.children[0].tagName === 'SPAN'; })
                                        .find(function (node) { return node.children[0].innerHTML === 'Show replies'; });
                                    if (!showRepliesButton) return [3 /*break*/, 4];
                                    ;
                                    showRepliesButton.click();
                                    return [4 /*yield*/, waitFor(1000)];
                                case 3:
                                    _a.sent();
                                    scrollHeight = document.body.scrollHeight;
                                    _a.label = 4;
                                case 4: return [3 /*break*/, 1];
                                case 5: return [2 /*return*/, Array.from(ids)];
                            }
                        });
                    }); }, author)];
            case 5: return [2 /*return*/, (_a.sent())];
            case 6:
                error_1 = _a.sent();
                console.error('Error getting tweets', error_1);
                return [2 /*return*/, []];
            case 7:
                if (!context) return [3 /*break*/, 9];
                return [4 /*yield*/, context.close()];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9: return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); };
var TwitterHandler = /** @class */ (function (_super) {
    __extends(TwitterHandler, _super);
    function TwitterHandler() {
        var _this = _super.call(this) || this;
        _this.name = 'Twitter';
        return _this;
    }
    TwitterHandler.prototype.shouldPreHandle = function (url) {
        return !!TWITTER_BEARER_TOKEN && TWITTER_URL_MATCH.test(url.toString());
    };
    TwitterHandler.prototype.preHandle = function (url, browser) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var tweetId, tweet, conversationId, tweetData, authorId, author, title, escapedTitle, authorImage, description, tweets, tweetsContent, _i, tweets_1, tweet_1, tweetData_1, text, _c, _d, urlObj, includesHtml, tweetUrl, content;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        tweetId = tweetIdFromStatusUrl(url);
                        if (!tweetId) {
                            throw new Error('could not find tweet id in url');
                        }
                        return [4 /*yield*/, getTweetById(tweetId)];
                    case 1:
                        tweet = _e.sent();
                        conversationId = tweet.data.conversation_id;
                        if (!(conversationId !== tweetId)) return [3 /*break*/, 3];
                        return [4 /*yield*/, getTweetById(conversationId)];
                    case 2:
                        // this is a reply, so we need to get the referenced tweet
                        tweet = _e.sent();
                        _e.label = 3;
                    case 3:
                        tweetData = tweet.data;
                        authorId = tweetData.author_id;
                        author = tweet.includes.users.filter(function (u) { return (u.id = authorId); })[0];
                        title = titleForTweet(author, tweetData.text);
                        escapedTitle = underscore_1["default"].escape(title);
                        authorImage = author.profile_image_url.replace('_normal', '_400x400');
                        description = underscore_1["default"].escape(tweetData.text);
                        return [4 /*yield*/, getOldTweets(browser, conversationId, author.username)];
                    case 4:
                        tweets = _e.sent();
                        tweetsContent = '';
                        for (_i = 0, tweets_1 = tweets; _i < tweets_1.length; _i++) {
                            tweet_1 = tweets_1[_i];
                            tweetData_1 = tweet_1.data;
                            text = tweetData_1.text;
                            if (tweetData_1.entities && tweetData_1.entities.urls) {
                                for (_c = 0, _d = tweetData_1.entities.urls; _c < _d.length; _c++) {
                                    urlObj = _d[_c];
                                    text = text.replace(urlObj.url, "<a href=\"".concat(urlObj.expanded_url, "\">").concat(urlObj.display_url, "</a>"));
                                }
                            }
                            includesHtml = (_b = (_a = tweet_1.includes.media) === null || _a === void 0 ? void 0 : _a.map(function (m) {
                                var linkUrl = m.type == 'photo' ? m.url : url;
                                var previewUrl = m.type == 'photo' ? m.url : m.preview_image_url;
                                return "<a class=\"media-link\" href=".concat(linkUrl, ">\n          <picture>\n            <img class=\"tweet-img\" src=").concat(previewUrl, " />\n          </picture>\n          </a>");
                            }).join('\n')) !== null && _b !== void 0 ? _b : '';
                            tweetsContent += "\n      <p>".concat(text, "</p>\n      ").concat(includesHtml, "\n    ");
                        }
                        tweetUrl = "\n       \u2014 <a href=\"https://twitter.com/".concat(author.username, "\">").concat(author.username, "</a> <span itemscope itemtype=\"https://schema.org/Person\" itemprop=\"author\">").concat(author.name, "</span> <a href=\"").concat(url, "\">").concat(formatTimestamp(tweetData.created_at), "</a>\n    ");
                        content = "\n<html>\n    <head>\n      <meta property=\"og:image\" content=\"".concat(authorImage, "\" />\n      <meta property=\"og:image:secure_url\" content=\"").concat(authorImage, "\" />\n      <meta property=\"og:title\" content=\"").concat(escapedTitle, "\" />\n      <meta property=\"og:description\" content=\"").concat(description, "\" />\n      <meta property=\"article:published_time\" content=\"").concat(tweetData.created_at, "\" />\n      <meta property=\"og:site_name\" content=\"Twitter\" />\n      <meta property=\"og:type\" content=\"tweet\" />\n    </head>\n    <body>\n      <div>\n        ").concat(tweetsContent, "\n        ").concat(tweetUrl, "\n      </div>\n    </body>\n</html>");
                        return [2 /*return*/, { content: content, url: url, title: title }];
                }
            });
        });
    };
    return TwitterHandler;
}(content_handler_1.ContentHandler));
exports.TwitterHandler = TwitterHandler;
