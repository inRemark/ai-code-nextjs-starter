import { Suspense } from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authConfig } from '@features/auth/services/next-auth.config';
import { getArticles } from '@/features/articles/services/article.service';
import type { Article } from '@/features/articles/types/article.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { ConsoleLayout } from '@/shared/layout/console-layout';
import { redirect } from 'next/navigation';
import { PlusCircle, Edit, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

async function ArticlesContent() {
  const session = await getServerSession(authConfig);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const { articles } = await getArticles({
    authorId: session.user.id,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    limit: 50,
  });

  return (
    <div className="space-y-6">
      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">全部文章</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">已发布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {articles.filter((a: Article) => a.published).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">草稿</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {articles.filter((a: Article) => !a.published).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 文章列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>我的文章</CardTitle>
              <CardDescription>管理您创建的所有文章</CardDescription>
            </div>
            <Button asChild>
              <Link href="/console/articles/new" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                新建文章
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>您还没有创建任何文章</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/console/articles/new">创建第一篇文章</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article: Article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/articles/${article.slug}`}
                        className="text-lg font-semibold hover:underline"
                      >
                        {article.title}
                      </Link>
                      <Badge variant={article.published ? 'default' : 'secondary'}>
                        {article.published ? '已发布' : '草稿'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{article.viewCount} 次浏览</span>
                      </div>
                      <span>
                        更新于{' '}
                        {format(new Date(article.updatedAt), 'PPP', { locale: zhCN })}
                      </span>
                    </div>
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 5).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/console/articles/${article.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" asChild>
                      <Link href={`/console/articles/${article.id}/delete`}>
                        <Trash2 className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConsoleArticlesPage() {
  return (
    <ConsoleLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-3">
                      <div className="h-4 bg-muted rounded w-20" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 bg-muted rounded w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-muted rounded" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          }
        >
          <ArticlesContent />
        </Suspense>
      </div>
    </ConsoleLayout>
  );
}

export const metadata = {
  title: '文章管理 - 控制台',
  description: '管理您创建的所有文章',
};
