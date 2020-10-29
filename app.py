from flask import Flask, jsonify, request
from flask.ext.pymongo import pymongo

app = Flask(__name__)

app.config['']

# https://www.youtube.com/watch?v=upGiAG7-Sa4