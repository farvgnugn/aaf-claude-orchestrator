import React from 'react';
import { User, Settings, CheckCircle, XCircle } from 'lucide-react';
import { SubAgent } from '../../types';

interface AgentCardProps {
  agent: SubAgent;
  onConfigurePolicy: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onConfigurePolicy }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-gray-900 group-hover:text-blue-700">
              {agent.name}
            </h3>
            <div className="flex items-center">
              {agent.enabled ? (
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded font-mono">
              {agent.file_path}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {agent.max_tokens_per_run && (
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                  {agent.max_tokens_per_run} tokens
                </span>
              )}
              
              {agent.allowed_tools && agent.allowed_tools.length > 0 && (
                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs">
                  {agent.allowed_tools.length} tools
                </span>
              )}
              
              {agent.may_bypass_permissions && (
                <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs">
                  Bypass Perms
                </span>
              )}
            </div>

            {agent.allowed_tools && agent.allowed_tools.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {agent.allowed_tools.map((tool, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onConfigurePolicy}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title="Configure Policy"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AgentCard;