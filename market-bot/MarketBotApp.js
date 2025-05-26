"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketBotApp = void 0;
const App_1 = require("@rocket.chat/apps-engine/definition/App");
const FinanceChatCommand_1 = require("./src/commands/FinanceChatCommand");
const settings_1 = require("@rocket.chat/apps-engine/definition/settings");
class MarketBotApp extends App_1.App {
    constructor(info, logger, accessors) {
        super(info, logger, accessors);
    }
    async extendConfiguration(configuration, environmentRead) {
        await configuration.slashCommands.provideSlashCommand(new FinanceChatCommand_1.FinanceChatCommand());
        await configuration.settings.provideSetting({
            id: 'alpha_vantage_api_key',
            type: settings_1.SettingType.STRING,
            packageValue: '',
            required: true,
            public: false,
            i18nLabel: 'Alpha Vantage API Key',
            i18nDescription: 'API key for Alpha Vantage',
        });
        await configuration.settings.provideSetting({
            id: 'gemini_api_key',
            type: settings_1.SettingType.STRING,
            packageValue: '',
            required: true,
            public: false,
            i18nLabel: 'Gemini API Key',
            i18nDescription: 'API key for Gemini AI',
        });
    }
}
exports.MarketBotApp = MarketBotApp;
