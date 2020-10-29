from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

mongo = MongoClient('mongodb+srv://dbadmin:GroupProject2@groupproject2.ocbpa.mongodb.net/sample_airbnb?retryWrites=true&w=majority')

@app.route('/framework', methods=['GET'])
def get_all_frameworks():
    framework = mongo.db.framework

    output = []

    for q in framework.find():
        output.append({'name' : q[name]})

    return jsonify({'result' : output})

if __name__ == '__main__':
    app.run(debug=True)