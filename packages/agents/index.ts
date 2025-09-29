import { query } from '@anthropic-ai/claude-code'
export async function runSubagent({ agentName, instruction, attachments = [] }:{agentName:string,instruction:string,attachments?:{role:'user'|'assistant',content:string}[]}) {
  const q = query({ prompt: [{ role: 'user', content: `Use the ${agentName} subagent to: ${instruction}` }, ...attachments], options: { apiKey: process.env.CLAUDE_API_KEY } })
  let text = ''; for await (const m of q.stream() as any) if (m.type === 'text-delta') text += m.delta; return text
}
