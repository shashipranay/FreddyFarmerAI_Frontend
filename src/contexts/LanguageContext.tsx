
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'te' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    marketplace: 'Marketplace',
    forFarmers: 'For Farmers',
    howItWorks: 'How it Works',
    about: 'About',
    login: 'Login',
    getStarted: 'Get Started',
    
    // Hero Section
    heroTitle: 'Connect Directly with Organic Farmers',
    heroSubtitle: 'Eliminate middlemen, reduce costs, and get the freshest organic produce directly from local farmers. Our AI-powered platform ensures quality, tracks freshness, and optimizes farm operations.',
    shopProduce: 'Shop Fresh Produce',
    joinFarmer: 'Join as Farmer',
    
    // Stats
    activeFarmers: 'Active Farmers',
    happyCustomers: 'Happy Customers',
    freshnessScore: 'Freshness Score',
    
    // Features
    whyChoose: 'Why Choose FarmConnect?',
    aiAnalytics: 'AI-Powered Analytics',
    aiAnalyticsDesc: 'Track expenses, monitor crop health, and predict optimal harvest times with advanced AI algorithms.',
    freshnessTracking: 'Freshness Tracking',
    freshnessTrackingDesc: 'Real-time freshness monitoring ensures customers receive the highest quality produce.',
    fairPricing: 'Fair Pricing',
    fairPricingDesc: 'Eliminate middlemen and commissions. Farmers set their own prices and keep more profit.',
    easyToUse: 'Easy to Use',
    easyToUseDesc: 'Intuitive platform for both farmers and customers with mobile-first design.',
    directDelivery: 'Direct Delivery',
    directDeliveryDesc: 'Efficient logistics connecting farms directly to customer doorsteps.',
    smartInsights: 'Smart Insights',
    smartInsightsDesc: 'Data-driven recommendations to optimize farming operations and reduce waste.',
    
    // Marketplace
    freshLocal: 'Fresh from Local Farms',
    marketplaceDesc: 'Discover the freshest organic produce from farmers in your area. Every item comes with AI-verified freshness scores and transparent pricing.',
    addToCart: 'Add to Cart',
    viewAllProducts: 'View All Products',
    
    // Farmer Dashboard
    smartTools: 'Smart Tools for Modern Farmers',
    dashboardDesc: 'Manage your farm operations, track expenses, monitor crop health, and connect with customers through our comprehensive farmer dashboard powered by AI insights.',
    weeklyRevenue: 'Weekly Revenue',
    expenseTracking: 'Expense Tracking',
    cropHealthAI: 'Crop Health AI',
    overallHealth: 'Overall health score',
    
    // Navigation Pages
    welcomeToMarketplace: 'Welcome to Marketplace',
    welcomeToFarmers: 'Welcome to Farmers Portal',
    welcomeToHowItWorks: 'How FarmConnect Works',
    welcomeToAbout: 'About FarmConnect',
    welcomeToLogin: 'Login to FarmConnect'
  },
  te: {
    // Header
    marketplace: 'మార్కెట్‌ప్లేస్',
    forFarmers: 'రైతుల కోసం',
    howItWorks: 'ఎలా పనిచేస్తుంది',
    about: 'గురించి',
    login: 'లాగిన్',
    getStarted: 'ప్రారంభించండి',
    
    // Hero Section
    heroTitle: 'సేంద్రీయ రైతులతో నేరుగా కనెక్ట్ అవ్వండి',
    heroSubtitle: 'మధ్యవర్తులను తొలగించండి, ఖర్చులను తగ్గించండి మరియు స్థానిక రైతుల నుండి నేరుగా తాజా సేంద్రీయ ఉత్పత్తులను పొందండి. మా AI-శక్తితో కూడిన ప్లాట్‌ఫారమ్ నాణ్యతను నిర్ధారిస్తుంది, తాజాదనాన్ని ట్రాక్ చేస్తుంది మరియు వ్యవసాయ కార్యకలాపాలను ఆప్టిమైజ్ చేస్తుంది.',
    shopProduce: 'తాజా ఉత్పత్తులు కొనండి',
    joinFarmer: 'రైతుగా చేరండి',
    
    // Stats
    activeFarmers: 'క్రియాశీల రైతులు',
    happyCustomers: 'సంతుష్ట కస్టమర్లు',
    freshnessScore: 'తాజాదనం స్కోర్',
    
    // Features
    whyChoose: 'FarmConnect ఎందుకు ఎంచుకోవాలి?',
    aiAnalytics: 'AI-శక్తితో కూడిన విశ్లేషణలు',
    aiAnalyticsDesc: 'అధునాతన AI అల్గోరిథమ్‌లతో ఖర్చులను ట్రాక్ చేయండి, పంట ఆరోగ్యాన్ని పర్యవేక్షించండి మరియు సరైన కోత సమయాలను అంచనా వేయండి.',
    freshnessTracking: 'తాజాదనం ట్రాకింగ్',
    freshnessTrackingDesc: 'రియల్-టైమ్ తాజాదనం పర్యవేక్షణ కస్టమర్లు అత్యధిక నాణ్యత ఉత్పత్తులను అందుకోవడాన్ని నిర్ధారిస్తుంది.',
    fairPricing: 'న్యాయమైన ధర',
    fairPricingDesc: 'మధ్యవర్తులు మరియు కమీషన్లను తొలగించండి. రైతులు తమ సొంత ధరలను నిర్ణయించుకుని మరింత లాభం పొందుతారు.',
    easyToUse: 'ఉపయోగించడానికి సులభం',
    easyToUseDesc: 'మొబైల్-ఫస్ట్ డిజైన్‌తో రైతులు మరియు కస్టమర్లు ఇద్దరికీ అర్థమయ్యే ప్లాట్‌ఫారమ్.',
    directDelivery: 'నేరుగా డెలివరీ',
    directDeliveryDesc: 'వ్యవసాయ క్షేత్రాలను నేరుగా కస్టమర్ ఇంటి వరకు కనెక్ట్ చేసే సమర్థవంతమైన లాజిస్టిక్స్.',
    smartInsights: 'స్మార్ట్ అంతర్దృష్టులు',
    smartInsightsDesc: 'వ్యవసాయ కార్యకలాపాలను ఆప్టిమైజ్ చేయడానికి మరియు వ్యర్థాలను తగ్గించడానికి డేటా-ఆధారిత సిఫార్సులు.',
    
    // Marketplace
    freshLocal: 'స్థానిక వ్యవసాయ క్షేత్రాల నుండి తాజా',
    marketplaceDesc: 'మీ ప్రాంతంలోని రైతుల నుండి అత్యంత తాజా సేంద్రీయ ఉత్పత్తులను కనుగొనండి. ప్రతి వస్తువు AI-ధృవీకరించిన తాజాదనం స్కోర్లు మరియు పారదర్శక ధరలతో వస్తుంది.',
    addToCart: 'కార్ట్‌కు జోడించండి',
    viewAllProducts: 'అన్ని ఉత్పత్తులను చూడండి',
    
    // Farmer Dashboard
    smartTools: 'ఆధునిక రైతుల కోసం స్మార్ట్ టూల్స్',
    dashboardDesc: 'మీ వ్యవసాయ కార్యకలాపాలను నిర్వహించండి, ఖర్చులను ట్రాక్ చేయండి, పంట ఆరోగ్యాన్ని పర్యవేక్షించండి మరియు AI అంతర్దృష్టులతో అధికారిక రైతు డ్యాష్‌బోర్డ్ ద్వారా కస్టమర్లతో కనెక్ట్ అవ్వండి.',
    weeklyRevenue: 'వారపు ఆదాయం',
    expenseTracking: 'ఖర్చుల ట్రాకింగ్',
    cropHealthAI: 'పంట ఆరోగ్యం AI',
    overallHealth: 'మొత్తం ఆరోగ్య స్కోర్',
    
    // Navigation Pages
    welcomeToMarketplace: 'మార్కెట్‌ప్లేస్‌కు స్వాగతం',
    welcomeToFarmers: 'రైతుల పోర్టల్‌కు స్వాగతం',
    welcomeToHowItWorks: 'FarmConnect ఎలా పనిచేస్తుంది',
    welcomeToAbout: 'FarmConnect గురించి',
    welcomeToLogin: 'FarmConnect లాగిన్'
  },
  hi: {
    // Header
    marketplace: 'बाज़ार',
    forFarmers: 'किसानों के लिए',
    howItWorks: 'यह कैसे काम करता है',
    about: 'के बारे में',
    login: 'लॉगिन',
    getStarted: 'शुरू करें',
    
    // Hero Section
    heroTitle: 'जैविक किसानों से सीधे जुड़ें',
    heroSubtitle: 'बिचौलियों को हटाएं, लागत कम करें और स्थानीय किसानों से सीधे सबसे ताजा जैविक उत्पाद प्राप्त करें। हमारा AI-संचालित प्लेटफॉर्म गुणवत्ता सुनिश्चित करता है, ताजगी को ट्रैक करता है और खेती के संचालन को अनुकूलित करता है।',
    shopProduce: 'ताजा उत्पाद खरीदें',
    joinFarmer: 'किसान के रूप में जुड़ें',
    
    // Stats
    activeFarmers: 'सक्रिय किसान',
    happyCustomers: 'खुश ग्राहक',
    freshnessScore: 'ताजगी स्कोर',
    
    // Features
    whyChoose: 'FarmConnect क्यों चुनें?',
    aiAnalytics: 'AI-संचालित विश्लेषण',
    aiAnalyticsDesc: 'उन्नत AI एल्गोरिदम के साथ खर्च को ट्रैक करें, फसल स्वास्थ्य की निगरानी करें और इष्टतम कटाई के समय की भविष्यवाणी करें।',
    freshnessTracking: 'ताजगी ट्रैकिंग',
    freshnessTrackingDesc: 'रियल-टाइम ताजगी निगरानी यह सुनिश्चित करती है कि ग्राहकों को उच्चतम गुणवत्ता के उत्पाद मिलें।',
    fairPricing: 'उचित मूल्य निर्धारण',
    fairPricingDesc: 'बिचौलियों और कमीशन को खत्म करें। किसान अपनी कीमतें तय करते हैं और अधिक मुनाफा रखते हैं।',
    easyToUse: 'उपयोग में आसान',
    easyToUseDesc: 'मोबाइल-फर्स्ट डिज़ाइन के साथ किसानों और ग्राहकों दोनों के लिए सहज प्लेटफॉर्म।',
    directDelivery: 'सीधी डिलीवरी',
    directDeliveryDesc: 'खेतों को सीधे ग्राहक के दरवाजे तक जोड़ने वाली कुशल लॉजिस्टिक्स।',
    smartInsights: 'स्मार्ट अंतर्दृष्टि',
    smartInsightsDesc: 'खेती के संचालन को अनुकूलित करने और अपशिष्ट को कम करने के लिए डेटा-संचालित सिफारिशें।',
    
    // Marketplace
    freshLocal: 'स्थानीय खेतों से ताजा',
    marketplaceDesc: 'अपने क्षेत्र के किसानों से सबसे ताजा जैविक उत्पादों की खोज करें। हर वस्तु AI-सत्यापित ताजगी स्कोर और पारदर्शी मूल्य निर्धारण के साथ आती है।',
    addToCart: 'कार्ट में जोड़ें',
    viewAllProducts: 'सभी उत्पाद देखें',
    
    // Farmer Dashboard
    smartTools: 'आधुनिक किसानों के लिए स्मार्ट टूल्स',
    dashboardDesc: 'अपने खेती के संचालन का प्रबंधन करें, खर्चों को ट्रैक करें, फसल स्वास्थ्य की निगरानी करें और AI अंतर्दृष्टि द्वारा संचालित हमारे व्यापक किसान डैशबोर्ड के माध्यम से ग्राहकों से जुड़ें।',
    weeklyRevenue: 'साप्ताहिक आय',
    expenseTracking: 'व्यय ट्रैकिंग',
    cropHealthAI: 'फसल स्वास्थ्य AI',
    overallHealth: 'समग्र स्वास्थ्य स्कोर',
    
    // Navigation Pages
    welcomeToMarketplace: 'बाज़ार में आपका स्वागत है',
    welcomeToFarmers: 'किसान पोर्टल में आपका स्वागत है',
    welcomeToHowItWorks: 'FarmConnect कैसे काम करता है',
    welcomeToAbout: 'FarmConnect के बारे में',
    welcomeToLogin: 'FarmConnect लॉगिन'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
