from flask import Flask, jsonify, render_template
from pymongo import MongoClient
from bson.json_util import dumps
from flask_cors import CORS

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
CORS(app)

mongo = MongoClient('mongodb+srv://readuser:readpassword@groupproject2.ocbpa.mongodb.net/test?retryWrites=true&w=majority')
db = mongo['static']
collection = db['json_data']

@app.route("/")
def index():
    return render_template('index_map_debug.html')

@app.route('/viz')
def viz():
    return render_template('viz.html')


@app.route('/by_year/<year>', methods=['GET'])
def year(year):
    results = list(collection.find({'year':int(year)}))
    return app.response_class(dumps(results), mimetype="application/json")

@app.route('/by_state_name/<state_name>', methods=['GET'])
def state_name(state_name):
    results = list(collection.find({'state_name':state_name}))
    return app.response_class(dumps(results), mimetype="application/json")
    
if __name__ == '__main__':
    app.run(debug=True)