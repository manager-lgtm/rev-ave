import React, { useState, useEffect } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  TrendingUp, 
  Users, 
  MousePointer, 
  Target, 
  Eye, 
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Download
} from "lucide-react";
import { storage } from './utils/storage';
import { analytics } from './Analytics';
import { abTesting } from './ABTesting';

interface AnalyticsData {
  totalUsers: number;
  totalSessions: number;
  totalPageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  topPages: Array<{ page: string; views: number; }>;
  deviceBreakdown: { mobile: number; tablet: number; desktop: number; };
  popularServices: Array<{ serviceId: string; views: number; }>;
  recentEvents: Array<any>;
}

export const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [activeTests, setActiveTests] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
    loadABTestData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    
    try {
      // Get analytics events from localStorage
      const events = storage.get<any[]>('analytics_events') || [];
      const now = Date.now();
      const timeRangeMs = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      }[timeRange];

      const filteredEvents = events.filter(
        event => now - event.timestamp <= timeRangeMs
      );

      // Calculate metrics
      const uniqueUsers = new Set(filteredEvents.map(e => e.userId)).size;
      const uniqueSessions = new Set(filteredEvents.map(e => e.sessionId)).size;
      const pageViews = filteredEvents.filter(e => e.event === 'page_view').length;
      const conversions = filteredEvents.filter(e => e.event === 'booking_completed').length;
      
      // Calculate session durations
      const sessionDurations = filteredEvents
        .filter(e => e.event === 'time_on_page')
        .map(e => e.properties?.duration_ms || 0);
      
      const avgSessionDuration = sessionDurations.length > 0 
        ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length 
        : 0;

      // Device breakdown
      const deviceCounts = filteredEvents.reduce((acc, event) => {
        const device = event.device || 'desktop';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Top pages
      const pageCounts = filteredEvents
        .filter(e => e.event === 'page_view')
        .reduce((acc, event) => {
          const page = event.properties?.page_name || event.pageUrl || 'unknown';
          acc[page] = (acc[page] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      const topPages = Object.entries(pageCounts)
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // Popular services
      const serviceCounts = filteredEvents
        .filter(e => e.event === 'service_view' || e.event === 'service_select')
        .reduce((acc, event) => {
          const serviceId = event.properties?.service_id || 'unknown';
          acc[serviceId] = (acc[serviceId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      const popularServices = Object.entries(serviceCounts)
        .map(([serviceId, views]) => ({ serviceId, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      setAnalyticsData({
        totalUsers: uniqueUsers,
        totalSessions: uniqueSessions,
        totalPageViews: pageViews,
        averageSessionDuration: avgSessionDuration,
        bounceRate: uniqueSessions > 0 ? ((uniqueSessions - conversions) / uniqueSessions) * 100 : 0,
        conversionRate: pageViews > 0 ? (conversions / pageViews) * 100 : 0,
        topPages,
        deviceBreakdown: {
          mobile: deviceCounts.mobile || 0,
          tablet: deviceCounts.tablet || 0,
          desktop: deviceCounts.desktop || 0
        },
        popularServices,
        recentEvents: filteredEvents.slice(-10).reverse()
      });
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadABTestData = () => {
    const tests = abTesting.getAllActiveTests();
    setActiveTests(tests);
  };

  const exportData = () => {
    const data = {
      analyticsData,
      activeTests,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-avenue-analytics-${timeRange}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 ra-spinner border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--ra-olive)]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[var(--ra-olive)]">Analytics Dashboard</h1>
            <p className="text-gray-600">Revenue Avenue Performance Metrics</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['24h', '7d', '30d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    timeRange === range
                      ? 'bg-white text-[var(--ra-olive)] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={exportData}
              className="ra-btn-outline flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="behavior">User Behavior</TabsTrigger>
            <TabsTrigger value="conversion">Conversions</TabsTrigger>
            <TabsTrigger value="experiments">A/B Tests</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-[var(--ra-olive)]">
                      {analyticsData?.totalUsers || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-[var(--ra-gold)]" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sessions</p>
                    <p className="text-2xl font-bold text-[var(--ra-olive)]">
                      {analyticsData?.totalSessions || 0}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-[var(--ra-gold)]" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Session</p>
                    <p className="text-2xl font-bold text-[var(--ra-olive)]">
                      {Math.round((analyticsData?.averageSessionDuration || 0) / 1000 / 60)}m
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-[var(--ra-gold)]" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-[var(--ra-olive)]">
                      {(analyticsData?.conversionRate || 0).toFixed(1)}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-[var(--ra-gold)]" />
                </div>
              </Card>
            </div>

            {/* Device Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-[var(--ra-olive)] mb-4 flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Device Breakdown</span>
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Smartphone className="w-8 h-8 text-[var(--ra-gold)] mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Mobile</p>
                  <p className="text-xl font-bold text-[var(--ra-olive)]">
                    {analyticsData?.deviceBreakdown.mobile || 0}
                  </p>
                </div>
                
                <div className="text-center">
                  <Tablet className="w-8 h-8 text-[var(--ra-gold)] mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Tablet</p>
                  <p className="text-xl font-bold text-[var(--ra-olive)]">
                    {analyticsData?.deviceBreakdown.tablet || 0}
                  </p>
                </div>
                
                <div className="text-center">
                  <Monitor className="w-8 h-8 text-[var(--ra-gold)] mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Desktop</p>
                  <p className="text-xl font-bold text-[var(--ra-olive)]">
                    {analyticsData?.deviceBreakdown.desktop || 0}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* User Behavior Tab */}
          <TabsContent value="behavior" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-[var(--ra-olive)] mb-4">Top Pages</h3>
                <div className="space-y-3">
                  {analyticsData?.topPages.map((page, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 truncate">{page.page}</span>
                      <Badge variant="outline">{page.views} views</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Popular Services */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-[var(--ra-olive)] mb-4">Popular Services</h3>
                <div className="space-y-3">
                  {analyticsData?.popularServices.map((service, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 truncate">{service.serviceId}</span>
                      <Badge variant="outline">{service.views} views</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Conversions Tab */}
          <TabsContent value="conversion" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-[var(--ra-olive)] mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Conversion Funnel</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <span className="font-medium">Page Views</span>
                  <span className="font-bold text-lg">{analyticsData?.totalPageViews || 0}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <span className="font-medium">Service Views</span>
                  <span className="font-bold text-lg">
                    {analyticsData?.popularServices.reduce((sum, service) => sum + service.views, 0) || 0}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                  <span className="font-medium">Bookings Initiated</span>
                  <span className="font-bold text-lg">
                    {analyticsData?.recentEvents.filter(e => e.event === 'booking_initiated').length || 0}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[var(--ra-cream)] to-[var(--ra-gold)] rounded-lg">
                  <span className="font-medium">Conversions</span>
                  <span className="font-bold text-lg">
                    {analyticsData?.recentEvents.filter(e => e.event === 'booking_completed').length || 0}
                  </span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* A/B Tests Tab */}
          <TabsContent value="experiments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeTests.map((test) => (
                <Card key={test.testId} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-[var(--ra-olive)]">{test.testId}</h3>
                      <p className="text-sm text-gray-600">Active Variant: {test.variantId}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Running</Badge>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Configuration:</h4>
                    <pre className="text-xs text-gray-600 overflow-auto">
                      {JSON.stringify(test.config, null, 2)}
                    </pre>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Component to add analytics dashboard access
export const AnalyticsAccess: React.FC<{ onViewDashboard: () => void }> = ({ 
  onViewDashboard 
}) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin (in production, this would be a proper auth check)
    const adminAccess = localStorage.getItem('admin_access') === 'true';
    setIsAdmin(adminAccess);
  }, []);

  if (!isAdmin) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const password = prompt('Enter admin password:');
            if (password === 'revenue2024') {
              localStorage.setItem('admin_access', 'true');
              setIsAdmin(true);
            }
          }}
          className="bg-white/90 backdrop-blur-sm"
        >
          Admin
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4">
      <Button
        onClick={onViewDashboard}
        className="ra-btn-secondary"
      >
        📊 Analytics
      </Button>
    </div>
  );
};