import os
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Base project folder
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(base_dir, "models", "energy_forecast_model.pkl")

# Load model
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at: {model_path}")

model = joblib.load(model_path)
print(f"✅ Model loaded from: {model_path}")

@app.route("/")
def home():
    return "Energy Forecasting API is running."

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        hour = int(data["hour"])
        day = int(data["day"])

        features = np.array([[hour, day]])
        prediction = model.predict(features)

        return jsonify({
            "hour": hour,
            "day": day,
            "predicted_energy": float(prediction[0])
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/sample-kpi", methods=["GET"])
def sample_kpi():
    return jsonify({
        "current_usage": 71.6,
        "status": "Stable",
        "weather_impact": "Moderate",
        "carbon_savings": 15.0
    })

if __name__ == "__main__":
    app.run(debug=True)