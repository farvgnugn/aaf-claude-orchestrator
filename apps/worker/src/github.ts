export type RepoCoords = { owner: string; repo: string }
export type GitHubAuth = {
  token: string
  installationId?: bigint
}

const BASE = 'https://api.github.com'

function bearer(auth?: GitHubAuth | string) {
  let token: string;

  if (typeof auth === 'string') {
    token = auth;
  } else if (auth?.token) {
    token = auth.token;
  } else {
    // Fallback to environment variable for backward compatibility
    token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error('GitHub token not provided and GITHUB_TOKEN not set');
  }

  return {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'orchestrator-mvp',
    'Accept': 'application/vnd.github.v3+json'
  };
}

export function parseRepoUrl(url: string): RepoCoords {
  const m = url.match(/github\.com\/([^\/]+)\/([^\/#]+)/);
  if (m) return { owner: m[1], repo: m[2] };
  const parts = url.split('/');
  if (parts.length===2) return { owner: parts[0], repo: parts[1] };
  throw new Error('Unsupported repo url:'+url)
}

export async function getDefaultBranch(owner: string, repo: string, auth?: GitHubAuth | string) {
  const r = await fetch(`${BASE}/repos/${owner}/${repo}`, { headers: bearer(auth) });
  const j = await r.json();
  return j.default_branch || 'main'
}

export async function getBranchSha(owner: string, repo: string, branch: string, auth?: GitHubAuth | string) {
  const r = await fetch(`${BASE}/repos/${owner}/${repo}/git/ref/heads/${branch}`, { headers: bearer(auth) });
  if (r.status>=400) throw new Error('getBranchSha failed');
  const j = await r.json();
  return j.object.sha
}

export async function createBranch(owner: string, repo: string, newBranch: string, fromSha: string, auth?: GitHubAuth | string) {
  const r = await fetch(`${BASE}/repos/${owner}/${repo}/git/refs`, {
    method:'POST',
    headers:{...bearer(auth),'Content-Type':'application/json'},
    body: JSON.stringify({ ref:`refs/heads/${newBranch}`, sha: fromSha })
  });
  if (r.status>=300) throw new Error(await r.text())
}

export async function putFile(owner: string, repo: string, branch: string, path: string, content: string, message: string, auth?: GitHubAuth | string) {
  const b64 = Buffer.from(content,'utf8').toString('base64');
  const r = await fetch(`${BASE}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
    method:'PUT',
    headers:{...bearer(auth),'Content-Type':'application/json'},
    body: JSON.stringify({ message, content: b64, branch })
  });
  if (r.status>=300) throw new Error(await r.text());
  return await r.json()
}

export async function createPR(owner: string, repo: string, head: string, base: string, title: string, body: string, auth?: GitHubAuth | string) {
  const r = await fetch(`${BASE}/repos/${owner}/${repo}/pulls`, {
    method:'POST',
    headers:{...bearer(auth),'Content-Type':'application/json'},
    body: JSON.stringify({ title, head, base, body })
  });
  const j = await r.json();
  if (r.status>=300) throw new Error(JSON.stringify(j));
  return j
}

export async function reviewAndMergePR(owner: string, repo: string, prNumber: number, approve: boolean = true, auth?: GitHubAuth | string) {
  await fetch(`${BASE}/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, {
    method:'POST',
    headers:{...bearer(auth),'Content-Type':'application/json'},
    body: JSON.stringify({ event: approve ? 'APPROVE' : 'REQUEST_CHANGES', body: approve ? 'LGTM (auto)' : 'Needs changes' })
  })
  await fetch(`${BASE}/repos/${owner}/${repo}/pulls/${prNumber}/merge`, {
    method:'PUT',
    headers:{...bearer(auth),'Content-Type':'application/json'},
    body: JSON.stringify({ merge_method: 'squash' })
  })
}
