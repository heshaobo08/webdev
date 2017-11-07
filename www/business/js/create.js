$(function(){
    /*生成随机验证码*/
    function yzm(){
        var arr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];
        var str = '';
        for(var i = 0 ; i < 4 ; i ++ )
            str += ''+arr[Math.floor(Math.random() * arr.length)];
        return str;
    }
    
   $(".create_code b").html(yzm());
   $(".create_code em").on("click",function(){
        $(".create_code b").html(yzm());  
   })
   $(".name_w").on("focus",function(){
       $(this).removeClass("b_color").addClass("b_success_color"); 
   });
    
   $(".name_w").on("blur",function(){
       $(this).removeClass("b_success_color").addClass("b_color");
       //邮箱验证	
        var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})$/; 
        var email = $("#name").val().trim();
       if(!email){
            $(this).removeClass("b_success_color").addClass("b_error_color");
            $(".email_error em").html("邮箱不能为空");
            $(".email_error").show();
            $(".email_success").hide();
            $(".email_repeat").hide();   
       }else{
            if(!reg.test(email)){
                $(this).removeClass("b_success_color").addClass("b_error_color");
                $(".email_error em").html("邮箱格式错误");
                $(".email_error").show();
                $(".email_success").hide();
                $(".email_repeat").hide();
            }else{
                $(this).removeClass("b_error_color").addClass("b_color");
                $(".email_success").show();
                $(".email_error").hide();
                $(".email_repeat").hide();
                
            }
       }
       
   });
    
    $(".code_w").on("focus",function(){
       $(this).removeClass("b_color").addClass("b_success_color");
   });
   
   $(".code_w").on("blur",function(){
       $(this).removeClass("b_success_color").addClass("b_color");
       var code = $("#code").val().trim().toLocaleLowerCase();
       var number=$(".create_code b").html().toLocaleLowerCase();
       if(code!=number){
            $(this).removeClass("b_success_color").addClass("b_error_color");
            $(".code_error").show();
           $(".code_success").hide();
       }else{
           $(this).removeClass("b_error_color").addClass("b_color");
           $(".code_error").hide();
           $(".code_success").show();
       }
   }); 
    
/*点击下一步*/
clickNext();
function clickNext(){  
    $(".create_form_next").on("click",function(){
       $(".name_w").removeClass("b_success_color").addClass("b_color");
       //邮箱验证	
        var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})$/; 
        var email = $("#name").val().trim();
       if(!email){
            $(".name_w").removeClass("b_success_color").addClass("b_error_color");
            $(".email_error em").html("邮箱不能为空");
            $(".email_error").show();
            $(".email_success").hide();
            $(".email_repeat").hide();
            return false;    
       }
       if(!reg.test(email)){
            $(".name_w").removeClass("b_success_color").addClass("b_error_color");
            $(".email_error em").html("邮箱格式错误");
            $(".email_error").show();
            $(".email_success").hide();
            $(".email_repeat").hide();
            return false;
        }
        
       var number=$(".create_code b").html().toLocaleLowerCase();
       var code = $("#code").val().trim().toLocaleLowerCase();
       if(code!=number){
            $(".code_w").removeClass("b_success_color").addClass("b_error_color");
            $(".code_error").show();
            $(".code_success").hide();
            return false;
       }
      $('#cover').height($(document).height());  
      $("#cover").show();
      $(".pop_phone").show();
    
    })
}
    $(".checkbox").on("click",function(){
        if(!$(".checkbox").prop("checked")){
            $(".create_form_next").off("click");
            $(".create_form_next").css({"background-color":"#d5d5d5","color":"#9d9696"});
        }else{
            $(".create_form_next").css({"background-color":"#2b91e6","color":"#fff"});
            clickNext();
        }
    })
  /*点击获取验证码*/ 
   $(".btn_code").on("click",function(){
          $(".pop_phone_w").removeClass("b_success_color").addClass("b_color");
            //手机号验证	
            var reg = /(^13\d{9}$)|(^14\d{9}$)|(^15\d{9}$)|(^16\d{9}$)|(^17\d{9}$)|(^18\d{9}$)|(^19\d{9}$)/g; 
            var mobileP = $("#pop_phone").val().trim();
            if(!mobileP){
                $(".pop_phone_w").removeClass("b_success_color").addClass("b_error_color");
                $(".pop_phone_error em").html("请输入手机号码");
                $(".pop_phone_error").css({"right":"88px"});
                $(".pop_phone_error").show();
                $(".pop_phone_success").hide();
                return false;
           }
           if(!reg.test(mobileP)){
                $(".pop_phone_w").removeClass("b_success_color").addClass("b_error_color");
                $(".pop_phone_error em").html("手机号码输入错误，请重新输入");
                $(".pop_phone_error").css({"right":"2px"});
                $(".pop_phone_error").show();
                $(".pop_phone_success").hide();
                return false; 
           }
          $(this).hide();
          $(".check_code_w").show();
          $(".resend_code").show();  
          $(".pop_next").css({"background-color":"#2b91e6","color":"#fff","cursor": "pointer"});
          $(".pop_code_success").show();
          popNext();
   })
   
/*获取验证码下一步*/ 
function popNext(){
       $(".pop_next").on("click",function(){
            $(".pop_phone_w").removeClass("b_success_color").addClass("b_color");
            //手机号验证	
            var reg = /(^13\d{9}$)|(^14\d{9}$)|(^15\d{9}$)|(^16\d{9}$)|(^17\d{9}$)|(^18\d{9}$)|(^19\d{9}$)/g; 
            var mobileP = $("#pop_phone").val().trim();
            if(!mobileP){
                $(".pop_phone_w").removeClass("b_success_color").addClass("b_error_color");
                $(".pop_phone_error em").html("请输入手机号码");
                $(".pop_phone_error").css({"right":"88px"});
                $(".pop_phone_error").show();
                $(".pop_phone_success").hide();
                return false;
           }
           if(!reg.test(mobileP)){
                $(".pop_phone_w").removeClass("b_success_color").addClass("b_error_color");
                $(".pop_phone_error em").html("手机号码输入错误，请重新输入");
                $(".pop_phone_error").css({"right":"2px"});
                $(".pop_phone_error").show();
                $(".pop_phone_success").hide();
                return false; 
           }
           
           //校验码验证
           var check_code = $("#check_code").val().trim();
           var temp = 123456;
           if(check_code!=temp){ 
              $(".check_code_w").removeClass("b_success_color").addClass("b_error_color");
              $(".pop_code_error").show();
              $(".pop_code_success").hide(); 
              return false;
           }else{
              $(".check_code_w").removeClass("b_error_color").addClass("b_color");
              $(".pop_code_error").hide();
           }
           
          $(".pop_phone").hide();
          $(".pop_email").show();
        
          var email_name = $("#name").val();
          var email_str = email_name.replace(email_name.substring(4,email_name.lastIndexOf("@")),"*****");
          $(".email_box h5 em").html(email_str);
               
           
      })
   }
  /*手机号码焦点获取*/
     $(".pop_phone_w").on("focus",function(){
       $(this).removeClass("b_color").addClass("b_success_color");
    });
 /*手机号码失去焦点*/   
    $(".pop_phone_w").on("blur",function(){
        $(".pop_phone_w").removeClass("b_success_color").addClass("b_color");
        //手机号验证	
        var reg = /(^13\d{9}$)|(^14\d{9}$)|(^15\d{9}$)|(^16\d{9}$)|(^17\d{9}$)|(^18\d{9}$)|(^19\d{9}$)/g; 
        var mobileP = $("#pop_phone").val().trim();
        if(!mobileP){
            $(".pop_phone_w").removeClass("b_success_color").addClass("b_error_color");
            $(".pop_phone_error em").html("请输入手机号码");
            $(".pop_phone_error").css({"right":"88px"});
            $(".pop_phone_error").show();
            $(".pop_phone_success").hide();
        }else{
          if(!reg.test(mobileP)){
              $(".pop_phone_w").removeClass("b_success_color").addClass("b_error_color");
              $(".pop_phone_error em").html("手机号码输入错误，请重新输入");
              $(".pop_phone_error").css({"right":"8px"});
              $(".pop_phone_error").show();
              $(".pop_phone_success").hide();
          }else{
              $(".pop_phone_w").removeClass("b_error_color").addClass("b_color");
              $(".pop_phone_error").hide();
              $(".pop_phone_success").show();
              
          }
        }
        
    })
    
    /*点击取消弹窗*/
    $(".pop_hd img").on("click",function(){
        $("#cover").hide();
        $(".pop_phone").hide();
        $(".pop_agreement").hide();
        $(".pop_licenses").hide();
        $(".pop_card").hide();
        $(".pop_email").hide();
    })
    
    /*点击弹出服务协议*/
    $(".checkbox_text em").on("click",function(){
        $('#cover').height($(document).height());
        $("#cover").show();
        $(".pop_agreement").show();
    })
    
    $(".create_data p:eq(0) em").on("click",function(){
        $('#cover').height($(document).height());
        $("#cover").show();
        $(".pop_licenses").show();
    })
    
    $(".create_data p:eq(2) em").on("click",function(){
        $('#cover').height($(document).height());
        $("#cover").show();
        $(".pop_card").show();
    })
    
    
    /*重新发送邮件*/
    var timeoff = true;
    $(".resend_email").on("click",function() {
        var count = 60;
        if(timeoff){
            countdown = setInterval(CountDown, 1000);
            CountDown();
        }
		function CountDown() {
            timeoff = false;
			$(".resend_email").html(count + "秒后重新发送");
			if (count == 0) {
				$('.resend_email').html("重新发送邮件");
                timeoff = true;
				clearInterval(countdown);
			}
			count--;
		}
		
    })
    
    /*重新发送邮件*/
    $(".resend_code").on("click",function() {
        var count = 60;
        if(timeoff){
            countdown = setInterval(CountDown, 1000);
            CountDown();
        }
		function CountDown() {
            timeoff = false;
			$(".resend_code").html(count + "秒后重新获取校验码");
			if (count == 0) {
				$('.resend_code').html("重新发送校验码");
                timeoff = true;
				clearInterval(countdown);
			}
			count--;
		}
		
    })
    
    
   /*判断邮箱的种类*/
    $(".click_email").on("click",function(){
        var email_name = $(".email_box h5 em").html().split("@")[1].split(".")[0];
        
        if(email_name=="qq"){
            window.open('http://mail.qq.com/','_blank');
        }else if(email_name=="163"){
            window.open('http://mail.163.com/','_blank');
        }else if(email_name=="126"){
            window.open('http://mail.126.com/','_blank');
        }else if(email_name=="tom"){
            window.open('http://mail.tom.com/','_blank');
        }else if(email_name=="sina"){
            window.open('http://mail.sina.com/','_blank');
        }else if(email_name=="yahoo"){
            window.open('http://mail.yahoo.com/','_blank');
        }else if(email_name=="hotmail"){
            window.open('http://mail.hotmail.com/','_blank');
        }else if(email_name=="gmail"){
            window.open('http://mail.gmail.com/','_blank');
        }else if(email_name=="21cn"){
            window.open('http://mail.21cn.com/','_blank');
        }else if(email_name=="sohu"){
            window.open('http://mail.sohu.com/','_blank');
        }else if(email_name=="263"){
            window.open('http://mail.263.com/','_blank');
        }else if(email_name=="eyou"){
            window.open('http://mail.eyou.com/','_blank');
        }
   
    });
    
    
    
    /*注册资料的显示与隐藏*/
    $(".create_tip h6").on("click",function(){
        $(".create_tip").hide();
        $(".create_hd").show();
        $(".create_data").show();
    });
    
    $(".create_hd").on("click",function(){
        $(".create_tip").show();
        $(".create_hd").hide();
        $(".create_data").hide();
    });
    
    
}) 
