import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from '@/components/ui/use-toast';
import { farmer } from '@/services/api';
import { DollarSign, Package, Plus, Search, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Trade {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
  } | null;
  quantity: number;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  buyer?: {
    _id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface TradeAnalytics {
  totalRevenue: number;
  revenueChange: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
}

const Trades = () => {
  const { toast } = useToast();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [analytics, setAnalytics] = useState<TradeAnalytics>({
    totalRevenue: 0,
    revenueChange: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    product: '',
    quantity: '',
    amount: '',
  });
  const [products, setProducts] = useState<Product[]>([]);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const response = await farmer.getTrades();
      const tradesData = response.data || [];
      setTrades(tradesData);
      
      // Calculate analytics
      const analytics: TradeAnalytics = {
        totalRevenue: tradesData
          .filter(trade => trade.status === 'completed')
          .reduce((sum, trade) => sum + (trade.amount || 0), 0),
        revenueChange: 0, // This would come from the API in a real implementation
        pendingOrders: tradesData.filter(trade => trade.status === 'pending').length,
        completedOrders: tradesData.filter(trade => trade.status === 'completed').length,
        cancelledOrders: tradesData.filter(trade => trade.status === 'cancelled').length,
      };
      setAnalytics(analytics);
    } catch (error) {
      console.error('Error fetching trades:', error);
      setTrades([]); // Set empty array on error
      toast({
        title: 'Error',
        description: 'Failed to fetch trades data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await farmer.getProducts();
      // The API returns { products: Product[], totalPages: number, currentPage: number, total: number }
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchTrades();
    fetchProducts();
  }, []);

  const handleUpdateStatus = async (tradeId: string, newStatus: 'completed' | 'pending' | 'cancelled') => {
    try {
      const response = await farmer.updateTradeStatus(tradeId, newStatus);
      
      if (response.data) {
        // Update local state
        setTrades(trades.map(trade => 
          trade._id === tradeId ? { ...trade, status: newStatus } : trade
        ));

        // Show appropriate message based on status
        let message = '';
        switch (newStatus) {
          case 'completed':
            message = 'Trade completed successfully';
            break;
          case 'cancelled':
            message = 'Trade cancelled';
            break;
          case 'pending':
            message = 'Trade status updated to pending';
            break;
        }

        toast({
          title: 'Success',
          description: message,
        });

        // Refresh analytics
        fetchTrades();
      }
    } catch (error: any) {
      console.error('Error updating trade status:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update trade status';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleCreateTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedProduct = products.find(p => p._id === createFormData.product);
      if (!selectedProduct) {
        toast({
          title: 'Error',
          description: 'Please select a valid product',
          variant: 'destructive',
        });
        return;
      }

      const quantity = Number(createFormData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        toast({
          title: 'Error',
          description: 'Please enter a valid quantity',
          variant: 'destructive',
        });
        return;
      }

      // Calculate amount based on product price and quantity
      const amount = selectedProduct.price * quantity;

      await farmer.createTrade({
        product: createFormData.product,
        quantity: quantity,
        amount: amount,
      });

      toast({
        title: 'Success',
        description: 'Trade created successfully',
      });

      setIsCreateDialogOpen(false);
      setCreateFormData({
        product: '',
        quantity: '',
        amount: '',
      });

      fetchTrades(); // Refresh the trades list
    } catch (error: any) {
      console.error('Error creating trade:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create trade',
        variant: 'destructive',
      });
    }
  };

  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (value: string) => {
    const product = products.find(p => p._id === value);
    if (product) {
      const quantity = Number(createFormData.quantity) || 1;
      const amount = product.price * quantity;
      setCreateFormData(prev => ({
        ...prev,
        product: value,
        amount: amount.toString(),
      }));
    }
  };

  const handleQuantityChange = (value: string) => {
    const product = products.find(p => p._id === createFormData.product);
    if (product) {
      const quantity = Number(value) || 0;
      const amount = product.price * quantity;
      setCreateFormData(prev => ({
        ...prev,
        quantity: value,
        amount: amount.toString(),
      }));
    }
  };

  const filteredTrades = trades.filter(trade => {
    const matchesFilter = filter === 'all' || trade.status === filter;
    const productName = trade.product?.name?.toLowerCase() || '';
    const buyerName = trade.buyer?.name?.toLowerCase() || '';
    const matchesSearch = productName.includes(searchQuery.toLowerCase()) ||
                         buyerName.includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Trade Management</h1>
            <div className="flex space-x-4">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-organic-green hover:bg-organic-green-dark">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Trade
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Trade</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTrade} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="product">Product</Label>
                      <Select
                        value={createFormData.product}
                        onValueChange={handleProductSelect}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem key={product._id} value={product._id}>
                              {product.name} (Stock: {product.stock})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        value={createFormData.quantity}
                        onChange={e => handleQuantityChange(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={createFormData.amount}
                        onChange={handleCreateFormChange}
                        required
                        readOnly
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Create Trade
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline">
                Export Trades
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-organic-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</div>
                <p className={`text-xs ${analytics.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.revenueChange >= 0 ? '+' : ''}{analytics.revenueChange}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Package className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.pendingOrders}</div>
                <p className="text-xs text-gray-500">Awaiting completion</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                <TrendingUp className="h-4 w-4 text-organic-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trades.length}</div>
                <p className="text-xs text-gray-500">
                  {analytics.completedOrders} completed, {analytics.cancelledOrders} cancelled
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <CardTitle>Trade History</CardTitle>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search trades..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Trades</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-organic-green"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrades.map((trade) => (
                      <TableRow key={trade._id}>
                        <TableCell className="font-medium">
                          {trade.product?.name || 'Product not found'}
                        </TableCell>
                        <TableCell>{trade.buyer?.name || 'N/A'}</TableCell>
                        <TableCell>{trade.quantity}</TableCell>
                        <TableCell>${trade.amount.toFixed(2)}</TableCell>
                        <TableCell>{new Date(trade.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              trade.status === 'completed'
                                ? 'default'
                                : trade.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={trade.status}
                            onValueChange={(value: 'completed' | 'pending' | 'cancelled') => 
                              handleUpdateStatus(trade._id, value)
                            }
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Trades;