# GitHub Setup Guide

This guide will help you push your BeliLite project to a private GitHub repository.

## 📋 Prerequisites

- Git installed on your machine
- A GitHub account
- Your code is ready and tested

## 🚀 Step-by-Step Setup

### Step 1: Create a Private Repository on GitHub

1. Go to [github.com](https://github.com)
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `BeliLite` (or your preferred name)
4. Description: "A lightweight note-taking app with Grok AI integration"
5. **Select "Private"** (important for keeping your code secure)
6. **Don't** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

### Step 2: Initialize Git (if not already done)

```bash
# Check if git is already initialized
git status

# If not initialized, run:
git init
```

### Step 3: Add All Files

```bash
# Add all files to staging
git add .

# Check what will be committed
git status
```

**Important**: Make sure `.env` and `node_modules/` are NOT included (they should be in `.gitignore`)

### Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: BeliLite note-taking app with Docker support"
```

### Step 5: Connect to GitHub Repository

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/BeliLite.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/BeliLite.git
```

### Step 6: Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

You'll be prompted for your GitHub credentials.

## 📁 Files to Include in Git

✅ **Include these files:**
- `server.js`
- `package.json`
- `package-lock.json`
- `public/` (all frontend files)
- `Dockerfile`
- `.dockerignore`
- `docker-compose.yml`
- `README.md`
- `TROUBLESHOOTING.md`
- `DOCKER_GUIDE.md`
- `GITHUB_SETUP.md`
- `.gitignore`

❌ **Don't include (already in .gitignore):**
- `node_modules/`
- `.env` (contains your API keys!)
- `notes.db` or `data/` (database files)
- `.DS_Store` and other OS files

## 🔐 Security Checklist

Before pushing, verify:

- [ ] `.env` file is NOT in the repository
- [ ] API keys are NOT hardcoded in any files
- [ ] `.gitignore` includes `.env`, `node_modules/`, `*.db`
- [ ] Repository is set to **Private**
- [ ] No sensitive data in commit history

## 🔄 Making Future Changes

After your initial push, use this workflow:

```bash
# 1. Check what changed
git status

# 2. Add changed files
git add .

# 3. Commit with a descriptive message
git commit -m "Description of your changes"

# 4. Push to GitHub
git push
```

## 📝 Good Commit Messages

Write clear, descriptive commit messages:

```bash
# Good examples:
git commit -m "Add Docker support with docker-compose"
git commit -m "Fix xAI API endpoint configuration"
git commit -m "Update README with Docker instructions"
git commit -m "Add error handling for API failures"

# Bad examples:
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

## 🐛 Troubleshooting

### Authentication Issues

If you get authentication errors:

**Option 1: Use Personal Access Token**
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` permissions
3. Use token as password when pushing

**Option 2: Use SSH**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: Settings → SSH and GPG keys
# Then use SSH URL for remote
```

### "Repository not found" Error

- Check repository name matches
- Verify repository exists on GitHub
- Check you have access (if it's a private repo)

### Large Files Warning

If you accidentally committed large files:
```bash
# Remove from git (but keep locally)
git rm --cached large-file.db

# Commit the removal
git commit -m "Remove large database file"

# Push
git push
```

## 📚 Additional Resources

- [GitHub Docs](https://docs.github.com)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [GitHub CLI](https://cli.github.com) (alternative to web interface)

## ✅ Final Checklist

Before considering your setup complete:

- [ ] Repository created on GitHub (private)
- [ ] All code files committed
- [ ] `.env` and sensitive files excluded
- [ ] README is complete and helpful
- [ ] Docker files included
- [ ] Code pushed successfully
- [ ] Can clone and run on another machine

## 🎉 You're Done!

Your BeliLite app is now on GitHub! You can:
- Share the repository (if you make it public later)
- Clone it on other machines
- Deploy it to cloud platforms
- Collaborate with others
- Track your project's history

