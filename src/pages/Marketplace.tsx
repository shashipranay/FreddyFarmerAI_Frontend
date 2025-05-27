
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MarketplacePreview from '@/components/MarketplacePreview';
import FreddyFarmerBot from '@/components/FreddyFarmerBot';
import { useLanguage } from '@/contexts/LanguageContext';

const Marketplace = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="bg-gradient-to-br from-organic-cream via-white to-accent py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('welcomeToMarketplace')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('marketplaceDesc')}
            </p>
          </div>
        </div>
        <MarketplacePreview />
      </div>
      <Footer />
      <FreddyFarmerBot />
    </div>
  );
};

export default Marketplace;
