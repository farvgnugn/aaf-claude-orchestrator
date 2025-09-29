import React, { useState, useEffect } from 'react';
import { Plus, Users, Upload } from 'lucide-react';
import { SubAgent } from '../types';
import { apiService } from '../services/api';
import AgentCard from '../components/agents/AgentCard';
import AgentPolicyForm from '../components/agents/AgentPolicyForm';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AgentsView: React.FC = () => {
  const [agents, setAgents] = useState<SubAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<SubAgent | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const projectId = 1; // TODO: Get from context or selection

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await apiService.getAgents(projectId);
      setAgents(data);
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIndexAgents = async () => {
    try {
      setActionLoading(true);
      // Sample agents for demonstration
      const sampleAgents = [
        {
          name: 'product-owner',
          file_path: '/project/.claude/agents/product-owner.md',
          sha256: 'abc123def456'
        },
        {
          name: 'developer',
          file_path: '/project/.claude/agents/developer.md',
          sha256: 'def456ghi789'
        },
        {
          name: 'reviewer',
          file_path: '/project/.claude/agents/reviewer.md',
          sha256: 'ghi789jkl012'
        }
      ];
      
      await apiService.indexAgents(projectId, sampleAgents);
      await loadAgents();
    } catch (error) {
      console.error('Failed to index agents:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetPolicy = async (data: any) => {
    if (!selectedAgent) return;
    
    try {
      setActionLoading(true);
      await apiService.setAgentPolicy(projectId, {
        agent_name: selectedAgent.name,
        ...data
      });
      await loadAgents();
      setSelectedAgent(null);
    } catch (error) {
      console.error('Failed to set agent policy:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sub-agents</h1>
          <p className="mt-1 text-gray-500">
            Manage AI sub-agents and their policies across your project
          </p>
        </div>
        <button
          onClick={handleIndexAgents}
          disabled={actionLoading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {actionLoading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          Index Agents
        </button>
      </div>

      {agents.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No agents indexed"
          description="Index your project's sub-agents to configure their policies and permissions."
          action={{
            label: "Index Agents",
            onClick: handleIndexAgents
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onConfigurePolicy={() => setSelectedAgent(agent)}
            />
          ))}
        </div>
      )}

      {selectedAgent && (
        <AgentPolicyForm
          agent={selectedAgent}
          onSubmit={handleSetPolicy}
          onCancel={() => setSelectedAgent(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default AgentsView;