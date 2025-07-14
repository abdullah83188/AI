import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import PostCard from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Post, Category } from "@shared/schema";
import NewsletterSignup from "@/components/newsletter-signup";
import SearchResults from "@/components/search-results";
import { ArrowRight, Sparkles, Globe, Code, Cpu, Plane, Star, TrendingUp } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All");


  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search");
  const categoryQuery = urlParams.get("category");

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: [
      "/api/posts",
      {
        status: "published",
        ...(searchQuery && { search: searchQuery }),
        ...(categoryQuery && { category: categoryQuery }),
      },
    ],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      setLocation("/");
    } else {
      setLocation(`/?category=${encodeURIComponent(category)}`);
    }
  };

  // If there's a search query, show search results
  if (searchQuery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <SearchResults query={searchQuery} />
        </div>
      </div>
    );
  }



  const featuredPost = posts?.[0];
  const recentPosts = posts?.slice(1) || [];

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-64 w-full" />
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Modern Hero Section */}
      {!searchQuery && !categoryQuery && (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-blue-950 dark:via-gray-900 dark:to-teal-950 rounded-3xl p-8 md:p-16 mb-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-500 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-green-500 rounded-full blur-3xl"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-2 border border-blue-200 dark:border-gray-700">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI - Voyager Blog</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Explore <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">AI - Voyager Blog</span>
              <br />
              <span className="text-3xl md:text-5xl">AI & Travel Adventures</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              A tech enthusiast and voyager passionate about AI, computers, and travel. 
              Discover simple, engaging insights on AI trends and travel adventures that inspire beginners and enthusiasts alike.
            </p>
            
            {/* Skills Preview */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800">
                <Code className="h-3 w-3 mr-1" />
                JavaScript/TypeScript Expert
              </Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800">
                <Cpu className="h-3 w-3 mr-1" />
                AI/ML Enthusiast
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800">
                <Globe className="h-3 w-3 mr-1" />
                Travel Stories
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
                onClick={() => {
                  document.getElementById('latest-posts')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Read Latest Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 font-semibold px-8 py-3 rounded-full"
                onClick={() => window.location.href = '/about'}
              >
                <Star className="mr-2 h-4 w-4" />
                About Me
              </Button>
            </div>
          </div>
        </section>
      )}
      {/* AI Fun Section */}
      {!searchQuery && !categoryQuery && (
        <section className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 rounded-2xl p-8 mb-16 border border-orange-200 dark:border-orange-800">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-500 rounded-full p-3">
                <Cpu className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-4">
              The AI That Writes This Blog 🤖
            </h2>
            <p className="text-orange-800 dark:text-orange-200 max-w-2xl mx-auto leading-relaxed">
              "Hi there! I'm the AI assistant behind this blog. I help create engaging content about AI and travel adventures. 
              Think of me as your friendly digital companion who's always ready to explain complex topics in simple terms!"
            </p>
          </div>
        </section>
      )}
      {/* Quick Stats */}
      {!searchQuery && !categoryQuery && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Tech Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">Latest trends & tutorials</p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-6 text-center">
              <Plane className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Travel Stories</h3>
              <p className="text-gray-600 dark:text-gray-300">Adventures & experiences</p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">Fresh content daily</p>
            </CardContent>
          </Card>
        </section>
      )}
      {/* Search Results Header */}
      {searchQuery && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Search Results for "{searchQuery}"
          </h2>
          <p className="text-muted-foreground">
            {posts?.length || 0} posts found
          </p>
        </section>
      )}
      {/* Category Filter Header */}
      {categoryQuery && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">
            {categoryQuery} Posts
          </h2>
          <p className="text-muted-foreground">
            {posts?.length || 0} posts in this category
          </p>
        </section>
      )}
      {/* Featured Post */}
      {featuredPost && !searchQuery && !categoryQuery && (
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-primary mb-6">Featured Post</h3>
          <PostCard post={featuredPost} featured />
        </section>
      )}
      {/* Recent Posts */}
      <section className="mb-12" id="latest-posts">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-2xl font-bold text-primary">
            {searchQuery ? "Search Results" : categoryQuery ? `${categoryQuery} Posts` : "Recent Posts"}
          </h3>
          {!searchQuery && categories && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter("All")}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryFilter(category.name)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {(searchQuery || categoryQuery ? posts : recentPosts).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No posts found matching your search."
                  : categoryQuery
                  ? "No posts found in this category."
                  : "No posts available."}
              </p>
            </CardContent>
          </Card>
        )}
      </section>
      {/* Newsletter Signup */}
      {!searchQuery && !categoryQuery && (
        <section className="mb-12">
          <NewsletterSignup variant="inline" />
        </section>
      )}
    </div>
  );
}
