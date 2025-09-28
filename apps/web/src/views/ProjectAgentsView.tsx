import React, { useState } from 'react';
import { Plus, Upload, CreditCard as Edit3, Play, Save, X, Eye, Code } from 'lucide-react';
import { SubAgent } from '../types';
import { apiService } from '../services/api';
import AgentCard from '../components/agents/AgentCard';
import AgentPolicyForm from '../components/agents/AgentPolicyForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import MDEditor from '@uiw/react-md-editor';

interface ProjectAgentsViewProps {
  projectId: number;
  agents: SubAgent[];
  onAgentsUpdate: () => void;
}

const ProjectAgentsView: React.FC<ProjectAgentsViewProps> = ({ 
  projectId, 
  agents, 
  onAgentsUpdate 
}) => {
  const [selectedAgent, setSelectedAgent] = useState<SubAgent | null>(null);
  const [editingAgent, setEditingAgent] = useState<SubAgent | null>(null);
  const [agentContent, setAgentContent] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('edit');

  const handleIndexAgents = async () => {
    try {
      setActionLoading(true);
      // Sample agents for demonstration
      const sampleAgents = [
        {
          name: 'product-owner',
          file_path: `/workspace/${projectId}/.claude/agents/product-owner.md`,
          sha256: 'abc123def456'
        },
        {
          name: 'developer',
          file_path: `/workspace/${projectId}/.claude/agents/developer.md`,
          sha256: 'def456ghi789'
        },
        {
          name: 'reviewer',
          file_path: `/workspace/${projectId}/.claude/agents/reviewer.md`,
          sha256: 'ghi789jkl012'
        }
      ];
      
      await apiService.indexAgents(projectId, sampleAgents);
      onAgentsUpdate();
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
      onAgentsUpdate();
      setSelectedAgent(null);
    } catch (error) {
      console.error('Failed to set agent policy:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditAgent = (agent: SubAgent) => {
    setEditingAgent(agent);
    // Sample markdown content for demonstration
    setAgentContent(`# ${agent.name.charAt(0).toUpperCase() + agent.name.slice(1)} Agent

## Role
You are a ${agent.name.replace('-', ' ')} responsible for managing and executing tasks related to your domain expertise.

## Capabilities
- Domain-specific knowledge and decision making
- Task execution within defined scope
- Collaboration with other agents and team members

## Guidelines
- Follow established project conventions
- Maintain clear communication
- Document decisions and rationale
- Escalate when necessary

## Tools Available
${agent.allowed_tools ? agent.allowed_tools.map(tool => `- ${tool}`).join('\n') : '- No tools configured'}

## Constraints
- Maximum tokens per run: ${agent.max_tokens_per_run || 'Not set'}
- May bypass permissions: ${agent.may_bypass_permissions ? 'Yes' : 'No'}
`);
  };

  const handleSaveAgent = async () => {
    if (!editingAgent) return;
    
    try {
      setActionLoading(true);
      // In a real implementation, this would save the markdown content
      // For now, we'll just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditingAgent(null);
      setAgentContent('');
    } catch (error) {
      console.error('Failed to save agent:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeployAgent = async (agent: SubAgent) => {
    try {
      setActionLoading(true);
      // In a real implementation, this would deploy the agent
      // For now, we'll just simulate the deployment
      await new Promise(resolve => setTimeout(resolve, 1500));
      onAgentsUpdate();
    } catch (error) {
      console.error('Failed to deploy agent:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (editingAgent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Agent: {editingAgent.name}</h2>
            <p className="mt-1 text-gray-500">Modify the agent's markdown configuration</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setEditingAgent(null);
                setAgentContent('');
                setViewMode('edit');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <X className="h-4 w-4 mr-2 inline" />
              Cancel
            </button>
            <button
              onClick={handleSaveAgent}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
            >
              {actionLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Agent
            </button>
            <button
              onClick={() => handleDeployAgent(editingAgent)}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
            >
              {actionLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Deploy Agent
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Agent Configuration</h3>
                <p className="text-sm text-gray-500 mt-1">
                  File: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{editingAgent.file_path}</code>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center ${
                    viewMode === 'preview' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode('edit')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center ${
                    viewMode === 'edit' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Code className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4" data-color-mode="light">
            <MDEditor
              value={agentContent}
              onChange={(val) => setAgentContent(val || '')}
              preview={viewMode === 'preview' ? 'preview' : 'edit'}
              hideToolbar={viewMode === 'preview'}
              visibleDragBar={false}
              height={500}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Agents</h2>
          <p className="mt-1 text-gray-500">Manage AI agents for this project</p>
        </div>
        <button
          onClick={handleIndexAgents}
          disabled={actionLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
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
          icon={Upload}
          title="No agents indexed"
          description="Index your project's sub-agents to configure their policies and deploy them."
          action={{
            label: "Index Agents",
            onClick: handleIndexAgents
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <div key={agent.id} className="space-y-3">
              <AgentCard
                agent={agent}
                onConfigurePolicy={() => setSelectedAgent(agent)}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditAgent(agent)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors flex items-center justify-center"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeployAgent(agent)}
                  disabled={actionLoading}
                  className="flex-1 px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {actionLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Deploy
                    </>
                  )}
                </button>
              </div>
            </div>
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

export default ProjectAgentsView;