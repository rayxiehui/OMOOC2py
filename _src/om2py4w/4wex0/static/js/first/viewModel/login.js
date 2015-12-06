requirejs.config({
 
 // 设置文件地址
    paths: {
        'jquery'         : '../../libs/jquery-1.11.3.min',
        'underscore'    : '../../libs/underscore',
    }
});

// 引入你所需要的js库
requirejs([
    'jquery',
     ],function ($) {

    var data ={};
    var username = $('#username').val().trim(),passworld = $('#passworld').val().trim();
    var data = {
        username : username,
        passworld: passworld 
    } 
    // 按钮点击利用jquery发送ajax请求
    $('#button').click(function(){
        var url = '/response';

        // Ajax方法  必要参数url与 data
        // 发送成功后执行success函数,在里面可以写你需要的各种逻辑.返回值是result这个参数,也就是前面boottle中return 的json
        $.ajax({
                url: url,
                type:"POST",
                data: data,
                dataType:'json',
                success: function(result) {
                    if (result) {
                    
                        alert(result.response);
                    }
                },
                error: function(){
                    alert('网络异常，请稍候再试！signature error');
                }
            });
    })
 
});


     
    