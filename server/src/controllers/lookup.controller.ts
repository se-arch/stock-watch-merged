import * as express from 'express'
import { Request, Response } from 'express'
import IControllerBase from 'interfaces/IControllerBase.interface'
import fetch from 'node-fetch'

class LookUpController implements IControllerBase {
    public path = '/look'
    public router = express.Router()

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/lookup', this.lookup)
    }

    urlForQuote = (symbol: string): string => {
        const endpoint = "quote";
        return this.apiUrl(endpoint, {symbol: symbol});
    };

    urlForLookUp = (input: string): string => {
        const endpoint = "api/v3/search-ticker";

        let params = {
            apikey: "1Vp3P7TNGpODDQB0fRlcV2vpwYh5xTOs",
            query: encodeURIComponent(input),
            limit: "10",
            lang: "en"
        }

        return this.apiUrl(endpoint, params);
    };

    apiUrl = (endpoint: string, params: object): string => {
        const apiHost = "http://financialmodelingprep.com/";

        let data = Object.entries(params);
        let items = data.map(([k, v]): string => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
        let query = items.join('&');

        return `${apiHost}/${endpoint}?${query}`;
    };

    lookup = async (req: Request, res: Response) => {
        const symbol: string = <string> req.query.value;

        const url = this.urlForLookUp(symbol);
        console.log(url);

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            const parsed = data.map(item => {
                return { symbol: item.symbol, name: item.name };
            });

            res.send(parsed);
        }  catch(error)  {
            console.log(error);
        }
    };
}

export default LookUpController;
