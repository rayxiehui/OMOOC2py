<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>nnn</title>
</head>
<body>

	%if (name == 'admin') :
	<form > 
	<input id= 'username' value = '{{name}}' name="username"/> 姓名:
	<input id = 'passworld' value = '{{passworld}}'  /> 呵呵:
	<input id = 'button' type = 'button' value = '提交'>
	%else :
	<a href="www.baidu">baidu</a>
	%end
</body>
<script src ='/static/assets/jquery-1.9.1.min.js'></script>
<script src ='/static/assets/js.js'></script>

</html>