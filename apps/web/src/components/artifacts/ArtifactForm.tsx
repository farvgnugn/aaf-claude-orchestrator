import React, { useState } from 'react';
import { X, Save, FileText } from 'lucide-react';

interface ArtifactFormProps {
  onSubmit: (data: {
    projectId: number;
    scopeKind: string;
    scopeId: number;
    kind: string;
    title?: string;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
  projectId: number;
}

const ArtifactForm: React.FC<ArtifactFormProps> = ({ 
  onSubmit, 
  onCancel, 
  loading, 
  projectId 
}) => {
  const [formData, setFormData] = useState({
    scopeKind: 'PROJECT',
    scopeId: projectId,
    kind: 'PRD',
    title: '',
  });

  const artifactKinds = [
    'PRD', 'ARCH_DOC', 'UI_SPEC', 'EPIC_SUMMARY', 
    'DEV_NOTES', 'QC_NOTES', 'PR_DETAILS', 'PR_DESCRIPTION', 'PR_COMMENTS'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectId,
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Create Artifact
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
              Artifact Kind
            </label>
            <select
              value={formData.kind}
              onChange={(e) => setFormData(prev => ({ ...prev, kind: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {artifactKinds.map(kind => (
                <option key={kind} value={kind}>{kind.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scope
            </label>
            <select
              value={formData.scopeKind}
              onChange={(e) => setFormData(prev => ({ ...prev, scopeKind: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PROJECT">Project</option>
              <option value="EPIC">Epic</option>
              <option value="STORY">Story</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Document title..."
            />
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
              {loading ? 'Creating...' : 'Create Artifact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArtifactForm;