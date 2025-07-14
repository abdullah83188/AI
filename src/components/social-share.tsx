import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Twitter, Linkedin, MessageCircle, Share2, Copy } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface SocialShareProps {
  postId: number;
  title: string;
  excerpt: string;
  url?: string;
  className?: string;
}

export default function SocialShare({ postId, title, excerpt, url, className = "" }: SocialShareProps) {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const currentUrl = url || window.location.href;
  const encodedTitle = encodeURIComponent(title);
  const encodedExcerpt = encodeURIComponent(excerpt);
  const encodedUrl = encodeURIComponent(currentUrl);

  const trackShare = async (platform: string) => {
    try {
      await apiRequest(`/api/posts/${postId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform })
      });
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle} ${encodedUrl}`
  };

  const handleShare = async (platform: string) => {
    setIsSharing(true);
    try {
      await trackShare(platform);
      window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
      
      toast({
        title: "Shared!",
        description: `Post shared on ${platform}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: "Link Copied!",
        description: "Post link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: excerpt,
          url: currentUrl
        });
        await trackShare('native');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Share:</span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook')}
        disabled={isSharing}
        className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950"
      >
        <Facebook className="h-4 w-4" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        disabled={isSharing}
        className="flex items-center gap-2 text-sky-600 border-sky-200 hover:bg-sky-50 dark:hover:bg-sky-950"
      >
        <Twitter className="h-4 w-4" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('linkedin')}
        disabled={isSharing}
        className="flex items-center gap-2 text-blue-700 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950"
      >
        <Linkedin className="h-4 w-4" />
        <span className="hidden sm:inline">LinkedIn</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('whatsapp')}
        disabled={isSharing}
        className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">WhatsApp</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="flex items-center gap-2 text-gray-600 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-950"
      >
        <Copy className="h-4 w-4" />
        <span className="hidden sm:inline">Copy</span>
      </Button>

      {/* Native Share API for mobile */}
      {navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="flex items-center gap-2 text-purple-600 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      )}
    </div>
  );
}