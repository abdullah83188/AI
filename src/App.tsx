import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AdminProvider } from "@/contexts/AdminContext";
import ErrorBoundary from "@/components/error-boundary";
import BackToTop from "@/components/back-to-top";
import ReadingProgress from "@/components/reading-progress";
import Header from "@/components/header";
import Footer from "@/components/footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Post from "@/pages/post";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Write from "@/pages/write";
import Analytics from "@/pages/analytics";
import AdminDashboard from "@/pages/admin-dashboard";
import BloggerImport from "@/pages/blogger-import";
import Monetization from "@/pages/monetization";
import Login from "@/pages/login";
import SEOHead from "@/components/seo-head";

function Router() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <SEOHead />
        <Header />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/post/:slug" component={Post} />
            <Route path="/write" component={Write} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/admin-dashboard" component={AdminDashboard} />
            <Route path="/blogger-import" component={BloggerImport} />
            <Route path="/monetization" component={Monetization} />
            <Route path="/admin" component={Login} />
            <Route path="/login" component={Login} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
        <BackToTop />
        <ReadingProgress />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AdminProvider>
            <Toaster />
            <Router />
          </AdminProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
