import { INewsArticle } from '../external/NewsService';
import { IMarketData } from '../external/MarketDataService';
import { ITechnicalIndicators } from '../external/AlphaVantage'; // Update this path if needed

export function buildStockPrompt(
    query: string,
    ticker: string,
    marketData: IMarketData,
    indicators: ITechnicalIndicators,
    news: INewsArticle[]
): string {
    return `
You are a financial expert providing insights on stock markets, technical indicators, and news sentiment analysis.

**User Query:** ${query}

📊 **Market Overview for ${ticker}:**
- 💰 *Current Price:* ${marketData.price ?? "N/A"}
- 📈 *50-day Moving Avg:* ${indicators.sma50 ?? "N/A"}
- 📉 *200-day Moving Avg:* ${indicators.sma200 ?? "N/A"}
- 📊 *Relative Strength Index (RSI):* ${indicators.rsi ?? "N/A"}

📰 **Latest Financial News:**
${news.length > 0 ? news.map((n, index) => `${index + 1}. ${n.title} (${n.sentiment ?? "N/A"})`).join("\n") : "No relevant news found."}

🔍 Provide an insightful response to the user's query based on this data.
    `;
}