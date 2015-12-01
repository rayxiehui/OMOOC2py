# -*- coding: UTF-8 -*-
from bottle import Bottle,run
app = Bottle()

@app.route('/hello')
def hello():
	return "hello world!"

@app.route('/hello',method='POST')	
def bbb():
	return "bbbken"

run(app,host = 'localhost',port = 12366) 	