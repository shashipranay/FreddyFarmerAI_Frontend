import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { farmer } from '@/services/api';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface AnalyticsData {
  insights: string;
  summary: {
    totalProducts: number;
    totalSales: number;
    totalExpenses: number;
    lowStockProducts: number;
    organicProducts: number;
  };
  trends: {
    salesByCategory: Record<string, number>;
    expensesByCategory: Record<string, number>;
    stockLevels: Array<{
      name: string;
      stock: number;
      category: string;
    }>;
  };
  period: string;
  metrics: string[];
}

const AIAnalyticsDashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await farmer.getAIAnalytics({
        period: 'monthly',
        metrics: ['revenue', 'expenses', 'crop_health', 'yield_prediction'],
      });
      
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const revenueData = [
    { month: 'Jan', revenue: 15000, expenses: 8000 },
    { month: 'Feb', revenue: 18000, expenses: 9000 },
    { month: 'Mar', revenue: 22000, expenses: 10000 },
    { month: 'Apr', revenue: 25000, expenses: 11000 },
    { month: 'May', revenue: 28000, expenses: 12000 },
    { month: 'Jun', revenue: 32000, expenses: 13000 },
  ];

  const cropHealthData = [
    { crop: 'Tomatoes', health: 95, yield: 85 },
    { crop: 'Lettuce', health: 88, yield: 92 },
    { crop: 'Carrots', health: 93, yield: 88 },
    { crop: 'Spinach', health: 91, yield: 90 },
    { crop: 'Broccoli', health: 87, yield: 85 },
  ];

  const expenseBreakdown = [
    { name: 'Seeds', value: 25, color: '#10B981' },
    { name: 'Fertilizers', value: 30, color: '#34D399' },
    { name: 'Equipment', value: 20, color: '#6EE7B7' },
    { name: 'Labor', value: 15, color: '#A7F3D0' },
    { name: 'Others', value: 10, color: '#D1FAE5' },
  ];

  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: '#10B981',
    },
    expenses: {
      label: 'Expenses',
      color: '#EF4444',
    },
    health: {
      label: 'Health Score',
      color: '#10B981',
    },
    yield: {
      label: 'Yield Prediction',
      color: '#34D399',
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-organic-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AI analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-800 font-medium mb-2">Failed to load analytics</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-organic-green text-white rounded hover:bg-organic-green-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered Analytics Dashboard
          </h2>
          <p className="text-xl text-gray-600">
            Real-time insights and predictions to optimize your farming operations
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-organic-green to-organic-green-light text-white">
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-2">₹32,000</div>
              <div className="text-sm opacity-90">Monthly Revenue</div>
              <div className="text-xs mt-1">+12% from last month</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-2">91%</div>
              <div className="text-sm opacity-90">Avg Crop Health</div>
              <div className="text-xs mt-1">+3% improvement</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-2">88%</div>
              <div className="text-sm opacity-90">Yield Efficiency</div>
              <div className="text-xs mt-1">Above average</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-2">25</div>
              <div className="text-sm opacity-90">Active Crops</div>
              <div className="text-xs mt-1">5 varieties</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue vs Expenses Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Crop Health Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Crop Health & Yield Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart data={cropHealthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="health" stroke="var(--color-health)" strokeWidth={2} />
                  <Line type="monotone" dataKey="yield" stroke="var(--color-yield)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border-l-4 border-organic-green rounded">
                  <div className="font-semibold text-organic-green">🌱 Optimal Planting</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Based on weather patterns, plant tomatoes in the next 2 weeks for maximum yield.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <div className="font-semibold text-blue-600">💧 Water Management</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Reduce watering by 15% for carrots - soil moisture levels are optimal.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <div className="font-semibold text-yellow-600">⚠️ Disease Alert</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Monitor lettuce crops closely - early signs of fungal infection detected.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                  <div className="font-semibold text-purple-600">📈 Market Insights</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Spinach prices are trending up 20%. Consider increasing production next season.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIAnalyticsDashboard;
