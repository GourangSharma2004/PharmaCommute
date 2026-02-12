#!/bin/bash

# Script to push PharmaCommute to GitHub
# Usage: ./push-to-github.sh <github-username> <repo-name>

GITHUB_USERNAME=${1:-"gourangsharma"}
REPO_NAME=${2:-"PharmaCommute"}

echo "🚀 Setting up GitHub repository for PharmaCommute..."
echo "📝 Author: Gourang Sharma"
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Remote 'origin' already exists. Removing it..."
    git remote remove origin
fi

# Add the GitHub remote
echo "➕ Adding GitHub remote..."
git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

# Show the remote
echo "✅ Remote configured:"
git remote -v
echo ""

echo "📤 To push to GitHub, run:"
echo "   git push -u origin main"
echo ""
echo "Or if you haven't created the repo on GitHub yet:"
echo "1. Go to https://github.com/new"
echo "2. Create a repository named: ${REPO_NAME}"
echo "3. Then run: git push -u origin main"
