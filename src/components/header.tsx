import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Sun, Moon, Menu, X, ChevronDown, Sparkles, Globe, Code, TrendingUp, BarChart3, Plane, Settings, DollarSign, Download } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdmin } from '@/contexts/AdminContext';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isAdminAuthenticated, logout } = useAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Modern Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                AI - Voyager Blog
              </span>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 mr-4 ${
                location === '/' 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location === '/about' 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
              }`}
            >
              About
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/50 rounded-lg transition-all duration-200"
              >
                Categories
                <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-background border rounded-lg shadow-lg py-2 z-50">
                  <Link 
                    href="/?category=AI" 
                    className="flex items-center px-4 py-2 text-sm hover:bg-accent/50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Code className="h-4 w-4 mr-2 text-blue-500" />
                    AI & Tech
                  </Link>
                  <Link 
                    href="/?category=Web Dev" 
                    className="flex items-center px-4 py-2 text-sm hover:bg-accent/50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Globe className="h-4 w-4 mr-2 text-green-500" />
                    Web Development
                  </Link>
                  <Link 
                    href="/?category=Travel" 
                    className="flex items-center px-4 py-2 text-sm hover:bg-accent/50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Plane className="h-4 w-4 mr-2 text-purple-500" />
                    Travel
                  </Link>
                </div>
              )}
            </div>

            <Link 
              href="/contact" 
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location === '/contact' 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
              }`}
            >
              Contact
            </Link>
            <Link 
              href="/write" 
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location === '/write' 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
              }`}
            >
              Write
            </Link>
            {/* Admin Tools Dropdown - Only show if authenticated */}
            {isAdminAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/50 rounded-lg transition-all duration-200"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Admin
                  <ChevronDown className="ml-1 h-3 w-3" />
                </button>
                {isAdminDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-background border rounded-lg shadow-lg py-2 z-50">
                    <Link 
                      href="/write" 
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent/50 transition-colors"
                      onClick={() => setIsAdminDropdownOpen(false)}
                    >
                      <Code className="h-4 w-4 mr-2 text-blue-500" />
                      Write Post
                    </Link>
                    <Link 
                      href="/analytics" 
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent/50 transition-colors"
                      onClick={() => setIsAdminDropdownOpen(false)}
                    >
                      <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
                      Analytics
                    </Link>
                    <Link 
                      href="/blogger-import" 
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent/50 transition-colors"
                      onClick={() => setIsAdminDropdownOpen(false)}
                    >
                      <Download className="h-4 w-4 mr-2 text-purple-500" />
                      Import from Blogger
                    </Link>
                    <Link 
                      href="/monetization" 
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent/50 transition-colors"
                      onClick={() => setIsAdminDropdownOpen(false)}
                    >
                      <DollarSign className="h-4 w-4 mr-2 text-yellow-500" />
                      Monetization
                    </Link>
                    <div className="border-t my-2"></div>
                    <button
                      onClick={() => {
                        logout();
                        setIsAdminDropdownOpen(false);
                        navigate('/');
                      }}
                      className="flex items-center px-4 py-2 text-sm hover:bg-accent/50 transition-colors w-full text-left text-red-600 hover:text-red-700"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Search Bar - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" size="sm" variant="outline">
              Search
            </Button>
          </form>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>



            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t mt-4 pt-4 pb-2 space-y-2">
            <Link 
              href="/" 
              className={`block px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location === '/' 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`block px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location === '/about' 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            
            <div className="px-3 py-2">
              <div className="text-xs font-semibold text-muted-foreground mb-2">Categories</div>
              <div className="space-y-1 ml-2">
                <Link 
                  href="/?category=AI" 
                  className="flex items-center px-3 py-1 text-sm hover:bg-accent/50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Code className="h-4 w-4 mr-2 text-blue-500" />
                  AI & Tech
                </Link>
                <Link 
                  href="/?category=Web Dev" 
                  className="flex items-center px-3 py-1 text-sm hover:bg-accent/50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Globe className="h-4 w-4 mr-2 text-green-500" />
                  Web Development
                </Link>
                <Link 
                  href="/?category=Travel" 
                  className="flex items-center px-3 py-1 text-sm hover:bg-accent/50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Plane className="h-4 w-4 mr-2 text-purple-500" />
                  Travel
                </Link>
              </div>
            </div>

            <Link 
              href="/contact" 
              className={`block px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location === '/contact' 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/write" 
              className={`block px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location === '/write' 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Write
            </Link>
            <Link 
              href="/analytics" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location === '/analytics' 
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search posts..." 
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}