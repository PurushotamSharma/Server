import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ServerIcon, HomeIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Dashboard', path: '/dashboard', icon: ServerIcon },
    { name: 'Add Server', path: '/add-server', icon: PlusCircleIcon },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900/95 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
        <Link 
  to="/"
  className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors ml-10"
>
  <ServerIcon className="h-10 w-10 text-blue-500" />
  <span className="font-bold text-xl">ServerMaster</span>
</Link>

          <div className="flex items-center justify-center flex-1 max-w-md mx-auto">
            <div className="hidden md:flex items-center space-x-1 bg-gray-800/50 rounded-full px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="relative group px-4 py-2"
                  >
                    <motion.div
                      className={`absolute inset-0 rounded-full ${
                        isActive ? 'bg-blue-500/20' : 'bg-transparent group-hover:bg-gray-700/50'
                      } transition-colors`}
                      layoutId="navbar-highlight"
                    />
                    <div className="flex items-center space-x-2 relative z-10">
                      <Icon className={`h-5 w-5 ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-200'}`} />
                      <span className={`text-sm ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {item.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Connect Server
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;