explorer "C:\Users\hp\OneDrive\Desktop\Replit_Final Dowloads Based On going\Replit_spreadverse_archive"# Plan: Spreadverse Monorepo File Organization

## Goal
Reorganize the Replit archive into a clean monorepo with `server/`, `client/`, `docs/`, `shared/`, and `script/` folders.

## Source
`C:\Users\hp\OneDrive\Desktop\Replit_Final Dowloads Based On going\Replit_spreadverse_archive`

---

## Step 1: Create additional folders at repo root

- [x] `server/`
- [x] `client/`
- [x] `docs/`
- [ ] `shared/`
- [ ] `script/`

## Step 2: Upload folders from archive into repo root

| Source folder        | Destination          |
|----------------------|----------------------|
| `client/`            | `client/` (merge)    |
| `server/`            | `server/` (merge)    |
| `shared/`            | `shared/`            |
| `script/`            | `script/`            |
| `attached_assets/`   | `docs/attached_assets/` |

## Step 3: Place config and doc files

| File                    | Destination                |
|-------------------------|----------------------------|
| `.gitignore`            | root                       |
| `package.json`          | root                       |
| `package-lock.json`     | root                       |
| `tsconfig.json`         | root                       |
| `components.json`       | `client/components.json`   |
| `tailwind.config.ts`    | `client/tailwind.config.ts`|
| `postcss.config.js`     | `client/postcss.config.js` |
| `vite.config.ts`        | `client/vite.config.ts`    |
| `drizzle.config.ts`     | `server/drizzle.config.ts` |
| `design_guidelines.md`  | `docs/design_guidelines.md`|
| `replit.md`             | `docs/replit.md`           |

## Step 4: Skip these files (do NOT upload)

| Item                          | Reason                          |
|-------------------------------|---------------------------------|
| `.local/`                     | Replit internal                 |
| `.config/`                    | Replit internal                 |
| `.replit`                     | Replit-specific, not needed     |
| `.git/`                       | Repo already has its own history|
| `drizzle.config.tts`          | Typo/duplicate                  |
| `project-backup.tar.gz`       | Backup archive, not needed      |
| `spreadverse-backup.tar.gz`   | Backup archive, not needed      |

## Step 5: Verify final structure

```
spreadverse-temp-live/
├── README.md
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── client/
│   ├── components.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── vite.config.ts
│   └── (uploaded client/ contents)
├── server/
│   ├── drizzle.config.ts
│   └── (uploaded server/ contents)
├── shared/
│   └── (uploaded shared/ contents)
├── script/
│   └── (uploaded script/ contents)
└── docs/
    ├── design_guidelines.md
    ├── replit.md
    └── attached_assets/
```

## Step 6: After upload, run cleanup

- Remove `.gitkeep` files from folders that now have content
- Verify no Replit-specific files leaked in
- Commit and push
