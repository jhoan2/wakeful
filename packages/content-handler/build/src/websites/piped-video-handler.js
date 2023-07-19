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
exports.PipedVideoHandler = void 0;
var axios_1 = require("axios");
var underscore_1 = require("underscore");
var content_handler_1 = require("../content-handler");
var PipedVideoHandler = /** @class */ (function (_super) {
    __extends(PipedVideoHandler, _super);
    function PipedVideoHandler() {
        var _this = _super.call(this) || this;
        // https://piped.video/watch?v={videoId}
        _this.PIPED_URL_MATCH = /^((?:https?:)?\/\/)?piped\.video\/watch\?v=[^&]+/;
        _this.getYoutubeVideoId = function (url) {
            var u = new URL(url);
            return u.searchParams.get('v');
        };
        _this.escapeTitle = function (title) {
            return underscore_1["default"].escape(title);
        };
        _this.name = 'Piped-video';
        return _this;
    }
    PipedVideoHandler.prototype.shouldPreHandle = function (url) {
        return this.PIPED_URL_MATCH.test(url.toString());
    };
    PipedVideoHandler.prototype.preHandle = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var videoId, baseUrl, apiUrl, metadata, videoStreams, videoStream, src, title, escapedTitle, ratio, thumbnail, height, width, authorName, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        videoId = this.getYoutubeVideoId(url);
                        if (!videoId) {
                            return [2 /*return*/, {}];
                        }
                        baseUrl = 'https://api-piped.mha.fi';
                        apiUrl = "".concat(baseUrl, "/streams/").concat(videoId);
                        return [4 /*yield*/, axios_1["default"].get(apiUrl)];
                    case 1:
                        metadata = (_a.sent()).data;
                        videoStreams = metadata.videoStreams;
                        if (!videoStreams || videoStreams.length == 0) {
                            return [2 /*return*/, {}];
                        }
                        videoStream = videoStreams[0];
                        src = "https://piped.mha.fi/embed/".concat(videoId);
                        title = metadata.title;
                        escapedTitle = this.escapeTitle(title);
                        ratio = videoStream.width / videoStream.height;
                        thumbnail = metadata.thumbnailUrl;
                        height = 350;
                        width = height * ratio;
                        authorName = underscore_1["default"].escape(metadata.uploader);
                        content = "\n    <html>\n      <head>\n        <title>".concat(escapedTitle, "</title>\n        <meta property=\"og:image\" content=\"").concat(thumbnail, "\" />\n        <meta property=\"og:image:secure_url\" content=\"").concat(thumbnail, "\" />\n        <meta property=\"og:title\" content=\"").concat(escapedTitle, "\" />\n        <meta property=\"og:description\" content=\"").concat(metadata.description, "\" />\n        <meta property=\"og:article:author\" content=\"").concat(authorName, "\" />\n        <meta property=\"og:site_name\" content=\"Piped Video\" />\n        <meta property=\"article:published_time\" content=\"").concat(metadata.uploadDate, "\" />\n        <meta property=\"og:type\" content=\"video\" />\n      </head>\n      <body>\n      <iframe width=\"").concat(width, "\" height=\"").concat(height, "\" src=\"").concat(src, "\" title=\"").concat(escapedTitle, "\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\n        <p><a href=\"").concat(url, "\" target=\"_blank\">").concat(escapedTitle, "</a></p>\n        <p itemscope=\"\" itemprop=\"author\" itemtype=\"http://schema.org/Person\">By <a href=\"https://piped.video").concat(metadata.uploaderUrl, "\" target=\"_blank\">").concat(authorName, "</a></p>\n      </body>\n    </html>");
                        return [2 /*return*/, { content: content, title: title }];
                }
            });
        });
    };
    return PipedVideoHandler;
}(content_handler_1.ContentHandler));
exports.PipedVideoHandler = PipedVideoHandler;
