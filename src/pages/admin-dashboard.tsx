import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  MessageCircle, 
  Users,
  BarChart3,
  DollarSign,
  Calendar,
  Search,
  Filter,
  LogOut,
  Settings,
  FileText,
  Image,
  Tags,
  Folder
} from "lucide-react";
import { Post, Category, Comment, NewsletterSubscription } from "@shared/schema";
import LoginForm from "@/components/auth/LoginForm";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Analytics data
  const { data: analytics } = useQuery<{
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    popularPosts: Post[];
  }>({
    queryKey: ["/api/analytics/dashboard"],
    enabled: !!user,
  });

  // Posts data
  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ["/api/admin/posts"],
    enabled: !!user,
  });

  // Categories data
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: !!user,
  });

  // Comments data
  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["/api/admin/comments"],
    enabled: !!user,
  });

  // Newsletter subscriptions
  const { data: subscribers = [] } = useQuery<NewsletterSubscription[]>({
    queryKey: ["/api/admin/newsletter"],
    enabled: !!user,
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  // Approve comment mutation
  const approveCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await apiRequest(`/api/admin/comments/${commentId}/approve`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/comments"] });
      toast({
        title: "Success",
        description: "Comment approved successfully",
      });
    },
  });

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoginForm />
        </main>
        <Footer />
      </div>
    );
  }

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingComments = comments.filter(comment => comment.status === "pending");
  const approvedComments = comments.filter(comment => comment.status === "approved");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Admin Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.displayName || user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalViews || 0}</div>
                  <p className="text-xs text-muted-foreground">All time views</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalLikes || 0}</div>
                  <p className="text-xs text-muted-foreground">All time likes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Comments</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalComments || 0}</div>
                  <p className="text-xs text-muted-foreground">Approved comments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{subscribers.length}</div>
                  <p className="text-xs text-muted-foreground">Newsletter subscribers</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Recent Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {posts.slice(0, 3).map((post) => (
                      <div key={post.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium truncate">{post.title}</p>
                          <p className="text-sm text-muted-foreground">{post.status}</p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/write?id=${post.id}`}>Edit</a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Pending Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pendingComments.slice(0, 3).map((comment) => (
                      <div key={comment.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{comment.authorName}</p>
                          <p className="text-sm text-muted-foreground truncate">{comment.content}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => approveCommentMutation.mutate(comment.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Published Posts</span>
                      <span className="font-medium">{posts.filter(p => p.status === 'published').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Draft Posts</span>
                      <span className="font-medium">{posts.filter(p => p.status === 'draft').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Categories</span>
                      <span className="font-medium">{categories.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[300px]"
                  />
                </div>
              </div>
              <Button asChild>
                <a href="/write">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Post
                </a>
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <p className="text-muted-foreground mt-1">{post.excerpt}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{post.category}</span>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {post.views}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {post.likes}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/post/${post.slug}`}>View</a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/write?id=${post.id}`}>
                            <Edit className="w-4 h-4" />
                          </a>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{post.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deletePostMutation.mutate(post.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-6">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Comments ({pendingComments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingComments.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{comment.authorName}</p>
                            <p className="text-sm text-muted-foreground">{comment.authorEmail}</p>
                            <p className="mt-2">{comment.content}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => approveCommentMutation.mutate(comment.id)}
                            >
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Categories</h2>
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>

            <div className="grid gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-muted-foreground">{category.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscribers ({subscribers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscribers.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div>
                        <p className="font-medium">{subscriber.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Subscribed: {new Date(subscriber.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={subscriber.status === 'active' ? 'default' : 'secondary'}>
                        {subscriber.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">General Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure your site settings</p>
                  </div>
                  <div>
                    <h3 className="font-medium">SEO Settings</h3>
                    <p className="text-sm text-muted-foreground">Manage meta tags and SEO configuration</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Monetization</h3>
                    <p className="text-sm text-muted-foreground">Configure AdSense and affiliate links</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}