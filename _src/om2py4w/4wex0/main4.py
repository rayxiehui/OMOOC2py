
# -*- coding: UTF-8 -*-
from bottle import get,post,request,run,template,route,static_file

js_path = './static/assets'
@route('/static/assets/<filename:re:.*\.css|.*\.js|.*\.png|.*\.jpg|.*\.gif>')
def server_static(filename):
    return static_file(filename,root = js_path) 

@route("/response",method ="Post")   
def log():  
    username = request.forms.get("username");  
    passworld = request.forms.get("passworld");  
      
    print(username,passworld)  
      
    if username =='admin' and passworld =='passworld':  
        return {"response":"1","b":"2"};  
    else :  
        return {"response":"222222","b":"2"};

@route('/login')
def login() :
	name = "admin"
	passworld = 'passworld'
	return template('tml',name =name,passworld = passworld)

run(host = 'localhost',port = 7888,debug=True)


