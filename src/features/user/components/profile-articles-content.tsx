"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { FileText, Eye, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  viewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const fetchUserArticles = async (): Promise<Article[]> => {
  const response = await fetch('/api/articles?authorId=me');
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  return response.json();
};

export const ProfileArticlesContent: React.FC = () => {
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['user-articles'],
    queryFn: fetchUserArticles,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              我的文章
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            我的文章
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-destructive">
            <p>加载失败，请稍后重试</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            我的文章
          </span>
          <Button asChild size="sm">
            <Link href="/console/articles">
              <Plus className="h-4 w-4 mr-2" />
              新建文章
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!articles || articles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">暂无文章</p>
            <Button asChild>
              <Link href="/console/articles">
                <Plus className="h-4 w-4 mr-2" />
                创建第一篇文章
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="text-lg font-semibold hover:text-primary transition-colors"
                  >
                    {article.title}
                  </Link>
                  <Badge variant={article.published ? "default" : "secondary"}>
                    {article.published ? "已发布" : "草稿"}
                  </Badge>
                </div>
                
                {article.excerpt && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {article.viewCount} 次浏览
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(article.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}
                  </span>
                  {article.tags.length > 0 && (
                    <div className="flex gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/console/articles?edit=${article.id}`}>
                      编辑
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/articles/${article.slug}`}>
                      查看
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="text-center pt-4">
              <Button asChild variant="outline">
                <Link href="/console/articles">
                  查看全部文章
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
