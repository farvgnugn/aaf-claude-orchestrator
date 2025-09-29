// Import seed data
import projectsData from '../data/projects.json';
import epicsData from '../data/epics.json';
import storiesData from '../data/stories.json';
import artifactsData from '../data/artifacts.json';
import artifactVersionsData from '../data/artifactVersions.json';
import agentsData from '../data/agents.json';
import pullRequestsData from '../data/pullRequests.json';

// Simulate API delays for realistic UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for demo purposes
let projects = [...projectsData];
let epics = [...epicsData];
let stories = [...storiesData];
let artifacts = [...artifactsData];
let artifactVersions = [...artifactVersionsData];
let agents = [...agentsData];
let pullRequests = [...pullRequestsData];

class ApiService {
  // Projects
  async getProjects() {
    await delay(300);
    return projects;
  }

  async getEpics(projectId?: number) {
    await delay(300);
    return projectId ? epics.filter(e => e.project_id === projectId) : epics;
  }

  async createProject(name: string) {
    await delay(500);
    const newProject = {
      id: Math.max(...projects.map(p => p.id)) + 1,
      public_id: `proj-${Date.now()}-uuid`,
      name,
      repo_ready: false,
      repo_provider: null,
      repo_url: null,
      repo_default_branch: 'main',
      workspace_root: null
    };
    projects.push(newProject);
    return newProject;
  }

  async getProject(id: number) {
    await delay(200);
    const project = projects.find(p => p.id === id);
    if (!project) throw new Error('Project not found');
    return project;
  }

  async bindRepository(id: number, data: {
    repoProvider: string;
    repoUrl: string;
    defaultBranch: string;
    workspaceRoot: string;
  }) {
    await delay(800);
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) throw new Error('Project not found');
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      repo_provider: data.repoProvider,
      repo_url: data.repoUrl,
      repo_default_branch: data.defaultBranch,
      workspace_root: data.workspaceRoot
    };
    return { ok: true, project: projects[projectIndex] };
  }

  async bootstrapRepo(id: number) {
    await delay(1200);
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) throw new Error('Project not found');
    
    projects[projectIndex].repo_ready = true;
    return { ok: true };
  }

  // Stories
  async getStories(epicId?: number) {
    await delay(300);
    return epicId ? stories.filter(s => s.epic_id === epicId) : stories;
  }

  async createStory(epicId: number, title: string) {
    await delay(600);
    const newStory = {
      id: Math.max(...stories.map(s => s.id)) + 1,
      public_id: `story-${Date.now()}-uuid`,
      epic_id: epicId,
      title,
      status: 'DRAFT' as const,
      dependencies_met: false,
      size: undefined,
      risk: undefined
    };
    stories.push(newStory);
    return newStory;
  }

  async requestPOReview(storyId: number) {
    await delay(1000);
    const storyIndex = stories.findIndex(s => s.id === storyId);
    if (storyIndex === -1) throw new Error('Story not found');
    
    // Simulate PO approval
    stories[storyIndex] = {
      ...stories[storyIndex],
      status: 'APPROVED',
      dependencies_met: true,
      size: 'M',
      risk: 'LOW'
    };
    
    return {
      ok: true,
      story: stories[storyIndex],
      approval: {
        story_public_id: stories[storyIndex].public_id,
        stage: 'PO',
        decision: 'APPROVE',
        rubric_json: {
          goalClear: true,
          atomicScope: true,
          acceptanceCriteria: true,
          dataContractsLinked: true,
          dependenciesResolved: true,
          nonFunctionalNoted: true,
          ownerNamed: true,
          rollbackPlan: true
        },
        decided_by: 'subagent:po'
      }
    };
  }

  // Artifacts
  async createArtifact(data: {
    projectId: number;
    scopeKind: string;
    scopeId: number;
    kind: string;
    title?: string;
  }) {
    await delay(500);
    const newArtifact = {
      id: Math.max(...artifacts.map(a => a.id)) + 1,
      public_id: `artifact-${Date.now()}-uuid`,
      project_id: data.projectId,
      scope_kind: data.scopeKind,
      scope_id: data.scopeId,
      kind: data.kind,
      title: data.title,
      current_version_no: 0
    };
    artifacts.push(newArtifact);
    return { ok: true, artifact: newArtifact };
  }

  async addArtifactVersion(artifactId: number, data: {
    content_md?: string;
    content_json?: any;
    author_type: string;
    author_ref: string;
    notes?: string;
  }) {
    await delay(400);
    const artifact = artifacts.find(a => a.id === artifactId);
    if (!artifact) throw new Error('Artifact not found');
    
    const newVersion = {
      id: Math.max(...artifactVersions.map(v => v.id)) + 1,
      artifact_id: artifactId,
      version_no: artifact.current_version_no + 1,
      content_md: data.content_md,
      content_json: data.content_json,
      author_type: data.author_type,
      author_ref: data.author_ref,
      notes: data.notes,
      created_at: new Date().toISOString()
    };
    
    artifactVersions.push(newVersion);
    artifact.current_version_no = newVersion.version_no;
    
    return { ok: true, version: newVersion };
  }

  async getArtifactVersions(artifactId: number) {
    await delay(200);
    return artifactVersions.filter(v => v.artifact_id === artifactId);
  }

  async getArtifact(artifactId: number) {
    await delay(200);
    const artifact = artifacts.find(a => a.id === artifactId);
    if (!artifact) throw new Error('Artifact not found');
    return artifact;
  }

  // Sub-agents
  async getAgents(projectId: number) {
    await delay(300);
    return agents.filter(a => a.project_id === projectId);
  }

  async indexAgents(projectId: number, agents: Array<{
    name: string;
    file_path: string;
    sha256: string;
  }>) {
    await delay(800);
    
    // Remove existing agents for this project
    const existingAgentIds = agents.filter(a => a.project_id === projectId).map(a => a.id);
    agents = agents.filter(a => !existingAgentIds.includes(a.id));
    
    // Add new agents
    const newAgents = agents.map((agent, index) => ({
      id: Math.max(...agents.map(a => a.id), 0) + index + 1,
      project_id: projectId,
      ...agent,
      enabled: true
    }));
    
    agents.push(...newAgents);
    return { ok: true };
  }

  async setAgentPolicy(projectId: number, data: {
    agent_name: string;
    max_tokens_per_run?: number;
    allowed_tools?: string[];
    may_bypass_permissions?: boolean;
  }) {
    await delay(400);
    const agentIndex = agents.findIndex(a => a.project_id === projectId && a.name === data.agent_name);
    if (agentIndex === -1) throw new Error('Agent not found');
    
    agents[agentIndex] = {
      ...agents[agentIndex],
      max_tokens_per_run: data.max_tokens_per_run,
      allowed_tools: data.allowed_tools,
      may_bypass_permissions: data.may_bypass_permissions
    };
    
    return { ok: true, policy: agents[agentIndex] };
  }

  // Pull Requests
  async ingestPR(data: {
    story_id: number;
    provider: string;
    repo: string;
    pr_number: number;
    branch: string;
    status: string;
    url: string;
    head_sha?: string;
    base_branch: string;
  }) {
    await delay(300);
    const newPR = {
      id: Math.max(...pullRequests.map(pr => pr.id)) + 1,
      ...data
    };
    pullRequests.push(newPR);
    return { ok: true };
  }

  async getStoryPRs(storyId: number) {
    await delay(200);
    return pullRequests.filter(pr => pr.story_id === storyId);
  }

  // Additional helper methods for seed data
  async getArtifacts(projectId?: number) {
    await delay(300);
    return projectId 
      ? artifacts.filter(a => a.project_id === projectId)
      : artifacts;
  }
}

export const apiService = new ApiService();