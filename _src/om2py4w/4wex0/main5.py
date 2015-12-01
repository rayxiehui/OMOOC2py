# -*- coding: UTF-8 -*-
from bottle import get,route,request,run,get,template
@route('/hello')
@route('/hell/<id:int>')
def helle (id):
    return 'hello %s,how are you?' % id

@route('/hell/<id:float>')
def callback(id):
    return 'hello %s,how floar  are you?' % id
run(host = 'localhost',port = 18888,debug=True) 	  