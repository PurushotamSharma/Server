import { useState } from 'react';

const ServerManagement = () => {
  const [servers, setServers] = useState([]);
  const [commands, setCommands] = useState([]);
  const [newServer, setNewServer] = useState({ name: '', privateKey: '' });
  const [newCommand, setNewCommand] = useState('');
  const [output, setOutput] = useState('');

  const handleAddServer = async () => {
    try {
      // API call to add server
      const response = await fetch('https://server-new-backend.vercel.app/api/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newServer),
      });
      
      const data = await response.json();
      setServers([...servers, data]);
      setNewServer({ name: '', privateKey: '' });
    } catch (error) {
      console.error('Error adding server:', error);
    }
  };

  const handleAddCommand = async () => {
    try {
      // API call to add command
      const response = await fetch('https://server-new-backend.vercel.app/api/commands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: newCommand }),
      });
      
      const data = await response.json();
      setCommands([...commands, data]);
      setNewCommand('');
    } catch (error) {
      console.error('Error adding command:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add Server</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Server Name"
            className="w-full p-2 border rounded"
            value={newServer.name}
            onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
          />
          <textarea
            placeholder="Private Key"
            className="w-full p-2 border rounded"
            value={newServer.privateKey}
            onChange={(e) => setNewServer({ ...newServer, privateKey: e.target.value })}
          />
          <button
            onClick={handleAddServer}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Server
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add Command</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter command"
            className="w-full p-2 border rounded"
            value={newCommand}
            onChange={(e) => setNewCommand(e.target.value)}
          />
          <button
            onClick={handleAddCommand}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Command
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Output</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {output || 'No output yet...'}
        </pre>
      </div>
    </div>
  );
};

export default ServerManagement;