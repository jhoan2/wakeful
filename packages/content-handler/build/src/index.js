"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.handleNewsletter = exports.getNewsletterHandler = exports.preParseContent = exports.preHandleContent = void 0;
var linkedom_1 = require("linkedom");
var axios_handler_1 = require("./newsletters/axios-handler");
var beehiiv_handler_1 = require("./newsletters/beehiiv-handler");
var bloomberg_newsletter_handler_1 = require("./newsletters/bloomberg-newsletter-handler");
var convertkit_handler_1 = require("./newsletters/convertkit-handler");
var cooper_press_handler_1 = require("./newsletters/cooper-press-handler");
var energy_world_1 = require("./newsletters/energy-world");
var every_io_handler_1 = require("./newsletters/every-io-handler");
var generic_handler_1 = require("./newsletters/generic-handler");
var ghost_handler_1 = require("./newsletters/ghost-handler");
var golang_handler_1 = require("./newsletters/golang-handler");
var hey_world_handler_1 = require("./newsletters/hey-world-handler");
var india_times_handler_1 = require("./newsletters/india-times-handler");
var morning_brew_handler_1 = require("./newsletters/morning-brew-handler");
var revue_handler_1 = require("./newsletters/revue-handler");
var substack_handler_1 = require("./newsletters/substack-handler");
var apple_news_handler_1 = require("./websites/apple-news-handler");
var bloomberg_handler_1 = require("./websites/bloomberg-handler");
var derstandard_handler_1 = require("./websites/derstandard-handler");
var github_handler_1 = require("./websites/github-handler");
var image_handler_1 = require("./websites/image-handler");
var medium_handler_1 = require("./websites/medium-handler");
var pdf_handler_1 = require("./websites/pdf-handler");
var piped_video_handler_1 = require("./websites/piped-video-handler");
var scrapingBee_handler_1 = require("./websites/scrapingBee-handler");
var stack_overflow_handler_1 = require("./websites/stack-overflow-handler");
var t_dot_co_handler_1 = require("./websites/t-dot-co-handler");
var twitter_handler_1 = require("./websites/twitter-handler");
var weixin_qq_handler_1 = require("./websites/weixin-qq-handler");
var wikipedia_handler_1 = require("./websites/wikipedia-handler");
var youtube_handler_1 = require("./websites/youtube-handler");
var validateUrlString = function (url) {
    var u = new URL(url);
    // Make sure the URL is http or https
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
        throw new Error('Invalid URL protocol check failed');
    }
    // Make sure the domain is not localhost
    if (u.hostname === 'localhost' || u.hostname === '0.0.0.0') {
        throw new Error('Invalid URL is localhost');
    }
    // Make sure the domain is not a private IP
    if (/^(10|172\.16|192\.168)\..*/.test(u.hostname)) {
        throw new Error('Invalid URL is private ip');
    }
    return true;
};
var contentHandlers = [
    new apple_news_handler_1.AppleNewsHandler(),
    new bloomberg_handler_1.BloombergHandler(),
    new derstandard_handler_1.DerstandardHandler(),
    new image_handler_1.ImageHandler(),
    new medium_handler_1.MediumHandler(),
    new pdf_handler_1.PdfHandler(),
    new scrapingBee_handler_1.ScrapingBeeHandler(),
    new t_dot_co_handler_1.TDotCoHandler(),
    new twitter_handler_1.TwitterHandler(),
    new youtube_handler_1.YoutubeHandler(),
    new wikipedia_handler_1.WikipediaHandler(),
    new github_handler_1.GitHubHandler(),
    new axios_handler_1.AxiosHandler(),
    new golang_handler_1.GolangHandler(),
    new morning_brew_handler_1.MorningBrewHandler(),
    new bloomberg_newsletter_handler_1.BloombergNewsletterHandler(),
    new substack_handler_1.SubstackHandler(),
    new stack_overflow_handler_1.StackOverflowHandler(),
    new energy_world_1.EnergyWorldHandler(),
    new piped_video_handler_1.PipedVideoHandler(),
    new weixin_qq_handler_1.WeixinQqHandler(),
];
var newsletterHandlers = [
    new axios_handler_1.AxiosHandler(),
    new bloomberg_newsletter_handler_1.BloombergNewsletterHandler(),
    new golang_handler_1.GolangHandler(),
    new substack_handler_1.SubstackHandler(),
    new morning_brew_handler_1.MorningBrewHandler(),
    new beehiiv_handler_1.BeehiivHandler(),
    new convertkit_handler_1.ConvertkitHandler(),
    new revue_handler_1.RevueHandler(),
    new ghost_handler_1.GhostHandler(),
    new cooper_press_handler_1.CooperPressHandler(),
    new hey_world_handler_1.HeyWorldHandler(),
    new generic_handler_1.GenericHandler(),
    new every_io_handler_1.EveryIoHandler(),
    new energy_world_1.EnergyWorldHandler(),
    new india_times_handler_1.IndiaTimesHandler(),
];
var preHandleContent = function (url, browser) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, contentHandlers_1, handler, resolvedUrl, err_1, _a, contentHandlers_2, handler;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _i = 0, contentHandlers_1 = contentHandlers;
                _b.label = 1;
            case 1:
                if (!(_i < contentHandlers_1.length)) return [3 /*break*/, 7];
                handler = contentHandlers_1[_i];
                if (!handler.shouldResolve(url)) return [3 /*break*/, 6];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, handler.resolve(url)];
            case 3:
                resolvedUrl = _b.sent();
                if (resolvedUrl && validateUrlString(resolvedUrl)) {
                    url = resolvedUrl;
                }
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                console.log('error resolving url with handler', handler.name, err_1);
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                _i++;
                return [3 /*break*/, 1];
            case 7:
                // Before we fetch the page we check the handlers, to see if they want
                // to perform a prefetch action that can modify our requests.
                // enumerate the handlers and see if any of them want to handle the request
                for (_a = 0, contentHandlers_2 = contentHandlers; _a < contentHandlers_2.length; _a++) {
                    handler = contentHandlers_2[_a];
                    if (handler.shouldPreHandle(url)) {
                        console.log('preHandleContent', handler.name, url);
                        return [2 /*return*/, handler.preHandle(url, browser)];
                    }
                }
                return [2 /*return*/, undefined];
        }
    });
}); };
exports.preHandleContent = preHandleContent;
var preParseContent = function (url, dom) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, contentHandlers_3, handler;
    return __generator(this, function (_a) {
        // Before we parse the page we check the handlers, to see if they want
        // to perform a preParse action that can modify our dom.
        // enumerate the handlers and see if any of them want to handle the dom
        for (_i = 0, contentHandlers_3 = contentHandlers; _i < contentHandlers_3.length; _i++) {
            handler = contentHandlers_3[_i];
            if (handler.shouldPreParse(url, dom)) {
                console.log('preParseContent', handler.name, url);
                return [2 /*return*/, handler.preParse(url, dom)];
            }
        }
        return [2 /*return*/, undefined];
    });
}); };
exports.preParseContent = preParseContent;
var getNewsletterHandler = function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var dom, _i, newsletterHandlers_1, handler;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dom = (0, linkedom_1.parseHTML)(input.html).document;
                _i = 0, newsletterHandlers_1 = newsletterHandlers;
                _a.label = 1;
            case 1:
                if (!(_i < newsletterHandlers_1.length)) return [3 /*break*/, 4];
                handler = newsletterHandlers_1[_i];
                return [4 /*yield*/, handler.isNewsletter(__assign(__assign({}, input), { dom: dom }))];
            case 2:
                if (_a.sent()) {
                    return [2 /*return*/, handler];
                }
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, undefined];
        }
    });
}); };
exports.getNewsletterHandler = getNewsletterHandler;
var handleNewsletter = function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var handler;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getNewsletterHandler)(input)];
            case 1:
                handler = _a.sent();
                if (handler) {
                    console.log('handleNewsletter', handler.name, input.subject);
                    return [2 /*return*/, handler.handleNewsletter(input)];
                }
                return [2 /*return*/, undefined];
        }
    });
}); };
exports.handleNewsletter = handleNewsletter;
module.exports = {
    preHandleContent: exports.preHandleContent,
    handleNewsletter: exports.handleNewsletter,
    preParseContent: exports.preParseContent,
    getNewsletterHandler: exports.getNewsletterHandler
};
