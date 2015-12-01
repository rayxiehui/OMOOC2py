# -*- coding: UTF-8 -*-
from bottle import get,post,request,run
#@route('/login')
@get('/login') # 或 @route('/login')
def login_form():
	return ''' <from methgeton = "POST" action = "/login">
	        <input name = "name" type ="text" />
	        <input name ="password" type = "password" />
	        <input type="submit" value="Login" />
	        </form>'''

@post('/login') #或 @route('/login',methon = 'POST')
def login_submit():
	name = request.froms.get('name')
	password = request.froms.get('password')
	if check_login(name,password):
		return "<p>登陆成功</p>"
	else :
	    return "<p>登录失败</p>"

run(host = 'localhost',port = 8888,debug=True) 	

