import { IHttp, IRead } from '@rocket.chat/apps-engine/definition/accessors';

export interface AlphaVantageMarketData {
    symbol: string;
    open: number;
    high: number;
    low: number;
    price: number;
    volume: number;
    previousClose: number;
    change: number;
    changePercent: string;
}

export interface ITechnicalIndicators {
    sma50?: number;
    sma200?: number;
    rsi?: number;
}

export class AlphaVantageService {
    public static async getMarketData(symbol: string, http: IHttp, read: IRead): Promise<AlphaVantageMarketData | null> {
        const apiKey = await read.getEnvironmentReader().getSettings().getValueById('alphavantage_api_key');
        if (!apiKey) {
            throw new Error('Alpha Vantage API key is not set in app settings.');
        }

        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
        const response = await http.get(url);

        if (response.statusCode !== 200 || !response.data || !response.data['Global Quote']) {
            return null;
        }

        const quote = response.data['Global Quote'];
        return {
            symbol: quote['01. symbol'],
            open: parseFloat(quote['02. open']),
            high: parseFloat(quote['03. high']),
            low: parseFloat(quote['04. low']),
            price: parseFloat(quote['05. price']),
            volume: parseInt(quote['06. volume'], 10),
            previousClose: parseFloat(quote['08. previous close']),
            change: parseFloat(quote['09. change']),
            changePercent: quote['10. change percent'],
        };
    }

    public static async getTechnicalIndicators(symbol: string, http: IHttp, read: IRead): Promise<ITechnicalIndicators | null> {
        const apiKey = await read.getEnvironmentReader().getSettings().getValueById('alphavantage_api_key');
        if (!apiKey) {
            throw new Error('Alpha Vantage API key is not set in app settings.');
        }

        // SMA 50
        const sma50Url = `https://www.alphavantage.co/query?function=SMA&symbol=${encodeURIComponent(symbol)}&interval=daily&time_period=50&series_type=close&apikey=${apiKey}`;
        const sma50Response = await http.get(sma50Url);
        let sma50: number | undefined;
        if (sma50Response.statusCode === 200 && sma50Response.data && sma50Response.data['Technical Analysis: SMA']) {
            const values = Object.values(sma50Response.data['Technical Analysis: SMA']);
            if (values.length > 0 && (values[0] as any)['SMA']) {
                sma50 = parseFloat((values[0] as any)['SMA']);
            }
        }

        // SMA 200
        const sma200Url = `https://www.alphavantage.co/query?function=SMA&symbol=${encodeURIComponent(symbol)}&interval=daily&time_period=200&series_type=close&apikey=${apiKey}`;
        const sma200Response = await http.get(sma200Url);
        let sma200: number | undefined;
        if (sma200Response.statusCode === 200 && sma200Response.data && sma200Response.data['Technical Analysis: SMA']) {
            const values = Object.values(sma200Response.data['Technical Analysis: SMA']);
            if (values.length > 0 && (values[0] as any)['SMA']) {
                sma200 = parseFloat((values[0] as any)['SMA']);
            }
        }

        // RSI
        const rsiUrl = `https://www.alphavantage.co/query?function=RSI&symbol=${encodeURIComponent(symbol)}&interval=daily&time_period=14&series_type=close&apikey=${apiKey}`;
        const rsiResponse = await http.get(rsiUrl);
        let rsi: number | undefined;
        if (rsiResponse.statusCode === 200 && rsiResponse.data && rsiResponse.data['Technical Analysis: RSI']) {
            const values = Object.values(rsiResponse.data['Technical Analysis: RSI']);
            if (values.length > 0 && (values[0] as any)['RSI']) {
                rsi = parseFloat((values[0] as any)['RSI']);
            }
        }

        return { sma50, sma200, rsi };
    }
}