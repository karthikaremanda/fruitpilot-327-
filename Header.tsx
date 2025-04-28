import React, { useState, useEffect } from 'react';
import { Menu, X, Apple, Bell } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Apple className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">FruitPilot</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#dashboard" className="text-gray-700 hover:text-green-600 transition-colors">Dashboard</a>
            <a href="#camera" className="text-gray-700 hover:text-green-600 transition-colors">Drone Camera</a>
            <a href="#project" className="text-gray-700 hover:text-green-600 transition-colors">Our Project</a>
            <a href="#statistics" className="text-gray-700 hover:text-green-600 transition-colors">Statistics</a>
            <a href="/map" className="text-gray-700 hover:text-green-600 transition-colors">Map</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="relative">
              <Bell className="h-6 w-6 text-gray-600 hover:text-green-600 transition-colors" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-orange-500 rounded-full"></span>
            </button>
            
            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col px-4 py-2">
            <a 
              href="#dashboard" 
              className="py-3 text-gray-700 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </a>
            <a 
              href="#camera" 
              className="py-3 text-gray-700 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Drone Camera
            </a>
            <a 
              href="#project" 
              className="py-3 text-gray-700 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Our Project
            </a>
            <a 
              href="#statistics" 
              className="py-3 text-gray-700 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Statistics
            </a>
            <a 
              href="/map" 
              className="py-3 text-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Map
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;