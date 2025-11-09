"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@shared/ui/card';
import { PortalLayout } from '@shared/layout/portal-layout';
import { PageContent } from '@/shared/layout/portal-page-content';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface MarkdownRendererProps {
  readonly title: string;
  readonly description?: string;
  readonly content: string;
}

// Markdown component definitions
const MarkdownH1 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1 className="text-2xl font-bold mb-4 text-foreground border-b pb-2" {...props}>
    {children}
  </h1>
);

const MarkdownH2 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className="text-xl font-semibold mb-3 mt-6 text-foreground" {...props}>
    {children}
  </h2>
);

const MarkdownH3 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className="text-lg font-semibold mb-2 mt-4 text-foreground" {...props}>
    {children}
  </h3>
);

const MarkdownP = ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className="mb-4 text-foreground leading-relaxed" {...props}>
    {children}
  </p>
);

const MarkdownUl = ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className="mb-4 ml-6 list-disc text-foreground" {...props}>
    {children}
  </ul>
);

const MarkdownOl = ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
  <ol className="mb-4 ml-6 list-decimal text-foreground" {...props}>
    {children}
  </ol>
);

const MarkdownLi = ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
  <li className="mb-1 text-foreground" {...props}>
    {children}
  </li>
);

const MarkdownStrong = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <strong className="font-semibold text-foreground" {...props}>
    {children}
  </strong>
);

const MarkdownEm = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <em className="italic text-foreground" {...props}>
    {children}
  </em>
);

const MarkdownCode = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground" {...props}>
    {children}
  </code>
);

const MarkdownPre = ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
  <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props}>
    {children}
  </pre>
);

const MarkdownBlockquote = ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4" {...props}>
    {children}
  </blockquote>
);

const MarkdownTable = ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto mb-4">
    <table className="min-w-full border border-border rounded-lg" {...props}>
      {children}
    </table>
  </div>
);

const MarkdownTh = ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className="border border-border px-4 py-2 bg-muted font-semibold text-left" {...props}>
    {children}
  </th>
);

const MarkdownTd = ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="border border-border px-4 py-2" {...props}>
    {children}
  </td>
);

// Markdown components configuration
const markdownComponents = {
  h1: MarkdownH1,
  h2: MarkdownH2,
  h3: MarkdownH3,
  p: MarkdownP,
  ul: MarkdownUl,
  ol: MarkdownOl,
  li: MarkdownLi,
  strong: MarkdownStrong,
  em: MarkdownEm,
  code: MarkdownCode,
  pre: MarkdownPre,
  blockquote: MarkdownBlockquote,
  table: MarkdownTable,
  th: MarkdownTh,
  td: MarkdownTd,
};

export function MarkdownRenderer({ title, description, content }: MarkdownRendererProps) {
  return (
    <PortalLayout>
      <PageContent maxWidth="xl">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            {description && (
              <p className="text-muted-foreground text-lg">{description}</p>
            )}
          </div>
          
          <Card>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={markdownComponents}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </PortalLayout>
  );
}
