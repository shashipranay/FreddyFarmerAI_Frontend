import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { customer } from '@/services/api';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  images: Array<{ url: string }>;
  product: {
    _id: string;
    name: string;
    price: number;
    images: Array<{ url: string }>;
  };
}

interface Cart {
  _id: string;
  products: CartProduct[];
  total: number;
}

const Cart = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await customer.getCart();
      console.log('Fetched cart data:', response);
      if (response.cart) {
        // Process cart data to ensure all required fields are present
        const processedCart = {
          ...response.cart,
          products: response.cart.products.map((product: CartProduct) => ({
            ...product,
            price: product.product?.price || 0,
            name: product.product?.name || 'Unknown Product',
            images: product.product?.images || [],
            quantity: product.quantity || 0
          }))
        };
        setCart(processedCart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch cart',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (!productId) {
      console.error('Product ID is missing');
      toast({
        title: 'Error',
        description: 'Product ID is missing',
        variant: 'destructive',
      });
      return;
    }

    if (newQuantity < 1) return;
    
    try {
      setIsUpdating(true);
      console.log('Updating quantity for product:', { productId, newQuantity });
      const response = await customer.updateCartItem(productId, newQuantity);
      console.log('Update cart response:', response);
      if (response.cart) {
        // Process cart data after update
        const processedCart = {
          ...response.cart,
          products: response.cart.products.map((product: CartProduct) => ({
            ...product,
            price: product.product?.price || 0,
            name: product.product?.name || 'Unknown Product',
            images: product.product?.images || [],
            quantity: product.quantity || 0
          }))
        };
        setCart(processedCart);
        toast({
          title: 'Success',
          description: 'Cart updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to update cart',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    if (!productId) {
      console.error('Product ID is missing');
      toast({
        title: 'Error',
        description: 'Product ID is missing',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUpdating(true);
      console.log('Removing product from cart:', productId);
      const response = await customer.removeFromCart(productId);
      console.log('Remove from cart response:', response);
      if (response.cart) {
        // Process cart data after removal
        const processedCart = {
          ...response.cart,
          products: response.cart.products.map((product: CartProduct) => ({
            ...product,
            price: product.product?.price || 0,
            name: product.product?.name || 'Unknown Product',
            images: product.product?.images || [],
            quantity: product.quantity || 0
          }))
        };
        setCart(processedCart);
        toast({
          title: 'Success',
          description: 'Item removed from cart',
        });
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.products.length === 0) {
      toast({
        title: 'Error',
        description: 'Your cart is empty',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCheckingOut(true);
      const response = await customer.checkout();
      console.log('Checkout response:', response);
      
      toast({
        title: 'Success',
        description: 'Order placed successfully! You will be notified when your products are delivered.',
      });
      
      // Clear the cart after successful checkout
      setCart(null);
      
      // Navigate to dashboard
      navigate('/customer/dashboard');
    } catch (error) {
      console.error('Checkout error:', error);
      
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 'Failed to process checkout';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } else if (error instanceof Error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to process checkout',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to process checkout',
          variant: 'destructive',
        });
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-organic-green" />
      </div>
    );
  }

  if (!cart || cart.products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8">Add some products to your cart to continue shopping</p>
          <Button
            onClick={() => navigate('/marketplace')}
            className="bg-organic-green hover:bg-organic-green-dark"
          >
            Continue Shopping
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.products.map((item) => {
                const itemPrice = item.product?.price || 0;
                const itemQuantity = item.quantity || 0;
                const itemTotal = itemPrice * itemQuantity;
                const productId = item.product?._id;
                
                if (!productId) {
                  console.error('Product ID is missing for item:', item);
                  return null;
                }
                
                return (
                  <Card key={`${productId}-${itemQuantity}`} className="p-4 mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product?.images?.[0]?.url || 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables'}
                        alt={item.product?.name || 'Product'}
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product?.name || 'Unknown Product'}</h3>
                        <p className="text-sm text-gray-500">${itemPrice.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(productId, itemQuantity - 1)}
                            disabled={isUpdating || itemQuantity <= 1}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{itemQuantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(productId, itemQuantity + 1)}
                            disabled={isUpdating}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${itemTotal.toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveFromCart(productId)}
                          disabled={isUpdating}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${(cart?.total || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${(cart?.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-organic-green hover:bg-organic-green-dark"
                      onClick={handleCheckout}
                      disabled={isUpdating || isCheckingOut}
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Proceed to Checkout'
                      )}
                    </Button>
                  </div>
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

export default Cart; 