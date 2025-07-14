import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, User, Clock } from "lucide-react";
import { Post } from "@shared/schema";

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
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

  if (featured) {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {post.category}
            </Badge>
            <span className="text-muted-foreground text-sm">{formattedDate}</span>
            <span className="text-muted-foreground text-sm flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {post.readingTime} min read
            </span>
          </div>
          <Link href={`/post/${post.slug || post.id}`}>
            <h2 className="text-2xl font-bold text-primary mb-3 hover:text-primary/80 transition-colors cursor-pointer line-clamp-2">
              {post.title}
            </h2>
          </Link>
          <p className="text-muted-foreground text-base leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="text-primary h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-sm">Admin</p>
                <p className="text-xs text-muted-foreground">Author</p>
              </div>
            </div>
            <Link href={`/post/${post.slug || post.id}`}>
              <button className="text-primary hover:text-primary/80 font-medium text-sm">
                Read More →
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-md transition-all duration-300 border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {post.category}
          </Badge>
          <span className="text-muted-foreground text-sm">{formattedDate}</span>
          <span className="text-muted-foreground text-sm flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {post.readingTime} min read
          </span>
        </div>
        <Link href={`/post/${post.slug || post.id}`}>
          <h3 className="text-xl font-bold text-primary mb-3 hover:text-primary/80 transition-colors cursor-pointer group-hover:text-primary/80 line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="text-primary h-3 w-3" />
            </div>
            <span className="text-sm text-muted-foreground">Admin</span>
          </div>
          <Link href={`/post/${post.slug || post.id}`}>
            <button className="text-primary hover:text-primary/80 font-medium text-sm">
              Read More →
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
