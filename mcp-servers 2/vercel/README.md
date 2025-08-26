# Vercel MCP Server for Claude Code

This MCP server provides Vercel API integration for Claude Code, allowing you to manage deployments, projects, and environments directly from Claude.

## Setup Instructions

### 1. Get your Vercel API Token

1. Go to https://vercel.com/account/tokens
2. Create a new token with appropriate permissions
3. Copy the token

### 2. Configure the Server

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Vercel API token:
   ```
   VERCEL_API_TOKEN=your_actual_token_here
   ```

### 3. Build the Server

```bash
npm install
npm run build
```

### 4. Connect to Claude Code

To use this MCP server with Claude Code, you have two options:

#### Option A: Direct stdio connection (Recommended)

Run this command in Claude Code:
```
/connect mcp --path /Users/hsiereveld/Desktop/ai-dev/CS-Boilerplate/cs-master/mcp-servers/vercel/build/index.js
```

#### Option B: HTTP proxy connection

1. Install the MCP proxy globally:
   ```bash
   npm install -g @modelcontextprotocol/proxy
   ```

2. Start the proxy server:
   ```bash
   cd /Users/hsiereveld/Desktop/ai-dev/CS-Boilerplate/cs-master/mcp-servers/vercel
   mcp-proxy --stdio --cmd "node build/index.js" --port 3399
   ```

3. Connect in Claude Code:
   ```
   /connect mcp --url http://localhost:3399
   ```

## Available Tools

Once connected, you can use these Vercel tools:

### Deployment Management
- `vercel-list-all-deployments` - List your deployments
- `vercel-get-deployment` - Get deployment details
- `vercel-create-deployment` - Create new deployments

### Project Management
- `vercel-list-projects` - List all projects
- `vercel-find-project` - Find a specific project
- `vercel-create-project` - Create a new project
- `vercel-create-environment-variables` - Set environment variables

### Environment Management
- `vercel-get-environments` - Get environment variables
- `vercel-create-custom-environment` - Create custom environments

### Team Management
- `vercel-list-all-teams` - List your teams
- `vercel-create-team` - Create a new team

## Usage Examples

After connecting, you can ask Claude:

- "List my recent Vercel deployments"
- "Deploy my project to Vercel"
- "Show me the environment variables for my project"
- "Create a new Vercel project"

## Troubleshooting

If the connection fails:

1. Ensure the `.env` file exists with your token
2. Check that the build completed successfully
3. Verify the path to the server is correct
4. Try the HTTP proxy method if stdio doesn't work

## Your CareService Platform Integration

This MCP server is now set up specifically for your CareService platform project. You can use it to:

- Deploy your CareService platform to Vercel
- Manage environment variables for different environments
- Monitor deployment status
- Create new projects for microservices or test environments