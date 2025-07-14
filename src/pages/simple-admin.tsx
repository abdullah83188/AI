import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Post } from "@shared/schema";
import { Plus, Edit, Trash2, Save } from "lucide-react";

export default function SimpleAdmin() {
  const [location, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    status: "draft" as "draft" | "published"
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      const tagsArray = postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await apiRequest("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          ...postData,
          tags: tagsArray
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
      setNewPost({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        tags: "",
        status: "draft"
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      const tagsArray = postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await apiRequest(`/api/posts/${editingPost!.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...postData,
          tags: tagsArray
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post updated successfully!",
      });
      setEditingPost(null);
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest(`/api/posts/${postId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Post deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags.join(', '),
      status: post.status as "draft" | "published"
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editingPost) {
      updatePostMutation.mutate(newPost);
    } else {
      createPostMutation.mutate(newPost);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingPost(null);
    setNewPost({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: "",
      status: "draft"
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Simple Blog Admin</h1>
        <p className="text-muted-foreground">Manage your blog posts easily</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Editor Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {editingPost ? "Edit Post" : "Create New Post"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="Enter post title..."
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt (Short Description)</Label>
                <Textarea
                  id="excerpt"
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                  placeholder="Brief description of your post..."
                  rows={2}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    placeholder="e.g., AI, Web Dev, Tech"
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                    placeholder="javascript, react, tutorial"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content (HTML/Markdown)</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Write your post content here... You can use HTML tags like <p>, <h2>, <strong>, etc."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newPost.status} 
                  onValueChange={(value) => setNewPost({...newPost, status: value as "draft" | "published"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSave}
                  disabled={createPostMutation.isPending || updatePostMutation.isPending}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>All Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold text-sm">{post.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {post.category} • {post.status}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deletePostMutation.mutate(post.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}