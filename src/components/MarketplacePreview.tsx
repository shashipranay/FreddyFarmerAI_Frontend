import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { customer } from '@/services/api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: Array<{
    url: string;
    public_id: string;
  }>;
  location: string;
  harvestDate: string;
  organic: boolean;
  farmer?: {
    name: string;
    location: string;
  };
}

const DEFAULT_PLACEHOLDER_IMAGE = 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables';

const MarketplacePreview = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await customer.getProducts();
        setProducts(response.products || []);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load products',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const handleAddToCart = async (productId: string) => {
    try {
      await customer.addToCart(productId, 1);
      toast({
        title: 'Success',
        description: 'Product added to cart',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product to cart',
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-accent to-organic-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('freshLocal').split('Local Farms').map((part, index) => (
              <span key={index}>
                {part}
                {index === 0 && <span className="text-organic-green">Local Farms</span>}
              </span>
            ))}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('marketplaceDesc')}
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-organic-green"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {products.slice(0, 4).map((product) => (
                <Card key={product._id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-organic-green-light to-organic-green p-6 text-center relative overflow-hidden">
                      <div className="aspect-square">
                        <img
                          src={product.images?.[0]?.url || DEFAULT_PLACEHOLDER_IMAGE}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = DEFAULT_PLACEHOLDER_IMAGE;
                          }}
                        />
                      </div>
                      {product.organic && (
                        <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-semibold">
                          Organic
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{product.farmer?.name || 'Unknown Farmer'}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-organic-green font-bold text-lg">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          📍 {product.location}
                        </span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-organic-green to-organic-green-dark hover:from-organic-green-dark hover:to-organic-green transition-all duration-300"
                        onClick={() => handleAddToCart(product._id)}
                      >
                        {t('addToCart')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/marketplace">
                <Button size="lg" className="bg-gradient-to-r from-organic-green to-organic-green-dark hover:from-organic-green-dark hover:to-organic-green text-lg px-8 shadow-lg transition-all duration-300">
                  {t('viewAllProducts')}
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MarketplacePreview;
