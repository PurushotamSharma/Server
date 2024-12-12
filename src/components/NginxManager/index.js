// Frontend: src/components/NginxManager/index.js

import React, { useState, useEffect, useCallback } from 'react';
import { 
    CloudIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    ArrowPathIcon 
} from '@heroicons/react/24/outline';
import { serverAPI } from '../../services/api';

const NginxManager = ({ server }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        isInstalled: false,
        isRunning: false,
        port80Available: false,
        publicUrl: null
    });
    const [error, setError] = useState(null);
    const [showPortPrompt, setShowPortPrompt] = useState(false);

    const checkNginxStatus = useCallback(async () => {
        if (!server) return;
        
        try {
            const statusCmd = await serverAPI.executeCommand(
                server._id, 
                'which nginx && systemctl is-active nginx'
            );
            
            return {
                isInstalled: !statusCmd.output.includes('no nginx'),
                isRunning: statusCmd.output.includes('active')
            };
        } catch (error) {
            console.error('Error checking nginx status:', error);
            return { isInstalled: false, isRunning: false };
        }
    }, [server]);

    const checkPort80 = useCallback(async () => {
        if (!server) return false;
        
        try {
            const portCmd = await serverAPI.executeCommand(
                server._id,
                'sudo lsof -i :80 || echo "free"'
            );
            return !portCmd.output.includes('free');
        } catch (error) {
            console.error('Error checking port 80:', error);
            return false;
        }
    }, [server]);

    const getPublicIp = useCallback(async () => {
        if (!server) return null;
        
        try {
            const ipCmd = await serverAPI.executeCommand(
                server._id,
                'curl -s http://169.254.169.254/latest/meta-data/public-ipv4'
            );
            return ipCmd.success ? ipCmd.output.trim() : null;
        } catch (error) {
            console.error('Error getting public IP:', error);
            return null;
        }
    }, [server]);

    const installNginx = async () => {
        setLoading(true);
        setError(null);

        try {
            // Check port 80 first
            const isPort80Available = await checkPort80();
            if (!isPort80Available) {
                setShowPortPrompt(true);
                setLoading(false);
                return;
            }

            // Installation commands
            const commands = [
                'sudo apt-get update',
                'sudo apt-get install -y nginx',
                'sudo systemctl start nginx',
                'sudo systemctl enable nginx'
            ];

            for (const cmd of commands) {
                const result = await serverAPI.executeCommand(server._id, cmd);
                if (!result.success) {
                    throw new Error(`Failed to execute: ${cmd}`);
                }
            }

            // Get public IP
            const publicIp = await getPublicIp();
            
            // Update status
            const nginxStatus = await checkNginxStatus();
            setStatus({
                ...nginxStatus,
                publicUrl: publicIp ? `http://${publicIp}` : null
            });

            setShowPortPrompt(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const refreshStatus = async () => {
        setLoading(true);
        try {
            const [nginxStatus, port80Status, publicIp] = await Promise.all([
                checkNginxStatus(),
                checkPort80(),
                getPublicIp()
            ]);

            setStatus({
                ...nginxStatus,
                port80Available: port80Status,
                publicUrl: publicIp ? `http://${publicIp}` : null
            });
        } catch (error) {
            setError('Failed to refresh status');
        } finally {
            setLoading(false);
        }
    };

    // Initial status check
    useEffect(() => {
        if (server) {
            refreshStatus();
        }
    }, [server]);

    return (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white flex items-center">
                    <CloudIcon className="h-5 w-5 text-blue-400 mr-2" />
                    Nginx Manager
                </h3>
                <button
                    onClick={refreshStatus}
                    disabled={loading}
                    className="p-1 hover:bg-gray-700 rounded-full"
                >
                    <ArrowPathIcon className={`h-5 w-5 text-gray-400 ${
                        loading ? 'animate-spin' : 'hover:text-white'
                    }`} />
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {/* Status Display */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-gray-300">
                        <span className={`h-2 w-2 rounded-full ${
                            status.isInstalled ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <span>Nginx Installed</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                        <span className={`h-2 w-2 rounded-full ${
                            status.isRunning ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <span>Nginx Running</span>
                    </div>
                </div>

                {/* Installation Button */}
                {!status.isInstalled && (
                    <button
                        onClick={installNginx}
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'Installing...' : 'Install Nginx'}
                    </button>
                )}

                {/* Port 80 Prompt */}
                {showPortPrompt && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                        <p className="text-yellow-400 mb-3">
                            Port 80 needs to be available for Nginx installation.
                        </p>
                        <button
                            onClick={() => {
                                setShowPortPrompt(false);
                                installNginx();
                            }}
                            className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg"
                        >
                            I've opened port 80, continue installation
                        </button>
                    </div>
                )}

                {/* Public URL Display */}
                {status.isRunning && status.publicUrl && (
                    <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                        <p className="text-green-400 mb-2">Nginx is running!</p>
                        <a
                            href={status.publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                        >
                            {status.publicUrl}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NginxManager;