import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq'
import { PrismaClient } from '@prisma/client'
import { runSubagent } from '@mvp/agents'
import { parseRepoUrl, getDefaultBranch, getBranchSha, createBranch, putFile, createPR, reviewAndMergePR } from './github.js'

const prisma = new PrismaClient()
const connection = { connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } }

const devQ = new Queue('dev', connection)
const reviewQ = new Queue('review', connection)
new QueueEvents('dev', connection)
new QueueEvents('review', connection)

async function enqueueDevJobs() {
  // find one approved story with project ready
  const story = await prisma.user_stories.findFirst({
    where: { status: 'APPROVED', dependencies_met: true, epic: { project: { repo_ready: true } } },
    include: { epic: { include: { project: true } } },
    orderBy: { id: 'asc' }
  })
  if (!story) return
  await prisma.user_stories.update({ where: { id: story.id }, data: { status: 'RUNNING' } })
  await devQ.add('implement', { storyId: story.id }, { removeOnComplete: true, attempts: 1 } as JobsOptions)
}

async function enqueueReviewJobs() {
  const pr = await prisma.story_pull_requests.findFirst({ where: { status: 'OPEN' }, orderBy: { id: 'asc' } })
  if (!pr) return
  await reviewQ.add('review', { prId: pr.id }, { removeOnComplete: true, attempts: 1 } as JobsOptions)
}

// DEV worker: drafts Dev Notes (Claude optional), creates branch, commits notes file, opens PR, records PR row, marks DONE
new Worker('dev', async job => {
  const story = await prisma.user_stories.findUnique({ where: { id: job.data.storyId }, include: { epic: { include: { project: true } } } })
  if (!story) return
  const project = story.epic.project
  if (!project.repo_url) throw new Error('Project repo_url not set')

  // Dev notes via Claude (optional)
  let devNotes = `# Dev Implementation Notes\n\n**Story:** ${story.public_id} — ${story.title}\n\nThis is an MVP generated note.`
  try {
    if (process.env.CLAUDE_API_KEY) {
      const text = await runSubagent({ agentName: 'dev-impl', instruction: `Create concise Dev Notes in markdown for story ${story.public_id} titled "${story.title}". Include a "How to Test" section.` })
      if (text?.trim()) devNotes = text
    }
  } catch { /* ignore */ }

  // Save Dev Notes artifact version
  let artifact = await prisma.artifacts.findFirst({ where: { scope_kind: 'STORY', scope_id: story.id, kind: 'DEV_NOTES' } })
  if (!artifact) {
    artifact = await prisma.artifacts.create({ data: { public_id: crypto.randomUUID(), project_id: project.id, scope_kind: 'STORY', scope_id: story.id, kind: 'DEV_NOTES', title: 'Dev Notes', current_version_no: 0 } })
  }
  const next = (artifact.current_version_no ?? 0) + 1
  await prisma.artifact_versions.create({ data: { artifact_id: artifact.id, version_no: next, content_md: devNotes, author_type: 'subagent', author_ref: 'subagent:dev-impl' } })
  await prisma.artifacts.update({ where: { id: artifact.id }, data: { current_version_no: next } })

  // GitHub PR flow
  const { owner, repo } = parseRepoUrl(project.repo_url)
  const base = await getDefaultBranch(owner, repo)
  const baseSha = await getBranchSha(owner, repo, base)
  const branch = `feat/${story.public_id}`
  try { await createBranch(owner, repo, branch, baseSha) } catch (e) { /* branch may exist; continue */ }
  const path = `.changes/dev-notes-${story.public_id}.md`
  await putFile(owner, repo, branch, path, devNotes, `docs: add dev notes for ${story.public_id}`)
  const pr = await createPR(owner, repo, branch, base, `feat(${story.public_id}): ${story.title}`, `This PR adds Dev Notes and related changes.`)

  await prisma.story_pull_requests.create({
    data: {
      story_id: story.id,
      provider: 'github',
      repo: `${owner}/${repo}`,
      pr_number: pr.number,
      branch,
      status: 'OPEN',
      url: pr.html_url,
      head_sha: pr.head?.sha || null,
      base_branch: base
    }
  })

  // Mark story as DONE (in real flow you'd wait CI/merge)
  await prisma.user_stories.update({ where: { id: story.id }, data: { status: 'DONE' } })
}, connection)

// REVIEW worker: approve and merge PR (demo)
new Worker('review', async job => {
  const pr = await prisma.story_pull_requests.findUnique({ where: { id: job.data.prId } })
  if (!pr) return
  const [owner, repo] = pr.repo.split('/')
  await reviewAndMergePR(owner, repo, pr.pr_number, true)
  await prisma.story_pull_requests.update({ where: { id: pr.id }, data: { status: 'MERGED', updated_at: new Date() } })
}, connection)

// Interval enqueuers
setInterval(enqueueDevJobs, 60_000)
setInterval(enqueueReviewJobs, 60_000)
console.log('[worker] BullMQ workers online. Enqueuers polling every 60s.')


// Example (optional): run a safe check inside sandbox after creating Dev Notes
// const { runInSandbox } = await import('./sandbox.js')
// await runInSandbox({
//   cmd: ['bash','-lc','echo "validating workspace..." && ls -la'],
//   bindWorkspace: '/workspaces', // named volume from compose
//   readonly: true
// })
