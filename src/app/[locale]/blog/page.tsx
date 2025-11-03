'use client'
import { useState, useEffect } from 'react'
import { logger } from '@logger';
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import { Search, Calendar, User, Tag, ChevronRight } from 'lucide-react'
import { Input } from '@shared/ui/input'
import { Button } from '@shared/ui/button'
import { Badge } from '@shared/ui/badge'
import { Card, CardContent, CardHeader } from '@shared/ui/card'
// import { StandaloneLayout } from '@/common/components/layout/standalone-layout'
import { PortalLayout } from '@shared/layout/portal-layout'
import { PageContent } from '@shared/layout/page-content'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  category: string
  tags: string[]
  readTime: number
}

interface BlogResponse {
  posts: BlogPost[]
  pagination: {
    currentPage: number
    totalPages: number
    totalPosts: number
    postsPerPage: number
    hasNext: boolean
    hasPrevious: boolean
  }
  categories: unknown[]
  tags: unknown[]
  featuredPosts: unknown[]
}

export default function BlogPage() {
  const t = useTranslations('blog');
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categories = [
    { id: 'all', name: t('list.categories.all') },
    { id: 'email-marketing', name: t('list.categories.email-marketing') },
    { id: 'tutorials', name: t('list.categories.tutorials') },
    { id: 'updates', name: t('list.categories.updates') },
    { id: 'best-practices', name: t('list.categories.best-practices') },
    { id: 'case-studies', name: t('list.categories.case-studies') }
  ]

  useEffect(() => {
    fetchPosts()
  }, [currentPage, selectedCategory, searchTerm])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/blog?${params}`)
      const data: BlogResponse = await response.json()
      
      const transformedPosts = data.posts?.map((post: unknown) => {
        const typedPost = post as {
          slug: string
          frontmatter?: {
            title?: string
            excerpt?: string
            author?: string
            date?: string
            category?: string
            tags?: string[]
            readTime?: number
          }
          content?: string
        }
        return {
          id: typedPost.slug,
          title: typedPost.frontmatter?.title || '',
          slug: typedPost.slug,
          excerpt: typedPost.frontmatter?.excerpt || '',
          content: typedPost.content || '',
          author: typedPost.frontmatter?.author || '',
          publishedAt: typedPost.frontmatter?.date || '',
          category: typedPost.frontmatter?.category || '',
          tags: typedPost.frontmatter?.tags || [],
          readTime: typedPost.frontmatter?.readTime || 5
        }
      }) || []
      
      setPosts(transformedPosts)
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (error) {
      logger.error(t('list.error'), error)
      setPosts([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchPosts()
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <PortalLayout 
      title={t('title')} 
      description={t('list.description')}
    >
      <PageContent maxWidth="2xl">
      <div className="py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('list.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange(category.id)}
                  className="text-sm"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                    <div className="h-3 bg-muted rounded w-4/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{t('list.noArticles')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {categories.find(c => c.id === post.category)?.name || post.category}
                    </Badge>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      <span>{post.author}</span>
                      <span className="mx-2">·</span>
                      <span>{post.readTime} {t('list.readTime')}</span>
                    </div>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium mt-4 group"
                  >
                    {t('list.readMore')}
                    <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                {t('list.pagination.previous')}
              </Button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                if (page > totalPages) return null
                
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              })}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                {t('list.pagination.next')}
              </Button>
            </div>
          </div>
        )}
      </div>
      </PageContent>
    </PortalLayout>
  )
}