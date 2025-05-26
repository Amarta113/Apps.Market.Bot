import { IHttp } from '@rocket.chat/apps-engine/definition/accessors';

export interface INewsArticle {
    title: string;
    url?: string;
    sentiment?: string;
    [key: string]: any;
}

const REDDIT_NEWS_URL = 'https://www.reddit.com/r/stocks/new.json?limit=5';

export class NewsService {
    static async getLatestNews(http: IHttp): Promise<INewsArticle[]> {
        const response = await http.get(REDDIT_NEWS_URL, {
            headers: { 'User-Agent': 'RocketChatBot/1.0' }
        });

        if (!response.data || !response.data.data || !response.data.data.children) {
            return [];
        }

        return response.data.data.children.map((child: any) => ({
            title: child.data.title,
            url: `https://reddit.com${child.data.permalink}`,
            sentiment: 'Neutral', 
        }));
    }
}