import { apiRequest } from '@/lib/queryClient';

export interface BloggerPost {
  id: string;
  title: string;
  content: string;
  published: string;
  updated: string;
  url: string;
  labels?: string[];
  author?: {
    displayName: string;
    url?: string;
  };
}

export interface ImportProgress {
  total: number;
  imported: number;
  failed: number;
  status: 'idle' | 'processing' | 'completed' | 'error';
  currentPost?: string;
  errors?: string[];
}

export class BloggerImportService {
  // Import from Blogger XML export
  static async importFromXML(xmlContent: string): Promise<ImportProgress> {
    try {
      const response = await apiRequest('/api/admin/import/blogger-xml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          xmlContent,
          password: 'admin123' // Add admin authentication
        }),
      });
      
      return response.json();
    } catch (error) {
      throw new Error('Failed to import from Blogger XML');
    }
  }

  // Import from Blogger API (requires blog URL)
  static async importFromBloggerAPI(blogUrl: string): Promise<ImportProgress> {
    try {
      const response = await apiRequest('/api/admin/import/blogger-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          blogUrl,
          password: 'admin123' // Add admin authentication
        }),
      });
      
      return response.json();
    } catch (error) {
      throw new Error('Failed to import from Blogger API');
    }
  }

  // Get import status
  static async getImportStatus(): Promise<ImportProgress> {
    try {
      const response = await apiRequest('/api/admin/import/status?password=admin123');
      return response.json();
    } catch (error) {
      throw new Error('Failed to get import status');
    }
  }

  // Parse Blogger XML export
  static parseBloggerXML(xmlContent: string): BloggerPost[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');
    
    const entries = xmlDoc.querySelectorAll('entry');
    const posts: BloggerPost[] = [];
    
    entries.forEach(entry => {
      const title = entry.querySelector('title')?.textContent || 'Untitled';
      const content = entry.querySelector('content')?.textContent || '';
      const published = entry.querySelector('published')?.textContent || '';
      const updated = entry.querySelector('updated')?.textContent || '';
      
      // Extract labels/categories
      const categoryElements = entry.querySelectorAll('category[scheme="http://www.blogger.com/atom/ns#"]');
      const labels: string[] = [];
      categoryElements.forEach(cat => {
        const term = cat.getAttribute('term');
        if (term) labels.push(term);
      });
      
      // Extract author
      const authorElement = entry.querySelector('author name');
      const author = authorElement ? {
        displayName: authorElement.textContent || 'Unknown',
        url: entry.querySelector('author uri')?.textContent
      } : undefined;
      
      // Extract URL
      const linkElement = entry.querySelector('link[rel="alternate"]');
      const url = linkElement?.getAttribute('href') || '';
      
      // Only include actual blog posts (not comments, etc.)
      if (content && title && published) {
        posts.push({
          id: entry.querySelector('id')?.textContent || Math.random().toString(),
          title,
          content,
          published,
          updated,
          url,
          labels,
          author
        });
      }
    });
    
    return posts;
  }

  // Convert Blogger post to our format
  static convertBloggerPost(bloggerPost: BloggerPost): any {
    return {
      title: bloggerPost.title,
      content: bloggerPost.content,
      excerpt: this.generateExcerpt(bloggerPost.content),
      slug: this.generateSlug(bloggerPost.title),
      category: bloggerPost.labels?.[0] || 'General',
      tags: bloggerPost.labels || [],
      status: 'published',
      publishedAt: new Date(bloggerPost.published),
      createdAt: new Date(bloggerPost.published),
      updatedAt: new Date(bloggerPost.updated || bloggerPost.published),
      readingTime: this.calculateReadingTime(bloggerPost.content),
      views: 0,
      likes: 0,
      authorId: 1 // Default to admin user
    };
  }

  private static generateExcerpt(content: string): string {
    // Remove HTML tags and get first 150 characters
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  }

  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private static calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
}