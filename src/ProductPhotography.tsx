import React from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

function ProductPhotography() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A051B] via-[#1A0B3C] to-[#0A051B]">
      {/* Enhanced Navigation */}
      <nav className="relative bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center p-4 relative">
            {/* Logo Section with enhanced animations */}
            <Link 
              to="/"
              className="flex items-center mb-4 md:mb-0 group relative"
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-sm group-hover:blur transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <Camera className="w-8 h-8 mr-2 group-hover:rotate-12 transition-all duration-300 text-blue-400 relative" />
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-300 to-blue-500 bg-clip-text text-transparent relative">
                PRODUCTINBEELD.NL
              </span>
            </Link>

            {/* Enhanced Navigation Links */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-1 relative">
              {[
                { to: "/", label: "HOME" },
                { to: "/productfotografie", label: "Productfotografie" },
                { to: "#", label: "Productvideo's" },
                { to: "#", label: "3D productverpakkingen" },
                { to: "#", label: "3D-boeken, e-books reclamevideo's" }
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="group relative px-4 py-2"
                >
                  <span className="relative z-10 text-gray-200 group-hover:text-white transition-colors duration-200">
                    {link.label}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-hover:from-blue-600/20 group-hover:via-blue-600/20 group-hover:to-blue-600/20 rounded-lg transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all duration-300"></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* YouTube Video Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative pb-[56.25%] h-0">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-2xl"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Product Photography Showcase"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white via-purple-300 to-purple-500 bg-clip-text text-transparent">
            Laat je product schitteren en maak indruk op je klanten
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Klaar om te beginnen?
          </p>
          <Link 
            to="/order/productfotografie"
            className="inline-block bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-8 py-4 rounded-full transform hover:scale-105 transition-all"
          >
            Start hier en laat je product stralen!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductPhotography;