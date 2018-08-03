"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class WordFilter {
    static instance() {
        if (WordFilter._instance == undefined) {
            WordFilter._instance = new WordFilter();
        }
        return WordFilter._instance;
    }
    constructor() {
        this._initialized = false;
        this._filterTextMap = {};
    }
    /**
     * 初始化时，将敏感词丢进来，并解析成 MAP
     *
     * @param {string[]} keywords
     */
    init(keywords) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._initTextFilterMap(keywords);
            this._initialized = true;
        });
    }
    /**
     * 初始化过滤词词库
     *
     * @param {string[]} keywords
     * @private
     */
    _initTextFilterMap(keywords) {
        if (keywords) {
            for (let i = 0; i < keywords.length; i++) {
                if (!keywords[i]) {
                    continue;
                }
                let parent = this._filterTextMap;
                // add word map
                let word = keywords[i];
                for (let i = 0; i < word.length; i++) {
                    if (!parent[word[i]])
                        parent[word[i]] = {};
                    parent = parent[word[i]];
                }
                parent.isEnd = true;
            }
        }
    }
    /**
     * 敏感词过滤
     */
    replace(searchValue, replaceValue = '*') {
        let parent = this._filterTextMap;
        for (let i = 0; i < searchValue.length; i++) {
            if (searchValue[i] == replaceValue) {
                continue;
            }
            let found = false;
            let skip = 0;
            let sWord = '';
            for (let j = i; j < searchValue.length; j++) {
                if (!parent[searchValue[j]]) {
                    found = false;
                    skip = j - i - 1;
                    parent = this._filterTextMap;
                    break;
                }
                sWord = sWord + searchValue[j];
                if (parent[searchValue[j]].isEnd) {
                    found = true;
                    skip = j - i;
                    parent = this._filterTextMap;
                    break;
                }
                parent = parent[searchValue[j]];
            }
            if (skip > 1) {
                i += skip - 1;
            }
            if (!found) {
                continue;
            }
            let stars = replaceValue;
            for (let k = 0; k < skip; k++) {
                stars = stars + replaceValue;
            }
            let reg = new RegExp(sWord, 'g');
            searchValue = searchValue.replace(reg, stars);
        }
        return searchValue;
    }
}
exports.WordFilter = WordFilter;
exports.default = WordFilter;