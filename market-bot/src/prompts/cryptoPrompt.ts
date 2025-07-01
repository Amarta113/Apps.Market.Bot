import { INewsArticle } from '../external/NewsService';
import { ICoinGeckoMarketData } from '../external/CoinGeckoService';

export function buildCryptoPrompt(query: string, coinData: ICoinGeckoMarketData | undefined, news: INewsArticle[]): string {
    return `
You are a financial expert providing insights on cryptocurrencies.

User Query: ${query}

Crypto Overview for ${coinData?.name ?? 'N/A'}:
- Current Price (USD): ${coinData?.current_price ?? "N/A"}
- Market Cap: ${coinData?.market_cap ?? "N/A"}
- 24h Change (%): ${coinData?.price_change_percentage_24h ?? "N/A"}
- 24h High: ${coinData?.high_24h ?? "N/A"}
- 24h Low: ${coinData?.low_24h ?? "N/A"}
- Volume: ${coinData?.total_volume ?? "N/A"}
- Circulating Supply: ${coinData?.circulating_supply ?? "N/A"}
- Total Supply: ${coinData?.total_supply ?? "N/A"}
- All-Time High: ${coinData?.ath ?? "N/A"}
- All-Time Low: ${coinData?.atl ?? "N/A"}

Latest Financial News:
${news.length > 0 ? news.map((n, index) => `${index + 1}. ${n.title} (${n.sentiment ?? "N/A"})`).join("\n") : "No relevant news found."}

Provide an insightful response to the user's query based on this data.
    `;
}