# BloodRadar — Beginner Git & GitHub Workflow

**Course:** CSE 3292 – Website Development  
**Project:** BloodRadar (Emergency Blood Response Network)  
**Team:** Digital Pioneers (Individual Project)  

---

## 1. Initial Local Setup & First Push

Because Windows Command Prompt may require administrator installation for Git CLI, you can use **Git Bash** or the **GitHub Desktop** client. If using Git Bash, run these exact commands in order:

```bash
# 1. Initialize local repository
git init

# 2. Stage all project files (safe: .env.local is already in .gitignore)
git add .

# 3. Create initial commit
git commit -m "feat: complete BloodRadar project foundation and documentation"

# 4. Set main branch
git branch -M main

# 5. Link to your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/your-username/bloodradar.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 2. Feature Branch Workflow (For University Submission Updates)

```bash
# 1. Ensure you are on main and up to date
git checkout main
git pull origin main

# 2. Create and switch to a feature branch
git checkout -b feature/docs-and-polish

# 3. Make small, clear commits
git add .
git commit -m "docs: finalize architecture and deployment guides"

# 4. Push feature branch to GitHub
git push origin feature/docs-and-polish

# 5. On GitHub.com:
# - Open a Pull Request (PR) from feature/docs-and-polish into main
# - Complete your self-review checklist
# - Click "Merge Pull Request"

# 6. Return to local main and pull merged changes
git checkout main
git pull origin main
git branch -d feature/docs-and-polish
```

---

## 3. Pre-Push Security Checklist

Before every push, run this check in your terminal to ensure no real secrets or passwords were accidentally added:
```powershell
Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch "node_modules|\.next|\.git" } | Select-String -Pattern "SUPABASE_SERVICE_ROLE_KEY=[a-zA-Z0-9]"
```
*(If this command returns no output, your repository is completely clean and safe to push.)*
