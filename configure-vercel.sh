#!/bin/bash

# Vercel Deployment Konfiguration Script
# Dieses Script hilft bei der automatischen Konfiguration der GitHub Secrets

set -e

echo "🚀 Hemera Vercel Deployment Konfiguration"
echo "=========================================="
echo ""

# Projekt-IDs anzeigen
echo "📋 Vercel Projekt-Informationen:"
echo "Project ID: prj_kEstjhNCbZ644s0UgQ22MI0AQi4i"
echo "Organization ID: team_zgkd4GJxP3Zhj3ksAwQKn7CG"
echo ""

# Token-Erstellung Anleitung
echo "🔐 Vercel Token erstellen:"
echo "1. Öffnen Sie: https://vercel.com/account/tokens"
echo "2. Klicken Sie 'Create Token'"
echo "3. Name: 'hemera-deployment'"
echo "4. Scope: 'Full Account'"
echo "5. Kopieren Sie das Token"
echo ""

# GitHub Secrets URL
echo "🔧 GitHub Secrets konfigurieren:"
echo "URL: https://github.com/Laparo/hemera/settings/secrets/actions"
echo ""

# Warten auf Token-Eingabe
echo "📝 Bitte geben Sie Ihr Vercel Token ein:"
read -s VERCEL_TOKEN
echo ""

if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ Kein Token eingegeben. Abbruch."
    exit 1
fi

echo "⚙️ Konfiguriere GitHub Secrets..."

# GitHub Secrets setzen
gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN" --repo Laparo/hemera
gh secret set VERCEL_ORG_ID --body "team_zgkd4GJxP3Zhj3ksAwQKn7CG" --repo Laparo/hemera
gh secret set VERCEL_PROJECT_ID --body "prj_kEstjhNCbZ644s0UgQ22MI0AQi4i" --repo Laparo/hemera

echo ""
echo "✅ GitHub Secrets erfolgreich konfiguriert:"
echo "   - VERCEL_TOKEN: ✓"
echo "   - VERCEL_ORG_ID: ✓"
echo "   - VERCEL_PROJECT_ID: ✓"
echo ""

echo "🚀 Deployment starten..."
git commit --allow-empty -m "chore: trigger deployment with configured secrets"
git push origin main

echo ""
echo "🎉 Konfiguration abgeschlossen!"
echo "📊 Deployment Status: https://github.com/Laparo/hemera/actions"
echo "🌐 Vercel Dashboard: https://vercel.com/dashboard"