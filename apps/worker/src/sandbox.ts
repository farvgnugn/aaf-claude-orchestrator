import Docker from 'dockerode'
const docker = new Docker()
export async function runInSandbox({ image=process.env.SANDBOX_IMAGE||'claude-sandbox:latest', cmd, workdir=process.env.SANDBOX_WORKDIR||'/workspace', bindWorkspace, readonly=true, networkMode=process.env.SANDBOX_NETWORK||'none', env={} }: { image?:string, cmd:string[], workdir?:string, bindWorkspace?:string, readonly?:boolean, networkMode?:string, env?:Record<string,string> }) {
  const Binds = bindWorkspace ? [`${bindWorkspace}:${workdir}:${readonly?'ro':'rw'}`] : undefined
  const Env = Object.entries(env).map(([k,v]) => `${k}=${v}`)
  const container = await docker.createContainer({ Image:image, Cmd:cmd, WorkingDir:workdir, HostConfig:{ NetworkMode:networkMode, Binds, ReadonlyRootfs:readonly }, Env })
  const stream = await container.attach({ stream:true, stdout:true, stderr:true })
  let logs=''; stream.on('data', (d:Buffer)=> logs += d.toString('utf8'))
  await container.start(); const status = await container.wait(); await container.remove({ force:true })
  return { exitCode: status.StatusCode||0, logs }
}
