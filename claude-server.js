const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'claude-code-server' });
});

// Claude Code execution endpoint
app.post('/claude', (req, res) => {
  const { prompt, options = {} } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Build Claude command with options
  let command = 'claude --print --output-format json';

  if (options.allowedTools) {
    command += ` --allowed-tools "${options.allowedTools.join(',')}"`;
  }

  if (options.workdir) {
    command = `cd "${options.workdir}" && ${command}`;
  }

  // Execute Claude with the prompt
  exec(`echo "${prompt.replace(/"/g, '\\"')}" | ${command}`,
    { maxBuffer: 1024 * 1024 * 10 }, // 10MB buffer
    (error, stdout, stderr) => {
      if (error) {
        console.error('Claude execution error:', error);
        return res.status(500).json({
          error: 'Claude execution failed',
          details: error.message,
          stderr: stderr
        });
      }

      try {
        const result = JSON.parse(stdout);
        res.json(result);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        res.status(500).json({
          error: 'Failed to parse Claude response',
          rawOutput: stdout,
          stderr: stderr
        });
      }
    }
  );
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Claude Code Server running on port ${PORT}`);
});