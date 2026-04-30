use rusqlite::{params, Connection};
use std::sync::Mutex;
use tauri::State;
use chrono::Local;
use crate::models::{DashboardStats, Repair};

pub struct DbState {
    pub conn: Mutex<Connection>,
}

#[tauri::command]
pub fn add_repair(
    state: State<DbState>,
    customer_name: String,
    customer_phone: String,
    device_type: String,
    device_model: String,
    issue_desc: String,
    deposit_paid: f64,
    est_cost: f64,
    notes: Option<String>,
) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    // Generate Repair ID: PR-YYYYMMDD-###
    let today = Local::now().format("%Y%m%d").to_string();
    
    // Count today's repairs to get the next seq number
    let count: i64 = conn.query_row(
        "SELECT COUNT(*) FROM repairs WHERE date(created_at) = date('now', 'localtime')",
        [],
        |row| row.get(0),
    ).unwrap_or(0);
    
    let repair_id = format!("PR-{}-{:03}", today, count + 1);

    conn.execute(
        "INSERT INTO repairs (
            repair_id, customer_name, customer_phone, device_type, device_model,
            issue_desc, deposit_paid, est_cost, status, notes
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'Pending', ?9)",
        params![
            repair_id, customer_name, customer_phone, device_type, device_model,
            issue_desc, deposit_paid, est_cost, notes
        ],
    ).map_err(|e| e.to_string())?;

    Ok(repair_id)
}

#[tauri::command]
pub fn get_repairs(state: State<DbState>) -> Result<Vec<Repair>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare("SELECT id, repair_id, customer_name, customer_phone, device_type, device_model, issue_desc, deposit_paid, est_cost, actual_cost, status, notes, created_at, updated_at FROM repairs ORDER BY created_at DESC").map_err(|e| e.to_string())?;
    
    let repairs = stmt.query_map([], |row| {
        Ok(Repair {
            id: row.get(0)?,
            repair_id: row.get(1)?,
            customer_name: row.get(2)?,
            customer_phone: row.get(3)?,
            device_type: row.get(4)?,
            device_model: row.get(5)?,
            issue_desc: row.get(6)?,
            deposit_paid: row.get(7)?,
            est_cost: row.get(8)?,
            actual_cost: row.get(9)?,
            status: row.get(10)?,
            notes: row.get(11)?,
            created_at: row.get(12)?,
            updated_at: row.get(13)?,
        })
    }).map_err(|e| e.to_string())?
    .filter_map(Result::ok)
    .collect();

    Ok(repairs)
}

#[tauri::command]
pub fn update_repair_status(
    state: State<DbState>,
    id: i64,
    status: String,
    actual_cost: Option<f64>
) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    if let Some(cost) = actual_cost {
        conn.execute(
            "UPDATE repairs SET status = ?1, actual_cost = ?2, updated_at = CURRENT_TIMESTAMP WHERE id = ?3",
            params![status, cost, id],
        ).map_err(|e| e.to_string())?;
    } else {
         conn.execute(
            "UPDATE repairs SET status = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2",
            params![status, id],
        ).map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub fn delete_repair(state: State<DbState>, id: i64) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM repairs WHERE id = ?1", params![id]).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_dashboard_stats(state: State<DbState>) -> Result<DashboardStats, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    let total_today: i64 = conn.query_row(
        "SELECT COUNT(*) FROM repairs WHERE date(created_at) = date('now', 'localtime')",
        [],
        |row| row.get(0),
    ).unwrap_or(0);

    let total_month: i64 = conn.query_row(
        "SELECT COUNT(*) FROM repairs WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now', 'localtime')",
        [],
        |row| row.get(0),
    ).unwrap_or(0);

    // Revenue is deposits from non-delivered + total cost from delivered
    let revenue_deposits: f64 = conn.query_row(
        "SELECT COALESCE(SUM(deposit_paid), 0) FROM repairs WHERE status != 'Delivered'",
        [],
        |row| row.get(0)
    ).unwrap_or(0.0);

    let revenue_delivered: f64 = conn.query_row(
        "SELECT COALESCE(SUM(MAX(est_cost, actual_cost)), 0) FROM repairs WHERE status = 'Delivered'",
        [],
        |row| row.get(0)
    ).unwrap_or(0.0);

    let total_revenue = revenue_deposits + revenue_delivered;

    Ok(DashboardStats {
        total_repairs_today: total_today,
        total_repairs_month: total_month,
        revenue: total_revenue,
        costs: 0.0,
        net_profit: total_revenue,
    })
}
