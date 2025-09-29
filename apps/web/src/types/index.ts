export interface Project {
  id: number;
  public_id: string;
  name: string;
  repo_ready: boolean;

  // Repository Connection
  repo_provider?: string;
  repo_url?: string;
  repo_owner?: string;
  repo_name?: string;
  repo_default_branch: string;
  workspace_root?: string;

  // GitHub Integration
  github_app_installation_id?: bigint;
  github_webhook_secret?: string;
  github_token_encrypted?: string;
  github_token_expires_at?: string;

  // Metadata
  created_at: string;
  updated_at: string;
}

export interface Epic {
  id: number;
  public_id: string;
  project_id: number;
  title: string;
  status: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  start_date?: string;
  target_date?: string;
}

export interface Story {
  id: number;
  public_id: string;
  epic_id: number;
  title: string;
  status: 'DRAFT' | 'ANALYST_REVIEWED' | 'PO_REVIEW' | 'NEEDS_REVISION' | 'AWAITING_HUMAN' | 'APPROVED' | 'REJECTED' | 'RUNNING' | 'DONE' | 'FAILED';
  dependencies_met: boolean;
  size?: string;
  risk?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  story_points?: number;
  assignee?: string;
}

export interface Artifact {
  id: number;
  public_id: string;
  project_id: number;
  scope_kind: 'PROJECT' | 'EPIC' | 'STORY';
  scope_id: number;
  kind: string;
  title?: string;
  current_version_no: number;
  description?: string;
  tags?: string[];
}

export interface ArtifactVersion {
  id: number;
  version_no: number;
  content_md?: string;
  content_json?: any;
  author_type: 'user' | 'subagent';
  author_ref: string;
  notes?: string;
  created_at: string;
}

export interface SubAgent {
  id: number;
  project_id: number;
  name: string;
  file_path: string;
  sha256: string;
  enabled: boolean;
  max_tokens_per_run?: number;
  allowed_tools?: string[];
  may_bypass_permissions?: boolean;
}

export interface PullRequest {
  id: number;
  story_id: number;
  provider: string;
  repo: string;
  pr_number: number;
  status: string;
  url: string;
  branch: string;
  head_sha?: string;
  base_branch: string;
}

export interface POApproval {
  story_public_id: string;
  stage: string;
  decision: 'APPROVE' | 'REVISE' | 'REJECT';
  rubric_json: {
    goalClear: boolean;
    atomicScope: boolean;
    acceptanceCriteria: boolean;
    dataContractsLinked: boolean;
    dependenciesResolved: boolean;
    nonFunctionalNoted: boolean;
    ownerNamed: boolean;
    rollbackPlan: boolean;
  };
  decided_by: string;
}

export interface GitHubInstallation {
  id: number;
  installation_id: bigint;
  account_login: string;
  account_type: 'User' | 'Organization';
  permissions: Record<string, any>;
  events: string[];
  created_at: string;
  updated_at: string;
  projects?: Project[];
}

export interface RepoBindingData {
  repoProvider: string;
  repoUrl: string;
  defaultBranch?: string;
  workspaceRoot?: string;
  githubWebhookSecret?: string;
  githubAppInstallationId?: string;
  githubTokenEncrypted?: string;
  githubTokenExpiresAt?: string;
}