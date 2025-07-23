import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { farmer } from '@/services/api';
import { AlertTriangle, DollarSign, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface SalesDataPoint {
  date: string;
  revenue: number;
}

interface ProductData {
  name: string;
  quantity: number;
  revenue: number;
}

interface StockLevel {
  name: string;
  stock: number;
  category: string;
}

interface AnalyticsSummary {
  totalProducts: number;
  totalRevenue: number;
  revenueChange: number;
  totalExpenses: number;
  lowStockProducts: number;
  organicProducts: number;
}

interface AnalyticsTrends {
  salesByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
  stockLevels: StockLevel[];
}

interface AIAnalyticsResponse {
  insights: string;
  summary: AnalyticsSummary;
  trends: AnalyticsTrends;
  period: string;
  metrics: string[];
}

const defaultAnalytics: AIAnalyticsResponse = {
  insights: '',
  summary: {
    totalProducts: 0,
    totalRevenue: 0,
    revenueChange: 0,
    totalExpenses: 0,
    lowStockProducts: 0,
    organicProducts: 0,
  },
  trends: {
    salesByCategory: {},
    expensesByCategory: {},
    stockLevels: [],
  },
  period: 'weekly',
  metrics: [],
};

const AIAnalytics = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [analytics, setAnalytics] = useState<AIAnalyticsResponse>(defaultAnalytics);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await farmer.getAIAnalytics({
        period,
        metrics: ['sales', 'inventory', 'predictions'],
        filters: productId ? {
          category: undefined,
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          }
        } : undefined,
      });
      setAnalytics(response || defaultAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics data. Please try again later.',
        variant: 'destructive',
      });
      setAnalytics(defaultAnalytics);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period, productId]);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      // Here you would typically call an API endpoint to generate a report
      await farmer.getAIAnalytics({
        period,
        metrics: ['report'],
        filters: {
          category: 'all',
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          }
        }
      });
      toast({
        title: 'Success',
        description: 'Report generation started. You will receive it shortly.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate report';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-organic-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">AI Analytics</h1>
            <Select value={period} onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly') => setPeriod(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-organic-green"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-organic-green" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{analytics.summary.totalRevenue.toFixed(2)}</div>
                    <p className={`text-xs ${analytics.summary.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {analytics.summary.revenueChange >= 0 ? '+' : ''}{analytics.summary.revenueChange.toFixed(1)}% from last {period}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-organic-green" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.summary.totalProducts}</div>
                    <p className="text-xs text-gray-500">{analytics.summary.organicProducts} organic products</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.summary.lowStockProducts}</div>
                    <p className="text-xs text-red-500">Products need attention</p>
                  </CardContent>
                </Card>
              </div>

              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">{analytics.insights}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Analytics */}
              <Tabs defaultValue="sales" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
                  <TabsTrigger value="expenses">Expense Analytics</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
                </TabsList>

                <TabsContent value="sales" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sales by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(analytics.trends.salesByCategory).map(([category, amount]) => (
                          <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h3 className="font-medium">{category}</h3>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-organic-green">₹{amount.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">Revenue</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="expenses" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Expenses by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(analytics.trends.expensesByCategory).map(([category, amount]) => (
                          <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h3 className="font-medium">{category}</h3>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-red-500">₹{amount.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">Expense</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Stock Levels</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.trends.stockLevels.map((stock, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <h3 className="font-medium">{stock.name}</h3>
                                <p className="text-sm text-gray-500">{stock.category}</p>
                              </div>
                              <span className={`text-sm ${
                                stock.stock < 10 ? 'text-red-500' :
                                stock.stock < 20 ? 'text-yellow-500' :
                                'text-green-500'
                              }`}>
                                {stock.stock} units
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  stock.stock < 10 ? 'bg-red-500' :
                                  stock.stock < 20 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{
                                  width: `${Math.min((stock.stock / 50) * 100, 100)}%`
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AIAnalytics; 