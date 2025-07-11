import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import {
    IRead,
    IModify,
    IHttp,
    IPersistence,
} from "@rocket.chat/apps-engine/definition/accessors";
import { MarketDataService, IMarketData } from "../external/MarketDataService";
import { NotifierService } from "../service/NotifyUserService";

// Define formatting functions separately
function formatCryptoMessage(marketData: IMarketData): string {
    return (
        `🪙 *${marketData.name}* (${marketData.symbol})\n` +
        `• Price: $${marketData.price}\n` +
        `• Market Cap: $${marketData.market_cap}\n` +
        `• 24h Change: ${marketData.price_change_percentage_24h}%\n` +
        `• 24h High: $${marketData.high_24h}\n` +
        `• 24h Low: $${marketData.low_24h}\n` +
        `• Volume: ${marketData.total_volume}\n` +
        `• Circulating Supply: ${marketData.circulating_supply}\n` +
        `• Total Supply: ${marketData.total_supply}\n` +
        `• All-Time High: $${marketData.ath}\n` +
        `• All-Time Low: $${marketData.atl}`
    );
}

function formatStockMessage(marketData: IMarketData): string {
    return (
        `📈 *${marketData.symbol}*\n` +
        `• Price: $${marketData.price}\n` +
        `• Open: $${marketData.open}\n` +
        `• High: $${marketData.high}\n` +
        `• Low: $${marketData.low}\n` +
        `• Previous Close: $${marketData.previousClose}\n` +
        `• Change: $${marketData.change} (${marketData.changePercent})\n` +
        `• Volume: ${marketData.volume}\n` +
        (marketData.sma50 ? `• 50-day SMA: $${marketData.sma50}\n` : "") +
        (marketData.sma200 ? `• 200-day SMA: $${marketData.sma200}\n` : "") +
        (marketData.rsi ? `• RSI: ${marketData.rsi}\n` : "")
    );
}

export class MarketUpdateCommand implements ISlashCommand {
    public command = "marketupdate";
    public i18nDescription =
        "Fetches real-time market updates for stocks and crypto";
    public i18nParamsExample = "[symbol]";
    public providesPreview = false;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence
    ): Promise<void> {
        const [symbol] = context.getArguments();
        if (!symbol) {
            await NotifierService.notifyUser(
                modify,
                context,
                "Please provide a stock or crypto symbol."
            );
            return;
        }

        const marketData = (await MarketDataService.getMarketData(
            symbol,
            http,
            read,
            true
        )) as IMarketData;

        let message: string;
        if (marketData && marketData.price) {
            message = marketData.isCrypto
                ? formatCryptoMessage(marketData)
                : formatStockMessage(marketData);
        } else {
            message = `⚠️ Market data for ${symbol} is not available.`;
        }

        await NotifierService.notifyUser(modify, context, message);
    }
}
