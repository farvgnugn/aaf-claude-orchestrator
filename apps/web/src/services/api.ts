// API base URL - backend running on port 4000
const API_BASE_URL = 'http://localhost:4000';

// HTTP client helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

class ApiService {
  // Projects
  async getProjects() {
    return apiRequest('/projects');
  }

  async getEpics(projectId?: number) {
    // Note: Backend doesn't have epics endpoint yet, return empty array for now
    return [];
  }

  async createProject(name: string) {
    return apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getProject(id: number) {
    return apiRequest(`/projects/${id}`);
  }

  async bindRepository(id: number, data: {
    repoProvider: string;
    repoUrl: string;
    defaultBranch: string;
    workspaceRoot: string;
  }) {
    return apiRequest(`/projects/${id}/repo/bind`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async bootstrapRepo(id: number) {
    return apiRequest(`/projects/${id}/repo/bootstrap`, {
      method: 'POST',
    });
  }

  // Stories
  async getStories(epicId?: number) {
    const params = epicId ? `?epicId=${epicId}` : '';
    return apiRequest(`/stories${params}`);
  }

  async createStory(epicId: number, title: string) {
    return apiRequest('/stories', {
      method: 'POST',
      body: JSON.stringify({ epicId, title }),
    });
  }

  async requestPOReview(storyId: number) {
    return apiRequest(`/stories/${storyId}/request-po-review`, {
      method: 'POST',
    });
  }

  // Artifacts
  async createArtifact(data: {
    projectId: number;
    scopeKind: string;
    scopeId: number;
    kind: string;
    title?: string;
  }) {
    return apiRequest('/artifacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addArtifactVersion(artifactId: number, data: {
    content_md?: string;
    content_json?: any;
    author_type: string;
    author_ref: string;
    notes?: string;
  }) {
    return apiRequest(`/artifacts/${artifactId}/versions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getArtifactVersions(artifactId: number) {
    return apiRequest(`/artifacts/${artifactId}/versions`);
  }

  async getArtifact(artifactId: number) {
    return apiRequest(`/artifacts/${artifactId}`);
  }

  // Sub-agents
  async getAgents(projectId: number) {
    return apiRequest(`/agents/${projectId}`);
  }

  async indexAgents(projectId: number, agents: Array<{
    name: string;
    file_path: string;
    sha256: string;
  }>) {
    return apiRequest(`/agents/${projectId}/index`, {
      method: 'POST',
      body: JSON.stringify({ agents }),
    });
  }

  async setAgentPolicy(projectId: number, data: {
    agent_name: string;
    max_tokens_per_run?: number;
    allowed_tools?: string[];
    may_bypass_permissions?: boolean;
  }) {
    return apiRequest(`/agents/${projectId}/policy`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
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
    return apiRequest('/pr/ingest', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getStoryPRs(storyId: number) {
    return apiRequest(`/pr/story/${storyId}`);
  }

  // Additional helper methods for seed data
  async getArtifacts(projectId?: number) {
    // Note: Backend doesn't have a general artifacts list endpoint yet
    // This would need to be implemented on the backend
    throw new Error('getArtifacts endpoint not implemented in backend yet');
  }
}

export const apiService = new ApiService();