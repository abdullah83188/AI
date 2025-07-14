import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';

interface ImportStatus {
  total: number;
  imported: number;
  failed: number;
  status: 'idle' | 'processing' | 'completed' | 'error';
}

export default function BloggerImport() {
  const { user, loading } = useAuth();
  const [blogUrl, setBlogUrl] = useState('');
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    total: 0,
    imported: 0,
    failed: 0,
    status: 'idle'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (data: { method: 'url' | 'file', content: string | File }) => {
      const formData = new FormData();
      formData.append('method', data.method);
      
      if (data.method === 'file' && data.content instanceof File) {
        formData.append('file', data.content);
      } else if (data.method === 'url') {
        formData.append('url', data.content as string);
      }

      return await apiRequest('/api/admin/import/blogger', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: (data) => {
      setImportStatus(data);
      toast({
        title: "Import Started",
        description: `Processing ${data.total} posts from your Blogger blog.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/posts'] });
    },
    onError: () => {
      toast({
        title: "Import Failed",
        description: "Failed to start import process. Please check your URL or file.",
        variant: "destructive",
      });
    },
  });

  const handleUrlImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Blogger URL.",
        variant: "destructive",
      });
      return;
    }
    importMutation.mutate({ method: 'url', content: blogUrl });
  };

  const handleFileImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!xmlFile) {
      toast({
        title: "Error",
        description: "Please select an XML export file.",
        variant: "destructive",
      });
      return;
    }
    importMutation.mutate({ method: 'file', content: xmlFile });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/xml') {
      setXmlFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid XML file.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Import from Blogger</h1>
            <p className="text-muted-foreground">
              Migrate your existing Blogger posts to AI-Voyager Blog seamlessly
            </p>
          </div>

          {/* Import Progress */}
          {importStatus.status !== 'idle' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {importStatus.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : importStatus.status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                  )}
                  Import Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress 
                    value={importStatus.total > 0 ? (importStatus.imported / importStatus.total) * 100 : 0} 
                    className="w-full" 
                  />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{importStatus.total}</p>
                      <p className="text-sm text-muted-foreground">Total Posts</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{importStatus.imported}</p>
                      <p className="text-sm text-muted-foreground">Imported</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{importStatus.failed}</p>
                      <p className="text-sm text-muted-foreground">Failed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Import Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* URL Import */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Import via URL
                </CardTitle>
                <CardDescription>
                  Enter your Blogger blog URL to automatically import posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUrlImport} className="space-y-4">
                  <div>
                    <Label htmlFor="blogUrl">Blogger URL</Label>
                    <Input
                      id="blogUrl"
                      value={blogUrl}
                      onChange={(e) => setBlogUrl(e.target.value)}
                      placeholder="https://yourblog.blogspot.com"
                      disabled={importMutation.isPending}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={importMutation.isPending}
                  >
                    {importMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Import from URL
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* File Import */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Import via XML File
                </CardTitle>
                <CardDescription>
                  Upload your Blogger XML export file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFileImport} className="space-y-4">
                  <div>
                    <Label htmlFor="xmlFile">XML Export File</Label>
                    <Input
                      id="xmlFile"
                      type="file"
                      accept=".xml"
                      onChange={handleFileChange}
                      disabled={importMutation.isPending}
                    />
                    {xmlFile && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {xmlFile.name}
                      </p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={importMutation.isPending || !xmlFile}
                  >
                    {importMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Import from File
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                How to Export from Blogger
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Note:</strong> Make sure you have admin access to the Blogger blog you want to import.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Steps to export from Blogger:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Go to your Blogger dashboard</li>
                    <li>Click on "Settings" in the left sidebar</li>
                    <li>Click on "Manage blog" section</li>
                    <li>Click "Back up content"</li>
                    <li>Click "Save to your computer"</li>
                    <li>Upload the downloaded XML file here</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">What gets imported:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>All published posts</li>
                    <li>Post titles, content, and excerpts</li>
                    <li>Publication dates</li>
                    <li>Categories and tags</li>
                    <li>Featured images (when available)</li>
                    <li>SEO metadata</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}