#!/bin/bash

# Vercel Token direkt über Environment Variable setzen
# Führen Sie dieses Script aus, nachdem Sie das Token von vercel.com/account/tokens kopiert haben

echo "🚀 Schnelle Vercel Konfiguration für hemera"
echo ""

if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ Bitte setzen Sie die VERCEL_TOKEN Umgebungsvariable:"
    echo "   export VERCEL_TOKEN='your_token_here'"
    echo "   ./quick-setup.sh"
    exit 1
fi

echo "⚙️ Konfiguriere GitHub Secrets..."

# GitHub Secrets setzen
gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN" --repo Laparo/hemera
gh secret set VERCEL_ORG_ID --body "team_zgkd4GJxP3Zhj3ksAwQKn7CG" --repo Laparo/hemera
gh secret set VERCEL_PROJECT_ID --body "prj_kEstjhNCbZ644s0UgQ22MI0AQi4i" --repo Laparo/hemera

echo "✅ Secrets konfiguriert!"

# Deployment auslösen
git commit --allow-empty -m "chore: trigger deployment with configured secrets"
git push origin main

echo "🎉 Deployment gestartet!"
echo "📊 Status: https://github.com/Laparo/hemera/actions"