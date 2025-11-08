import { MarkdownRenderer } from '@/shared/ui/markdown-simple/markdown-renderer';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export default async function CookiePolicyPage() {
  const markdownPath = path.join(process.cwd(), 'public/legal/cookie-policy.md');
  const markdownContent = await fs.readFile(markdownPath, 'utf8');

  return (
    <MarkdownRenderer
      title="Cookie政策"
      description="了解AICoder如何使用cookies来改善您的体验"
      content={markdownContent}
    />
  );
}
