import React from 'react';
import { FileText, Clock, User, Bot } from 'lucide-react';
import { Artifact, ArtifactVersion } from '../../types';

interface ArtifactCardProps {
  artifact: Artifact;
  latestVersion?: ArtifactVersion;
  onClick: () => void;
}

const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, latestVersion, onClick }) => {
  const getKindColor = (kind: string) => {
    const colors: Record<string, string> = {
      PRD: 'text-blue-600 bg-blue-50 border-blue-200',
      ARCH_DOC: 'text-purple-600 bg-purple-50 border-purple-200',
      UI_SPEC: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      DEV_NOTES: 'text-amber-600 bg-amber-50 border-amber-200',
      QC_NOTES: 'text-red-600 bg-red-50 border-red-200',
      PR_DETAILS: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      PR_DESCRIPTION: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      PR_COMMENTS: 'text-pink-600 bg-pink-50 border-pink-200',
    };
    return colors[kind] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="h-4 w-4 text-blue-600" />
            <h3 className="font-medium text-gray-900 group-hover:text-blue-700 line-clamp-1">
              {artifact.title || `${artifact.kind} Document`}
            </h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getKindColor(artifact.kind)}`}>
                {artifact.kind.replace('_', ' ')}
              </span>
              
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                v{artifact.current_version_no}
              </span>

              <span className="text-xs text-gray-500 capitalize">
                {artifact.scope_kind.toLowerCase()} scope
              </span>
            </div>

            {latestVersion && (
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                {latestVersion.author_type === 'user' ? (
                  <User className="h-3 w-3" />
                ) : (
                  <Bot className="h-3 w-3" />
                )}
                <span>by {latestVersion.author_ref}</span>
                <Clock className="h-3 w-3 ml-2" />
                <span>{new Date(latestVersion.created_at).toLocaleDateString()}</span>
              </div>
            )}

            {latestVersion?.notes && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {latestVersion.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtifactCard;