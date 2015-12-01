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
    </form>

	%else :
	<a href="www.baidu">baidu</a>
	%end
</body>
<script data-main = "/static/js/first/viewModel/login.js" src = "/static/js/libs/require.js"></script>

</html>