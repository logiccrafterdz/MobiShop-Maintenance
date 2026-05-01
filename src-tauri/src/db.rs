use rusqlite::{Connection, Result};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

pub fn init_db(app: &AppHandle) -> Result<Connection> {
    let app_dir = app.path().app_data_dir().expect("Failed to get app data dir");
    
    if !app_dir.exists() {
        fs::create_dir_all(&app_dir).expect("Failed to create app data directory");
    }

    let db_path: PathBuf = app_dir.join("mobishop.db");
    let conn = Connection::open(db_path)?;

    // Create repairs table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS repairs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            repair_id TEXT UNIQUE,
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            device_type TEXT NOT NULL,
            device_model TEXT NOT NULL,
            issue_desc TEXT NOT NULL,
            deposit_paid REAL DEFAULT 0,
            est_cost REAL DEFAULT 0,
            actual_cost REAL DEFAULT 0,
            status TEXT DEFAULT 'Pending',
            notes TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )",
        (),
    )?;

    // Create settings table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )",
        (),
    )?;

    Ok(conn)
}
