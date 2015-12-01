requirejs.config({
    //By default load any module IDs from js/lib
    // baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        'jquery'         : '../../libs/jquery-1.11.3.min',
        'underscore'    : '../../libs/underscore',
    }
});

// Start the main app logic.
requirejs([
    'jquery',
     ],function ($) {
    var data ={};
    var username = $('#username').val().trim(),passworld = $('#passworld').val().trim();
    var data = {
        username : username,
        passworld: passworld 
    } 
    $('#button').click(function(){
        var url = '/response';
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


     
    