import os
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

print("🚀 Script started...")

# Base project folder
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Paths
data_path = os.path.join(base_dir, "data", "energy.csv")
models_dir = os.path.join(base_dir, "models")
outputs_dir = os.path.join(base_dir, "outputs")

# Load dataset
df = pd.read_csv(data_path)
import os
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

print("🚀 Script started...")

# Base project folder
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Paths
data_path = os.path.join(base_dir, "data", "energy.csv")
models_dir = os.path.join(base_dir, "models")
outputs_dir = os.path.join(base_dir, "outputs")

# Load dataset
df = pd.read_csv(data_path)
print("✅ CSV loaded")
print(df.head())
print(df.columns)

# Clean column names
df.columns = df.columns.str.strip()

# Remove junk unnamed columns if present
df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

print("✅ Cleaned columns:")
print(df.columns)

# Rename columns if needed
if "AEP_MW" in df.columns:
    df = df.rename(columns={"AEP_MW": "Energy"})

# Check required columns
if "Datetime" not in df.columns or "Energy" not in df.columns:
    raise ValueError(f"Dataset must contain 'Datetime' and 'Energy' columns. Found: {list(df.columns)}")

# Convert Datetime column
df["Datetime"] = pd.to_datetime(df["Datetime"])
print("✅ Datetime converted")

# Set index
df.set_index("Datetime", inplace=True)

# Resample hourly
df = df.resample("h").mean()

# Fill missing values
df = df.ffill()

# Feature engineering
df["hour"] = df.index.hour
df["day"] = df.index.dayofweek

# Inputs and target
X = df[["hour", "day"]]
y = df["Energy"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("🔥 Starting model training...")

# Train model
model = MLPRegressor(hidden_layer_sizes=(64, 64), max_iter=500, random_state=42)
model.fit(X_train, y_train)

print("✅ Model trained")

# Predict
predictions = model.predict(X_test)

# Metrics
mae = mean_absolute_error(y_test, predictions)
rmse = mean_squared_error(y_test, predictions) ** 0.5
r2 = r2_score(y_test, predictions)

print("Model Evaluation:")
print(f"MAE  : {mae:.4f}")
print(f"RMSE : {rmse:.4f}")
print(f"R2   : {r2:.4f}")

# Save model
model_path = os.path.join(models_dir, "energy_forecast_model.pkl")
joblib.dump(model, model_path)
print(f"✅ Model saved successfully at: {model_path}")

# Save cleaned dataset
cleaned_data_path = os.path.join(outputs_dir, "cleaned_energy_data.csv")
df.to_csv(cleaned_data_path)

# Plot full trend
trend_plot_path = os.path.join(outputs_dir, "energy_trend.png")
plt.figure(figsize=(12, 5))
df["Energy"].plot(title="Energy Consumption Over Time")
plt.xlabel("Datetime")
plt.ylabel("Energy")
plt.tight_layout()
plt.savefig(trend_plot_path)
plt.show()

# Plot actual vs predicted
comparison = pd.DataFrame({
    "Actual": y_test.values,
    "Predicted": predictions
}).reset_index(drop=True)

comparison_plot_path = os.path.join(outputs_dir, "actual_vs_predicted.png")
plt.figure(figsize=(12, 5))
plt.plot(comparison["Actual"][:100], label="Actual")
plt.plot(comparison["Predicted"][:100], label="Predicted")
plt.title("Actual vs Predicted Energy Consumption")
plt.xlabel("Sample Index")
plt.ylabel("Energy")
plt.legend()
plt.tight_layout()
plt.savefig(comparison_plot_path)
plt.show()

print("✅ All output files saved successfully.")