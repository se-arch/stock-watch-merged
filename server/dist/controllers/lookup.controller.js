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
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const node_fetch_1 = require("node-fetch");
class LookUpController {
    constructor() {
        this.path = '/look';
        this.router = express.Router();
        this.urlForQuote = (symbol) => {
            const endpoint = "quote";
            return this.apiUrl(endpoint, { symbol: symbol });
        };
        this.urlForLookUp = (input) => {
            const endpoint = "autoc";
            let params = {
                query: encodeURIComponent(input),
                limit: "10",
                lang: "en"
            };
            return this.apiUrl(endpoint, params);
        };
        this.apiUrl = (endpoint, params) => {
            const apiHost = "http://d.yimg.com/autoc.finance.yahoo.com";
            let data = Object.entries(params);
            let items = data.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
            let query = items.join('&');
            return `${apiHost}/${endpoint}?${query}`;
        };
        this.lookup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const symbol = req.query.value;
            const url = this.urlForLookUp(symbol);
            console.log(url);
            try {
                const response = yield node_fetch_1.default(url);
                const data = yield response.json();
                const parsed = data.ResultSet.Result.map(item => {
                    return { symbol: item.symbol, name: item.name };
                });
                res.send(parsed);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/lookup', this.lookup);
    }
}
exports.default = LookUpController;
//# sourceMappingURL=lookup.controller.js.map