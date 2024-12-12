import React, { useState } from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    ServerIcon, 
    ArrowLeftIcon, 
    ExclamationCircleIcon, 
    CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { serverAPI } from '../services/api';

const AddServer = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        host: '',
        username: '',
        privateKey: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate form data
        if (!formData.name.trim()) {
            setError('Server name is required');
            setLoading(false);
            return;
        }

        if (!formData.host.trim()) {
            setError('Host address is required');
            setLoading(false);
            return;
        }

        if (!formData.username.trim()) {
            setError('Username is required');
            setLoading(false);
            return;
        }

        if (!formData.privateKey.trim()) {
            setError('Private key is required');
            setLoading(false);
            return;
        }

        try {
            console.log('Adding server:', { ...formData, privateKey: '[REDACTED]' });
            const response = await serverAPI.addServer(formData);
            
            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                setError(response.message || 'Failed to add server');
            }
        } catch (error) {
            console.error('Add server error:', error);
            setError(error.message || 'Failed to add server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <motion.button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-gray-400 hover:text-white flex items-center"
                    whileHover={{ x: -4 }}
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <ServerIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white">Add New Server</h1>
                        <p className="text-gray-400 mt-2">Connect and manage your server securely</p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 text-red-400 flex items-center"
                            >
                                <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-6 text-green-400 flex items-center"
                            >
                                <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                                Server added successfully! Redirecting...
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Server Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Server Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="e.g., Production Server"
                            />
                        </div>

                        {/* Host */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Host
                            </label>
                            <input
                                type="text"
                                name="host"
                                value={formData.host}
                                onChange={handleChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="e.g., 192.168.1.1"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="e.g., ubuntu"
                            />
                        </div>

                        {/* Private Key */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Private Key
                            </label>
                            <textarea
                                name="privateKey"
                                value={formData.privateKey}
                                onChange={handleChange}
                                rows={6}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none font-mono text-sm"
                                placeholder="Paste your private key here..."
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-medium text-white flex items-center justify-center ${
                                loading 
                                    ? 'bg-blue-500/50 cursor-not-allowed' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                            whileHover={!loading ? { scale: 1.02 } : {}}
                            whileTap={!loading ? { scale: 0.98 } : {}}
                        >
                            {loading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                    />
                                    Adding Server...
                                </>
                            ) : (
                                'Add Server'
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AddServer;