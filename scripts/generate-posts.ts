import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';
import RSS from 'rss';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/posts.json');
const RSS_OUTPUT = path.join(process.cwd(), 'public/rss.xml');
const SITEMAP_OUTPUT = path.join(process.cwd(), 'public/sitemap.xml');

// Configuration from environment variables
const SITE_CONFIG = {
  title: process.env.VITE_SITE_TITLE || 'My Custom Blog',
  description: process.env.VITE_SITE_DESCRIPTION || 'A vast wilderness, a profound void. Within this expanse, the spark of creation awaits, contingent only upon the hour mirakyux transcends their own stillness.',
  url: process.env.VITE_SITE_URL || 'https://example.com',
  author: process.env.VITE_AUTHOR_NAME || 'Your Name',
  email: process.env.VITE_AUTHOR_EMAIL || 'your@email.com',
  language: process.env.VITE_LANGUAGE || 'en'
};

interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  content: string;
  wordCount: number;
  readingTime: number;
}

import { enhanceContent } from './ai-utils';

async function generatePosts() {
  console.log('Generating posts...');

  const postFiles = await glob('*.md', { cwd: POSTS_DIR });
  const posts: PostMetadata[] = [];

  const feed = new RSS({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    feed_url: `${SITE_CONFIG.url}/rss.xml`,
    site_url: SITE_CONFIG.url,
    managingEditor: `${SITE_CONFIG.author} (${SITE_CONFIG.email})`,
    webMaster: `${SITE_CONFIG.author} (${SITE_CONFIG.email})`,
    language: SITE_CONFIG.language,
    pubDate: new Date().toUTCString(),
    ttl: 60,
  });

  for (const file of postFiles) {
    const filePath = path.join(POSTS_DIR, file);
    let fileContent = fs.readFileSync(filePath, 'utf-8');
    let { data, content } = matter(fileContent);

    // Title Extraction: Use the first H1 as the title if present
    const h1Match = content.match(/^#\s+(.*)/m);
    if (h1Match) {
      data.title = h1Match[1].trim();
      content = content.replace(/^#\s+.*\n?/m, '').trim(); // Remove H1 from content
    }

    // AI Fallback: If title is missing, try to enhance the post
    if (!data.title || data.title === 'Untitled') {
      console.log(`Auto-enhancing post metadata for: ${file}...`);
      try {
        const enhanced = await enhanceContent(content, data);
        const now = new Date();
        const formattedDate = now.toISOString().replace('T', ' ').split('.')[0];

        data = {
          ...data,
          title: data.title || enhanced.title || 'Untitled',
          date: data.date || formattedDate,
          description: data.description || enhanced.description || '',
          tags: enhanced.tags // Overwrite tags
        };
        // Persist the enhanced metadata back to the file
        const updatedFileContent = matter.stringify(content, data);
        fs.writeFileSync(filePath, updatedFileContent);
        console.log(`Successfully enhanced ${file}`);
      } catch (error) {
        console.error(`AI Enhancement failed for ${file}:`, error);
      }
    }

    const slug = file.replace(/\.md$/, '');

    const formatDate = (dateInput: any) => {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return new Date().toISOString().replace('T', ' ').split('.')[0];
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const getWordCount = (text: string) => {
      const plainText = text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[#*`~[\]()<>!-]/g, '')
        .trim();
      const cjk = plainText.match(/[\u4e00-\u9fa5]/g)?.length || 0;
      const english = plainText.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
      return cjk + english;
    };

    // Asset Handling: Scan for relative image paths like ./images/...
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    let match;
    let processedContent = content;

    while ((match = imageRegex.exec(content)) !== null) {
      const imageUrl = match[1];
      if (imageUrl.startsWith('./')) {
        const relativePath = imageUrl.replace('./', '');
        const sourcePath = path.join(POSTS_DIR, relativePath);
        const targetDir = path.join(process.cwd(), 'public', 'images', 'posts', slug);
        const targetPath = path.join(targetDir, path.basename(relativePath));

        if (fs.existsSync(sourcePath)) {
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          fs.copyFileSync(sourcePath, targetPath);

          // Rewrite path for frontend
          const publicPath = `/images/posts/${slug}/${path.basename(relativePath)}`;
          processedContent = processedContent.replace(imageUrl, publicPath);
          console.log(`  Copied asset: ${relativePath} -> ${publicPath}`);
        }
      }
    }

    const post: PostMetadata = {
      slug,
      title: data.title || 'Untitled',
      date: data.date ? formatDate(data.date) : formatDate(new Date()),
      description: data.description || '',
      tags: data.tags || [],
      content: processedContent, // Use the content with rewritten paths
      wordCount: getWordCount(content),
      readingTime: Math.ceil(getWordCount(content) / 200),
    };

    posts.push(post);

    feed.item({
      title: post.title,
      description: post.description,
      url: `${SITE_CONFIG.url}/#${encodeURIComponent(post.slug)}`,
      date: post.date,
      categories: post.tags,
    });
  }

  // Sort posts by date descending
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Generate Sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_CONFIG.url}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${posts.map(post => `  <url>
    <loc>${SITE_CONFIG.url}/#${encodeURIComponent(post.slug)}</loc>
    <lastmod>${post.date.split(' ')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  // Ensure directories exist
  if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
  fs.writeFileSync(RSS_OUTPUT, feed.xml({ indent: true }));
  fs.writeFileSync(SITEMAP_OUTPUT, sitemap);

  console.log(`Successfully generated ${posts.length} posts.`);
}

generatePosts().catch(console.error);
