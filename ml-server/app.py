from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# ----------------------------------------------------------
# ✅ HEALTH CHECK (IMPORTANT)
# ----------------------------------------------------------
@app.route("/")
def home():
    return jsonify({"status": "ML Server Running"})

@app.route("/health")
def health():
    return jsonify({"status": "ok"})


# ----------------------------------------------------------
# LOAD MODELS
# ----------------------------------------------------------
def load_model(model, scaler, cols):
    try:
        m = joblib.load(model)
        s = joblib.load(scaler)
        c = joblib.load(cols)
        print(f"✅ {model} loaded.")
        return m, s, c
    except:
        print(f"❌ {model} loading failed!")
        return None, None, None


HEART_MODEL = joblib.load("heart_pipeline.pkl")

DIABETES_MODEL, DIABETES_SCALER, DIABETES_COLS = load_model(
    "diabetes_model.pkl", "diabetes_scaler.pkl", "diabetes_feature_columns.pkl"
)

STROKE_MODEL, STROKE_SCALER, STROKE_COLS = load_model(
    "stroke_model.pkl", "stroke_scaler.pkl", "stroke_feature_columns.pkl"
)

KIDNEY_MODEL, KIDNEY_SCALER, KIDNEY_COLS = load_model(
    "kidney_model.pkl", "kidney_scaler.pkl", "kidney_features.pkl"
)

LIVER_MODEL, LIVER_SCALER, LIVER_COLS = load_model(
    "liver_model.pkl", "liver_scaler.pkl", "liver_features.pkl"
)

# ----------------------------------------------------------
# PROCESS FUNCTION
# ----------------------------------------------------------
def process_input(data, cols, scaler=None, model_type=None):

    df = pd.DataFrame([data])

    # =========================
    # SPECIAL CASE: STROKE
    # =========================
    if model_type == "stroke":

        numeric_cols = ['age', 'avg_glucose_level', 'bmi']

        # One-hot encoding
        df = pd.get_dummies(df)

        # Add missing columns
        for col in cols:
            if col not in df:
                df[col] = 0

        # Keep correct order
        df = df[cols]

        # Scale ONLY numeric columns
        df[numeric_cols] = scaler.transform(df[numeric_cols])

        return df

    # =========================
    # NORMAL MODELS
    # =========================
    for col in cols:
        if col not in df.columns:
            df[col] = 0

    df = df[cols]

    if scaler:
        df = scaler.transform(df)

    return df


def get_result(prob):
    return {
        "probability": round(prob, 2),
        "chance_level": (
            "HIGH CHANCE" if prob >= 70 else
            "MEDIUM CHANCE" if prob >= 30 else
            "LOW CHANCE"
        )
    }

# ----------------------------------------------------------
# ROUTES
# ----------------------------------------------------------
@app.route('/heart', methods=['POST'])
def heart():
    try:
        data = request.json
        print("📥 HEART:", data)

        df = pd.DataFrame([data])

        prob = HEART_MODEL.predict_proba(df)[0][1] * 100

        return jsonify({
            "success": True,
            **get_result(prob)
        })

    except Exception as e:
        print("❌ HEART ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route('/diabetes', methods=['POST'])
def diabetes():
    df = process_input(request.json, DIABETES_COLS, DIABETES_SCALER)
    prob = DIABETES_MODEL.predict_proba(df)[0][1] * 100

    return jsonify({"success": True, **get_result(prob)})


@app.route('/stroke', methods=['POST'])
def stroke():
    try:
        data = request.json
        print("📥 STROKE:", data)

        df = process_input(
            data,
            STROKE_COLS,
            STROKE_SCALER,
            model_type="stroke"   # 🔥 IMPORTANT
        )

        prob = STROKE_MODEL.predict_proba(df)[0][1] * 100

        return jsonify({
            "success": True,
            **get_result(prob)
        })

    except Exception as e:
        print("❌ STROKE ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route('/kidney', methods=['POST'])
def kidney():
    df = process_input(request.json, KIDNEY_COLS, KIDNEY_SCALER)
    prob = KIDNEY_MODEL.predict_proba(df)[0][1] * 100

    return jsonify({"success": True, **get_result(prob)})


@app.route('/liver', methods=['POST'])
def liver():
    df = process_input(request.json, LIVER_COLS, LIVER_SCALER)
    prob = LIVER_MODEL.predict_proba(df)[0][1] * 100

    return jsonify({"success": True, **get_result(prob)})


# ----------------------------------------------------------
# RUN SERVER
# ----------------------------------------------------------
if __name__ == "__main__":
    app.run(port=5001, debug=True)