import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface BookmarkButtonProps {
  postId: number;
  className?: string;
}

export default function BookmarkButton({ postId, className = "" }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Generate or get session ID
  const getSessionId = () => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  };

  useEffect(() => {
    // Check if post is bookmarked
    const checkBookmarkStatus = async () => {
      try {
        const sessionId = getSessionId();
        const response = await apiRequest(`/api/bookmarks/check/${postId}?sessionId=${sessionId}`);
        setIsBookmarked(response.isBookmarked);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    checkBookmarkStatus();
  }, [postId]);

  const toggleBookmark = async () => {
    setIsLoading(true);
    try {
      const sessionId = getSessionId();
      
      if (isBookmarked) {
        await apiRequest(`/api/bookmarks/${postId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
        setIsBookmarked(false);
        toast({
          title: "Bookmark Removed",
          description: "Post removed from bookmarks",
        });
      } else {
        await apiRequest('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, postId })
        });
        setIsBookmarked(true);
        toast({
          title: "Bookmarked!",
          description: "Post added to bookmarks",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleBookmark}
      disabled={isLoading}
      className={`flex items-center gap-2 ${
        isBookmarked 
          ? 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-950' 
          : 'text-gray-600 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-950'
      } ${className}`}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">
        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </span>
    </Button>
  );
}