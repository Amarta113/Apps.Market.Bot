import { IHttp, IRead } from '@rocket.chat/apps-engine/definition/accessors';

export interface ILLMService {
    getChatResponse(prompt: string, http: IHttp, read: IRead): Promise<string>;
}