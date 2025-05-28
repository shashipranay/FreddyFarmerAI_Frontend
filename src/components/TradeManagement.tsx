import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { farmer } from '@/services/api';
import React, { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
}

interface Trade {
  _id: string;
  product: Product;
  quantity: number;
  amount: number;
  status: string;
  createdAt: string;
}

export function TradeManagement() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    amount: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchTrades();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await farmer.getProducts();
      setProducts(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    }
  };

  const fetchTrades = async () => {
    try {
      const response = await farmer.getTrades();
      setTrades(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch trades',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (value: string) => {
    const product = products.find(p => p._id === value);
    if (product) {
      setFormData(prev => ({
        ...prev,
        product: value,
        amount: (product.price * Number(prev.quantity || 1)).toString(),
      }));
    }
  };

  const handleQuantityChange = (value: string) => {
    const product = products.find(p => p._id === formData.product);
    if (product) {
      setFormData(prev => ({
        ...prev,
        quantity: value,
        amount: (product.price * Number(value)).toString(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await farmer.createTrade({
        product: formData.product,
        quantity: Number(formData.quantity),
        amount: Number(formData.amount),
      });

      toast({
        title: 'Success',
        description: 'Trade created successfully',
      });

      setFormData({
        product: '',
        quantity: '',
        amount: '',
      });

      fetchTrades();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create trade',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestTrades = async () => {
    setLoading(true);
    try {
      await farmer.createTestTrades({ count: 5 });
      toast({
        title: 'Success',
        description: 'Test trades created successfully',
      });
      fetchTrades();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create test trades',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trade Management</h2>
        <Button
          onClick={handleCreateTestTrades}
          disabled={loading || products.length === 0}
        >
          Create Test Trades
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select
              value={formData.product}
              onValueChange={handleProductChange}
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
              value={formData.quantity}
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
              value={formData.amount}
              onChange={handleInputChange}
              required
              readOnly
            />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          Create Trade
        </Button>
      </form>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map(trade => (
              <TableRow key={trade._id}>
                <TableCell>{trade.product.name}</TableCell>
                <TableCell>{trade.quantity}</TableCell>
                <TableCell>${trade.amount.toFixed(2)}</TableCell>
                <TableCell>{trade.status}</TableCell>
                <TableCell>
                  {new Date(trade.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 