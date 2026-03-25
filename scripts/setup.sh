#!/usr/bin/env bash
set -euo pipefail

echo "Running SafeNet setup (Unix shell)"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

SKIP_PY=${SKIP_PY:-0}
SKIP_NODE=${SKIP_NODE:-0}

if [ "$SKIP_PY" -eq 0 ]; then
  if ! command -v python3 >/dev/null 2>&1 && ! command -v python >/dev/null 2>&1; then
    echo "Warning: Python not found on PATH. Please install Python 3.8+."
  else
    PY_CMD=python3
    if ! command -v python3 >/dev/null 2>&1; then
      PY_CMD=python
    fi
    VENV_PATH="$ROOT_DIR/backend/.venv"
    if [ ! -d "$VENV_PATH" ]; then
      echo "Creating Python virtual environment at backend/.venv"
      $PY_CMD -m venv "$VENV_PATH"
    else
      echo "Virtual environment already exists at backend/.venv"
    fi
    echo "Activating venv and installing Python dependencies"
    # shellcheck source=/dev/null
    source "$VENV_PATH/bin/activate"
    pip install --upgrade pip
    pip install -r "$ROOT_DIR/backend/requirements.txt"
  fi
fi

if [ "$SKIP_NODE" -eq 0 ]; then
  if ! command -v npm >/dev/null 2>&1; then
    echo "Warning: npm not found on PATH. Please install Node.js (which includes npm)."
  else
    echo "Installing frontend dependencies (npm)"
    (cd "$ROOT_DIR" && npm install)
  fi
fi

echo "Setup complete. See README.md for next steps."
