import React, { useState } from 'react';
import { Settings, ArrowLeft, Zap, Github, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  showProjectNav?: boolean;
  onBackToProjects?: () => void;
  onGitHubSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  showProjectNav = false,
  onBackToProjects,
  onGitHubSettings
}) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  return (
    <header className="header-gradient shadow-xl border-b border-dark-700 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              {showProjectNav ? (
                <button
                  onClick={onBackToProjects}
                  className="flex items-center text-lg font-bold text-white hover:text-blue-400 transition-all duration-300 group"
                >
                  <ArrowLeft className="h-5 w-5 mr-2 text-blue-400 group-hover:transform group-hover:-translate-x-1 transition-transform duration-300" />
                  Back to Projects
                </button>
              ) : (
                <h1 className="text-xl font-bold text-white flex items-center group">
                  <div className="relative mr-3">
                    <Zap className="h-7 w-7 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                    <div className="absolute inset-0 bg-blue-400 opacity-20 blur-lg rounded-full group-hover:opacity-30 transition-opacity duration-300"></div>
                  </div>
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Claude Orchestrator
                  </span>
                </h1>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="flex items-center space-x-2 px-3 py-2 text-dark-300 hover:text-white bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${showSettingsMenu ? 'rotate-180' : ''}`} />
              </button>

              {showSettingsMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onGitHubSettings?.();
                        setShowSettingsMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub Installations
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <span className="text-sm font-bold text-white">AI</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;