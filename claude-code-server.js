#!/usr/bin/env node

const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'claude-code-server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Claude Code execution endpoint
app.post('/claude', (req, res) => {
  const { prompt, options = {} } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Build Claude command with options
  let command = 'claude --print --output-format json';

  // Add tool restrictions if provided
  if (options.allowedTools && Array.isArray(options.allowedTools)) {
    const tools = options.allowedTools.join(',');
    command += ` --allowed-tools "${tools}"`;
  }

  if (options.disallowedTools && Array.isArray(options.disallowedTools)) {
    const tools = options.disallowedTools.join(',');
    command += ` --disallowed-tools "${tools}"`;
  }

  // Add model selection if specified
  if (options.model) {
    command += ` --model "${options.model}"`;
  }

  // Add permission mode if specified
  if (options.permissionMode) {
    command += ` --permission-mode "${options.permissionMode}"`;
  }

  // Change working directory if specified
  if (options.workdir && fs.existsSync(options.workdir)) {
    command = `cd "${options.workdir}" && ${command}`;
  }

  // Add session continuation options
  if (options.sessionId) {
    command += ` --session-id "${options.sessionId}"`;
  }

  if (options.continue) {
    command += ' --continue';
  }

  // Escape the prompt properly for shell execution
  const escapedPrompt = prompt.replace(/"/g, '\\"').replace(/'/g, "\\'");

  console.log(`[${new Date().toISOString()}] Executing Claude command:`, command);
  console.log(`[${new Date().toISOString()}] Prompt:`, prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''));

  // Execute Claude with the prompt
  exec(`echo "${escapedPrompt}" | ${command}`,
    {
      maxBuffer: 1024 * 1024 * 50, // 50MB buffer for large responses
      timeout: 300000, // 5 minute timeout
      cwd: options.workdir || process.cwd()
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`[${new Date().toISOString()}] Claude execution error:`, error);
        return res.status(500).json({
          error: 'Claude execution failed',
          details: error.message,
          stderr: stderr,
          command: command.replace(/echo "[^"]*"/, 'echo "[PROMPT]"') // Hide prompt in error logs
        });
      }

      try {
        const result = JSON.parse(stdout);

        // Log success (without showing full response for brevity)
        console.log(`[${new Date().toISOString()}] Claude response received:`, {
          type: result.type,
          duration_ms: result.duration_ms,
          num_turns: result.num_turns,
          total_cost_usd: result.total_cost_usd
        });

        res.json(result);
      } catch (parseError) {
        console.error(`[${new Date().toISOString()}] JSON parse error:`, parseError);
        res.status(500).json({
          error: 'Failed to parse Claude response',
          parseError: parseError.message,
          rawOutput: stdout.substring(0, 1000) + (stdout.length > 1000 ? '...' : ''),
          stderr: stderr
        });
      }
    }
  );
});

// Stream endpoint for real-time Claude responses
app.post('/claude/stream', (req, res) => {
  const { prompt, options = {} } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Set up server-sent events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  let command = 'claude --print --output-format stream-json';

  // Add options similar to above
  if (options.allowedTools && Array.isArray(options.allowedTools)) {
    command += ` --allowed-tools "${options.allowedTools.join(',')}"`;
  }

  if (options.workdir && fs.existsSync(options.workdir)) {
    command = `cd "${options.workdir}" && ${command}`;
  }

  const escapedPrompt = prompt.replace(/"/g, '\\"').replace(/'/g, "\\'");

  console.log(`[${new Date().toISOString()}] Starting Claude stream:`, command);

  const claudeProcess = exec(`echo "${escapedPrompt}" | ${command}`, {
    maxBuffer: 1024 * 1024 * 50,
    cwd: options.workdir || process.cwd()
  });

  claudeProcess.stdout.on('data', (data) => {
    // Send each line as a server-sent event
    const lines = data.toString().split('\\n');
    lines.forEach(line => {
      if (line.trim()) {
        res.write(`data: ${line}\\n\\n`);
      }
    });
  });

  claudeProcess.stderr.on('data', (data) => {
    console.error(`Claude stderr: ${data}`);
    res.write(`data: ${JSON.stringify({ error: data.toString() })}\\n\\n`);
  });

  claudeProcess.on('close', (code) => {
    console.log(`[${new Date().toISOString()}] Claude stream ended with code:`, code);
    res.write(`data: ${JSON.stringify({ type: 'end', code })}\\n\\n`);
    res.end();
  });

  // Handle client disconnect
  req.on('close', () => {
    claudeProcess.kill();
  });
});

// Get Claude version info
app.get('/claude/version', (req, res) => {
  exec('claude --version', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to get Claude version', details: error.message });
    }
    res.json({ version: stdout.trim(), stderr: stderr });
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Server error:`, error);
  res.status(500).json({ error: 'Internal server error', details: error.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Claude Code Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Claude endpoint: POST http://localhost:${PORT}/claude`);
  console.log(`📡 Stream endpoint: POST http://localhost:${PORT}/claude/stream`);
  console.log(`ℹ️  Version endpoint: GET http://localhost:${PORT}/claude/version`);
});