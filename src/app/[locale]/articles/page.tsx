import { Suspense } from 'react';
import Link from 'next/link';
import { createPageMetadataGenerator } from '@/lib/seo';
import { getArticles } from '@/features/articles/services/article.service';
import type { Article } from '@/features/articles/types/article.types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { PortalLayout } from '@/shared/layout/portal-layout';
import { formatDistance } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ArticlesListProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    tag?: string;
  }>;
}

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    tag?: string;
  }>;
}

// 生成多语言 SEO metadata
export const generateMetadata = createPageMetadataGenerator('articles');

async function ArticlesList({ searchParams }: ArticlesListProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search;
  const tag = params.tag;

  const { articles, totalPages, hasNext, hasPrevious } = await getArticles({
    page,
    limit: 12,
    published: true,
    search,
    tags: tag ? [tag] : undefined,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });

  return (
    <div className="space-y-8">
      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: Article) => (
          <Link key={article.id} href={`/articles/${article.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              {article.coverImage && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <span>{article.author?.name || '匿名'}</span>
                  <span>•</span>
                  <span>
                    {article.publishedAt
                      ? formatDistance(new Date(article.publishedAt), new Date(), {
                          addSuffix: true,
                          locale: zhCN,
                        })
                      : '未发布'}
                  </span>
                  <span>•</span>
                  <span>{article.viewCount} 次浏览</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {article.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex flex-wrap gap-2">
                  {article.tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{article.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {hasPrevious && (
            <Button variant="outline" asChild>
              <Link href={`/articles?page=${page - 1}${search ? `&search=${search}` : ''}${tag ? `&tag=${tag}` : ''}`}>
                上一页
              </Link>
            </Button>
          )}
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            第 {page} / {totalPages} 页
          </span>
          {hasNext && (
            <Button variant="outline" asChild>
              <Link href={`/articles?page=${page + 1}${search ? `&search=${search}` : ''}${tag ? `&tag=${tag}` : ''}`}>
                下一页
              </Link>
            </Button>
          )}
        </div>
      )}

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">暂无文章</p>
        </div>
      )}
    </div>
  );
}

export default async function ArticlesPage(props: PageProps) {
  return (
    <PortalLayout>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="space-y-8">
          {/* 页面标题 */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">文章中心</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              探索技术文章、开发指南和最佳实践
            </p>
          </div>

          {/* 文章列表 */}
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-full animate-pulse">
                    <div className="aspect-video bg-muted rounded-t-lg" />
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-5/6" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          >
            <ArticlesList searchParams={props.searchParams} />
          </Suspense>
        </div>
      </div>
    </PortalLayout>
  );
}
