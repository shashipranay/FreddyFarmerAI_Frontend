import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <section className="bg-gradient-to-br from-organic-cream via-white to-accent pt-24 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t('heroTitle').split(' ').map((word, index) => (
                <span key={index} className={word === 'Directly' || word === 'Organic' ? 'text-organic-green' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            <p className="text-xl text-gray-600 mt-6 leading-relaxed mb-8">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {isAuthenticated ? (
                <>
                  <Link to="/marketplace">
                    <Button size="lg" className="bg-gradient-to-r from-organic-green to-organic-green-dark hover:from-organic-green-dark hover:to-organic-green text-lg px-8 py-4 shadow-lg transition-all duration-300">
                      {t('shopProduce')}
                    </Button>
                  </Link>
                  <Link to="/for-farmers">
                    <Button size="lg" variant="outline" className="border-2 border-organic-green text-organic-green hover:bg-organic-green hover:text-white text-lg px-8 py-4 transition-all duration-300">
                      {t('joinFarmer')}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button size="lg" className="bg-gradient-to-r from-organic-green to-organic-green-dark hover:from-organic-green-dark hover:to-organic-green text-lg px-8 py-4 shadow-lg transition-all duration-300">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register/farmer">
                    <Button size="lg" variant="outline" className="border-2 border-organic-green text-organic-green hover:bg-organic-green hover:text-white text-lg px-8 py-4 transition-all duration-300">
                      Join as Farmer
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-organic-green">500+</div>
                <div className="text-gray-600 text-sm">{t('activeFarmers')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-organic-green">10K+</div>
                <div className="text-gray-600 text-sm">{t('happyCustomers')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-organic-green">95%</div>
                <div className="text-gray-600 text-sm">{t('freshnessScore')}</div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-slide-in">
            <div className="bg-gradient-to-br from-organic-green to-organic-green-light p-8 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white rounded-2xl p-6 transform -rotate-3">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { emoji: '🥬', name: 'Fresh Lettuce', price: '$3.99/lb', freshness: '98%' },
                    { emoji: '🍅', name: 'Organic Tomatoes', price: '$4.50/lb', freshness: '96%' },
                    { emoji: '🥕', name: 'Baby Carrots', price: '$2.99/lb', freshness: '99%' },
                    { emoji: '🌽', name: 'Sweet Corn', price: '$1.99/ear', freshness: '97%' }
                  ].map((item, index) => (
                    <div key={index} className="bg-gradient-to-br from-accent to-organic-cream rounded-xl p-4 text-center hover:shadow-lg transition-shadow duration-300">
                      <div className="text-4xl mb-2">{item.emoji}</div>
                      <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                      <div className="text-organic-green font-bold text-sm">{item.price}</div>
                      <div className="text-xs text-gray-500">Freshness: {item.freshness}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
