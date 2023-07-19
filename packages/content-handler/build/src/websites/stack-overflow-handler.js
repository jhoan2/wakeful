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
exports.StackOverflowHandler = void 0;
var content_handler_1 = require("../content-handler");
var StackOverflowHandler = /** @class */ (function (_super) {
    __extends(StackOverflowHandler, _super);
    function StackOverflowHandler() {
        var _this = _super.call(this) || this;
        _this.name = 'stackoverflow';
        return _this;
    }
    StackOverflowHandler.prototype.parseText = function (element, title) {
        var _a;
        var newText = element.ownerDocument.createElement('div');
        var text = element.querySelector("div[itemprop='text']");
        if (text) {
            var votes = (_a = element
                .querySelector("div[itemprop='upvoteCount']")) === null || _a === void 0 ? void 0 : _a.getAttribute('data-value');
            if (votes) {
                newText.innerHTML = "<h2>".concat(title, ": ").concat(votes, " vote").concat(votes === '1' ? '' : 's', "</h2>").concat(text.innerHTML);
            }
        }
        return newText;
    };
    StackOverflowHandler.prototype.parseComments = function (element) {
        var dom = element.ownerDocument;
        var newComments = dom.createElement('div');
        // comments
        var commentsDiv = element.querySelector(".comments");
        if (commentsDiv) {
            var comments = commentsDiv.querySelectorAll(".comment");
            if (comments.length > 0) {
                newComments.innerHTML = "<h3>Comments</h3>";
                comments.forEach(function (comment) {
                    var _a, _b;
                    var author = comment.querySelector(".comment-user");
                    var text = (_a = comment.querySelector(".comment-copy")) === null || _a === void 0 ? void 0 : _a.textContent;
                    var authorHref = author === null || author === void 0 ? void 0 : author.getAttribute('href');
                    var date = (_b = comment.querySelector(".relativetime-clean")) === null || _b === void 0 ? void 0 : _b.textContent;
                    if (author && text && authorHref && date) {
                        var newComment = dom.createElement('p');
                        newComment.innerHTML = "<a href=\"".concat(authorHref, "\"><b>").concat(author.innerHTML, "</b></a>: ").concat(text, " - ").concat(date);
                        newComments.appendChild(newComment);
                    }
                });
            }
        }
        return newComments;
    };
    StackOverflowHandler.prototype.parseAuthors = function (element) {
        var dom = element.ownerDocument;
        var newAuthors = dom.createElement('div');
        var authors = element.querySelectorAll(".post-signature");
        authors.forEach(function (author) {
            var _a, _b, _c, _d;
            var isOwner = author.classList.contains('owner');
            var name = (_a = author.querySelector(".user-details a")) === null || _a === void 0 ? void 0 : _a.textContent;
            var link = (_b = author.querySelector(".user-details a")) === null || _b === void 0 ? void 0 : _b.getAttribute('href');
            var reputation = (_c = author.querySelector(".reputation-score")) === null || _c === void 0 ? void 0 : _c.textContent;
            var badges = Array.from(author.querySelectorAll("span[title*='badges']"))
                .map(function (badge) { return badge.getAttribute('title'); })
                .join(', ');
            var date = (_d = author.querySelector(".user-action-time")) === null || _d === void 0 ? void 0 : _d.textContent;
            if (name && link && reputation && date) {
                var newAuthor = dom.createElement('p');
                newAuthor.innerHTML = "<a href=\"".concat(link, "\"><b>").concat(name, "</b></a> - ").concat(reputation, " reputation - ").concat(badges || 'no badge', " - ").concat(date);
                if (isOwner) {
                    var author_1 = dom.createElement('span');
                    author_1.setAttribute('rel', 'author');
                    author_1.innerHTML = name;
                    newAuthor.appendChild(author_1);
                }
                newAuthors.appendChild(newAuthor);
            }
        });
        return newAuthors;
    };
    StackOverflowHandler.prototype.shouldPreParse = function (url, dom) {
        return new URL(url).hostname.endsWith('stackoverflow.com');
    };
    StackOverflowHandler.prototype.preParse = function (url, dom) {
        return __awaiter(this, void 0, void 0, function () {
            var mainEntity, newMainEntity_1, question, answersDiv, answers;
            var _this = this;
            return __generator(this, function (_a) {
                mainEntity = dom.querySelector("div[itemprop='mainEntity']");
                if (mainEntity) {
                    newMainEntity_1 = dom.createElement('div');
                    question = mainEntity.querySelector('#question');
                    if (question) {
                        newMainEntity_1.appendChild(this.parseText(question, 'Question'));
                        newMainEntity_1.appendChild(this.parseAuthors(question));
                        newMainEntity_1.appendChild(this.parseComments(question));
                    }
                    answersDiv = mainEntity.querySelector('#answers');
                    if (answersDiv) {
                        answers = answersDiv.querySelectorAll(".answer");
                        answers.forEach(function (answer) {
                            var title = answer.classList.contains('accepted-answer')
                                ? 'Accepted Answer'
                                : 'Answer';
                            newMainEntity_1.appendChild(_this.parseText(answer, title));
                            newMainEntity_1.appendChild(_this.parseAuthors(answer));
                            newMainEntity_1.appendChild(_this.parseComments(answer));
                        });
                    }
                    dom.body.replaceChildren(newMainEntity_1);
                }
                return [2 /*return*/, Promise.resolve(dom)];
            });
        });
    };
    return StackOverflowHandler;
}(content_handler_1.ContentHandler));
exports.StackOverflowHandler = StackOverflowHandler;
