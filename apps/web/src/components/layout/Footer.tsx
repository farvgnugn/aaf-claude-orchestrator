import React from 'react';
import { Archive, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateToArchive: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateToArchive }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 border-t border-dark-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-dark-300">
            <span className="text-sm">
              © {currentYear} Agentic AI Flow - Claude Code Orchestrator
            </span>
            <Heart className="h-4 w-4 text-red-400 animate-pulse" />
          </div>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={onNavigateToArchive}
              className="flex items-center space-x-2 text-dark-300 hover:text-blue-400 transition-all duration-300 group"
            >
              <Archive className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-medium">Archived Projects</span>
            </button>
            
            <div className="flex items-center space-x-4 text-xs text-dark-400">
              <span>Powered by Claude AI</span>
              <div className="h-4 w-px bg-dark-600"></div>
              <span>Built with React & Tailwind</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;