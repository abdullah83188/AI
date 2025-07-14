import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Eye, Heart, MessageCircle, Users, Calendar, Clock, Target } from "lucide-react";

interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  popularPosts: Array<{
    id: number;
    title: string;
    views: number;
    likes: number;
    commentCount: number;
    publishedAt: string;
  }>;
}

export default function AdvancedAnalytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/dashboard"],
  });

  const { data: posts } = useQuery({
    queryKey: ["/api/posts", { status: "published" }],
  });

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalPosts = posts?.length || 0;
  const avgViewsPerPost = totalPosts > 0 ? Math.round((analytics?.totalViews || 0) / totalPosts) : 0;
  const avgLikesPerPost = totalPosts > 0 ? Math.round((analytics?.totalLikes || 0) / totalPosts) : 0;
  const avgCommentsPerPost = totalPosts > 0 ? Math.round((analytics?.totalComments || 0) / totalPosts) : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalViews?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {avgViewsPerPost} avg per post
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalLikes?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {avgLikesPerPost} avg per post
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalComments?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {avgCommentsPerPost} avg per post
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              Active content
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Most Popular Posts
          </CardTitle>
          <CardDescription>
            Top performing content based on views, likes, and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics?.popularPosts?.map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <h3 className="font-medium text-sm">{post.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likes} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {post.commentCount} comments
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{post.views}</div>
                  <div className="text-xs text-muted-foreground">views</div>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-muted-foreground">
                No posts available yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      {totalPosts > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
            <CardDescription>
              Content performance and reader engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Views per Post</span>
                <span className="font-medium">{avgViewsPerPost}</span>
              </div>
              <Progress value={Math.min((avgViewsPerPost / 1000) * 100, 100)} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Likes per Post</span>
                <span className="font-medium">{avgLikesPerPost}</span>
              </div>
              <Progress value={Math.min((avgLikesPerPost / 100) * 100, 100)} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Comments per Post</span>
                <span className="font-medium">{avgCommentsPerPost}</span>
              </div>
              <Progress value={Math.min((avgCommentsPerPost / 20) * 100, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}