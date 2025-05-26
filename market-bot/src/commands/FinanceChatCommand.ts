import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { IRead, IModify, IHttp, IPersistence, ILogger } from '@rocket.chat/apps-engine/definition/accessors';
import { AlphaVantageService, IMarketData, ITechnicalIndicators } from '../external/AlphaVantage';
import { CoinGeckoService, ICoinGeckoMarketData } from '../external/CoinGeckoService';
import { NewsService, INewsArticle } from '../external/NewsService';
import { GeminiService } from '../external/GeminiService';
import { buildCryptoPrompt } from '../prompts/cryptoPrompt';
import { buildStockPrompt } from '../prompts/stockPrompt';

export class FinanceChatCommand implements ISlashCommand {
    public command = 'financechat';
    public i18nDescription = 'Get financial insights, stock and crypto data, and smart summaries.';
    public i18nParamsExample = '[stock_symbol or crypto_ticker] or [financial_query]';
    public providesPreview = false;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence
    ): Promise<void> {
        const logger: ILogger | undefined = (this as any).logger;
        const llm = new GeminiService(); 
        try {
            const args: string[] = context.getArguments();
            if (!args || args.length === 0) {
                await this.notifyUser(
                    modify,
                    context,
                    '⚠️ Please provide a stock or crypto ticker (e.g., AAPL, BTC) or a financial question.'
                );
                return;
            }

            const query: string = args.join(' ').trim();
            if (!query.match(/^[\w\s\.\-\$]+$/)) {
                await this.notifyUser(
                    modify,
                    context,
                    '⚠️ Invalid input. Please enter a valid ticker or question.'
                );
                return;
            }

    
            const tickers = args.filter(arg => /^[A-Za-z0-9]+$/.test(arg));
            const isMultiTicker = tickers.length === args.length && tickers.length > 1;
            const isSingleTicker = tickers.length === 1 && args.length === 1;

            let prompt: string;
            let news: INewsArticle[] = [];
            let responseText: string;

            if (isSingleTicker) {
                const ticker = tickers[0].toUpperCase();
                let coins: Array<{ id: string; symbol: string; name: string }> = [];
                try {
                    coins = await CoinGeckoService.searchCoins(ticker, http);
                } catch (err) {
                    logger?.error?.(`CoinGecko search error: ${err}`);
                }
                const coinMatch = coins.find(c => c.symbol.toUpperCase() === ticker);

                if (coinMatch) {
                    let coinData: ICoinGeckoMarketData | undefined;
                    try {
                        coinData = await CoinGeckoService.getMarketData(coinMatch.id, http);
                    } catch (err) {
                        logger?.error?.(`CoinGecko market data error: ${err}`);
                    }
                    try {
                        news = await NewsService.getLatestNews(http);
                    } catch (err) {
                        logger?.error?.(`NewsService error: ${err}`);
                    }
                    prompt = buildCryptoPrompt(query, coinData, news);
                } else {
                    let marketData: IMarketData = {};
                    let indicators: ITechnicalIndicators = {};
                    try {
                        marketData = await AlphaVantageService.getMarketData(ticker, http, read) ?? {};
                        indicators = await AlphaVantageService.getTechnicalIndicators(ticker, http, read) ?? {};
                    } catch (err) {
                        logger?.error?.(`AlphaVantage error: ${err}`);
                    }
                    try {
                        news = await NewsService.getLatestNews(http);
                    } catch (err) {
                        logger?.error?.(`NewsService error: ${err}`);
                    }

                    if (!marketData.price) {
                        await this.notifyUser(
                            modify,
                            context,
                            `⚠️ Market data for *${ticker}* is unavailable. Please check the symbol.`
                        );
                        return;
                    }
                    prompt = buildStockPrompt(query, ticker, marketData, indicators, news);
                }
            } else if (isMultiTicker) {
                prompt = `Provide a financial summary for the following tickers: ${tickers.join(', ')}.`;
            } else {
                prompt = query;
            }

            try {
                responseText = await llm.getChatResponse(prompt, http, read);
            } catch (err) {
                logger?.error?.(`LLMService error: ${err}`);
                responseText = "⚠️ Sorry, I couldn't get a response from the AI service at this time.";
            }

            await this.notifyUser(modify, context, responseText);

        } catch (error: any) {
            logger?.error?.(`Error in /financechat command: ${error?.message ?? error}`);
            await this.notifyUser(
                modify,
                context,
                `⚠️ Error executing command: ${error?.message ?? "Unknown error"}`
            );
        }
    }

    private async notifyUser(modify: IModify, context: SlashCommandContext, text: string): Promise<void> {
        await modify.getNotifier().notifyUser(
            context.getSender(),
            modify.getCreator().startMessage()
                .setText(text)
                .setRoom(context.getRoom())
                .getMessage()
        );
    }
}