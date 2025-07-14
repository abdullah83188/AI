import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'blog';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
}

export default function SEOHead({
  title = 'AI-Voyager Blog - Exploring Technology and Innovation',
  description = 'Dive into the world of AI, technology, and digital innovation. Expert insights, tutorials, and the latest trends in artificial intelligence and web development.',
  keywords = ['AI', 'Technology', 'Innovation', 'Machine Learning', 'Web Development', 'Programming', 'Tech Blog'],
  image = '/og-image.jpg',
  url = 'https://tech-scribe-tech-ai.replit.app',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Mohammad Abdulla',
  category
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) || 
                   document.querySelector(`meta[name="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1');

    // Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:type', type);
    updateMetaTag('og:url', url);
    updateMetaTag('og:image', image);
    updateMetaTag('og:site_name', 'AI-Voyager Blog');
    updateMetaTag('og:locale', 'en_US');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:site', '@ai_voyager_blog');
    updateMetaTag('twitter:creator', '@mohammad_abdulla');

    // Article-specific tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime);
      }
      if (author) {
        updateMetaTag('article:author', author);
      }
      if (category) {
        updateMetaTag('article:section', category);
      }
      keywords.forEach(keyword => {
        updateMetaTag('article:tag', keyword);
      });
    }

    // JSON-LD structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'BlogPosting' : 'WebSite',
      name: title,
      description: description,
      url: url,
      image: image,
      author: {
        '@type': 'Person',
        name: author
      },
      publisher: {
        '@type': 'Organization',
        name: 'AI-Voyager Blog',
        logo: {
          '@type': 'ImageObject',
          url: `${url}/logo.png`
        }
      },
      ...(type === 'article' && {
        datePublished: publishedTime,
        dateModified: modifiedTime,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url
        }
      })
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Add canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', url);

  }, [title, description, keywords, image, url, type, publishedTime, modifiedTime, author, category]);

  return null;
}