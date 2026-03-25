# SafeNet — Setup

This repository contains a React frontend and a FastAPI backend. The repo includes helper scripts to install dependencies and prepare a Python virtual environment.

Files:
- File: [scripts/setup.ps1](scripts/setup.ps1)
- File: [scripts/setup.sh](scripts/setup.sh)
- File: [backend/requirements.txt](backend/requirements.txt)
- File: [backend/README.md](backend/README.md)

Quick start (Windows PowerShell):

1. Open PowerShell as your normal user (avoid Administrator unless needed).
2. Run the setup script:

```
powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
```

Quick start (macOS / Linux):

1. Open a terminal.
2. Make the script executable (one time):

```
chmod +x scripts/setup.sh
```

3. Run the script:

```
./scripts/setup.sh
```

What the scripts do:
- Create a Python virtual environment at `backend/.venv` (if missing).
- Install Python dependencies from `backend/requirements.txt` into the venv.
- Run `npm install` in the repository root to fetch frontend dependencies.

Next steps (after setup):
- Start the frontend dev server:

```
npm run dev
```

- Start the backend (inside the Python virtual environment):

Windows PowerShell (activate venv):

```
.\backend\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

macOS / Linux (activate venv):

```
source backend/.venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Notes:
- If Python or Node.js are not on PATH the scripts will warn and print manual instructions.
- If you prefer to manage Python versions with `pyenv` or `conda`, create/activate your environment and then run `pip install -r backend/requirements.txt` manually.

See [backend/README.md](backend/README.md) for backend-specific environment variables (MongoDB URI, DB name).
