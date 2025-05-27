
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Send, Bot, User, X, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FreddyFarmerBot = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const botResponses = {
    en: {
      greeting: "Hi! I'm Freddy Farmer, your AI farming assistant! How can I help you today?",
      helpTopics: "I can help you with crop management, expense tracking, market prices, weather updates, and farming best practices. What would you like to know?",
      expenses: "To track your expenses effectively, categorize them into seeds, fertilizers, labor, equipment, and irrigation. Would you like me to show you how to set up expense categories?",
      crops: "For optimal crop health, consider factors like soil pH, water requirements, seasonal timing, and pest management. Which crop are you planning to grow?",
      market: "Current market trends show high demand for organic vegetables. Tomatoes, leafy greens, and herbs are performing well. Would you like specific price information?",
      weather: "Weather plays a crucial role in farming. I recommend checking daily forecasts and planning irrigation accordingly. Do you need help with weather-based farming tips?",
      default: "I'm here to help with all your farming needs! Feel free to ask about crops, expenses, market prices, or any farming advice."
    },
    te: {
      greeting: "నమస్కారం! నేను ఫ్రెడ్డీ ఫార్మర్, మీ AI వ్యవసాయ సహాయకుడిని! ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?",
      helpTopics: "నేను పంట నిర్వహణ, ఖర్చుల ట్రాకింగ్, మార్కెట్ ధరలు, వాతావరణ అప్‌డేట్‌లు మరియు వ్యవసాయ ఉత్తమ పద్ధతులతో మీకు సహాయం చేయగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
      expenses: "మీ ఖర్చులను సమర్థవంతంగా ట్రాక్ చేయడానికి, వాటిని విత్తనాలు, ఎరువులు, కార్మికులు, పరికరాలు మరియు నీటిపారుదలగా వర్గీకరించండి. ఖర్చు వర్గాలను ఎలా సెటప్ చేయాలో నేను మీకు చూపించాలా?",
      crops: "సరైన పంట ఆరోగ్యం కోసం, మట్టి pH, నీటి అవసరాలు, కాలానుగుణ సమయం మరియు కీట నిర్వహణ వంటి అంశాలను పరిగణించండి. మీరు ఏ పంట పెంచాలని అనుకుంటున్నారు?",
      market: "ప్రస్తుత మార్కెట్ ట్రెండ్‌లు సేంద్రీయ కూరగాయలకు అధిక డిమాండ్‌ను చూపుతున్నాయి. టమాటాలు, ఆకు కూరలు మరియు మూలికలు బాగా పని చేస్తున్నాయి. మీకు నిర్దిష్ట ధర సమాచారం కావాలా?",
      weather: "వ్యవసాయంలో వాతావరణం కీలక పాత్ర పోషిస్తుంది. రోజువారీ వాతావరణ సూచనలను తనిఖీ చేయడం మరియు తదనుగుణంగా నీటిపారుదల ప్రణాళిక చేయడం నేను సిఫార్సు చేస్తాను. వాతావరణ ఆధారిత వ్యవసాయ చిట్కాలతో మీకు సహాయం కావాలా?",
      default: "నేను మీ అన్ని వ్యవసాయ అవసరాలతో సహాయం చేయడానికి ఇక్కడ ఉన్నాను! పంటలు, ఖర్చులు, మార్కెట్ ధరలు లేదా ఏదైనా వ్యవసాయ సలహా గురించి అడగడానికి సంకోచించకండి."
    },
    hi: {
      greeting: "नमस्ते! मैं फ्रेडी फार्मर हूं, आपका AI कृषि सहायक! आज मैं आपकी कैसे मदद कर सकता हूं?",
      helpTopics: "मैं फसल प्रबंधन, खर्च ट्रैकिंग, बाजार की कीमतों, मौसम अपडेट और कृषि की सर्वोत्तम प्रथाओं में आपकी मदद कर सकता हूं। आप क्या जानना चाहते हैं?",
      expenses: "अपने खर्चों को प्रभावी रूप से ट्रैक करने के लिए, उन्हें बीज, उर्वरक, श्रम, उपकरण और सिंचाई में वर्गीकृत करें। क्या आप चाहते हैं कि मैं आपको खर्च श्रेणियां सेट करने का तरीका दिखाऊं?",
      crops: "इष्टतम फसल स्वास्थ्य के लिए, मिट्टी pH, पानी की आवश्यकताएं, मौसमी समय और कीट प्रबंधन जैसे कारकों पर विचार करें। आप कौन सी फसल उगाने की योजना बना रहे हैं?",
      market: "वर्तमान बाजार के रुझान जैविक सब्जियों की उच्च मांग दिखाते हैं। टमाटर, पत्तेदार साग और जड़ी-बूटियां अच्छा प्रदर्शन कर रही हैं। क्या आपको विशिष्ट मूल्य जानकारी चाहिए?",
      weather: "मौसम खेती में महत्वपूर्ण भूमिका निभाता है। मैं दैनिक पूर्वानुमान की जांच करने और तदनुसार सिंचाई की योजना बनाने की सलाह देता हूं। क्या आपको मौसम-आधारित खेती की युक्तियों में मदद चाहिए?",
      default: "मैं आपकी सभी कृषि आवश्यकताओं में मदद के लिए यहां हूं! फसलों, खर्चों, बाजार की कीमतों या किसी भी कृषि सलाह के बारे में पूछने में संकोच न करें।"
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: botResponses[language].greeting,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    const responses = botResponses[language];

    if (message.includes('help') || message.includes('सहायता') || message.includes('సహాయం')) {
      return responses.helpTopics;
    } else if (message.includes('expense') || message.includes('cost') || message.includes('खर्च') || message.includes('ఖర్చు')) {
      return responses.expenses;
    } else if (message.includes('crop') || message.includes('plant') || message.includes('फसल') || message.includes('పంట')) {
      return responses.crops;
    } else if (message.includes('market') || message.includes('price') || message.includes('बाजार') || message.includes('మార్కెట్')) {
      return responses.market;
    } else if (message.includes('weather') || message.includes('rain') || message.includes('मौसम') || message.includes('వాతావరణం')) {
      return responses.weather;
    } else {
      return responses.default;
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-organic-green hover:bg-organic-green-dark shadow-lg transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-96 z-50">
          <Card className="w-full h-full flex flex-col shadow-2xl border-organic-green">
            <CardHeader className="bg-organic-green text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-6 w-6" />
                  <CardTitle className="text-lg">Freddy Farmer</CardTitle>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-organic-green-dark p-1"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-organic-green-dark p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col">
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-organic-green text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.sender === 'bot' && <Bot className="h-4 w-4 mt-1 text-organic-green" />}
                          {message.sender === 'user' && <User className="h-4 w-4 mt-1" />}
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4 text-organic-green" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-organic-green rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-organic-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-organic-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={language === 'te' ? 'మీ సందేశాన్ని టైప్ చేయండి...' : language === 'hi' ? 'अपना संदेश टाइप करें...' : 'Type your message...'}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-organic-green hover:bg-organic-green-dark"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FreddyFarmerBot;
