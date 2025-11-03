/**
 * Article Detail Page - 文章详情页面
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, incrementArticleView } from '@/features/articles/services/article.service';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { PortalLayout } from '@/shared/layout/portal-layout';
import { ArrowLeft, Eye, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function ArticleContent({ slug }: { slug: string }) {
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // 增加浏览次数（后台异步执行，不阻塞页面渲染）
  incrementArticleView(article.id).catch((error) => {
    console.error('Failed to increment view:', error);
  });

  return (
    <article className="space-y-8">
      {/* 返回按钮 */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/articles" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回文章列表
        </Link>
      </Button>

      {/* 文章头部 */}
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">{article.title}</h1>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{article.author?.name || '匿名'}</span>
          </div>
          {article.publishedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(article.publishedAt), 'PPP', { locale: zhCN })}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{article.viewCount} 次浏览</span>
          </div>
        </div>

        {/* 标签 */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 封面图 */}
        {article.coverImage && (
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* 文章内容 */}
      <Card>
        <CardHeader>
          {article.excerpt && (
            <p className="text-lg text-muted-foreground italic">{article.excerpt}</p>
          )}
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </CardContent>
      </Card>

      {/* 底部导航 */}
      <div className="flex justify-between items-center pt-8 border-t">
        <Button variant="outline" asChild>
          <Link href="/articles">← 返回文章列表</Link>
        </Button>
        {article.author && (
          <Link
            href={`/articles?authorId=${article.author.id}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            查看作者更多文章 →
          </Link>
        )}
      </div>
    </article>
  );
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <PortalLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Suspense
          fallback={
            <div className="space-y-8 animate-pulse">
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="aspect-video bg-muted rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/6" />
              </div>
            </div>
          }
        >
          <ArticleContent slug={slug} />
        </Suspense>
      </div>
    </PortalLayout>
  );
}

// 生成静态参数
export async function generateStaticParams() {
  // 在生产环境中，这里应该返回所有已发布文章的 slug
  // 为了避免构建时间过长，这里返回空数组，使用 ISR
  return [];
}

// 启用 ISR，每 60 秒重新验证
export const revalidate = 60;
