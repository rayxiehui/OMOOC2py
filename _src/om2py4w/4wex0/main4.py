
# -*- coding: UTF-8 -*-
from bottle import get,post,request,run,template,route,static_file

js_path = './static/js/libs'
@route('/static/js/libs/<filename:re:.*\.css|.*\.js|.*\.png|.*\.jpg|.*\.gif>')
def server_static(filename):
    return static_file(filename,root = js_path) 

js_path2 = './static/js/first/viewModel'
@route('/static/js/first/viewModel/<filename:re:.*\.css|.*\.js|.*\.png|.*\.jpg|.*\.gif>')
def server_static_two(filename):
    return static_file(filename,root = js_path2)     

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


