import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, CheckCircle } from "lucide-react";
import { InsertNewsletterSubscription } from "@shared/schema";

interface NewsletterSignupProps {
  variant?: "card" | "inline";
  className?: string;
}

export default function NewsletterSignup({ 
  variant = "card", 
  className = "" 
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const subscribe = useMutation({
    mutationFn: async (subscriptionData: InsertNewsletterSubscription) => {
      return await apiRequest("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Successfully Subscribed!",
        description: "Thank you for subscribing to our newsletter. You'll receive updates about new posts and tech insights.",
      });
      setIsSubscribed(true);
      setEmail("");
      setName("");
    },
    onError: (error) => {
      toast({
        title: "Subscription Failed",
        description: "Failed to subscribe to newsletter. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive",
      });
      return;
    }

    subscribe.mutate({
      email: email.trim(),
      name: name.trim() || undefined,
    });
  };

  if (isSubscribed) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-600 mb-2">
          Successfully Subscribed!
        </h3>
        <p className="text-muted-foreground">
          Thank you for subscribing to our newsletter. You'll receive updates about new posts and tech insights.
        </p>
      </div>
    );
  }

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="newsletter-name" className="block text-sm font-medium mb-2">
            Name (Optional)
          </label>
          <Input
            id="newsletter-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="newsletter-email" className="block text-sm font-medium mb-2">
            Email *
          </label>
          <Input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>
      </div>
      <Button 
        type="submit" 
        disabled={subscribe.isPending}
        className="w-full"
      >
        {subscribe.isPending ? (
          "Subscribing..."
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Subscribe to Newsletter
          </>
        )}
      </Button>
    </form>
  );

  if (variant === "inline") {
    return (
      <div className={`bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg ${className}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Mail className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold">Stay Updated</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          Get the latest posts and tech insights delivered to your inbox.
        </p>
        {form}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-6 w-6 text-blue-600" />
          <span>Newsletter Signup</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Get the latest posts and tech insights delivered to your inbox. Join our community of tech enthusiasts!
        </p>
        {form}
        <p className="text-sm text-muted-foreground mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </CardContent>
    </Card>
  );
}