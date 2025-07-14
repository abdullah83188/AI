import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, Eye } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import TinyMCEEditor from '@/components/tinymce-editor';
import AdminOnlyAccess from '@/components/admin-only-access';
import GoogleAdSense from '@/components/google-adsense';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Write() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return await apiRequest("POST", "/api/posts", postData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      navigate('/');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: async (postData: any) => {
      return await apiRequest("POST", "/api/posts", { ...postData, status: 'draft' });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Draft saved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
  });

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !category.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Title, Content, Category).",
        variant: "destructive",
      });
      return;
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
      slug: generateSlug(title.trim()),
      category: category.trim(),
      tags,
      status,
      readingTime: calculateReadingTime(content),
      featuredImage: featuredImage.trim() || null,
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
      metaKeywords: metaKeywords.split(',').map(k => k.trim()).filter(Boolean),
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      authorId: 1 // Will be updated when user system is implemented
    };

    if (status === 'published') {
      createPostMutation.mutate(postData);
    } else {
      saveDraftMutation.mutate(postData);
    }
  };

  const handleSaveDraft = () => {
    const postData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
      slug: generateSlug(title.trim()),
      category: category.trim(),
      tags,
      status: 'draft',
      readingTime: calculateReadingTime(content),
      featuredImage: featuredImage.trim() || null,
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
      metaKeywords: metaKeywords.split(',').map(k => k.trim()).filter(Boolean),
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      authorId: 1 // Will be updated when user system is implemented
    };

    saveDraftMutation.mutate(postData);
  };

  return (
    <AdminOnlyAccess>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">✍️ Write New Post</h1>
                <p className="text-muted-foreground">Create and publish your blog post with TinyMCE editor</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={saveDraftMutation.isPending}
                >
                  {saveDraftMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Draft
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Dashboard
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter post title"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Brief description of your post"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AI">AI</SelectItem>
                          <SelectItem value="Web Dev">Web Dev</SelectItem>
                          <SelectItem value="Mobile">Mobile</SelectItem>
                          <SelectItem value="DevOps">DevOps</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Travel">Travel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={(value: 'draft' | 'published') => setStatus(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="featuredImage">Featured Image URL</Label>
                    <Input
                      id="featuredImage"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="scheduledAt">Schedule Publication</Label>
                    <Input
                      id="scheduledAt"
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Editor - TinyMCE</CardTitle>
                </CardHeader>
                <CardContent>
                  <TinyMCEEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Start writing your amazing blog post..."
                    height={600}
                  />
                </CardContent>
              </Card>
              
              {/* AdSense Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Monetization Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GoogleAdSense adSlot="1234567890" />
                    <GoogleAdSense adSlot="0987654321" />
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button type="button" onClick={handleAddTag}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="SEO title for search engines"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Brief description for search engines"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input
                      id="metaKeywords"
                      value={metaKeywords}
                      onChange={(e) => setMetaKeywords(e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createPostMutation.isPending || saveDraftMutation.isPending}
                >
                  {createPostMutation.isPending || saveDraftMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : status === 'published' ? (
                    <Eye className="w-4 h-4 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {status === 'published' ? 'Publish Post' : 'Save Draft'}
                </Button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </AdminOnlyAccess>
  );
}