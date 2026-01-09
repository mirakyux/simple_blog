import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const provider = process.env.VITE_LLM_PROVIDER || 'chatgpt';
const openaiKey = process.env.OPENAI_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
const llmModel = process.env.LLM_MODEL;
const llmBaseUrl = process.env.LLM_BASE_URL;

export async function enhanceContent(content: string, currentFrontmatter: any) {
    const prompt = `
You are an expert ghostwriter and blog editor. 
Analyze the following blog post content and provide:
1. An SEO-optimized, catchy title (if existing one is weak).
2. A 1-2 sentence compelling summary for the description field.
3. A curated list of exactly 3-4 high-level "Category Tags". These should be broad nouns that summarize the *theme* (e.g., "Engineering", "Design", "Reflections"). Avoid specific feature names. Output MUST be Title Case.

Current Title: ${currentFrontmatter.title || 'Untitled'}
Current Description: ${currentFrontmatter.description || 'N/A'}
Current Tags: ${currentFrontmatter.tags?.join(', ') || 'None'}

Content:
${content.slice(0, 4000)}

Return ONLY a JSON object with the following structure:
{
  "title": "...",
  "description": "...",
  "tags": ["tag1", "tag2", "..."]
}
`;

    if (provider === 'chatgpt') {
        if (!openaiKey) throw new Error("OPENAI_API_KEY is missing");
        const openai = new OpenAI({
            apiKey: openaiKey,
            baseURL: llmBaseUrl || undefined
        });
        const response = await openai.chat.completions.create({
            model: llmModel || "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });
        return JSON.parse(response.choices[0].message.content || '{}');
    } else if (provider === 'gemini') {
        if (!geminiKey) throw new Error("GEMINI_API_KEY is missing");
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: llmModel || "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : '{}');
    }

    throw new Error(`Unsupported provider: ${provider}`);
}
