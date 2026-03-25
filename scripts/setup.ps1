param(
    [switch]$SkipNodeInstall,
    [switch]$SkipPythonInstall
)

Write-Host "Running SafeNet setup (PowerShell)"

if (-not $SkipPythonInstall) {
    if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
        Write-Warning "Python is not on PATH. Please install Python 3.8+ and rerun this script."
    } else {
        $venvPath = Join-Path $PSScriptRoot "..\backend\.venv"
        if (-not (Test-Path $venvPath)) {
            Write-Host "Creating Python virtual environment at backend\.venv"
            python -m venv (Join-Path $PSScriptRoot "..\backend\.venv")
        } else {
            Write-Host "Virtual environment already exists at backend\.venv"
        }

        Write-Host "Activating virtual environment and installing Python dependencies"
        & (Join-Path $PSScriptRoot "..\backend\.venv\Scripts\Activate.ps1")
        pip install --upgrade pip
        pip install -r (Join-Path $PSScriptRoot "..\backend\requirements.txt")
    }
}

if (-not $SkipNodeInstall) {
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Warning "npm is not on PATH. Please install Node.js (which includes npm) and rerun this script."
    } else {
        Write-Host "Installing frontend dependencies (npm)"
        Push-Location (Join-Path $PSScriptRoot "..")
        npm install
        Pop-Location
    }
}

Write-Host "Setup complete. See README.md for next steps."
