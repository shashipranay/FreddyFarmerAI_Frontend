
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      step: 1,
      title: 'Register as Farmer or Customer',
      description: 'Create your account and set up your profile based on your role.',
      icon: '👤'
    },
    {
      step: 2,
      title: 'Browse Fresh Produce',
      description: 'Explore organic products with AI-verified freshness scores.',
      icon: '🌱'
    },
    {
      step: 3,
      title: 'Direct Connection',
      description: 'Connect directly with farmers without any middlemen.',
      icon: '🤝'
    },
    {
      step: 4,
      title: 'Smart Analytics',
      description: 'Track expenses, monitor crop health with AI insights.',
      icon: '📊'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="bg-gradient-to-br from-organic-cream via-white to-accent py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('welcomeToHowItWorks')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to connect farmers with customers
            </p>
          </div>
        </div>
        
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="text-6xl mb-4">{step.icon}</div>
                    <div className="w-12 h-12 bg-organic-green rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
