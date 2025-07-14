import { useEffect, useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// YOUR EMAIL - ONLY YOU CAN ACCESS ADMIN
const ADMIN_EMAIL = 'mohammadabdulla9048@gmail.com'; // Replace with your actual email

interface AdminOnlyAccessProps {
  children: React.ReactNode;
}

export default function AdminOnlyAccess({ children }: AdminOnlyAccessProps) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Skip Firebase auth check if not configured
    if (!auth) {
      console.warn('Firebase auth not configured - allowing access for development');
      setIsAuthorized(true);
      setIsVerifying(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Check if user email matches admin email
        if (user.email === ADMIN_EMAIL) {
          setIsAuthorized(true);
          toast({
            title: "Access Granted",
            description: "Welcome back, admin!",
            duration: 3000,
          });
        } else {
          setIsAuthorized(false);
          toast({
            title: "Access Denied", 
            description: "You are not authorized to access this area.",
            variant: "destructive",
            duration: 5000,
          });
        }
      } else {
        setIsAuthorized(false);
      }
      
      setIsVerifying(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleUnauthorizedAccess = () => {
    console.error("UNAUTHORIZED ACCESS ATTEMPT! Only admin can access this area.");
    toast({
      title: "Unauthorized Access",
      description: "This area is restricted to admin only.",
      variant: "destructive",
    });
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">Verifying Access</h2>
            <p className="text-muted-foreground">Checking admin permissions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You must be logged in to access this admin area.
            </p>
            <Button 
              onClick={() => window.location.href = '/login'}
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    handleUnauthorizedAccess();
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You are not authorized to access this admin area.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">
                <strong>Current user:</strong> {currentUser.email}
              </p>
              <p className="text-sm text-red-700">
                <strong>Required:</strong> {ADMIN_EMAIL}
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-4 w-4" />
          <p className="text-sm font-medium">
            Admin Access Granted - {currentUser.email}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}