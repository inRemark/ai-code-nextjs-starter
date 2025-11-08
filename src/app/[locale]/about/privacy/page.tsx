import { MarkdownRenderer } from '@/shared/ui/markdown-simple/markdown-renderer';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export default async function PrivacyPolicyPage() {
  const markdownPath = path.join(process.cwd(), 'public/legal/privacy-policy.md');
  const markdownContent = await fs.readFile(markdownPath, 'utf8');

  return (
    <MarkdownRenderer
      title="隐私政策"
      description="了解AICoder如何收集、使用和保护您的个人信息"
      content={markdownContent}
    />
  );
}
