import sqlite3
from pathlib import Path
from typing import Optional

import pandas as pd

DB_PATH = Path("data/ocf_ops_hub.db")


def get_conn() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            phone TEXT,
            address TEXT,
            email TEXT,
            tags TEXT,
            last_service_date TEXT,
            services_used TEXT,
            notes TEXT,
            opt_out INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lead_date TEXT NOT NULL,
            source TEXT NOT NULL,
            service_requested TEXT,
            lead_cost REAL DEFAULT 0,
            status TEXT NOT NULL,
            job_revenue REAL DEFAULT 0,
            job_date TEXT,
            notes TEXT,
            refund_amount REAL DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS campaign_templates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            service_hint TEXT,
            template_text TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS campaign_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            template_id INTEGER,
            segment_type TEXT,
            segment_value TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(template_id) REFERENCES campaign_templates(id)
        );

        CREATE TABLE IF NOT EXISTS campaign_queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            run_id INTEGER NOT NULL,
            client_id INTEGER NOT NULL,
            phone TEXT,
            message TEXT,
            status TEXT DEFAULT 'pending',
            sent_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(run_id, client_id),
            FOREIGN KEY(run_id) REFERENCES campaign_runs(id),
            FOREIGN KEY(client_id) REFERENCES clients(id)
        );

        CREATE TABLE IF NOT EXISTS holiday_lights (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER,
            client_name TEXT,
            address TEXT,
            phone TEXT,
            takedown_fee REAL DEFAULT 0,
            status TEXT DEFAULT 'not contacted',
            notes TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(client_id) REFERENCES clients(id)
        );

        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            payment_date TEXT NOT NULL,
            amount REAL NOT NULL,
            client_id INTEGER,
            client_name TEXT,
            method TEXT NOT NULL,
            invoice_ref TEXT,
            notes TEXT,
            transferred INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(client_id) REFERENCES clients(id)
        );
        """
    )
    conn.commit()


def fetch_df(conn: sqlite3.Connection, query: str, params: Optional[tuple] = None) -> pd.DataFrame:
    return pd.read_sql_query(query, conn, params=params or ())


def upsert_clients(conn: sqlite3.Connection, df: pd.DataFrame) -> tuple[int, int]:
    inserted = 0
    updated = 0
    for _, row in df.iterrows():
        name = str(row.get("full_name", "")).strip()
        phone = normalize_phone(row.get("phone", ""))
        if not name and not phone:
            continue

        existing_id = None
        if phone:
            rec = conn.execute("SELECT id FROM clients WHERE REPLACE(REPLACE(REPLACE(phone,'-',''),'(',''),')','') LIKE ? LIMIT 1", (f"%{phone[-10:]}%",)).fetchone()
            if rec:
                existing_id = rec["id"]

        if existing_id is None and name:
            rec = conn.execute("SELECT id FROM clients WHERE lower(full_name)=lower(?) LIMIT 1", (name,)).fetchone()
            if rec:
                existing_id = rec["id"]

        payload = {
            "full_name": name or row.get("full_name", ""),
            "phone": phone,
            "address": row.get("address", ""),
            "email": row.get("email", ""),
            "tags": row.get("tags", ""),
            "last_service_date": row.get("last_service_date", None),
            "services_used": row.get("services_used", ""),
            "notes": row.get("notes", ""),
            "opt_out": int(bool(row.get("opt_out", 0))),
        }

        if existing_id:
            conn.execute(
                """
                UPDATE clients SET
                    full_name=:full_name,
                    phone=COALESCE(NULLIF(:phone,''), phone),
                    address=COALESCE(NULLIF(:address,''), address),
                    email=COALESCE(NULLIF(:email,''), email),
                    tags=COALESCE(NULLIF(:tags,''), tags),
                    last_service_date=COALESCE(NULLIF(:last_service_date,''), last_service_date),
                    services_used=COALESCE(NULLIF(:services_used,''), services_used),
                    notes=TRIM(COALESCE(notes,'' ) || ' | ' || COALESCE(NULLIF(:notes,''),'')),
                    opt_out=:opt_out,
                    updated_at=CURRENT_TIMESTAMP
                WHERE id=:id
                """,
                {**payload, "id": existing_id},
            )
            updated += 1
        else:
            conn.execute(
                """
                INSERT INTO clients (full_name, phone, address, email, tags, last_service_date, services_used, notes, opt_out)
                VALUES (:full_name, :phone, :address, :email, :tags, :last_service_date, :services_used, :notes, :opt_out)
                """,
                payload,
            )
            inserted += 1
    conn.commit()
    return inserted, updated


def normalize_phone(value: str) -> str:
    digits = "".join(ch for ch in str(value or "") if ch.isdigit())
    if len(digits) == 11 and digits.startswith("1"):
        digits = digits[1:]
    return digits


def export_df(df: pd.DataFrame, file_type: str) -> bytes:
    if file_type == "csv":
        return df.to_csv(index=False).encode("utf-8")
    path = Path("data/_temp_export.xlsx")
    df.to_excel(path, index=False)
    data = path.read_bytes()
    path.unlink(missing_ok=True)
    return data


def seed_demo_data(conn: sqlite3.Connection) -> None:
    exists = conn.execute("SELECT 1 FROM clients LIMIT 1").fetchone()
    if exists:
        return
    demo_clients = pd.DataFrame(
        [
            {"full_name": "Maria Johnson", "phone": "7135551111", "address": "1201 Main St, Houston, TX", "email": "maria@example.com", "tags": "repeat", "last_service_date": "2024-09-20", "services_used": "gutter cleaning,window cleaning", "notes": "Prefers Saturday.", "opt_out": 0},
            {"full_name": "Ethan Brooks", "phone": "8325552233", "address": "4550 Heights Blvd, Houston, TX", "email": "", "tags": "holiday", "last_service_date": "2023-12-15", "services_used": "holiday lights", "notes": "Needs takedown call in Jan.", "opt_out": 0},
        ]
    )
    upsert_clients(conn, demo_clients)
    conn.execute(
        "INSERT INTO leads (lead_date,source,service_requested,lead_cost,status,job_revenue,job_date,notes,refund_amount) VALUES (?,?,?,?,?,?,?,?,?)",
        ("2024-10-01", "Thumbtack", "window cleaning", 45, "won", 320, "2024-10-04", "Quick response won lead", 0),
    )
    conn.execute(
        "INSERT INTO payments (payment_date,amount,client_name,method,invoice_ref,notes,transferred) VALUES (?,?,?,?,?,?,?)",
        ("2024-10-04", 320, "Maria Johnson", "Zelle", "INV-1001", "Fall cleaning", 0),
    )
    conn.execute(
        "INSERT INTO campaign_templates (name,service_hint,template_text) VALUES (?,?,?)",
        ("120-day Follow-up", "gutter cleaning", "Hi [Name], it's Operation Clean Freedom checking in. It's been a while since your [Service]. Want a quick quote this week?"),
    )
    conn.commit()
