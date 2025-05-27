
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const MarketplacePreview = () => {
  const { t } = useLanguage();

  const products = [
    {
      name: 'Organic Spinach',
      farmer: 'Green Valley Farm',
      price: '$3.50/bunch',
      freshness: 98,
      image: '🥬',
      distance: '2.3 miles'
    },
    {
      name: 'Heritage Tomatoes',
      farmer: 'Sunset Organic',
      price: '$5.99/lb',
      freshness: 96,
      image: '🍅',
      distance: '4.1 miles'
    },
    {
      name: 'Rainbow Carrots',
      farmer: 'Earth Harvest',
      price: '$4.25/lb',
      freshness: 99,
      image: '🥕',
      distance: '1.8 miles'
    },
    {
      name: 'Fresh Herbs Bundle',
      farmer: 'Herb Haven',
      price: '$6.99/bundle',
      freshness: 97,
      image: '🌿',
      distance: '3.2 miles'
    }
  ];

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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-organic-green-light to-organic-green p-6 text-center relative overflow-hidden">
                  <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">{product.image}</div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-semibold">
                    {product.freshness}% Fresh
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/10 rounded-full"></div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.farmer}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-organic-green font-bold text-lg">{product.price}</span>
                    <span className="text-gray-500 text-sm">📍 {product.distance}</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-organic-green to-organic-green-dark hover:from-organic-green-dark hover:to-organic-green transition-all duration-300">
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
      </div>
    </section>
  );
};

export default MarketplacePreview;
