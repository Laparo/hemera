# Qodo Aware MCP – Setup (VS Code)

This guide integrates Qodo Aware as an MCP server in VS Code so that Copilot/Claude can use Qodo
tools via MCP.

## Prerequisites

- Qodo Aware Client Domain (e.g., `aware.example.qodo.ai`)
- Qodo Aware API token (personal or workspace token)
- Node.js 22.x (see `.nvmrc`/`package.json`)
- VS Code (with MCP-capable client such as GitHub Copilot Chat / Claude Code)

## Configuration

1. Set environment variables locally (zsh):
   - In your shell session or in `.env.local` (do not commit!)
   - Required:
     - `QODO_AWARE_TOKEN` (the raw token)

2. VS Code MCP server entry (pre-created): `.vscode/mcp.json`
   - Server name: `qodo-aware`
   - Put your domain into the URL: `https://<QODO_AWARE_CLIENT_DOMAIN>/mcp/` → e.g.,
     `https://aware.example.qodo.ai/mcp/`
   - The auth header value comes from `AUTH_TOKEN`, which we set via env as
     `Bearer <QODO_AWARE_TOKEN>`.

> Important: `.vscode/mcp.json` only contains a placeholder for `AUTH_TOKEN`. The real token is
> provided via env.

### Example: Shell setup (zsh)

Add the following exports to your current session (or to `~/.zshrc`, then restart the terminal):

```sh
export QODO_AWARE_TOKEN="<YOUR_SECRET_TOKEN>"
# The MCP server uses AUTH_TOKEN for the Authorization header
export AUTH_TOKEN="Bearer ${QODO_AWARE_TOKEN}"
```

Alternatively, configure the MCP server environment in VS Code settings if your client supports it.

## Verification

- Reload VS Code.
- In the Copilot/Claude MCP panel, verify that `qodo-aware` starts.
- Expected: The server exposes Qodo Aware resources/tools (e.g., code search, PR analysis, etc.).
- If auth errors occur: verify the header (must start with `Bearer`) and ensure the domain is
  correct in `QODO_AWARE_CLIENT_DOMAIN`.

## Troubleshooting

- 401/403: Token expired or invalid → generate a new token in Qodo and set `AUTH_TOKEN` again.
- ENOTFOUND/ECONNREFUSED: Check the domain (e.g., `aware.example.qodo.ai`), consider firewall/VPN.
- `mcp-remote` not found: Ensure `npx` is available (Node 22.x installed) and you have internet
  access.

## Security notes

- Never commit tokens. `.env.local` is covered by `.gitignore`.
- Prefer a separate workspace token with minimal privileges.
- Revoke tokens that are no longer needed.

## Uninstall

- Remove the `qodo-aware` block from `.vscode/mcp.json`.
- Remove related env variables from your shell configuration.
