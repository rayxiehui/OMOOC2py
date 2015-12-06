
# -*- coding: UTF-8 -*-
from bottle import get,post,request,run,template,route,static_file

# 所有网页中引入的资源文件都在static文件夹,网页本身放在views
# 设置引入文件的路径,这个是各种引入库文件所在地  https://www.linuxyw.com/609.html语法参考
js_path = './static/js/libs'   
@route('/static/js/libs/<filename:re:.*\.css|.*\.js|.*\.png|.*\.jpg|.*\.gif>')
def server_static(filename):
    return static_file(filename,root = js_path) 

# 引入自己所写文件
js_path2 = './static/js/first/viewModel'
@route('/static/js/first/viewModel/<filename:re:.*\.css|.*\.js|.*\.png|.*\.jpg|.*\.gif>')
def server_static_two(filename):
    return static_file(filename,root = js_path2)     


#接收登陆密码与用户名后 返回的是json对象,这样页面可以直接接收到,不用再刷新.
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


