import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProjectsView from './views/ProjectsView';
import ProjectDashboard from './views/ProjectDashboard';
import ArchiveView from './views/ArchiveView';
import GitHubInstallationsManager from './components/github/GitHubInstallationsManager';

function App() {
  const [currentView, setCurrentView] = useState<'projects' | 'project-dashboard' | 'archive' | 'github-settings'>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'projects':
        return <ProjectsView onSelectProject={(projectId) => {
          setSelectedProjectId(projectId);
          setCurrentView('project-dashboard');
        }} />;
      case 'project-dashboard':
        return selectedProjectId ? (
          <ProjectDashboard 
            projectId={selectedProjectId} 
            onBackToProjects={() => setCurrentView('projects')}
          />
        ) : null;
      case 'archive':
        return <ArchiveView onBackToProjects={() => setCurrentView('projects')} />;
      case 'github-settings':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <GitHubInstallationsManager />
          </div>
        );
      default:
        return <ProjectsView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
        showProjectNav={currentView === 'project-dashboard'}
        onBackToProjects={() => setCurrentView('projects')}
        onGitHubSettings={() => setCurrentView('github-settings')}
      />
      <main className="py-8 min-h-[calc(100vh-8rem)]">
        {renderCurrentView()}
      </main>
      <Footer onNavigateToArchive={() => setCurrentView('archive')} />
    </div>
  );
}

export default App;