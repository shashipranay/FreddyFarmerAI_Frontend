
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="bg-gradient-to-br from-organic-cream via-white to-accent py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('welcomeToAbout')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionizing agriculture through direct farmer-customer connections
            </p>
          </div>
        </div>
        
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  FarmConnect bridges the gap between organic farmers and conscious consumers, 
                  eliminating middlemen to ensure fair prices for farmers and fresh produce for customers.
                </p>
                <p className="text-lg text-gray-600">
                  Our AI-powered platform provides real-time insights, expense tracking, and 
                  freshness monitoring to optimize the entire farm-to-table journey.
                </p>
              </div>
              <div className="bg-gradient-to-br from-organic-green to-organic-green-light p-8 rounded-3xl text-white">
                <h3 className="text-2xl font-bold mb-6">Our Impact</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Farmers Supported:</span>
                    <span className="font-bold">500+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customers Served:</span>
                    <span className="font-bold">10,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Generated:</span>
                    <span className="font-bold">₹50L+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waste Reduced:</span>
                    <span className="font-bold">30%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Developer</h2>
              <p className="text-xl text-gray-600">Passionate developer driving agricultural innovation</p>
            </div>
            
            <div className="flex justify-center">
              <Card className="text-center hover:shadow-xl transition-all duration-300 max-w-sm">
                <CardContent className="p-8">
                  <div className="text-6xl mb-6">👨‍💻</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">G.Shashi Pranay</h3>
                  <p className="text-organic-green font-semibold mb-4">Full Stack Developer</p>
                  <p className="text-gray-600">
                    Passionate about leveraging technology to solve real-world agricultural challenges 
                    and create sustainable solutions for farmers and consumers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;
