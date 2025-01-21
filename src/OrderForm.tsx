import React from 'react';
import { Link } from 'react-router-dom';
import { CameraIcon } from './components/Icons';

function OrderForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A051B] via-[#1A0B3C] to-[#0A051B]">
      {/* Navigation */}
      <nav className="relative bg-black/40 backdrop-blur-xl sticky top-0 z-50 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center p-4 relative">
            {/* Logo Section with Link */}
            <Link 
              to="/" 
              className="flex items-center mb-4 md:mb-0 group relative hover:opacity-80 transition-opacity"
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-sm group-hover:blur transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <CameraIcon className="w-8 h-8 mr-2 group-hover:rotate-12 transition-all duration-300 text-blue-400 relative" />
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-300 to-blue-500 bg-clip-text text-transparent relative">
                PRODUCTINBEELD.NL
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex space-x-6">
              <Link 
                to="/productfotografie" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Productfotografie
              </Link>
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white via-blue-300 to-blue-500 bg-clip-text text-transparent">
            Bestel Productfotografie
          </h1>
          {/* Form content will be added here */}
        </div>
      </div>
    </div>
  );
}

export default OrderForm;