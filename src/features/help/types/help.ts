// 帮助中心相关的类型定义

export interface HelpCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  articles: HelpArticle[];
  subcategories?: HelpCategory[];
  order: number;
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lastUpdated: Date;
  views: number;
  helpful: number;
  videoUrl?: string;
  relatedArticles?: string[];
  author: string;
  publishedAt: Date;
}

export interface HelpSearchResult {
  articles: HelpArticle[];
  categories: HelpCategory[];
  totalCount: number;
  searchQuery: string;
  suggestions?: string[];
}

export interface HelpFilters {
  categoryId?: string;
  difficulty?: HelpArticle['difficulty'];
  tags?: string[];
  hasVideo?: boolean;
  lastUpdated?: {
    start: Date;
    end: Date;
  };
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
  category: string;
}

export interface PopularArticle {
  article: HelpArticle;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

export interface HelpStats {
  totalArticles: number;
  totalViews: number;
  averageRating: number;
  popularTopics: string[];
  recentUpdates: HelpArticle[];
}

export interface ContactSupport {
  channels: SupportChannel[];
  businessHours: string;
  responseTime: string;
  languages: string[];
}

export interface SupportChannel {
  type: 'email' | 'chat' | 'phone' | 'ticket';
  name: string;
  description: string;
  contact: string;
  available: boolean;
  icon: string;
}

export interface HelpPageData {
  categories: HelpCategory[];
  popularArticles: PopularArticle[];
  quickActions: QuickAction[];
  recentArticles: HelpArticle[];
  stats: HelpStats;
  contactSupport: ContactSupport;
}
