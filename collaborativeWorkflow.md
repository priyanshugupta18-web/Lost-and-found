# Collaborative Workflow Using Git and GitHub

## 1. Introduction

Git and GitHub are essential tools for team-based software development. Git is a version control system, while GitHub is a platform to host Git repositories and collaborate with others.

This document explains a clean, real-world collaborative workflow used in projects.

---

## 2. Key Concepts

### Git

* Version control system
* Tracks changes in code
* Works locally on your system

### GitHub

* Cloud platform for Git repositories
* Enables collaboration
* Provides features like Pull Requests, Issues, and Actions

---

## 3. Basic Git Workflow (Single Developer)

1. Initialize repository

```bash
git init
```

2. Add files

```bash
git add .
```

3. Commit changes

```bash
git commit -m "Initial commit"
```

4. Push to GitHub

```bash
git push origin main
```

---

## 4. Collaborative Workflow (Team-Based)

This is the most important section for real projects.

### Step 1: Clone Repository

Each developer clones the repo:

```bash
git clone <repo-url>
```

---

### Step 2: Create a New Branch

Never work directly on main branch.

```bash
git checkout -b feature-login
```

Branch naming examples:

* feature/navbar
* bugfix/login-error
* feature/todo-ui

---

### Step 3: Make Changes

Develop your feature locally.

---

### Step 4: Stage and Commit

```bash
git add .
git commit -m "Added login feature"
```

---

### Step 5: Push Branch to GitHub

```bash
git push origin feature-login
```

---

### Step 6: Create Pull Request (PR)

On GitHub:

* Open repository
* Click "Compare & Pull Request"
* Add description of changes

---

### Step 7: Code Review

Team members:

* Review code
* Suggest changes
* Approve PR

---

### Step 8: Merge PR

After approval:

* Merge feature branch into main

---

### Step 9: Update Local Repo

```bash
git checkout main
git pull origin main
```

---

## 5. Important Git Commands

### Check status

```bash
git status
```

### View commit history

```bash
git log
```

### Switch branch

```bash
git checkout main
```

### Delete branch

```bash
git branch -d feature-login
```

---

## 6. Best Practices

### 1. Always use branches

Never commit directly to main.

### 2. Write meaningful commit messages

Bad:

* "fix"

Good:

* "Fixed login validation bug"

### 3. Pull before starting work

```bash
git pull origin main
```

### 4. Small commits

Keep commits small and focused.

### 5. Use Pull Requests for all changes

Even for small fixes.

---

## 7. Common Team Workflow Example

1. Team lead creates repo
2. Members clone repo
3. Each member creates feature branch
4. Work independently
5. Push branch
6. Create PR
7. Review & merge
8. Sync with main branch

---

## 8. Handling Merge Conflicts

When same file is edited by multiple people:

Steps:

1. Git shows conflict
2. Open file
3. Manually fix code
4. Add file again

```bash
git add .
```

5. Commit merge

```bash
git commit
```

---

## 9. GitHub Features You Should Know

* Pull Requests (PR)
* Issues (bug tracking)
* Projects (task management)
* Actions (CI/CD automation)

---

## 10. Real Project Workflow Summary

> Branch → Work → Commit → Push → PR → Review → Merge → Sync

---

## for deep dive into git and GitHub refer this website
[click here](https://priyanshugupta18-web.github.io/Git-and-GitHub-Documentation-Website/)
