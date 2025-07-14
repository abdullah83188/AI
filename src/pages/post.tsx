import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User, Share2, Heart, MessageCircle, Eye } from "lucide-react";
import { Link } from "wouter";
import { Post as PostType } from "@shared/schema";
import CommentSection from "@/components/comment-section";
import NewsletterSignup from "@/components/newsletter-signup";
import SocialShare from "@/components/social-share";
import BookmarkButton from "@/components/bookmark-button";
import ReadingProgress from "@/components/reading-progress";
import RelatedPosts from "@/components/related-posts";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: post, isLoading, error } = useQuery<PostType>({
    queryKey: ["/api/posts/slug", slug],
    enabled: !!slug,
    queryFn: async () => {
      if (!slug) throw new Error("No slug provided");
      
      // First try to get by slug
      try {
        const response = await fetch(`/api/posts/slug/${slug}`);
        if (response.ok) {
          return response.json();
        }
      } catch (error) {
        console.error("Failed to fetch by slug:", error);
      }
      
      // If slug fails, try by ID (for numeric slugs)
      if (!isNaN(Number(slug))) {
        try {
          const response = await fetch(`/api/posts/${slug}`);
          if (response.ok) {
            return response.json();
          }
        } catch (error) {
          console.error("Failed to fetch by ID:", error);
        }
      }
      
      throw new Error("Post not found");
    },
  });

  const { data: analytics } = useQuery<{ views: number; likes: number; commentCount: number }>({
    queryKey: ["/api/posts", post?.id, "analytics"],
    enabled: !!post?.id,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!post) return;
      await apiRequest("POST", `/api/posts/${post.id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", post?.id, "analytics"] });
      toast({
        title: "Success",
        description: "Post liked successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    },
  });

  // Track view when post loads
  useEffect(() => {
    if (post?.id) {
      apiRequest("POST", `/api/posts/${post.id}/view`).catch(() => {
        // Silently fail view tracking
      });
    }
  }, [post?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="py-8 text-center">
              <h1 className="text-2xl font-bold text-primary mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      AI: "bg-blue-100 text-blue-800",
      "Web Dev": "bg-green-100 text-green-800",
      Mobile: "bg-purple-100 text-purple-800",
      DevOps: "bg-orange-100 text-orange-800",
      "Data Science": "bg-cyan-100 text-cyan-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
          </Link>
        </div>

        {/* Post Header */}
        <article className="mb-8">
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge className={getCategoryColor(post.category)}>
                {post.category}
              </Badge>
              <span className="text-muted-foreground text-sm">{formattedDate}</span>
              <span className="text-muted-foreground text-sm flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {post.readingTime} min read
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-primary mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-reading mb-6">
              {post.excerpt}
            </p>

            {/* Author and Actions */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <User className="text-accent-foreground h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Admin</p>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>
              
              {/* Analytics and Actions */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {analytics?.views || 0}
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {analytics?.commentCount || 0}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => likeMutation.mutate()}
                    disabled={likeMutation.isPending}
                    className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {analytics?.likes || 0}
                  </Button>
                  <BookmarkButton postId={post.id} />
                  <SocialShare 
                    postId={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    url={`${window.location.origin}/post/${post.slug}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-8">
            <img
              src={`https://images.unsplash.com/photo-${
                post.category === "AI" ? "1555066931-4365d14bab8c" :
                post.category === "Web Dev" ? "1461749280684-dccba630e2f6" :
                post.category === "Mobile" ? "1512941937669-90a1b58e7e9c" :
                post.category === "DevOps" ? "1558494949-ef010cbdcc31" :
                "1551288049-bebda4e38f71"
              }?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=600`}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Post Content */}
          <div 
            className="prose prose-lg max-w-none leading-reading"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Newsletter Signup */}
        <NewsletterSignup variant="inline" className="mb-8" />
        
        {/* Related Posts */}
        <RelatedPosts 
          currentPostId={post.id}
          category={post.category}
          tags={post.tags}
          className="mb-8"
        />
        
        {/* Comment Section */}
        <CommentSection postId={post.id} />
      </main>
      <Footer />
    </div>
  );
}
