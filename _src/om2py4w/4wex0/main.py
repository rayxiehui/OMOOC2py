# -*- coding: UTF-8 -*-
from bottle import route,run

@route('/hello')
def hello():
	return "hello world!"

run(host = 'localhost',port = 11111,debug =True)