import React, { useEffect, useState } from 'react'

type Project = { id:number; name:string; repo_ready:boolean }
type Story = { id:number; title:string; status:string }

const API = 'http://localhost:4000'

export function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selected, setSelected] = useState<Project|null>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [newProject, setNewProject] = useState('')
  const [bind, setBind] = useState({ repoProvider: 'github', repoUrl: '', defaultBranch: 'main', workspaceRoot: '' })

  useEffect(() => { fetch(`${API}/projects`).then(r=>r.json()).then(setProjects) }, [])

  function openProject(p: Project) {
    setSelected(p)
    fetch(`${API}/stories?epicId=`) // MVP: load all
    fetch(`${API}/stories`).then(r=>r.json()).then(setStories)
  }

  async function createProject() {
    const res = await fetch(`${API}/projects`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: newProject }) })
    const p = await res.json()
    setProjects([...projects, p])
    setNewProject('')
  }

  async function bindRepo() {
    if (!selected) return
    await fetch(`${API}/projects/${selected.id}/repo/bind`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(bind) })
    alert('Repo bound. Now run bootstrap.')
  }

  async function bootstrap() {
    if (!selected) return
    await fetch(`${API}/projects/${selected.id}/repo/bootstrap`, { method:'POST' })
    const res = await fetch(`${API}/projects/${selected.id}`)
    const p = await res.json()
    setSelected(p)
    setProjects(projects.map(x=>x.id===p.id? p:x))
  }

  async function approveFirstStory() {
    if (!stories.length) return
    const s = stories[0]
    await fetch(`${API}/stories/${s.id}/request-po-review`, { method:'POST' })
    const updated = await fetch(`${API}/stories`).then(r=>r.json())
    setStories(updated)
  }

  return (
    <div className="min-h-screen text-white">
      <header className="p-6">
        <h1 className="h1">Claude Orchestrator <span className="text-brand-300">MVP</span></h1>
        <p className="subtle mt-1">Consumer-grade UI • soft shadows • gradients • rounded corners</p>
      </header>

      <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="card p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Projects</h2>
            <div className="flex gap-2">
              <input className="px-3 py-2 rounded-xl bg-slate-700 text-white" placeholder="New project name" value={newProject} onChange={e=>setNewProject(e.target.value)} />
              <button className="btn" onClick={createProject}>Create</button>
            </div>
          </div>
          <ul className="space-y-2">
            {projects.map(p => (
              <li key={p.id} className={`p-3 rounded-xl border ${selected?.id===p.id? 'border-brand-500 bg-slate-800':'border-slate-700 bg-slate-800/60'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-slate-300">Repo Ready: {p.repo_ready? 'Yes':'No'}</div>
                  </div>
                  <button className="btn-secondary" onClick={()=>openProject(p)}>Open</button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-4 lg:col-span-2">
          {!selected && <div className="text-slate-300">Select a project to manage repository, agents, and stories.</div>}
          {selected && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-semibold">{selected.name}</div>
                  <div className="text-xs text-slate-300">ID #{selected.id}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${selected.repo_ready? 'bg-emerald-600/30 border border-emerald-500 text-emerald-100':'bg-amber-600/30 border border-amber-500 text-amber-100'}`}>
                  {selected.repo_ready? 'Repo Ready':'Repo Not Ready'}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-700">
                  <h3 className="font-semibold mb-2">Repository Binding</h3>
                  <div className="space-y-2">
                    <input className="w-full px-3 py-2 rounded-xl bg-slate-700" placeholder="Repo URL (https://github.com/org/repo)" value={bind.repoUrl} onChange={e=>setBind({...bind, repoUrl:e.target.value})}/>
                    <input className="w-full px-3 py-2 rounded-xl bg-slate-700" placeholder="Workspace Root (e.g., D:/work/rocket-oms)" value={bind.workspaceRoot} onChange={e=>setBind({...bind, workspaceRoot:e.target.value})}/>
                    <div className="flex gap-2">
                      <button className="btn" onClick={bindRepo}>Bind Repo</button>
                      <button className="btn-secondary" onClick={bootstrap}>Bootstrap</button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-700">
                  <h3 className="font-semibold mb-2">Stories (MVP)</h3>
                  <p className="text-sm text-slate-300 mb-2">Auto-approve first story via PO gate (simulated).</p>
                  <button className="btn" onClick={approveFirstStory}>Approve First Story</button>
                  <ul className="mt-3 space-y-2">
                    {stories.map(s => (
                      <li key={s.id} className="p-2 rounded-xl bg-slate-800/70 border border-slate-700 flex justify-between">
                        <span>{s.title}</span><span className="text-slate-300">{s.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}