import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { customer } from '@/services/api';
import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: Array<{ url: string; public_id: string }>;
}

interface Farmer {
  _id: string;
  name: string;
  location?: string;
}

interface Trade {
  _id: string;
  product: Product;
  farmer: Farmer;
  quantity: number;
  amount: number;
  status: string;
  createdAt: string;
}

export function TradeManagement() {
  const { toast } = useToast();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const trades = await customer.getTrades();
      console.log('Fetched trades:', trades); // Debug log
      setTrades(trades);
    } catch (error) {
      console.error('Error fetching trades:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch trades',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
    // Set up polling to refresh trades every 30 seconds
    const intervalId = setInterval(fetchTrades, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Trades</h2>
        <button
          onClick={fetchTrades}
          className="px-4 py-2 text-sm bg-organic-green text-white rounded hover:bg-organic-green-dark transition-colors"
        >
          Refresh
        </button>
      </div>
      {loading ? (
        <div className="text-center">Loading trades...</div>
      ) : trades.length === 0 ? (
        <div className="text-center text-gray-500">No trades found</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map(trade => (
                <TableRow key={trade._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {trade.product.images && trade.product.images[0] ? (
                        <img 
                          src={trade.product.images[0].url} 
                          alt={trade.product.name} 
                          className="w-10 h-10 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/40';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <span>{trade.product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{trade.farmer?.name || 'Unknown'}</TableCell>
                  <TableCell>{trade.quantity}</TableCell>
                  <TableCell>₹{trade.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${getStatusColor(trade.status)}`}>
                      {trade.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(trade.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
} 