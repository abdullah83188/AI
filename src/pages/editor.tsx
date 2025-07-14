import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/header";
import Footer from "@/components/footer";
import RichTextEditor from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, Send, X } from "lucide-react";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertPostSchema, Post } from "@shared/schema";

const editorSchema = insertPostSchema.extend({
  tags: z.array(z.string()).default([]),
});

type EditorFormData = z.infer<typeof editorSchema>;

export default function Editor() {
  const { id } = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const isEditing = !!id;

  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ["/api/posts", id],
    enabled: isEditing,
  });

  const { data: categories } = useQuery<string[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<EditorFormData>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: [],
      status: "draft",
    },
  });

  const { handleSubmit, setValue, watch, formState: { errors } } = form;

  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setValue("content", post.content);
      setValue("excerpt", post.excerpt);
      setValue("category", post.category);
      setValue("status", post.status);
      setTags(post.tags);
    }
  }, [post, setValue]);

  const savePostMutation = useMutation({
    mutationFn: async (data: EditorFormData) => {
      const postData = { ...data, tags };
      
      if (isEditing) {
        return await apiRequest("PUT", `/api/posts/${id}`, postData);
      } else {
        return await apiRequest("POST", "/api/posts", postData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Success",
        description: isEditing ? "Post updated successfully" : "Post created successfully",
      });
      setLocation("/admin");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive",
      });
    },
  });

  const publishPostMutation = useMutation({
    mutationFn: async (data: EditorFormData) => {
      const postData = { ...data, tags, status: "published" };
      
      if (isEditing) {
        await apiRequest("PUT", `/api/posts/${id}`, postData);
        return await apiRequest("POST", `/api/posts/${id}/publish`);
      } else {
        return await apiRequest("POST", "/api/posts", postData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Success",
        description: "Post published successfully",
      });
      setLocation("/admin");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish post",
        variant: "destructive",
      });
    },
  });

  const onSaveDraft = (data: EditorFormData) => {
    savePostMutation.mutate({ ...data, status: "draft" });
  };

  const onPublish = (data: EditorFormData) => {
    publishPostMutation.mutate({ ...data, status: "published" });
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Post" : "Create New Post"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter post title..."
                  className="text-2xl font-bold border-none shadow-none px-0 focus-visible:ring-0"
                  {...form.register("title")}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of your post..."
                  rows={3}
                  {...form.register("excerpt")}
                />
                {errors.excerpt && (
                  <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>
                )}
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={watch("category")}
                    onValueChange={(value) => setValue("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="AI">AI</SelectItem>
                      <SelectItem value="Web Dev">Web Dev</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="tags"
                      placeholder="Add tags..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  content={watch("content")}
                  onChange={(content) => setValue("content", content)}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-6">
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSubmit(onSaveDraft)}
                    disabled={savePostMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // Preview functionality could be added here
                      toast({
                        title: "Preview",
                        description: "Preview feature coming soon!",
                      });
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
                <Button
                  type="button"
                  onClick={handleSubmit(onPublish)}
                  disabled={publishPostMutation.isPending}
                  className="bg-accent hover:bg-accent/90"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isEditing && post?.status === "published" ? "Update" : "Publish"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
