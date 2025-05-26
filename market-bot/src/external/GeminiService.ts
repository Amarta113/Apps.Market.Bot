import { IHttp, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ILLMService } from '../llm/ILLMService';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export class GeminiService implements ILLMService {
    async getChatResponse(prompt: string, http: IHttp, read: IRead): Promise<string> {
        const apiKey = await read.getEnvironmentReader().getSettings().getValueById('gemini_api_key');
        if (!apiKey) {
            throw new Error('Gemini API key not set in app settings');
        }

        const payload = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        const response = await http.post(`${GEMINI_API_URL}?key=${apiKey}`, {
            headers: { 'Content-Type': 'application/json' },
            data: payload,
        });

        if (response.data && response.data.error) {
            throw new Error(`Gemini API error: ${response.data.error.message}`);
        }

        if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
            throw new Error('No response from Gemini API');
        }

        return response.data.candidates[0].content.parts[0].text || 'No response generated.';
    }
}