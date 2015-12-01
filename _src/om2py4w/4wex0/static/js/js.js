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



     
    