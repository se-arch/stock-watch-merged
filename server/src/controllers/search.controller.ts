import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from 'interfaces/IControllerBase.interface'
import fetch from 'node-fetch'

class SearchController implements IControllerBase {
    public path = '/search'
    public router = express.Router()
    private config = {
        supported_resolutions: ["1", "5", "15", "30", "60", "D", "W", "M"]
    }

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/search', this.search)
    }

    webHook = () => {
        // const url = `https://finnhub.io/api/v1/webhook/add?token=${token}`;
        // const request = await fetch(url);
        // const data = await request.json();
    };

    toTimestamp = (strDate: string): number => {
        var datum = Date.parse(strDate);
        return datum / 1000;
    }

    urlForQuote = (symbol: string): string => {
        const endpoint = "quote";
        return this.apiUrl(endpoint, { symbol: symbol });
    };

    urlForCandles = (symbol: string, start: string, end: string): string => {
        const endpoint = "stock/candle";

        let from = parseInt(start) / 1000;
        let to = parseInt(end) / 1000;

        let params = {
            from: from,
            to: to,
            resolution: "W",
            adjusted: false,
            symbol: encodeURIComponent(symbol),
        }

        return this.apiUrl(endpoint, params);
    };

    apiUrl = (endpoint: string, params: object): string => {
        const apiHost = "https://finnhub.io/api/v1";
        const token = "bu1ehdn48v6pl1t2qjb0";

        let data = Object.entries(params);
        let items = data.map(([k, v]): string => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
        let query = items.join('&');

        return `${apiHost}/${endpoint}?${query}&token=${token}`;
    };

    search = async (req: Request, res: Response) => {
        const symbol: string = <string>req.query.value;
        const startDate: string = <string>req.query.startDate;
        const endDate: string = <string>req.query.endDate;

        const url = encodeURI(this.urlForCandles(symbol, startDate, endDate));

        try {
            console.log(url);
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            if ("s" in data && data.s === "no_data") {
                res.send({});
                return;
            }

            res.send(data);
        } catch (error) {
            console.log(error);
        }
    };
}

export default SearchController
