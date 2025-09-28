import { query } from '@anthropic-ai/claude-code'

export type RunSubagentOptions = {
  agentName: string
  instruction: string
  attachments?: { role: 'user'|'assistant', content: string }[]
}

export async function runSubagent(opts: RunSubagentOptions): Promise<string> {
  const q = query({
    prompt: [
      { role: 'user', content: `Use the ${opts.agentName} subagent to: ${opts.instruction}` },
      ...(opts.attachments ?? [])
    ],
    options: {
      apiKey: process.env.CLAUDE_API_KEY
    }
  })
  let text = ''
  for await (const m of q.stream()) {
    if ((m as any).type === 'text-delta') text += (m as any).delta
  }
  return text
}
