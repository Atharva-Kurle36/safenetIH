# SafeNet Backend (FastAPI)

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:

   pip install -r requirements.txt

3. Run the API:

   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

## Endpoints

- POST /analyze
- GET /simulate
- GET /health
