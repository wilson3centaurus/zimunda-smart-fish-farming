from flask import Flask, jsonify
import pyrebase
from datetime import datetime
import requests
import json
from flask_cors import CORS

# Firebase configuration
config = {
    "apiKey": "AIzaSyDnG1Kr_vUrdoVcE2SAbzEiG-tBPSe6-kw",
    "authDomain": "zimunda-sensor-data.firebaseapp.com",
    "databaseURL": "https://zimunda-sensor-data-default-rtdb.firebaseio.com",
    "projectId": "zimunda-sensor-data",
    "storageBucket": "zimunda-sensor-data.appspot.com",
    "messagingSenderId": "260289735455",
    "appId": "1:260289735455:web:c70d169bc8b86945cb1e2a",
    "measurementId": "G-WFH79MCPNP"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()

app = Flask(__name__)
CORS(app)

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)

app.json_encoder = CustomJSONEncoder

def send_to_grafana(data):
    # Grafana UID data source
    url = "http://localhost:3000/api/datasources/proxy/UID/"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer GRAFANA_API_TOKEN"  #Grafana API token
    }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        print("Data sent to Grafana successfully!")
    else:
        print("Failed to send data to Grafana. Status code:", response.status_code)

@app.route("/data")
def get_data():
    temperatures = db.child("temperature").order_by_child("timestamp").get().val()
    data = []
    if temperatures:
        for key, value in temperatures.items():
            if "timestamp" in value:
                time_str = value["timestamp"]
                time_obj = datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S")  # Converting string to datetime object
                iso_time = time_obj.strftime("%Y-%m-%d %H:%M:%S")  # Custom formatting without "T"
                data.append({"timestamp": iso_time, "celsius": value["celsius"]})
        data.sort(key=lambda x: x["timestamp"], reverse=True)  # Sort by latest first
    return jsonify({"temperature": data})


@app.route("/")
def index():
    temperature_data = {
        "celsius": 23.45,
        "timestamp": datetime.now()  # Store timestamp as datetime object
    }
    db.child("temperature").push(temperature_data)

    temperatures = db.child("temperature").order_by_child("timestamp").get().val()
    data = []
    if temperatures:
        for key, value in temperatures.items():
            if "timestamp" in value:
                data.append({"timestamp": value["timestamp"], "celsius": value["celsius"]})
        data.sort(key=lambda x: x["timestamp"], reverse=True)  # Sort by latest first
        celsius = data[0]["celsius"]
    else:
        celsius = None

    # Prepare data for Grafana JSON data source
    grafana_data = prepare_data_for_grafana(data)
    send_to_grafana(grafana_data)

    return jsonify({"celsius": celsius, "data": data})


def prepare_data_for_grafana(data):
    return [{"time": d["timestamp"], "value": d["celsius"]} for d in data]

if __name__ == "__main__":
    app.run(debug=True)
