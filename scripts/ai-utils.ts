import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface FrontmatterData {
  title?: string;
  description?: string;
  tags?: string[];
  date?: string;
  [key: string]: any;
}

interface EnhancedContent {
  title: string;
  description: string;
  tags: string[];
}

/**
 * 使用 AI 增强文章内容，生成缺失的 Frontmatter 字段
 * 只会生成缺失的字段，不会覆盖已有内容
 */
export async function enhanceContent(
  content: string,
  existingData: FrontmatterData = {}
): Promise<EnhancedContent> {
  const provider = process.env.VITE_LLM_PROVIDER || 'chatgpt';
  
  try {
    if (provider === 'gemini') {
      return enhanceWithGemini(content, existingData);
    } else {
      return enhanceWithOpenAI(content, existingData);
    }
  } catch (error) {
    console.error('AI enhancement failed:', error);
    // Return defaults on failure
    return {
      title: existingData.title || 'Untitled',
      description: existingData.description || '',
      tags: existingData.tags || [],
    };
  }
}

/**
 * 使用 OpenAI 进行内容增强
 */
async function enhanceWithOpenAI(
  content: string,
  existingData: FrontmatterData
): Promise<EnhancedContent> {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.LLM_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const openai = new OpenAI({
    apiKey,
    baseURL,
  });

  // 构建提示词，只请求缺失的字段
  const missingFields = getMissingFields(existingData);
  
  const prompt = `Analyze this blog post content and generate ONLY the missing frontmatter fields.

Content:
${content.substring(0, 2000)}${content.length > 2000 ? '...' : ''}

Missing fields to generate: ${missingFields.join(', ')}

Existing fields (DO NOT modify these):
${JSON.stringify(existingData, null, 2)}

Return ONLY a JSON object with the missing fields. Format:
{
  ${missingFields.includes('title') ? '"title": "Generated title"' : ''}
  ${missingFields.includes('description') ? '"description": "Brief description in 1-2 sentences"' : ''}
  ${missingFields.includes('tags') ? '"tags": ["tag1", "tag2", "tag3"]' : ''}
}

Return valid JSON only, no markdown, no explanations.`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that generates blog post frontmatter. Return ONLY valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  const generatedText = response.choices[0]?.message?.content || '{}';
  
  // 解析 JSON，清理可能的 markdown 标记
  const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
  const jsonString = jsonMatch ? jsonMatch[0] : generatedText;
  
  try {
    const generated = JSON.parse(jsonString);
    
    // 合并已有字段和生成字段
    return {
      title: existingData.title || generated.title || 'Untitled',
      description: existingData.description || generated.description || '',
      tags: existingData.tags || generated.tags || [],
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return {
      title: existingData.title || 'Untitled',
      description: existingData.description || '',
      tags: existingData.tags || [],
    };
  }
}

/**
 * 使用 Google Gemini 进行内容增强
 */
async function enhanceWithGemini(
  content: string,
  existingData: FrontmatterData
): Promise<EnhancedContent> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const missingFields = getMissingFields(existingData);
  
  const prompt = `分析这篇博客文章内容，只生成缺失的 Frontmatter 字段。

文章内容：
${content.substring(0, 2000)}${content.length > 2000 ? '...' : ''}

需要生成的缺失字段：${missingFields.join(', ')}

已有字段（不要修改）：
${JSON.stringify(existingData, null, 2)}

只返回一个 JSON 对象，包含缺失的字段。格式：
{
  ${missingFields.includes('title') ? '"title": "生成的标题"' : ''}
  ${missingFields.includes('description') ? '"description": "1-2 句话的简短描述"' : ''}
  ${missingFields.includes('tags') ? '"tags": ["标签 1", "标签 2", "标签 3"]' : ''}
}

只返回有效的 JSON，不要 markdown，不要解释。`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const generatedText = response.text();

  // 解析 JSON
  const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
  const jsonString = jsonMatch ? jsonMatch[0] : generatedText;
  
  try {
    const generated = JSON.parse(jsonString);
    
    return {
      title: existingData.title || generated.title || 'Untitled',
      description: existingData.description || generated.description || '',
      tags: existingData.tags || generated.tags || [],
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return {
      title: existingData.title || 'Untitled',
      description: existingData.description || '',
      tags: existingData.tags || [],
    };
  }
}

/**
 * 获取缺失的字段列表
 */
function getMissingFields(data: FrontmatterData): string[] {
  const requiredFields = ['title', 'description', 'tags'];
  const missing: string[] = [];

  for (const field of requiredFields) {
    if (!data[field] || data[field] === '' || (Array.isArray(data[field]) && data[field].length === 0)) {
      missing.push(field);
    }
  }

  return missing;
}



/**
 * 智能更新 Frontmatter
 * 1. 保留已有字段
 * 2. 填充缺失字段
 */
export async function smartUpdateFrontmatter(
  content: string,
  existingData: FrontmatterData
): Promise<FrontmatterData> {
  console.log('Smart updating frontmatter...');
  console.log('Existing fields:', Object.keys(existingData));

  // 检查缺失的字段
  const missingFields = getMissingFields(existingData);
  
  if (missingFields.length > 0) {
    console.log('Missing fields:', missingFields);
    
    // 使用 AI 生成缺失字段
    const enhanced = await enhanceContent(content, existingData);
    
    // 合并数据（保留已有字段）
    const updatedData = {
      ...existingData,
      title: existingData.title || enhanced.title,
      description: existingData.description || enhanced.description,
      tags: existingData.tags?.length ? existingData.tags : enhanced.tags,
      date: existingData.date || new Date().toISOString().replace('T', ' ').split('.')[0],
    };
    
    console.log('✓ Frontmatter updated');
    return updatedData;
  } else {
    console.log('✓ All required fields present, skipping AI generation');
    return existingData;
  }
}
