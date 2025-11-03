"use client";
import { logger } from '@logger';
import React, { useState, useEffect } from 'react';
import { PortalLayout } from '@shared/layout/portal-layout';
import { PageContent } from '@shared/layout/page-content';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { 
  Search, 
  BookOpen, 
  Rocket, 
  Mail, 
  Users, 
  Settings, 
  AlertCircle, 
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Eye,
  ThumbsUp,
  MessageCircle,
  Phone,
  Plus,
  Upload,
  Send,
  Book
} from 'lucide-react';
import { HelpPageData, HelpArticle } from '@/features/help';

const iconMap = {
  rocket: Rocket,
  mail: Mail,
  users: Users,
  settings: Settings,
  'alert-circle': AlertCircle,
  shield: Shield,
  plus: Plus,
  upload: Upload,
  send: Send,
  book: Book,
  'message-circle': MessageCircle,
  phone: Phone,
};

export default function HelpPage() {
  const [helpData, setHelpData] = useState<HelpPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<HelpArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchHelpData();
  }, []);

  const fetchHelpData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/help');
      if (!response.ok) throw new Error('Failed to fetch help data');
      const data = await response.json();
      setHelpData(data);
    } catch (error) {
      logger.error('Error fetching help data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(`/api/help?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data.articles);
    } catch (error) {
      logger.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // 防抖搜索
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  if (loading) {
    return (
      <PortalLayout title="帮助中心" description="寻找答案和获取支持">
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">加载中...</p>
            </div>
          </div>
        </PageContent>
      </PortalLayout>
    );
  }

  if (!helpData) {
    return (
      <PortalLayout title="帮助中心" description="寻找答案和获取支持">
        <PageContent>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">加载帮助内容失败</p>
            <Button onClick={fetchHelpData}>重试</Button>
          </div>
        </PageContent>
      </PortalLayout>
    );
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-500" />;
      default: return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <PortalLayout 
      title="帮助中心" 
      description="寻找答案、学习教程和获取支持"
    >
      <PageContent maxWidth="xl">
        <div className="space-y-8">
          {/* 搜索栏 */}
          <div className="text-center">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="搜索帮助文章、教程或常见问题..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
              {isSearching && (
                <p className="text-sm text-muted-foreground mt-2">搜索中...</p>
              )}
            </div>
          </div>

          {/* 搜索结果 */}
          {searchQuery && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                搜索结果 ({searchResults.length})
              </h2>
              {searchResults.length > 0 ? (
                <div className="grid gap-4">
                  {searchResults.map((article) => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{article.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {article.content.substring(0, 150)}...
                            </CardDescription>
                          </div>
                          <Badge variant={
                            article.difficulty === 'beginner' ? 'secondary' :
                            article.difficulty === 'intermediate' ? 'default' : 'destructive'
                          }>
                            {article.difficulty === 'beginner' ? '入门' :
                             article.difficulty === 'intermediate' ? '中级' : '高级'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {article.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {article.helpful}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.lastUpdated.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">未找到相关内容</h3>
                  <p className="text-muted-foreground">尝试使用不同的关键词或浏览下面的分类</p>
                </div>
              )}
            </div>
          )}

          {/* 非搜索状态的内容 */}
          {!searchQuery && (
            <>
              {/* 快速操作 */}
              <div>
                <h2 className="text-xl font-semibold mb-4">快速操作</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {helpData.quickActions.map((action) => {
                    const Icon = iconMap[action.icon as keyof typeof iconMap] || BookOpen;
                    return (
                      <Card key={action.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{action.title}</h3>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* 分类导航 */}
              <div>
                <h2 className="text-xl font-semibold mb-4">浏览分类</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {helpData.categories.map((category) => {
                    const Icon = iconMap[category.icon as keyof typeof iconMap] || BookOpen;
                    return (
                      <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-3 rounded-lg">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                              <CardDescription>{category.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {category.articles.slice(0, 3).map((article) => (
                              <div key={article.id} className="flex items-center justify-between">
                                <span className="text-sm hover:text-primary cursor-pointer">
                                  {article.title}
                                </span>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Eye className="w-3 h-3 mr-1" />
                                  {article.views}
                                </div>
                              </div>
                            ))}
                            {category.articles.length > 3 && (
                              <div className="text-sm text-primary cursor-pointer hover:underline">
                                查看全部 {category.articles.length} 篇文章
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* 热门文章 */}
              <div>
                <h2 className="text-xl font-semibold mb-4">热门文章</h2>
                <div className="grid gap-4">
                  {helpData.popularArticles.map((item) => (
                    <Card key={item.article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-primary">
                              {item.rank}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium mb-1">{item.article.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.article.content.substring(0, 100)}...
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {item.article.views}
                                </div>
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="w-3 h-3" />
                                  {item.article.helpful}
                                </div>
                                <div className="flex items-center gap-1">
                                  {getTrendIcon(item.trend)}
                                  {item.trend === 'up' ? '上升' : item.trend === 'down' ? '下降' : '稳定'}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge variant={
                            item.article.difficulty === 'beginner' ? 'secondary' :
                            item.article.difficulty === 'intermediate' ? 'default' : 'destructive'
                          }>
                            {item.article.difficulty === 'beginner' ? '入门' :
                             item.article.difficulty === 'intermediate' ? '中级' : '高级'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </PageContent>
    </PortalLayout>
  );
}