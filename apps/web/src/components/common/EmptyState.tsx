import React from 'react';
import { Video as LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="text-center py-16 animate-fade-in-up">
      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-dark-700 to-dark-800 rounded-full flex items-center justify-center mb-6 shadow-xl">
        <Icon className="h-12 w-12 text-dark-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-dark-400 mb-8 max-w-md mx-auto leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary inline-flex items-center px-6 py-3 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;