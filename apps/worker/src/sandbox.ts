import Docker from 'dockerode'

const docker = new Docker() // talks to /var/run/docker.sock

export type SandboxRunOptions = {
  image?: string
  cmd: string[]
  workdir?: string
  bindWorkspace?: string   // host or volume path to mount
  readonly?: boolean
  networkMode?: string     // 'none' by default
  env?: Record<string,string>
}

export async function runInSandbox(opts: SandboxRunOptions): Promise<{ exitCode: number, logs: string }> {
  const image = opts.image || process.env.SANDBOX_IMAGE || 'claude-sandbox:latest'
  const workdir = opts.workdir || process.env.SANDBOX_WORKDIR || '/workspace'
  const networkMode = opts.networkMode || process.env.SANDBOX_NETWORK || 'none'
  const binds = []
  if (opts.bindWorkspace) {
    const mode = opts.readonly ? 'ro' : 'rw'
    binds.push(`${opts.bindWorkspace}:${workdir}:${mode}`)
  }
  const Env = Object.entries(opts.env || {}).map(([k,v]) => `${k}=${v}`)

  const container = await docker.createContainer({
    Image: image,
    Cmd: opts.cmd,
    WorkingDir: workdir,
    HostConfig: {
      NetworkMode: networkMode,
      Binds: binds,
      ReadonlyRootfs: !!opts.readonly,
      // No additional capabilities; conservative defaults
    },
    Env
  })

  const chunks: Buffer[] = []
  const stream = await container.attach({ stream: true, stdout: true, stderr: true })
  stream.on('data', (d: Buffer) => chunks.push(d))
  await container.start()
  const status = await container.wait()
  const logs = Buffer.concat(chunks).toString('utf8')
  await container.remove({ force: true })
  return { exitCode: status.StatusCode || 0, logs }
}
