$(function(){
    $(".credit_btn").on("click",function(){
        $('#cover').height($(document).height()); 
        $("#cover").show();
        $(".bank_phone").show();
    });
    
    
    /*验证手机号*/
    $(".short_btn").on("click",function(){
        var reg = /^\d{6}$/;
        var phone = $("#phone_number").val();
        if(!reg.test(phone)){
            $(".short_error").html("请输入6位数字");
            return false;
        }
        
    });
    
    /*重新发送短信*/
    var timeoff = true;
    $(".short_input span").on("click",function() {
        var count = 60;
        if(timeoff){
            countdown = setInterval(CountDown, 1000);
            CountDown();
        }
		function CountDown() {
            timeoff = false;
			$(".short_input span").html(count + "秒后重新发送");
			if (count == 0) {
				$('.short_input span').html("重新获取验证码");
                timeoff = true;
				clearInterval(countdown);
			}
			count--;
		}	
    });
    
    $(".short_message span").on("click",function(){
        $("#cover").hide();
        $(".bank_phone").hide();
    });
    
    /*输入框输入时判断是否全部有值*/
    function getShow(){
        var switch_num = 0;
        $(".credit_two_l input[type='text']").each(function(){  //遍历input标签，判断是否有内容未填写
            var vl=$(this).val();
            if(vl==""){
                switch_num = 1; 
            }
        });
        
       if(!$(".credit_two_l input[type='checkbox']").is(':checked')){
           switch_num = 1; 
       }
        
      if(switch_num == 1){
            $(".credit_btn_no").show();
            }else{
                $(".credit_btn_no").hide();
        }  
    };
    $(".credit_two_l input").on("blur",function(){
        getShow();
    });
    
    $(".credit_two_l input").on("keyup",function(){
         getShow();
    });
    /*是否勾选了协议*/
    $(".credit_two_l input[type='checkbox']").on("click",function(){
         var switch_num = 0;
        $(".credit_two_l input[type='text']").each(function(){  //遍历input标签，判断是否有内容未填写
            var vl=$(this).val();
            if(vl==""){
                switch_num = 1; 
            }
        });
        if(!$(this).is(':checked')){
               switch_num = 1; 
        }
        if(switch_num == 1){
            $(".credit_btn_no").show();
        }else{
            $(".credit_btn_no").hide();
        }  
        
    });
    
    
    
    
      
})