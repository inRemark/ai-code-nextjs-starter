import { MarkdownRenderer } from '@/shared/ui/markdown-simple/markdown-renderer';
import { promises as fs } from 'fs';
import path from 'path';

export default async function TermsOfServicePage() {
  // 读取服务条款markdown文件
  const markdownPath = path.join(process.cwd(), 'public/legal/terms-of-service.md');
  const markdownContent = await fs.readFile(markdownPath, 'utf8');

  return (
    <MarkdownRenderer
      title="服务条款"
      description="AICoder服务使用条款和条件"
      content={markdownContent}
    />
  );
}
