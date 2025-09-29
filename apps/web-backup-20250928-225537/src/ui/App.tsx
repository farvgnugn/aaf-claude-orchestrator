import React, { useEffect, useState } from 'react'
type Project = { id:number; name:string; repo_ready:boolean }
type Story = { id:number; title:string; status:string }
const API = 'http://localhost:4000'
export function App(){
  const [projects,setProjects]=useState<Project[]>([])
  const [selected,setSelected]=useState<Project|null>(null)
  const [stories,setStories]=useState<Story[]>([])
  const [newProject,setNewProject]=useState('')
  const [bind,setBind]=useState({repoProvider:'github',repoUrl:'',defaultBranch:'main',workspaceRoot:''})
  useEffect(()=>{fetch(`${API}/projects`).then(r=>r.json()).then(setProjects)},[])
  function openProject(p:Project){setSelected(p);fetch(`${API}/stories`).then(r=>r.json()).then(setStories)}
  async function createProject(){const r=await fetch(`${API}/projects`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:newProject})});const p=await r.json();setProjects([...projects,p]);setNewProject('')}
  async function bindRepo(){if(!selected) return;await fetch(`${API}/projects/${selected.id}/repo/bind`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(bind)});alert('Repo bound. Now bootstrap.')}
  async function bootstrap(){if(!selected) return;await fetch(`${API}/projects/${selected.id}/repo/bootstrap`,{method:'POST'});const p=await fetch(`${API}/projects/${selected.id}`).then(r=>r.json());setSelected(p);setProjects(projects.map(x=>x.id===p.id?p:x))}
  async function approveFirstStory(){if(!stories.length) return;const s=stories[0];await fetch(`${API}/stories/${s.id}/request-po-review`,{method:'POST'});const updated=await fetch(`${API}/stories`).then(r=>r.json());setStories(updated)}
  return (<div className="p-6"><h1 className="text-xl font-semibold mb-4">Orchestrator (Prisma-only)</h1>
  <div className="grid md:grid-cols-3 gap-6">
    <section className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
      <h2 className="font-semibold mb-2">Projects</h2>
      <div className="flex gap-2 mb-2"><input className="px-2 py-1 rounded bg-slate-700" placeholder="New project" value={newProject} onChange={e=>setNewProject(e.target.value)}/><button onClick={createProject} className="px-3 py-1 rounded bg-blue-600">Create</button></div>
      <ul className="space-y-2">{projects.map(p=>(<li key={p.id} className="p-2 rounded bg-slate-900 flex justify-between items-center"><span>{p.name}</span><button className="px-2 py-1 rounded bg-slate-700" onClick={()=>openProject(p)}>Open</button></li>))}</ul>
    </section>
    <section className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 md:col-span-2">
      {!selected && <div>Select a project</div>}
      {selected && (<div className="space-y-4">
        <div className="flex items-center justify-between"><div><div className="font-semibold">{selected.name}</div><div className="text-xs">Repo Ready: {selected.repo_ready?'Yes':'No'}</div></div></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><h3 className="font-semibold mb-2">Bind Repo</h3>
            <input className="w-full mb-2 px-2 py-1 rounded bg-slate-700" placeholder="Repo URL (owner/repo or https)" value={bind.repoUrl} onChange={e=>setBind({...bind,repoUrl:e.target.value})}/>
            <input className="w-full mb-2 px-2 py-1 rounded bg-slate-700" placeholder="Workspace Root" value={bind.workspaceRoot} onChange={e=>setBind({...bind,workspaceRoot:e.target.value})}/>
            <div className="flex gap-2"><button className="px-3 py-1 rounded bg-blue-600" onClick={bindRepo}>Bind</button><button className="px-3 py-1 rounded bg-slate-700" onClick={bootstrap}>Bootstrap</button></div>
          </div>
          <div><h3 className="font-semibold mb-2">Stories (MVP)</h3><button className="px-3 py-1 rounded bg-blue-600" onClick={approveFirstStory}>PO Approve First</button>
            <ul className="mt-2 space-y-2">{stories.map(s=> (<li key={s.id} className="p-2 rounded bg-slate-900 flex justify-between"><span>{s.title}</span><span className="text-xs">{s.status}</span></li>))}</ul>
          </div>
        </div>
      </div>)}
    </section>
  </div></div>)}
