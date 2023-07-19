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
exports.WeixinQqHandler = void 0;
var luxon_1 = require("luxon");
var content_handler_1 = require("../content-handler");
var WeixinQqHandler = /** @class */ (function (_super) {
    __extends(WeixinQqHandler, _super);
    function WeixinQqHandler() {
        var _this = _super.call(this) || this;
        _this.name = 'Weixin QQ';
        return _this;
    }
    WeixinQqHandler.prototype.shouldPreParse = function (url, dom) {
        return new URL(url).hostname.endsWith('weixin.qq.com');
    };
    WeixinQqHandler.prototype.preParse = function (url, dom) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function () {
            var publishTime, dateTimeFormat, publishTimeInGMT8;
            return __generator(this, function (_j) {
                publishTime = (_a = dom.querySelector('#publish_time')) === null || _a === void 0 ? void 0 : _a.textContent;
                if (publishTime) {
                    dateTimeFormat = 'yyyy-LL-dd HH:mm';
                    publishTimeInGMT8 = luxon_1.DateTime.fromFormat(publishTime, dateTimeFormat)
                        .setZone('Asia/Shanghai')
                        .toFormat(dateTimeFormat);
                    // replace the publish time in the dom
                    (_b = dom.querySelector('#publish_time')) === null || _b === void 0 ? void 0 : _b.replaceWith(publishTimeInGMT8);
                }
                // This replace the class name of the article info to preserve the block
                (_c = dom
                    .querySelector('.rich_media_meta_list')) === null || _c === void 0 ? void 0 : _c.setAttribute('class', '_omnivore_rich_media_meta_list');
                // This removes the title
                (_d = dom.querySelector('.rich_media_title')) === null || _d === void 0 ? void 0 : _d.remove();
                // This removes the profile info
                (_e = dom.querySelector('.profile_container')) === null || _e === void 0 ? void 0 : _e.remove();
                //  This removes the footer
                (_f = dom.querySelector('#content_bottom_area')) === null || _f === void 0 ? void 0 : _f.remove();
                (_g = dom.querySelector('.rich_media_area_extra')) === null || _g === void 0 ? void 0 : _g.remove();
                (_h = dom.querySelector('#js_pc_qr_code')) === null || _h === void 0 ? void 0 : _h.remove();
                return [2 /*return*/, Promise.resolve(dom)];
            });
        });
    };
    return WeixinQqHandler;
}(content_handler_1.ContentHandler));
exports.WeixinQqHandler = WeixinQqHandler;
