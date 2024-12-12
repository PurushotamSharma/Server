// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    ServerIcon, 
    CommandLineIcon,
    CpuChipIcon,
    CircleStackIcon,
    Square3Stack3DIcon,
    ArrowRightIcon,
    XCircleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { serverAPI } from '../services/api';

const Dashboard = () => {
    const [servers, setServers] = useState([]);
    const [selectedServer, setSelectedServer] = useState(null);
    const [systemInfo, setSystemInfo] = useState(null);
    const [customCommand, setCustomCommand] = useState('');
    const [commandOutput, setCommandOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch servers and start polling
    useEffect(() => {
        fetchServers();
        const interval = setInterval(fetchServers, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    // Fetch server metrics when server is selected
    useEffect(() => {
        if (selectedServer) {
            fetchServerMetrics();
        }
    }, [selectedServer]);

    const fetchServers = async () => {
        try {
            const response = await serverAPI.getAllServers();
            if (response.success) {
                setServers(response.servers);
            }
        } catch (error) {
            console.error('Failed to fetch servers:', error);
        }
    };

    const fetchServerMetrics = async () => {
        if (!selectedServer) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const defaultCommands = [
                { command: 'uname -a', type: 'system' },
                { command: 'free -h', type: 'memory' },
                { command: 'df -h', type: 'disk' },
                { command: 'uptime', type: 'uptime' }
            ];

            const metrics = {};
            for (const cmd of defaultCommands) {
                const response = await serverAPI.executeCommand(selectedServer._id, cmd.command);
                if (response.success) {
                    metrics[cmd.type] = response.output;
                }
            }

            setSystemInfo({
                system: metrics.system,
                memory: parseMemoryInfo(metrics.memory),
                disk: parseDiskInfo(metrics.disk),
                uptime: metrics.uptime
            });
        } catch (error) {
            setError('Failed to fetch server metrics');
        } finally {
            setLoading(false);
        }
    };

    const parseMemoryInfo = (memoryOutput) => {
        if (!memoryOutput) return null;
        
        try {
            const lines = memoryOutput.split('\n');
            const memLine = lines.find(line => line.startsWith('Mem:'));
            if (!memLine) return null;

            const parts = memLine.split(/\s+/);
            const total = parts[1];
            const used = parts[2];
            const free = parts[3];

            return {
                total,
                used,
                free,
                percentage: Math.round((parseFloat(used) / parseFloat(total)) * 100)
            };
        } catch (error) {
            console.error('Error parsing memory info:', error);
            return null;
        }
    };

    const parseDiskInfo = (diskOutput) => {
        if (!diskOutput) return null;

        try {
            const lines = diskOutput.split('\n');
            const rootLine = lines.find(line => line.includes('/dev/'));
            if (!rootLine) return null;

            const parts = rootLine.split(/\s+/);
            return {
                filesystem: parts[0],
                size: parts[1],
                used: parts[2],
                available: parts[3],
                percentage: parseInt(parts[4]),
                mountpoint: parts[5]
            };
        } catch (error) {
            console.error('Error parsing disk info:', error);
            return null;
        }
    };

    const handleServerSelect = async (server) => {
        setSelectedServer(server);
        setSystemInfo(null);
        setCommandOutput('');
        setError(null);
        await fetchServerMetrics();
    };

    const handleExecuteCommand = async (e) => {
        e.preventDefault();
        if (!customCommand.trim() || !selectedServer) return;

        setLoading(true);
        try {
            const response = await serverAPI.executeCommand(selectedServer._id, customCommand);
            if (response.success) {
                setCommandOutput(prev => `${prev}\n$ ${customCommand}\n${response.output}`);
                setCustomCommand('');
            } else {
                setError('Command execution failed');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 border-r border-gray-700">
                <div className="p-4">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                        <ServerIcon className="h-6 w-6 text-blue-500 mr-2" />
                        Servers
                    </h2>
                </div>
                
                <div className="p-2 space-y-2">
                    {servers.map(server => (
                        <motion.button
                            key={server._id}
                            onClick={() => handleServerSelect(server)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full p-3 rounded-lg flex items-center ${
                                selectedServer?._id === server._id
                                    ? 'bg-blue-600'
                                    : 'bg-gray-700 hover:bg-gray-600'
                            } text-white`}
                        >
                            <div className="flex-1">{server.name}</div>
                            <div className={`h-2 w-2 rounded-full ${server.isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gray-800 border-b border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-white flex items-center">
                            <CommandLineIcon className="h-6 w-6 text-blue-500 mr-2" />
                            {selectedServer ? selectedServer.name : 'Select a Server'}
                        </h1>
                        {selectedServer && (
                            <span className="text-sm text-gray-400">
                                {selectedServer.host}
                            </span>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
                            <p className="text-red-400 flex items-center">
                                <XCircleIcon className="h-5 w-5 mr-2" />
                                {error}
                            </p>
                        </div>
                    )}

                    {selectedServer && (
                        <>
                            {/* Status Indicator */}
                            <div className={`mb-6 p-4 rounded-lg border ${
                                selectedServer.isConnected 
                                    ? 'bg-green-500/10 border-green-500/50' 
                                    : 'bg-red-500/10 border-red-500/50'
                            }`}>
                                <p className={`flex items-center ${
                                    selectedServer.isConnected ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {selectedServer.isConnected 
                                        ? <CheckCircleIcon className="h-5 w-5 mr-2" />
                                        : <XCircleIcon className="h-5 w-5 mr-2" />
                                    }
                                    {selectedServer.isConnected ? 'Connected' : 'Disconnected'}
                                </p>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                {/* System Info */}
                                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <h3 className="text-lg font-medium text-white flex items-center mb-4">
                                        <CpuChipIcon className="h-5 w-5 text-blue-400 mr-2" />
                                        System Information
                                    </h3>
                                    <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
                                        {systemInfo?.system || (loading ? 'Loading...' : 'No information available')}
                                    </pre>
                                </div>

                                {/* Memory Usage */}
                                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <h3 className="text-lg font-medium text-white flex items-center mb-4">
                                        <CircleStackIcon className="h-5 w-5 text-blue-400 mr-2" />
                                        Memory Usage
                                    </h3>
                                    {systemInfo?.memory ? (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-gray-300">
                                                <span>Total:</span>
                                                <span>{systemInfo.memory.total}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Used:</span>
                                                <span>{systemInfo.memory.used}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Free:</span>
                                                <span>{systemInfo.memory.free}</span>
                                            </div>
                                            <div className="h-2 bg-gray-700 rounded-full mt-2">
                                                <div 
                                                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${systemInfo.memory.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">
                                            {loading ? 'Loading...' : 'No memory information available'}
                                        </div>
                                    )}
                                </div>

                                {/* Disk Usage */}
                                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                    <h3 className="text-lg font-medium text-white flex items-center mb-4">
                                        <Square3Stack3DIcon className="h-5 w-5 text-blue-400 mr-2" />
                                        Disk Usage
                                    </h3>
                                    {systemInfo?.disk ? (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-gray-300">
                                                <span>Size:</span>
                                                <span>{systemInfo.disk.size}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Used:</span>
                                                <span>{systemInfo.disk.used}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-300">
                                                <span>Available:</span>
                                                <span>{systemInfo.disk.available}</span>
                                            </div>
                                            <div className="h-2 bg-gray-700 rounded-full mt-2">
                                                <div 
                                                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${systemInfo.disk.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">
                                            {loading ? 'Loading...' : 'No disk information available'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Command Console */}
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <form onSubmit={handleExecuteCommand}>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={customCommand}
                                            onChange={(e) => setCustomCommand(e.target.value)}
                                            placeholder="Enter custom command..."
                                            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                            disabled={loading}
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={loading || !customCommand.trim()}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Execute
                                            <ArrowRightIcon className="h-4 w-4 ml-2" />
                                        </motion.button>
                                    </div>
                                </form>

                                {commandOutput && (
                                    <div className="mt-4">
                                        <pre className="bg-gray-900 p-4 rounded-lg text-gray-300 font-mono text-sm overflow-x-auto">
                                            {commandOutput}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;