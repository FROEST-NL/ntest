import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, ChevronRight, Star } from 'lucide-react';

function App() {
  const reviews = [
    {
      stars: 5,
      text: "Mijn boek komt tot leven in 3D! Ik ben zo blij met de 3D-opbouw van mijn boek. Het ziet er prachtig uit en trekt nu veel meer aandacht op social media. De aangepaste animaties maken het echt speciaal. Echt een topdienst!",
      author: "Emma van Dijk",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      stars: 5,
      text: "Fantastische service! De foto's van mijn producten zien er professioneel en strak uit. De transparante achtergrond was precies wat ik nodig had voor mijn webshop. Snel geleverd en topkwaliteit. Zeker een aanrader!",
      author: "Lisa van den Berg",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      stars: 5,
      text: "Echt blij met het resultaat! Ik kon zelf de kijkhoek bepalen, en dat maakte een wereld van verschil. De foto's zijn nu perfect afgestemd op mijn merk. Supertevreden en zal zeker terugkomen!",
      author: "Mark de Vries",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      stars: 5,
      text: "Perfect voor social media! De aangepaste achtergrondkleuren maken mijn producten echt opvallend. De foto's zijn nu een eyecatcher op Instagram. Dankjewel voor de snelle en professionele service!",
      author: "Sara Meijer",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      stars: 5,
      text: "Precies wat ik zocht! De foto's zijn meteen klaar voor mijn productlistings en zien er superstrak uit. De communicatie was ook heel prettig. Echt een aanrader voor iedereen die professionele productfoto's nodig heeft!",
      author: "Tom Janssen",
      image: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=150&h=150"
    }
  ];

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

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {/* Productfotografie */}
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-white/10 backdrop-blur-lg p-8 border border-white/10 group-hover:border-blue-500/50 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4 text-white">Productfotografie</h2>
              <p className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">€55,-</p>
              <ul className="space-y-3 mb-6 text-gray-300">
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Transparante achtergronden</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Aangepaste achtergrondkleuren</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Kijkhoek bepaling</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Productlisting-ready</li>
              </ul>
              <Link to="/productfotografie" 
                className="block text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full transform transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                Start hier
              </Link>
            </div>
          </div>

          {/* Productvideo's */}
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-white/10 backdrop-blur-lg p-8 border border-white/10 group-hover:border-blue-500/50 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4 text-white">Productvideo's</h2>
              <p className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">€80,-</p>
              <ul className="space-y-3 mb-6 text-gray-300">
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Gespecialiseerd in social media ads</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Keuze uit templates</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Ingesproken video's</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Video's op maat</li>
              </ul>
              <Link to="#" 
                className="block text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full transform transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                Start hier
              </Link>
            </div>
          </div>

          {/* 3D productverpakkingen */}
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-white/10 backdrop-blur-lg p-8 border border-white/10 group-hover:border-blue-500/50 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4 text-white">3D productverpakkingen</h2>
              <p className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">€100,-</p>
              <ul className="space-y-3 mb-6 text-gray-300">
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Jouw productverpakking in 3D</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Op maat gemaakte video</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Export mogelijkheden</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Transparante achtergronden</li>
              </ul>
              <Link to="#" 
                className="block text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full transform transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                Start hier
              </Link>
            </div>
          </div>

          {/* 3D-boeken */}
          <div className="group relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-white/10 backdrop-blur-lg p-8 border border-white/10 group-hover:border-blue-500/50 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4 text-white">3D-boeken & E-books</h2>
              <p className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">€150,-</p>
              <ul className="space-y-3 mb-6 text-gray-300">
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Video op maat</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Ingesproken reclame</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Export mogelijkheden</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Aangepaste animaties</li>
              </ul>
              <Link to="#" 
                className="block text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full transform transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                Start hier
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="relative overflow-hidden py-10 mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A051B] via-transparent to-[#0A051B] z-10"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white via-blue-300 to-blue-500 bg-clip-text text-transparent">
            Wat onze klanten zeggen
          </h2>
          
          <div className="flex animate-scroll">
            {[...reviews, ...reviews].map((review, index) => (
              <div
                key={index}
                className="flex-none w-[350px] mx-4"
              >
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/10 hover:border-blue-500/20 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <img
                      src={review.image}
                      alt={review.author}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="flex text-yellow-400 mb-1">
                        {[...Array(review.stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="font-medium text-white">{review.author}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;