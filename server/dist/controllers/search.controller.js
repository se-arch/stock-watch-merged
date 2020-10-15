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
class SearchController {
    constructor() {
        this.path = '/search';
        this.router = express.Router();
        this.config = {
            supported_resolutions: ["1", "5", "15", "30", "60", "D", "W", "M"]
        };
        this.webHook = () => {
            // const url = `https://finnhub.io/api/v1/webhook/add?token=${token}`;
            // const request = await fetch(url);
            // const data = await request.json();
        };
        this.toTimestamp = (strDate) => {
            var datum = Date.parse(strDate);
            return datum / 1000;
        };
        this.urlForQuote = (symbol) => {
            const endpoint = "quote";
            return this.apiUrl(endpoint, { symbol: symbol });
        };
        this.urlForCandles = (symbol, start, end) => {
            const endpoint = "stock/candle";
            let from = parseInt(start) / 1000;
            let to = parseInt(end) / 1000;
            let params = {
                from: from,
                to: to,
                resolution: "W",
                adjusted: false,
                symbol: encodeURIComponent(symbol),
            };
            return this.apiUrl(endpoint, params);
        };
        this.apiUrl = (endpoint, params) => {
            const apiHost = "https://finnhub.io/api/v1";
            const token = "bu1ehdn48v6pl1t2qjb0";
            let data = Object.entries(params);
            let items = data.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
            let query = items.join('&');
            return `${apiHost}/${endpoint}?${query}&token=${token}`;
        };
        this.search = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const symbol = req.query.value;
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            const url = encodeURI(this.urlForCandles(symbol, startDate, endDate));
            try {
                console.log(url);
                const response = yield node_fetch_1.default(url);
                const data = yield response.json();
                console.log(data);
                if ("s" in data && data.s === "no_data") {
                    res.send({});
                    return;
                }
                res.send(data);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/search', this.search);
    }
}
exports.default = SearchController;
//# sourceMappingURL=search.controller.js.map