import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ServerIcon, 
  CommandLineIcon, 
  BoltIcon, 
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 group transition-all duration-300"
  >
    <div className="relative">
      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
      <Icon className="h-12 w-12 text-blue-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />
    </div>
    <h3 className="text-xl font-bold text-white mt-4 group-hover:text-blue-400 transition-colors">
      {title}
    </h3>
    <p className="text-gray-400 mt-2 group-hover:text-gray-300 transition-colors">
      {description}
    </p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative inline-block mb-6"
          >
            <ServerIcon className="h-20 w-20 text-blue-500" />
            <motion.div
              className="absolute -right-2 -top-2 bg-green-500 rounded-full p-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <BoltIcon className="h-6 w-6 text-white" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white mb-6"
          >
            Server Management,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Simplified
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-10"
          >
            Execute commands, monitor status, and manage your servers with elegance and efficiency.
            Your command center for seamless server operations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/dashboard">
              <motion.button
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium flex items-center group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/add-server">
              <motion.button
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium border border-gray-700 hover:border-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Server
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={CommandLineIcon}
            title="Command Execution"
            description="Execute commands remotely with real-time feedback and monitoring. Secure and efficient command management."
            delay={0.2}
          />
          <FeatureCard
            icon={ChartBarIcon}
            title="Performance Metrics"
            description="Monitor server health, resource usage, and performance metrics in real-time with detailed analytics."
            delay={0.4}
          />
          <FeatureCard
            icon={ShieldCheckIcon}
            title="Secure Access"
            description="Enterprise-grade security with SSH key authentication and encrypted connections for safe server management."
            delay={0.6}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;