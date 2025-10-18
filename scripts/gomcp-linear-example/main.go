package main

import (
	"fmt"
	"log"
	"os"

	"github.com/localrivet/gomcp/client"
)

func main() {
	// Hinweis: LINEAR_API_TOKEN muss gesetzt sein (per Env oder via macOS Keychain-Wrapper)
	token := os.Getenv("LINEAR_API_TOKEN")
	if token == "" {
		log.Println("WARN: LINEAR_API_TOKEN ist leer – setze es per Env oder Keychain-Wrapper.")
	}

	cfg := client.ServerConfig{
		MCPServers: map[string]client.ServerDefinition{
			"linear": {
				Command: "npx",
				Args:    []string{"-y", "@tacticlaunch/mcp-linear"},
				Env: map[string]string{
					"LINEAR_API_TOKEN": "${LINEAR_API_TOKEN}",
				},
			},
		},
	}

	c, err := client.NewClient(
		"gomcp-linear-example",
		client.WithServers(cfg, "linear"),
	)
	if err != nil {
		log.Fatalf("Client-Erstellung fehlgeschlagen: %v", err)
	}
	defer c.Close()

	// 1) Tool-Discovery: verfügbare Tools vom Linear-Server abrufen
	if tools, err := c.ListTools(); err != nil {
		log.Printf("WARN: Konnte Tools nicht auflisten: %v", err)
	} else {
		fmt.Println("Verfügbare Tools:")
		for _, t := range tools {
			// t.Name und t.Description sind erwartete Felder in der Tool-Definition
			fmt.Printf("- %s: %s\n", t.Name, t.Description)
		}
	}

	res, err := c.CallTool("list_issues", map[string]any{
		"team": "Frontend",
	})
	if err != nil {
		log.Fatalf("Tool-Aufruf fehlgeschlagen: %v", err)
	}
	fmt.Printf("Result: %v\n", res)
}
