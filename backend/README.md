# SafeNet Backend (FastAPI)

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:

   pip install -r requirements.txt

3. Run the API:

   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

## MongoDB Persistence (Optional but recommended)

To keep dashboard metrics and event logs permanently, configure MongoDB:

1. Start MongoDB locally (or use MongoDB Atlas).
2. Set environment variables before starting backend:

   MONGO_URI=mongodb://127.0.0.1:27017
   MONGO_DB_NAME=safenet

3. Use the same `MONGO_URI` in MongoDB Compass to inspect collections.

When MongoDB is connected, backend writes telemetry to:
- `analysis_events`
- `simulation_events`

If MongoDB is not reachable, backend falls back to in-memory telemetry.

## Endpoints

- POST /analyze
- GET /simulate
- GET /health
