from datetime import date
import pandas as pd
import streamlit as st

from db import export_df, fetch_df, get_conn, init_db, normalize_phone, seed_demo_data, upsert_clients

st.set_page_config(page_title="OCF Ops Hub", layout="wide")
conn = get_conn()
init_db(conn)

SERVICES = ["gutter cleaning", "window cleaning", "holiday lights", "yard cleanup"]


def parse_import_csv(uploaded, import_type: str) -> pd.DataFrame:
    df = pd.read_csv(uploaded).fillna("")
    cols = {c.lower().strip(): c for c in df.columns}

    def pick(*names):
        for n in names:
            if n in cols:
                return df[cols[n]]
        return ""

    if import_type == "Jobber CSV":
        out = pd.DataFrame(
            {
                "full_name": pick("client", "client name", "name"),
                "phone": pick("phone", "client phone", "primary phone"),
                "address": pick("address", "service address"),
                "email": pick("email", "client email"),
                "services_used": pick("service", "job title", "line item name"),
                "last_service_date": pick("job date", "completed on", "date"),
                "notes": pick("notes", "job notes"),
                "tags": "jobber_import",
                "opt_out": 0,
            }
        )
    else:
        out = pd.DataFrame(
            {
                "full_name": pick("name", "full_name", "full name", "client"),
                "phone": pick("phone", "mobile"),
                "address": pick("address"),
                "email": pick("email"),
                "services_used": pick("service", "services_used"),
                "last_service_date": pick("last_service_date", "last service date"),
                "notes": pick("notes"),
                "tags": pick("tags"),
                "opt_out": 0,
            }
        )
    out["phone"] = out["phone"].apply(normalize_phone)
    return out


def render_dashboard():
    st.header("Dashboard")
    leads = fetch_df(conn, "SELECT * FROM leads")

    if leads.empty:
        st.info("No leads yet. Add leads in the Leads tab.")
        return

    leads["lead_cost"] = pd.to_numeric(leads["lead_cost"], errors="coerce").fillna(0)
    leads["job_revenue"] = pd.to_numeric(leads["job_revenue"], errors="coerce").fillna(0)
    leads["refund_amount"] = pd.to_numeric(leads["refund_amount"], errors="coerce").fillna(0)

    mtd = leads[pd.to_datetime(leads["lead_date"], errors="coerce").dt.to_period("M") == pd.Period(date.today(), "M")]
    st.metric("Total lead spend (MTD)", f"${mtd['lead_cost'].sum():,.2f}")
    refund_rate = (len(leads[leads["status"] == "refunded"]) / len(leads)) * 100 if len(leads) else 0
    st.metric("Refund rate", f"{refund_rate:.1f}%")

    metrics = (
        leads.groupby("source", dropna=False)
        .apply(
            lambda g: pd.Series(
                {
                    "close_rate": (len(g[g["status"] == "won"]) / len(g)) * 100 if len(g) else 0,
                    "cost_per_booked_job": g["lead_cost"].sum() / max(len(g[g["status"] == "won"]), 1),
                    "roi": ((g["job_revenue"].sum() - g["lead_cost"].sum()) / g["lead_cost"].sum() * 100) if g["lead_cost"].sum() else 0,
                }
            )
        )
        .reset_index()
    )
    st.subheader("Lead Performance by Source")
    st.dataframe(metrics, use_container_width=True)


def render_clients():
    st.header("Clients")
    search = st.text_input("Search clients")
    q = "SELECT * FROM clients"
    params = ()
    if search:
        q += " WHERE lower(full_name) LIKE lower(?) OR phone LIKE ? OR lower(tags) LIKE lower(?)"
        like = f"%{search}%"
        params = (like, like, like)
    clients = fetch_df(conn, q + " ORDER BY full_name", params)
    st.dataframe(clients, use_container_width=True, hide_index=True)

    st.subheader("Add / Update Client")
    with st.form("client_form"):
        c1, c2, c3 = st.columns(3)
        full_name = c1.text_input("Full name")
        phone = c2.text_input("Phone")
        email = c3.text_input("Email")
        address = st.text_input("Address")
        tags = st.text_input("Tags (comma separated)")
        last_service_date = st.date_input("Last service date", value=None)
        services_used = st.multiselect("Services used", SERVICES)
        notes = st.text_area("Notes")
        opt_out = st.checkbox("Opt out (do not contact)")
        submitted = st.form_submit_button("Save client")
    if submitted:
        df = pd.DataFrame([
            {
                "full_name": full_name,
                "phone": phone,
                "address": address,
                "email": email,
                "tags": tags,
                "last_service_date": str(last_service_date) if last_service_date else "",
                "services_used": ",".join(services_used),
                "notes": notes,
                "opt_out": int(opt_out),
            }
        ])
        inserted, updated = upsert_clients(conn, df)
        st.success(f"Saved. Inserted {inserted}, updated {updated}.")


def render_import_tools():
    st.subheader("Import Clients")
    import_type = st.selectbox("Import format", ["Jobber CSV", "Basic Contacts CSV"])
    uploaded = st.file_uploader("Upload CSV", type=["csv"], key="import_file")
    if uploaded:
        preview_df = parse_import_csv(uploaded, import_type)
        st.write("Preview")
        st.dataframe(preview_df.head(30), use_container_width=True)
        if st.button("Confirm import"):
            inserted, updated = upsert_clients(conn, preview_df)
            st.success(f"Import complete. Inserted {inserted}, updated {updated}.")


def render_leads():
    st.header("Leads")
    with st.form("lead_form"):
        c1, c2, c3 = st.columns(3)
        lead_date = c1.date_input("Date", value=date.today())
        source = c2.selectbox("Source", ["Thumbtack", "referral", "repeat", "other"])
        service = c3.selectbox("Service requested", SERVICES)
        lead_cost = c1.number_input("Lead cost", min_value=0.0, step=1.0)
        status = c2.selectbox("Status", ["new", "contacted", "won", "lost", "refunded"])
        job_revenue = c3.number_input("Job revenue (if won)", min_value=0.0, step=10.0)
        job_date = c1.date_input("Job date", value=None)
        refund_amount = c2.number_input("Refund amount", min_value=0.0, step=1.0)
        notes = st.text_area("Notes / win-loss reason")
        submitted = st.form_submit_button("Save lead")
    if submitted:
        conn.execute(
            "INSERT INTO leads (lead_date,source,service_requested,lead_cost,status,job_revenue,job_date,notes,refund_amount) VALUES (?,?,?,?,?,?,?,?,?)",
            (str(lead_date), source, service, float(lead_cost), status, float(job_revenue), str(job_date) if job_date else None, notes, float(refund_amount)),
        )
        conn.commit()
        st.success("Lead saved.")

    leads = fetch_df(conn, "SELECT * FROM leads ORDER BY lead_date DESC")
    st.dataframe(leads, use_container_width=True, hide_index=True)


def apply_segment(segment_type: str, segment_value: str) -> pd.DataFrame:
    clients = fetch_df(conn, "SELECT * FROM clients WHERE opt_out = 0")
    if clients.empty:
        return clients
    if segment_type == "last_service_days_gt":
        clients["last_service_date"] = pd.to_datetime(clients["last_service_date"], errors="coerce")
        days = int(segment_value)
        cutoff = pd.Timestamp.today() - pd.Timedelta(days=days)
        return clients[clients["last_service_date"] < cutoff]
    if segment_type == "tag_equals":
        return clients[clients["tags"].str.contains(segment_value, case=False, na=False)]
    if segment_type == "service_contains":
        return clients[clients["services_used"].str.contains(segment_value, case=False, na=False)]
    return clients


def render_campaigns():
    st.header("Campaigns")
    st.caption("Generates a manual outreach queue only. No SMS is sent automatically.")

    with st.form("template_form"):
        t_name = st.text_input("Template name")
        t_service = st.selectbox("Service hint", ["", *SERVICES])
        t_text = st.text_area("Template text", value="Hi [Name], this is Operation Clean Freedom. It's been a while since your [Service] service on [LastServiceDate]. Want a quote?")
        if st.form_submit_button("Save template") and t_name and t_text:
            conn.execute("INSERT INTO campaign_templates (name, service_hint, template_text) VALUES (?,?,?)", (t_name, t_service, t_text))
            conn.commit()
            st.success("Template saved.")

    templates = fetch_df(conn, "SELECT * FROM campaign_templates ORDER BY id DESC")
    st.dataframe(templates, use_container_width=True, hide_index=True)

    if templates.empty:
        return

    st.subheader("Create campaign run")
    run_name = st.text_input("Campaign run name", value=f"Run {date.today()}")
    template_id = st.selectbox("Template", templates["id"].tolist(), format_func=lambda x: templates.loc[templates["id"] == x, "name"].iloc[0])
    seg_type = st.selectbox("Segment type", ["last_service_days_gt", "tag_equals", "service_contains"])
    seg_val = st.text_input("Segment value", value="120" if seg_type == "last_service_days_gt" else "repeat")

    if st.button("Generate queue"):
        selected = templates[templates["id"] == template_id].iloc[0]
        targets = apply_segment(seg_type, seg_val)
        conn.execute("INSERT INTO campaign_runs (name, template_id, segment_type, segment_value) VALUES (?,?,?,?)", (run_name, int(template_id), seg_type, seg_val))
        run_id = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]

        for _, c in targets.iterrows():
            msg = selected["template_text"]
            msg = msg.replace("[Name]", str(c.get("full_name", "")))
            msg = msg.replace("[Service]", selected.get("service_hint") or str(c.get("services_used", "service")))
            msg = msg.replace("[LastServiceDate]", str(c.get("last_service_date", "")))
            conn.execute(
                "INSERT OR IGNORE INTO campaign_queue (run_id, client_id, phone, message, status) VALUES (?,?,?,?,?)",
                (run_id, int(c["id"]), c.get("phone", ""), msg, "pending"),
            )
        conn.commit()
        st.success("Campaign queue generated.")

    runs = fetch_df(conn, "SELECT * FROM campaign_runs ORDER BY id DESC")
    if runs.empty:
        return
    run_pick = st.selectbox("View queue for run", runs["id"].tolist(), format_func=lambda x: runs.loc[runs["id"] == x, "name"].iloc[0])
    queue = fetch_df(conn, "SELECT q.id, c.full_name, q.phone, q.message, q.status FROM campaign_queue q JOIN clients c ON c.id=q.client_id WHERE q.run_id=? ORDER BY q.id", (int(run_pick),))

    for _, row in queue.iterrows():
        with st.expander(f"{row['full_name']} ({row['phone']}) - {row['status']}"):
            st.code(row["message"])
            st.text_input("Copy-ready message", value=row["message"], key=f"msg_{row['id']}")
            c1, c2, c3 = st.columns(3)
            if c1.button("Mark Sent", key=f"sent_{row['id']}"):
                conn.execute("UPDATE campaign_queue SET status='sent', sent_at=CURRENT_TIMESTAMP WHERE id=?", (int(row["id"]),))
                conn.commit()
                st.rerun()
            if c2.button("Skip", key=f"skip_{row['id']}"):
                conn.execute("UPDATE campaign_queue SET status='skipped' WHERE id=?", (int(row["id"]),))
                conn.commit()
                st.rerun()
            if c3.button("Opt-out", key=f"opt_{row['id']}"):
                conn.execute("UPDATE clients SET opt_out=1 WHERE id=(SELECT client_id FROM campaign_queue WHERE id=?)", (int(row["id"]),))
                conn.commit()
                st.rerun()

    fmt = st.radio("Export queue", ["csv", "xlsx"], horizontal=True)
    if st.button("Download queue"):
        file_bytes = export_df(queue, fmt)
        st.download_button("Click to save", data=file_bytes, file_name=f"campaign_queue_{run_pick}.{fmt}")


def render_holiday_lights():
    st.header("Holiday Lights")
    clients = fetch_df(conn, "SELECT id, full_name, address, phone FROM clients ORDER BY full_name")
    with st.form("holiday_form"):
        picked = st.selectbox("Client", [None] + clients["id"].tolist(), format_func=lambda x: "-- manual --" if x is None else clients.loc[clients["id"] == x, "full_name"].iloc[0])
        c_name = st.text_input("Client name", value="" if picked is None else clients.loc[clients["id"] == picked, "full_name"].iloc[0])
        c_addr = st.text_input("Address", value="" if picked is None else clients.loc[clients["id"] == picked, "address"].iloc[0])
        c_phone = st.text_input("Phone", value="" if picked is None else clients.loc[clients["id"] == picked, "phone"].iloc[0])
        fee = st.number_input("Takedown fee", min_value=0.0, step=10.0)
        status = st.selectbox("Status", ["not contacted", "scheduled", "completed"])
        notes = st.text_input("Notes")
        if st.form_submit_button("Save takedown"):
            conn.execute(
                "INSERT INTO holiday_lights (client_id, client_name, address, phone, takedown_fee, status, notes) VALUES (?,?,?,?,?,?,?)",
                (picked, c_name, c_addr, normalize_phone(c_phone), float(fee), status, notes),
            )
            conn.commit()
            st.success("Saved holiday lights item.")

    data = fetch_df(conn, "SELECT * FROM holiday_lights ORDER BY id DESC")
    st.dataframe(data, use_container_width=True)
    fmt = st.radio("Export schedule", ["csv", "xlsx"], horizontal=True, key="holiday_fmt")
    st.download_button("Download routing list", data=export_df(data, fmt), file_name=f"holiday_lights_schedule.{fmt}")


def render_payments():
    st.header("Payments")
    clients = fetch_df(conn, "SELECT id, full_name FROM clients ORDER BY full_name")
    with st.form("payment_form"):
        p_date = st.date_input("Date", value=date.today())
        amount = st.number_input("Amount", min_value=0.0, step=1.0)
        picked = st.selectbox("Client", [None] + clients["id"].tolist(), format_func=lambda x: "-- manual --" if x is None else clients.loc[clients["id"] == x, "full_name"].iloc[0])
        client_name = st.text_input("Client name", value="" if picked is None else clients.loc[clients["id"] == picked, "full_name"].iloc[0])
        method = st.selectbox("Method", ["Zelle", "cash", "card", "check"])
        invoice = st.text_input("Invoice/job reference")
        notes = st.text_input("Notes")
        if st.form_submit_button("Log payment"):
            conn.execute(
                "INSERT INTO payments (payment_date, amount, client_id, client_name, method, invoice_ref, notes) VALUES (?,?,?,?,?,?,?)",
                (str(p_date), float(amount), picked, client_name, method, invoice, notes),
            )
            conn.commit()
            st.success("Payment logged.")

    payments = fetch_df(conn, "SELECT * FROM payments ORDER BY payment_date DESC, id DESC")
    st.dataframe(payments, use_container_width=True)

    st.subheader("End of day transfer list (Zelle)")
    zelle = fetch_df(conn, "SELECT payment_date, client_name, amount, invoice_ref, transferred FROM payments WHERE method='Zelle' ORDER BY payment_date DESC")
    st.dataframe(zelle, use_container_width=True)
    st.metric("Zelle amount to transfer", f"${zelle[zelle['transferred']==0]['amount'].sum() if not zelle.empty else 0:,.2f}")
    fmt = st.radio("Export payments", ["csv", "xlsx"], horizontal=True, key="pay_fmt")
    st.download_button("Download payment log", data=export_df(payments, fmt), file_name=f"payments.{fmt}")


def render_settings():
    st.header("Settings")
    st.write("Use demo mode to quickly populate sample data.")
    if st.button("Load demo dataset"):
        seed_demo_data(conn)
        st.success("Demo data loaded (if database was empty).")


st.title("OCF Ops Hub")
st.caption("Operation Clean Freedom · Houston, TX")

render_import_tools()

tabs = st.tabs(["Dashboard", "Clients", "Leads", "Campaigns", "Holiday Lights", "Payments", "Settings"])
with tabs[0]:
    render_dashboard()
with tabs[1]:
    render_clients()
with tabs[2]:
    render_leads()
with tabs[3]:
    render_campaigns()
with tabs[4]:
    render_holiday_lights()
with tabs[5]:
    render_payments()
with tabs[6]:
    render_settings()
