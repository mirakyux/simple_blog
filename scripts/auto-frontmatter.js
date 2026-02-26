#!/usr/bin/env node

/**
 * AI Frontmatter 自动填充脚本
 * 在 commit 前自动检查并填充 Markdown 文章的 Frontmatter
 * 
 * 使用方式：
 * node scripts/auto-frontmatter.js file1.md file2.md ...
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 动态导入 AI 模块
let enhanceContent;
try {
  const aiUtils = await import('./ai-utils.js');
  enhanceContent = aiUtils.enhanceContent;
} catch (error) {
  console.log('⚠️  Could not load AI utilities, using basic checks only');
}

const files = process.argv.slice(2);

if (files.length === 0) {
  console.log('✓ No Markdown files to check');
  process.exit(0);
}

console.log('🤖 Checking frontmatter for:', files.join(', '));

let hasChanges = false;
let aiUsed = false;

// 检查是否配置了 AI
const hasOpenAI = process.env.OPENAI_API_KEY;
const hasGemini = process.env.GEMINI_API_KEY;
const useAI = (hasOpenAI || hasGemini) && enhanceContent;

if (!useAI) {
  console.log('⚠️  No AI configured (set OPENAI_API_KEY or GEMINI_API_KEY)');
  console.log('   Will only add missing date field\n');
}

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`⚠️  File not found: ${file}`);
    continue;
  }
  
  console.log(`\n📝 ${file}`);
  
  const content = fs.readFileSync(file, 'utf-8');
  const { data, content: body } = matter(content);
  
  const missingFields = [];
  if (!data.title || data.title === '' || data.title === 'Untitled') {
    missingFields.push('title');
  }
  if (!data.description || data.description === '') {
    missingFields.push('description');
  }
  if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
    missingFields.push('tags');
  }
  
  // 检查是否是修改（已有 date 且不是今天新建的）
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const dateStr = String(data.date || '');
  const isExistingPost = data.date && !dateStr.startsWith(today);
  
  // 检查文件是否有内容修改（通过 git diff）
  let hasContentChanges = false;
  if (isExistingPost) {
    try {
      // 获取暂存前的版本
      const diff = execSync(`git diff HEAD -- "${file}"`, { encoding: 'utf-8' });
      hasContentChanges = diff.trim().length > 0;
      
      if (hasContentChanges) {
        console.log('  📝 Content modified');
      }
    } catch (error) {
      // 新文件没有 git 历史，忽略错误
      console.log('  🆕 New file');
    }
  }
  
  if (missingFields.length === 0 && data.date && !hasContentChanges) {
    console.log('  ✓ Complete');
    continue;
  }
  
  // 如果有缺失字段且有 AI，使用 AI 填充
  if (missingFields.length > 0 && useAI) {
    try {
      console.log(`  🤖 Generating: ${missingFields.join(', ')}`);
      
      const enhanced = await enhanceContent(body, data);
      
      const updatedData = {
        ...data,
        title: data.title || enhanced.title,
        description: data.description || enhanced.description,
        tags: (data.tags && data.tags.length > 0) ? data.tags : enhanced.tags,
        date: data.date || new Date().toISOString().replace('T', ' ').split('.')[0],
      };
      
      // 如果是修改，添加 lastmod
      if (isExistingPost && hasContentChanges) {
        updatedData.lastmod = now.toISOString().replace('T', ' ').split('.')[0];
        console.log('  ✓ Added lastmod');
      }
      
      const updatedContent = matter.stringify(body, updatedData);
      fs.writeFileSync(file, updatedContent);
      
      console.log('  ✓ Updated with AI');
      aiUsed = true;
      hasChanges = true;
      
    } catch (error) {
      console.log(`  ⚠️  AI failed: ${error.message}`);
      console.log('  ⚠️  Please fill manually');
    }
  } else if (!data.date) {
    // 没有 AI，只添加 date
    const formattedDate = now.toISOString().replace('T', ' ').split('.')[0];
    
    data.date = formattedDate;
    const updatedContent = matter.stringify(body, data);
    fs.writeFileSync(file, updatedContent);
    
    console.log(`  ✓ Added date: ${formattedDate}`);
    hasChanges = true;
  } else if (isExistingPost && hasContentChanges) {
    // 有修改，添加 lastmod
    const formattedLastmod = now.toISOString().replace('T', ' ').split('.')[0];
    data.lastmod = formattedLastmod;
    
    const updatedContent = matter.stringify(body, data);
    fs.writeFileSync(file, updatedContent);
    
    console.log(`  ✓ Added lastmod: ${formattedLastmod}`);
    hasChanges = true;
  } else if (missingFields.length > 0) {
    console.log(`  ❌ Missing: ${missingFields.join(', ')}`);
    console.log('  💡 Configure AI or fill manually');
    hasChanges = true;
  }
}

console.log('');
if (hasChanges) {
  if (aiUsed) {
    console.log('✓ Frontmatter updated with AI ✨');
  } else {
    console.log('⚠️  Some files need attention:');
    console.log('   - Fill missing fields manually, OR');
    console.log('   - Configure AI: echo "GEMINI_API_KEY=xxx" >> .env');
  }
  
  // 如果有更改，自动 add 到 git
  console.log('\n💡 Auto-staging updated files...');
  try {
    execSync(`git add ${files.join(' ')}`, { stdio: 'ignore' });
    console.log('✓ Files staged');
  } catch (error) {
    console.log('⚠️  Could not auto-stage, please commit manually');
  }
  
  process.exit(0);
} else {
  console.log('✓ All frontmatter is complete!');
  process.exit(0);
}
