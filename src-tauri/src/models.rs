use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Repair {
    pub id: i64,
    pub repair_id: String,
    pub customer_name: String,
    pub customer_phone: String,
    pub device_type: String,
    pub device_model: String,
    pub issue_desc: String,
    pub deposit_paid: f64,
    pub est_cost: f64,
    pub actual_cost: f64,
    pub status: String,
    pub notes: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DashboardStats {
    pub total_repairs_today: i64,
    pub total_repairs_month: i64,
    pub revenue: f64,
    pub costs: f64,
    pub net_profit: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RevenueChartData {
    pub day: String,
    pub revenue: f64,
}
