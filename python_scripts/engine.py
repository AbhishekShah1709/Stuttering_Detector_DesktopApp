import sys
from flask import Flask
import json

app = Flask(__name__)

@app.route("/")
def hello():
    print("python")
    dct = {"k" : "Hello"}
    json_obj = json.dumps(dct)
    return json_obj

#if __name__ == "__main__":
app.run(host='127.0.0.1', port=5000)
