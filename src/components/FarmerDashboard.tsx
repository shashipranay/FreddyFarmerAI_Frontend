
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const FarmerDashboard = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-organic-green">{t('smartTools').split(' ')[0]} {t('smartTools').split(' ')[1]}</span> {t('smartTools').split(' ').slice(2).join(' ')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('dashboardDesc')}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-organic-green to-organic-green-light text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <span>📊</span>
                {t('weeklyRevenue')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-organic-green mb-2">$2,450</div>
              <div className="text-green-600 text-sm">+15% from last week</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tomatoes</span>
                  <span className="font-semibold">$890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lettuce</span>
                  <span className="font-semibold">$650</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carrots</span>
                  <span className="font-semibold">$910</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-organic-earth to-organic-earth-light text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <span>💰</span>
                {t('expenseTracking')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-organic-earth mb-2">$890</div>
              <div className="text-red-600 text-sm">-5% from last month</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Seeds</span>
                  <span className="font-semibold">$320</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fertilizer</span>
                  <span className="font-semibold">$280</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Equipment</span>
                  <span className="font-semibold">$290</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-organic-sage to-organic-green-light text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <span>🌱</span>
                {t('cropHealthAI')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-organic-green mb-2">92%</div>
              <div className="text-green-600 text-sm">{t('overallHealth')}</div>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Tomatoes</span>
                    <span className="text-sm">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-organic-green h-2 rounded-full transition-all duration-500" style={{width: '95%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Lettuce</span>
                    <span className="text-sm">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-organic-green h-2 rounded-full transition-all duration-500" style={{width: '88%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Carrots</span>
                    <span className="text-sm">93%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-organic-green h-2 rounded-full transition-all duration-500" style={{width: '93%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FarmerDashboard;
