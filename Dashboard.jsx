import { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const weeklyData = [
  { day: "Mon", usage: 14800 },
  { day: "Tue", usage: 15200 },
  { day: "Wed", usage: 14950 },
  { day: "Thu", usage: 16000 },
  { day: "Fri", usage: 15850 },
  { day: "Sat", usage: 14500 },
  { day: "Sun", usage: 13900 },
];

const hourlyTrend = [
  { hour: "6 AM", load: 9000 },
  { hour: "9 AM", load: 12000 },
  { hour: "12 PM", load: 15000 },
  { hour: "3 PM", load: 16100 },
  { hour: "6 PM", load: 14200 },
  { hour: "9 PM", load: 11800 },
];

export default function Dashboard() {
  const [hour, setHour] = useState(14);
  const [day, setDay] = useState(2);
  const [prediction, setPrediction] = useState(16139.27);

  const getPrediction = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", {
        hour: Number(hour),
        day: Number(day),
      });
      setPrediction(res.data.predicted_energy);
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Backend not connected");
    }
  };

  const gridStatus =
    prediction > 15800 ? "High Load" : prediction > 14500 ? "Stable" : "Low Demand";

  const weatherImpact =
    prediction > 15500 ? "High Cooling Demand" : "Moderate";

  const estimatedSavings =
    prediction > 15500 ? "8.5%" : "12.0%";

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>⚡ GridWise AI</div>
        <div style={styles.navItemActive}>Dashboard</div>
        <div style={styles.navItem}>Prediction</div>
        <div style={styles.navItem}>Analytics</div>
        <div style={styles.navItem}>Sustainability</div>
        <div style={styles.navItem}>Settings</div>
      </aside>

      <main style={styles.main}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Energy Forecast Dashboard</h1>
            <p style={styles.subtitle}>AI-powered smart load forecasting</p>
          </div>
          <div style={styles.badge}>Live Model</div>
        </div>

        <div style={styles.kpiGrid}>
          <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>Predicted Usage</div>
            <div style={styles.kpiValue}>{prediction.toFixed(2)}</div>
            <div style={styles.kpiSub}>kWh estimated load</div>
          </div>

          <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>Grid Status</div>
            <div style={styles.kpiValue}>{gridStatus}</div>
            <div style={styles.kpiSub}>Based on current prediction</div>
          </div>

          <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>Weather Impact</div>
            <div style={styles.kpiValue}>{weatherImpact}</div>
            <div style={styles.kpiSub}>Cooling load indicator</div>
          </div>

          <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>Cost Saving Window</div>
            <div style={styles.kpiValue}>{estimatedSavings}</div>
            <div style={styles.kpiSub}>Potential optimization</div>
          </div>
        </div>

        <div style={styles.contentGrid}>
          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>Prediction Controls</h3>

            <label style={styles.label}>Hour</label>
            <input
              type="number"
              min="0"
              max="23"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Day (0 = Monday, 6 = Sunday)</label>
            <input
              type="number"
              min="0"
              max="6"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              style={styles.input}
            />

            <button onClick={getPrediction} style={styles.button}>
              Run Forecast
            </button>

            <div style={styles.resultBox}>
              <div style={styles.resultLabel}>Latest Prediction</div>
              <div style={styles.resultValue}>{prediction.toFixed(2)} kWh</div>
            </div>
          </div>

          <div style={styles.panelLarge}>
            <h3 style={styles.panelTitle}>Hourly Load Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={hourlyTrend}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="hour" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="load"
                  stroke="#60a5fa"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.bottomGrid}>
          <div style={styles.panelLarge}>
            <h3 style={styles.panelTitle}>Weekly Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Bar dataKey="usage" fill="#818cf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>AI Insight</h3>
            <div style={styles.insightBox}>
              {prediction > 15800
                ? "Peak load is expected. Shift heavy appliance usage away from this time window to reduce strain and cost."
                : prediction > 14500
                ? "Demand is stable. This is a normal operating window with manageable consumption."
                : "Demand is relatively low. This is a better window for flexible loads and planned high-consumption activities."}
            </div>

            <div style={styles.smallStat}>
              <span>Confidence</span>
              <strong>91%</strong>
            </div>

            <div style={styles.smallStat}>
              <span>Recommended Action</span>
              <strong>
                {prediction > 15800 ? "Load Shift" : "Monitor"}
              </strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#081225",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "230px",
    backgroundColor: "#0b1730",
    padding: "24px 18px",
    borderRight: "1px solid #1e293b",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#93c5fd",
  },
  navItem: {
    padding: "12px 14px",
    marginBottom: "10px",
    borderRadius: "10px",
    color: "#cbd5e1",
    cursor: "pointer",
  },
  navItemActive: {
    padding: "12px 14px",
    marginBottom: "10px",
    borderRadius: "10px",
    backgroundColor: "#1d4ed8",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    padding: "28px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "34px",
  },
  subtitle: {
    margin: "6px 0 0 0",
    color: "#94a3b8",
  },
  badge: {
    backgroundColor: "#1e293b",
    color: "#86efac",
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: "bold",
    border: "1px solid #334155",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "20px",
  },
  kpiCard: {
    backgroundColor: "#0f1d3a",
    borderRadius: "16px",
    padding: "18px",
    border: "1px solid #1e293b",
  },
  kpiLabel: {
    color: "#94a3b8",
    fontSize: "14px",
    marginBottom: "10px",
  },
  kpiValue: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  kpiSub: {
    color: "#64748b",
    fontSize: "13px",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: "18px",
    marginBottom: "18px",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: "18px",
  },
  panel: {
    backgroundColor: "#0f1d3a",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid #1e293b",
  },
  panelLarge: {
    backgroundColor: "#0f1d3a",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid #1e293b",
    minHeight: "360px",
  },
  panelTitle: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#cbd5e1",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid #334155",
    backgroundColor: "#0b1730",
    color: "#fff",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "4px",
  },
  resultBox: {
    marginTop: "18px",
    backgroundColor: "#0b1730",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #334155",
  },
  resultLabel: {
    color: "#94a3b8",
    marginBottom: "8px",
  },
  resultValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#22c55e",
  },
  insightBox: {
    backgroundColor: "#0b1730",
    borderRadius: "12px",
    padding: "16px",
    color: "#e2e8f0",
    lineHeight: 1.6,
    marginBottom: "18px",
    border: "1px solid #334155",
  },
  smallStat: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #1e293b",
    color: "#cbd5e1",
  },
};