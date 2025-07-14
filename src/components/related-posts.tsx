import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Calendar } from 'lucide-react';
import { Post } from '@shared/schema';

interface RelatedPostsProps {
  currentPostId: number;
  category: string;
  tags: string[];
  className?: string;
}

export default function RelatedPosts({ currentPostId, category, tags, className = "" }: RelatedPostsProps) {
  const { data: relatedPosts, isLoading } = useQuery({
    queryKey: ['/api/posts/related', currentPostId, category, tags],
    queryFn: async () => {
      const params = new URLSearchParams({
        currentPostId: currentPostId.toString(),
        category,
        tags: tags.join(',')
      });
      const response = await fetch(`/api/posts/related?${params}`);
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Related Posts</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Related Posts</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post: Post) => (
          <Link key={post.id} href={`/post/${post.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-800">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.views}
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm">
                    {post.title}
                  </h4>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readingTime} min read
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.publishedAt!).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}