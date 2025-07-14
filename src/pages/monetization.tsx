import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  Link, 
  Eye, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  TrendingUp,
  Lock,
  Unlock
} from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';

interface AdSenseSettings {
  enabled: boolean;
  publisherId: string;
  adUnits: {
    header: string;
    sidebar: string;
    inArticle: string;
    footer: string;
  };
  autoAds: boolean;
}

interface AffiliateLink {
  id: number;
  name: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  conversions: number;
  commission: number;
  category: string;
  isActive: boolean;
}

interface PaywallSettings {
  enabled: boolean;
  freeArticlesLimit: number;
  subscriptionPlans: {
    monthly: { price: number; stripePriceId: string };
    yearly: { price: number; stripePriceId: string };
  };
  premiumContent: string[];
}

export default function Monetization() {
  const { user, loading } = useAuth();
  const [adsenseSettings, setAdsenseSettings] = useState<AdSenseSettings>({
    enabled: false,
    publisherId: '',
    adUnits: { header: '', sidebar: '', inArticle: '', footer: '' },
    autoAds: false
  });
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [paywallSettings, setPaywallSettings] = useState<PaywallSettings>({
    enabled: false,
    freeArticlesLimit: 3,
    subscriptionPlans: {
      monthly: { price: 9.99, stripePriceId: '' },
      yearly: { price: 99.99, stripePriceId: '' }
    },
    premiumContent: []
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch monetization settings
  const { data: monetizationData } = useQuery({
    queryKey: ['/api/admin/monetization'],
    enabled: !!user,
  });

  useEffect(() => {
    if (monetizationData) {
      setAdsenseSettings(monetizationData.adsense || adsenseSettings);
      setAffiliateLinks(monetizationData.affiliateLinks || []);
      setPaywallSettings(monetizationData.paywall || paywallSettings);
    }
  }, [monetizationData]);

  // Save AdSense settings
  const saveAdSenseMutation = useMutation({
    mutationFn: async (settings: AdSenseSettings) => {
      return await apiRequest('/api/admin/monetization/adsense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, password: 'admin123' }),
      });
    },
    onSuccess: () => {
      toast({ title: "Success", description: "AdSense settings saved successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/monetization'] });
    },
  });

  // Save affiliate link
  const saveAffiliateMutation = useMutation({
    mutationFn: async (link: Partial<AffiliateLink>) => {
      return await apiRequest('/api/admin/monetization/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...link, password: 'admin123' }),
      });
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Affiliate link saved successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/monetization'] });
    },
  });

  // Save paywall settings
  const savePaywallMutation = useMutation({
    mutationFn: async (settings: PaywallSettings) => {
      return await apiRequest('/api/admin/monetization/paywall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, password: 'admin123' }),
      });
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Paywall settings saved successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/monetization'] });
    },
  });

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Monetization</h1>
            <p className="text-muted-foreground">
              Manage AdSense, affiliate links, and premium content subscriptions
            </p>
          </div>

          <Tabs defaultValue="adsense" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="adsense" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                AdSense
              </TabsTrigger>
              <TabsTrigger value="affiliate" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                Affiliate Links
              </TabsTrigger>
              <TabsTrigger value="paywall" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Premium Content
              </TabsTrigger>
            </TabsList>

            {/* AdSense Tab */}
            <TabsContent value="adsense">
              <Card>
                <CardHeader>
                  <CardTitle>Google AdSense Integration</CardTitle>
                  <CardDescription>
                    Configure Google AdSense to display ads on your blog
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="adsense-enabled">Enable AdSense</Label>
                      <p className="text-sm text-muted-foreground">
                        Turn on ad display across your blog
                      </p>
                    </div>
                    <Switch
                      id="adsense-enabled"
                      checked={adsenseSettings.enabled}
                      onCheckedChange={(checked) =>
                        setAdsenseSettings(prev => ({ ...prev, enabled: checked }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="publisher-id">Publisher ID</Label>
                    <Input
                      id="publisher-id"
                      value={adsenseSettings.publisherId}
                      onChange={(e) =>
                        setAdsenseSettings(prev => ({ ...prev, publisherId: e.target.value }))
                      }
                      placeholder="pub-1234567890123456"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Ad Unit IDs</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="header-ad">Header Ad</Label>
                        <Input
                          id="header-ad"
                          value={adsenseSettings.adUnits.header}
                          onChange={(e) =>
                            setAdsenseSettings(prev => ({
                              ...prev,
                              adUnits: { ...prev.adUnits, header: e.target.value }
                            }))
                          }
                          placeholder="1234567890"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sidebar-ad">Sidebar Ad</Label>
                        <Input
                          id="sidebar-ad"
                          value={adsenseSettings.adUnits.sidebar}
                          onChange={(e) =>
                            setAdsenseSettings(prev => ({
                              ...prev,
                              adUnits: { ...prev.adUnits, sidebar: e.target.value }
                            }))
                          }
                          placeholder="1234567891"
                        />
                      </div>
                      <div>
                        <Label htmlFor="article-ad">In-Article Ad</Label>
                        <Input
                          id="article-ad"
                          value={adsenseSettings.adUnits.inArticle}
                          onChange={(e) =>
                            setAdsenseSettings(prev => ({
                              ...prev,
                              adUnits: { ...prev.adUnits, inArticle: e.target.value }
                            }))
                          }
                          placeholder="1234567892"
                        />
                      </div>
                      <div>
                        <Label htmlFor="footer-ad">Footer Ad</Label>
                        <Input
                          id="footer-ad"
                          value={adsenseSettings.adUnits.footer}
                          onChange={(e) =>
                            setAdsenseSettings(prev => ({
                              ...prev,
                              adUnits: { ...prev.adUnits, footer: e.target.value }
                            }))
                          }
                          placeholder="1234567893"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-ads">Auto Ads</Label>
                      <p className="text-sm text-muted-foreground">
                        Let Google automatically place ads for better revenue
                      </p>
                    </div>
                    <Switch
                      id="auto-ads"
                      checked={adsenseSettings.autoAds}
                      onCheckedChange={(checked) =>
                        setAdsenseSettings(prev => ({ ...prev, autoAds: checked }))
                      }
                    />
                  </div>

                  <Button 
                    onClick={() => saveAdSenseMutation.mutate(adsenseSettings)}
                    disabled={saveAdSenseMutation.isPending}
                  >
                    {saveAdSenseMutation.isPending ? 'Saving...' : 'Save AdSense Settings'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Affiliate Links Tab */}
            <TabsContent value="affiliate">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Affiliate Link Management</CardTitle>
                        <CardDescription>
                          Create and track affiliate marketing links
                        </CardDescription>
                      </div>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Link
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {affiliateLinks.length === 0 ? (
                        <div className="text-center py-8">
                          <Link className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">No affiliate links yet</p>
                          <p className="text-sm text-muted-foreground">
                            Create your first affiliate link to start earning commissions
                          </p>
                        </div>
                      ) : (
                        affiliateLinks.map((link) => (
                          <div key={link.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold">{link.name}</h4>
                                  <Badge variant={link.isActive ? "default" : "secondary"}>
                                    {link.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Short URL: /go/{link.shortCode}
                                </p>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium">{link.clicks}</p>
                                    <p className="text-muted-foreground">Clicks</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">{link.conversions}</p>
                                    <p className="text-muted-foreground">Conversions</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">${link.commission}</p>
                                    <p className="text-muted-foreground">Commission</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Paywall Tab */}
            <TabsContent value="paywall">
              <Card>
                <CardHeader>
                  <CardTitle>Premium Content & Subscriptions</CardTitle>
                  <CardDescription>
                    Set up paid subscriptions and premium content access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="paywall-enabled">Enable Premium Content</Label>
                      <p className="text-sm text-muted-foreground">
                        Restrict access to premium articles for subscribers only
                      </p>
                    </div>
                    <Switch
                      id="paywall-enabled"
                      checked={paywallSettings.enabled}
                      onCheckedChange={(checked) =>
                        setPaywallSettings(prev => ({ ...prev, enabled: checked }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="free-limit">Free Articles Limit</Label>
                    <Input
                      id="free-limit"
                      type="number"
                      value={paywallSettings.freeArticlesLimit}
                      onChange={(e) =>
                        setPaywallSettings(prev => ({
                          ...prev,
                          freeArticlesLimit: parseInt(e.target.value) || 0
                        }))
                      }
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Number of free articles users can read before subscribing
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label>Subscription Plans</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Monthly Plan</h4>
                        <div className="space-y-2">
                          <div>
                            <Label htmlFor="monthly-price">Price ($)</Label>
                            <Input
                              id="monthly-price"
                              type="number"
                              step="0.01"
                              value={paywallSettings.subscriptionPlans.monthly.price}
                              onChange={(e) =>
                                setPaywallSettings(prev => ({
                                  ...prev,
                                  subscriptionPlans: {
                                    ...prev.subscriptionPlans,
                                    monthly: {
                                      ...prev.subscriptionPlans.monthly,
                                      price: parseFloat(e.target.value) || 0
                                    }
                                  }
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="monthly-stripe">Stripe Price ID</Label>
                            <Input
                              id="monthly-stripe"
                              value={paywallSettings.subscriptionPlans.monthly.stripePriceId}
                              onChange={(e) =>
                                setPaywallSettings(prev => ({
                                  ...prev,
                                  subscriptionPlans: {
                                    ...prev.subscriptionPlans,
                                    monthly: {
                                      ...prev.subscriptionPlans.monthly,
                                      stripePriceId: e.target.value
                                    }
                                  }
                                }))
                              }
                              placeholder="price_xxxxxxxxxxxxx"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Yearly Plan</h4>
                        <div className="space-y-2">
                          <div>
                            <Label htmlFor="yearly-price">Price ($)</Label>
                            <Input
                              id="yearly-price"
                              type="number"
                              step="0.01"
                              value={paywallSettings.subscriptionPlans.yearly.price}
                              onChange={(e) =>
                                setPaywallSettings(prev => ({
                                  ...prev,
                                  subscriptionPlans: {
                                    ...prev.subscriptionPlans,
                                    yearly: {
                                      ...prev.subscriptionPlans.yearly,
                                      price: parseFloat(e.target.value) || 0
                                    }
                                  }
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="yearly-stripe">Stripe Price ID</Label>
                            <Input
                              id="yearly-stripe"
                              value={paywallSettings.subscriptionPlans.yearly.stripePriceId}
                              onChange={(e) =>
                                setPaywallSettings(prev => ({
                                  ...prev,
                                  subscriptionPlans: {
                                    ...prev.subscriptionPlans,
                                    yearly: {
                                      ...prev.subscriptionPlans.yearly,
                                      stripePriceId: e.target.value
                                    }
                                  }
                                }))
                              }
                              placeholder="price_xxxxxxxxxxxxx"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => savePaywallMutation.mutate(paywallSettings)}
                    disabled={savePaywallMutation.isPending}
                  >
                    {savePaywallMutation.isPending ? 'Saving...' : 'Save Paywall Settings'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
    </div>
  );
}