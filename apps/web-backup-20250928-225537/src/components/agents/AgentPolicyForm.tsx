import React, { useState } from 'react';
import { X, Save, Settings } from 'lucide-react';
import { SubAgent } from '../../types';

interface AgentPolicyFormProps {
  agent: SubAgent;
  onSubmit: (data: {
    max_tokens_per_run?: number;
    allowed_tools?: string[];
    may_bypass_permissions?: boolean;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
}

const AgentPolicyForm: React.FC<AgentPolicyFormProps> = ({ 
  agent, 
  onSubmit, 
  onCancel, 
  loading 
}) => {
  const [maxTokens, setMaxTokens] = useState(agent.max_tokens_per_run || '');
  const [allowedTools, setAllowedTools] = useState(agent.allowed_tools?.join(', ') || '');
  const [mayBypass, setMayBypass] = useState(agent.may_bypass_permissions || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: any = {};
    
    if (maxTokens) {
      data.max_tokens_per_run = parseInt(maxTokens.toString());
    }
    
    if (allowedTools.trim()) {
      data.allowed_tools = allowedTools.split(',').map(tool => tool.trim()).filter(Boolean);
    }
    
    data.may_bypass_permissions = mayBypass;
    
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-600" />
            Configure Policy - {agent.name}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Tokens Per Run
            </label>
            <input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="4000"
              min="1"
              max="100000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed Tools (comma-separated)
            </label>
            <input
              type="text"
              value={allowedTools}
              onChange={(e) => setAllowedTools(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="fs, git, shell, api"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="bypass"
              checked={mayBypass}
              onChange={(e) => setMayBypass(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="bypass" className="text-sm font-medium text-gray-700">
              May bypass permissions
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentPolicyForm;