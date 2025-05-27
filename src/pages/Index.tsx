
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import MarketplacePreview from '@/components/MarketplacePreview';
import FarmerDashboard from '@/components/FarmerDashboard';
import Footer from '@/components/Footer';
import FreddyFarmerBot from '@/components/FreddyFarmerBot';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <MarketplacePreview />
        <FarmerDashboard />
      </div>
      <Footer />
      <FreddyFarmerBot />
    </div>
  );
};

export default Index;
