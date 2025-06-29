import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { IRead, IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { WatchlistService } from "../service/WatchlistService";
import { NotifierService } from "../service/NotifyUserService";
export class ShowWatchlistCommand implements ISlashCommand {
    public command = "showwatchlist";
    public i18nDescription = "Display your current watchlist";
    public i18nParamsExample = "";
    public providesPreview = false;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify
    ): Promise<void> {
        const sender = context.getSender();
        const service = new WatchlistService();
        const list = await service.get(sender.id, read);

        const text = list.length
            ? `Your Watchlist:\n- ${list.join("\n- ")}`
            : "Your watchlist is empty. Add items using `/addtowatchlist [TICKER]`.";

        await NotifierService.notifyUser(modify, context, text);
    }
}
