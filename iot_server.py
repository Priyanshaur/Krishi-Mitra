from flask import Flask, request, jsonify

app = Flask(__name__)

latest_data = {}

# Soil moisture range:
# 4095 -> completely dry/out of soil
# 0 -> completely wet/dipped in water

@app.route("/data", methods=["POST"])
def receive_data():
    global latest_data
    try:
        data = request.get_json()
        if data:
            latest_data = data
            print("Received:", data)
            return jsonify({"status": "ok"}), 200
        else:
            return jsonify({"status": "error", "message": "No JSON data received"}), 400
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/data", methods=["GET"])
def send_data():
    return jsonify(latest_data)

if __name__ == "__main__":
    # Running on port 5001 to avoid conflict with Node.js backend on 5000
    app.run(host="0.0.0.0", port=5001)
