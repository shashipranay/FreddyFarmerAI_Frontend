import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { farmer } from '@/services/api';
import { Calendar, DollarSign, Plus, TrendingDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

interface ExpenseAnalytics {
  totalExpenses: number;
  expenseChange: number;
  expensesThisMonth: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

const Expenses = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [analytics, setAnalytics] = useState<ExpenseAnalytics>({
    totalExpenses: 0,
    expenseChange: 0,
    expensesThisMonth: 0,
    categoryBreakdown: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    date: '',
    description: '',
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const [expensesData, analyticsData] = await Promise.all([
        farmer.getExpenses(),
        farmer.getExpenseAnalytics(period),
      ]);
      setExpenses(expensesData);
      setAnalytics(analyticsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch expenses data';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [period]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const expense = await farmer.addExpense({
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        date: newExpense.date,
        description: newExpense.description,
      });
      setExpenses([...expenses, expense]);
      setNewExpense({
        category: '',
        amount: '',
        date: '',
        description: '',
      });
      toast({
        title: 'Success',
        description: 'Expense added successfully',
      });
      fetchExpenses(); // Refresh data
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add expense',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await farmer.deleteExpense(expenseId);
      setExpenses(expenses.filter(expense => expense.id !== expenseId));
      toast({
        title: 'Success',
        description: 'Expense deleted successfully',
      });
      fetchExpenses(); // Refresh data
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete expense',
        variant: 'destructive',
      });
    }
  };

  const categories = [
    'Seeds & Plants',
    'Equipment',
    'Fertilizers',
    'Pesticides',
    'Labor',
    'Utilities',
    'Transportation',
    'Other',
  ];

  if (loading && !expenses.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-organic-green"></div>
      </div>
    );
  }

  if (error && !expenses.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Expenses</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={fetchExpenses}
            className="bg-organic-green hover:bg-organic-green-dark"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
            <div className="flex space-x-4">
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
              <Button className="bg-organic-green hover:bg-organic-green-dark">
                Export Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <DollarSign className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics.totalExpenses.toFixed(2)}</div>
                <p className={`text-xs ${analytics.expenseChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.expenseChange >= 0 ? '+' : ''}{analytics.expenseChange}% vs last {period}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expense Trend</CardTitle>
                <TrendingDown className="h-4 w-4 text-organic-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.expenseChange}%</div>
                <p className="text-xs text-gray-500">vs last {period}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses This Month</CardTitle>
                <Calendar className="h-4 w-4 text-organic-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.expensesThisMonth}</div>
                <p className="text-xs text-gray-500">Total entries</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-organic-green"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="font-medium">{expense.category}</h3>
                            <p className="text-sm text-gray-500">{expense.description}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-semibold">${expense.amount.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">{expense.date}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Add New Expense</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddExpense} className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newExpense.category}
                        onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-organic-green hover:bg-organic-green-dark">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Expenses; 