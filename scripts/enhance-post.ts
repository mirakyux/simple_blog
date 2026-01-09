import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { enhanceContent } from './ai-utils';

async function main() {
    const filePath = process.argv[2];
    if (!filePath) {
        console.error("Please provide a file path to enhance.");
        process.exit(1);
    }

    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
        console.error(`File not found: ${fullPath}`);
        process.exit(1);
    }

    console.log(`Enhancing post: ${filePath}...`);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const { data, content } = matter(fileContent);

    try {
        const enhanced = await enhanceContent(content, data);

        const now = new Date();
        const formattedDate = now.toISOString().replace('T', ' ').split('.')[0];

        const newData = {
            ...data,
            title: data.title || enhanced.title,
            date: data.date || formattedDate, // Auto-fill date if missing
            description: data.description || enhanced.description,
            tags: enhanced.tags // Overwrite to ensure conciseness based on AI summary
        };

        const updatedContent = matter.stringify(content, newData);
        fs.writeFileSync(fullPath, updatedContent);
        console.log("Post enhanced successfully!");
        console.log("Updated Frontmatter:", newData);
    } catch (error) {
        console.error("Enhancement failed:", error);
        process.exit(1);
    }
}

main();
