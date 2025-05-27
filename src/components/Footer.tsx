
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-organic-green to-organic-green-light rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌱</span>
              </div>
              <span className="text-2xl font-bold">FarmConnect</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Connecting organic farmers directly with customers through AI-powered technology 
              for a sustainable future.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">For Customers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-organic-green transition-colors">Browse Marketplace</a></li>
              <li><a href="#" className="hover:text-organic-green transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-organic-green transition-colors">Freshness Guarantee</a></li>
              <li><a href="#" className="hover:text-organic-green transition-colors">Delivery Info</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">For Farmers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-organic-green transition-colors">Join Platform</a></li>
              <li><a href="#" className="hover:text-organic-green transition-colors">AI Analytics</a></li>
              <li><a href="#" className="hover:text-organic-green transition-colors">Expense Tracking</a></li>
              <li><a href="#" className="hover:text-organic-green transition-colors">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-organic-green transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-organic-green transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-organic-green transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-organic-green transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 FarmConnect. All rights reserved. Built with 💚 for sustainable farming.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
