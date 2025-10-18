# Linear MCP Server – Installation & Nutzung

Kurzanleitung, um den Linear Model Context Protocol (MCP) Server lokal zu installieren und in
gängigen Clients (Cursor, Claude Desktop/VS Code) zu verwenden.

## Voraussetzungen

- Node.js ≥ 18 (Repo verwendet 22.x; lokal sollte ≥18 ausreichen)
- Linear Personal API Key

### Linear API Key erstellen

1. In Linear anmelden: <https://linear.app>
2. Avatar (oben links) → Settings
3. Security & access → Personal API Keys → „New API Key“
4. Key benennen (z. B. „MCP Linear Integration“) und sicher kopieren.

## Installation

Global installieren (CLI `mcp-linear`):

```bash
npm i -g @tacticlaunch/mcp-linear
```

Überprüfen:

```bash
mcp-linear --version
```

## Starten

- Entweder als CLI-Argument:

```bash
mcp-linear --token YOUR_LINEAR_API_TOKEN
```

- Oder via Umgebungsvariable:

```bash
export LINEAR_API_TOKEN=YOUR_LINEAR_API_TOKEN
mcp-linear
```

## Einbindung in Clients

Du kannst den Server mit `npx` in Client-Settings einbinden, ohne globales Installieren.
Beispiel-Konfigurationen:

### Cursor (`~/.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@tacticlaunch/mcp-linear"],
      "env": {
        "LINEAR_API_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

### Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@tacticlaunch/mcp-linear"],
      "env": {
        "LINEAR_API_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

### Claude VS Code Extension

Datei:
`~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@tacticlaunch/mcp-linear"],
      "env": {
        "LINEAR_API_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

### GoMCP (CLI)

Konfigurationsdatei: `~/.config/gomcp/config.yaml`

Einfache Variante (Env im File – nur lokal):

```yaml
servers:
  linear:
    command: npx
    args:
      - -y
      - @tacticlaunch/mcp-linear
    env:
      LINEAR_API_TOKEN: YOUR_LINEAR_API_TOKEN
```

Sichere Variante (macOS Keychain, kein Klartext im File):

```yaml
servers:
  linear:
    command: bash
    args:
      - -lc
      - |
        TOKEN=$(security find-generic-password -a 'abb@laparo.bizR' -s 'LINEAR_API_TOKEN' -w 2>/dev/null); STATUS=$?; if [ $STATUS -ne 0 ] || [ -z "$TOKEN" ]; then echo 'LINEAR_API_TOKEN not accessible in Keychain for account abb@laparo.bizR' >&2; exit 1; fi; LINEAR_API_TOKEN="$TOKEN" npx -y @tacticlaunch/mcp-linear
```

Start:

```bash
gomcp linear
```

## Troubleshooting

- „Linear API token not found“: Token als `--token` oder `LINEAR_API_TOKEN` setzen.
- Netzwerkeinschränkungen/Proxy: `HTTPS_PROXY`/`HTTP_PROXY` setzen.
- Node-Version: Sicherstellen, dass `node -v` ≥ 18 ist.

## Sicherheit

- API Token niemals ins Repo einchecken.
- Für CI/Automatisierung Secrets in GitHub Actions als `LINEAR_API_TOKEN` setzen.

## Quellen

- Paket: <https://www.npmjs.com/package/@tacticlaunch/mcp-linear>
- Repo: <https://github.com/tacticlaunch/mcp-linear>
