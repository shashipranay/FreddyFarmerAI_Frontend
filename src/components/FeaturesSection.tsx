
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import React from 'react';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: '🤖',
      title: t('aiAnalytics'),
      description: t('aiAnalyticsDesc')
    },
    {
      icon: '🌱',
      title: t('freshnessTracking'),
      description: t('freshnessTrackingDesc')
    },
    {
      icon: '💰',
      title: t('fairPricing'),
      description: t('fairPricingDesc')
    },
    {
      icon: '📱',
      title: t('easyToUse'),
      description: t('easyToUseDesc')
    },
    {
      icon: '🚚',
      title: t('directDelivery'),
      description: t('directDeliveryDesc')
    },
    {
      icon: '📊',
      title: t('smartInsights'),
      description: t('smartInsightsDesc')
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('whyChoose').split('Freddy Farmer').map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index === 0 && <span className="text-organic-green">Freddy Farmer</span>}
              </React.Fragment>
            ))}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge AI technology with sustainable farming practices 
            to create a better future for farmers and consumers alike.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-gradient-to-br from-white to-accent group">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
