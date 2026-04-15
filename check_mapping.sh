#!/bin/bash
echo "🔍 AUDITING V1.1.1 MAPPING..."
echo "--------------------------------"

# 1. Check Entry Points
echo -n "[1/3] Entry Point: dist/index.js... "
[ -f "dist/index.js" ] && echo "✅ FOUND" || echo "❌ MISSING"

echo -n "[2/3] Server Entry: dist/server/index.js... "
[ -f "dist/server/index.js" ] && echo "✅ FOUND" || echo "❌ MISSING"

# 2. Check Core Libraries (The "Connection" Logic)
echo -n "[3/3] Library: Whisper... "
[ -d "dist/short-creator/libraries" ] && echo "✅ FOUND" || echo "❌ MISSING"

echo "--------------------------------"
echo "🚀 CONNECTION MAP STATUS:"
if [ -f "dist/index.js" ] && [ -d "dist/short-creator/libraries" ]; then
    echo "READY: Docker can map 'node dist/index.js' correctly."
else
    echo "ERROR: Your 'dist' folder is incomplete. Run 'npm run build' first."
fi
