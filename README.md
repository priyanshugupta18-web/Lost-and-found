# 🔍 Lost & Found Web App
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=flat)

## About
A web platform where users can post lost or found items,
browse listings, and connect with each other to recover belongings.

##  Live Demo
> Coming soon...

##  Features
- User registration & login (Firebase Auth)
- Post lost or found items with photos
- Browse & search all listings
- User dashboard to manage posts
- Admin panel to moderate content
- Mobile responsive design

##  Tech Stack
| Layer     | Technology        |
|-----------|-------------------|
| Frontend  | HTML, CSS, JS     |
| Auth      | Firebase Auth     |
| Database  | Cloud Firestore   |
| Storage   | Firebase Storage  |
| Hosting   | Firebase Hosting  |

<h1>Folder Structure</h1>
<pre>
lost-and-found/
│
├── index.html
│
├── auth/
│   ├── login.html
│   ├── signup.html
│   └── forgot-password.html
│
├── pages/
│   ├── browse.html
│   ├── post-item.html
│   ├── item-detail.html
│   ├── about.html
│   ├── contact.html
│   └── faq.html
│
├── dashboard/
│   ├── index.html
│   ├── my-posts.html
│   ├── profile.html
│   └── notifications.html
│
├── admin/
│   ├── index.html
│   ├── manage-posts.html
│   └── manage-users.html
│
├── css/
│   ├── style.css
│   ├── components.css
│   ├── auth.css
│   ├── browse.css
│   ├── post-item.css
│   ├── item-detail.css
│   ├── dashboard.css
│   └── admin.css
│
├── js/
│   ├── firebase-config.js
│   ├── main.js
│   ├── login.js
│   ├── signup.js
│   ├── forgot-password.js
│   ├── browse.js
│   ├── post-item.js
│   ├── item-detail.js
│   ├── dashboard.js
│   ├── my-posts.js
│   ├── profile.js
│   ├── notifications.js
│   ├── admin.js
│   ├── manage-posts.js
│   └── manage-users.js
│
└── assets/
    ├── images/
    │   ├── logo.png
    │   └── hero-bg.jpg
    └── icons/
        └── categories/
</pre>

##  Getting Started
1. Clone the repo
   git clone https://github.com/priyanshugupta18-web/lost-and-found.git
3. Open index.html in your browser
4. Add your Firebase config in js/firebase-config.js


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

