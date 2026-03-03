# OCF Ops Hub (Local-First)

OCF Ops Hub is a local Streamlit + SQLite tool for Operation Clean Freedom (Houston, TX) to manage clients, leads, follow-up campaigns, holiday lights takedowns, and payment logging.

## Features

- **Client database** with tags, services, notes, and opt-out control.
- **CSV import tools**:
  - Jobber CSV mapping (client + service/job fields)
  - Basic contacts CSV mapping
  - dedupe by phone first, then by name.
- **Lead tracker** with source, cost, status, revenue, and win/loss notes.
- **Dashboard metrics**:
  - close rate by source
  - cost per booked job by source
  - ROI by source
  - month-to-date lead spend
  - refund rate.
- **Campaign queue generator** (manual outreach only):
  - template placeholders: `[Name]`, `[Service]`, `[LastServiceDate]`
  - segment filters
  - queue actions: Mark Sent, Skip, Opt-out
  - CSV/XLSX export.
- **Holiday lights takedown manager** with routing export.
- **Payments log** + end-of-day Zelle transfer summary.

## Project structure

- `app.py` - Streamlit UI and workflows.
- `db.py` - SQLite schema + helper functions + demo seeding.
- `samples/jobber_sample.csv` - sample Jobber-like import file.
- `samples/contacts_sample.csv` - sample basic contacts import file.
- `data/` - SQLite database and temporary exports (auto-created).

## Windows setup (PowerShell)

1. Install Python 3.10+.
2. In the project folder:

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

3. Run the app:

```powershell
streamlit run app.py
```

4. Open the local URL shown in terminal (typically `http://localhost:8501`).

## How to import Jobber CSV

1. In the app, use the **Import Clients** section at the top.
2. Choose **Jobber CSV**.
3. Upload your file (or test with `samples/jobber_sample.csv`).
4. Review the preview table.
5. Click **Confirm import**.
6. Open **Clients** tab and verify imported records.

## How to export reports

- Campaign queue: **Campaigns** tab → choose run → `csv` or `xlsx` → Download.
- Holiday routing: **Holiday Lights** tab → `csv` or `xlsx` → Download routing list.
- Payments: **Payments** tab → `csv` or `xlsx` → Download payment log.

## Demo mode dataset

- Go to **Settings** tab.
- Click **Load demo dataset**.
- Demo seed loads only if the client table is empty.

## Acceptance test walkthrough

1. **Import test**: import `samples/jobber_sample.csv`, confirm clients in **Clients** tab.
2. **Campaign export test**: create a template/run in **Campaigns**, then export queue to `.xlsx`.
3. **Lead ROI test**: add a lead in **Leads**, then see dashboard source metrics update.
4. **Payment transfer test**: add a **Zelle** payment in **Payments**, verify transfer total increases.

## Notes

- App is local-first and stores data in `data/ocf_ops_hub.db`.
- App does **not** send SMS automatically. It generates copy-ready message queues only.
