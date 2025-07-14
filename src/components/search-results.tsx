import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Post } from "@shared/schema";
import PostCard from "@/components/post-card";
import { Search, FileText, Calendar, Eye, Heart, MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface SearchResultsProps {
  query: string;
  className?: string;
}

export default function SearchResults({ query, className = "" }: SearchResultsProps) {
  const [searchTerm, setSearchTerm] = useState(query);
  
  const { data: searchResults, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts", { search: query, status: "published" }],
    enabled: !!query,
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Search Results
          </h1>
          <p className="text-muted-foreground mb-4">
            {searchResults?.length || 0} results found for "{query}"
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Refine your search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      {searchResults && searchResults.length > 0 ? (
        <div className="space-y-6">
          {/* Results Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Search Results
              </CardTitle>
              <CardDescription>
                Found {searchResults.length} article{searchResults.length !== 1 ? 's' : ''} matching your search
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories?.map((category: any) => (
                  <Badge key={category.id} variant="outline" className="text-xs">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search Results Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {searchResults.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any articles matching "{query}". Try different keywords or browse our categories.
            </p>
            <div className="flex justify-center gap-2">
              <Link href="/">
                <Button variant="outline">
                  Browse All Posts
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline">
                  About This Blog
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}