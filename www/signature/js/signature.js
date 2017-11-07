$(function(){
    /*下来菜单获取值*/
    $('[name="record_select"]').click(function(e){
	$('[name="record_select"]').find('ul').hide();
	$(this).find('ul').show();
	e.stopPropagation();
    });
    $('[name="record_select"] li').hover(function(e){
        $(this).toggleClass('on');
        e.stopPropagation();
    });
    var code_off = true;
    $('[name="record_select"] li').click(function(e){
        var val = $(this).text();
        var dataVal = $(this).attr("data-value");
        $(this).parents('[name="record_select"]').find('input').val(val);
        $('[name="record_select"] ul').hide();
        
        //选择法人时隐藏
        if(dataVal==11){
            $(".agent_box").hide();
            code_off = false;
        }else{
            $(".agent_box").show();
            code_off = true;
        }
        e.stopPropagation();
    });
    $(document).click(function(){
        $('[name="record_select"] ul').hide();
    });
    
    //验证身份证方法
    var aCity = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州"
        ,53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
    function cidInfo(sId){
        var iSum = 0
        var info = ""
        if(!/^\d{17}(\d|x)$/i.test(sId)){
            return false;
        }
        sId=sId.replace(/x$/i,"a");
        if(aCity[parseInt(sId.substr(0,2))]==null){
            return false;
        }
        var sBirthday = sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
        var d=new Date(sBirthday.replace(/-/g,"/"))
        if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
            return false;
        }
        for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11)
        if(iSum%11!=1){
            return false;
        }
        return true;
    };
    
    //下一步
    $(".message_next").on("click",function(){
        var signature_system = $("#signature_system").val();
        var contract = $("#contract").val();
        var company_name = $("#company_name").val();
        var company_address = $("#company_address").val();
        var enterprise_type = $("#enterprise_type").val();
        var registration_type = $("#registration_type").val();
        var certificates_type = $("#certificates_type").val();
        var company_number = $("#company_number").val();
        var company_range = $("#company_range").val();
        var person_name = $("#person_name").val();
        var person_card = $("#person_card").val();
        var person_address = $("#person_address").val();
        var agent_name = $("#agent_name").val();
        var agent_card = $("#agent_card").val();
        var contacts_name = $("#contacts_name").val();
        var contacts_phone = $("#contacts_phone").val();
        var contacts_email = $("#contacts_email").val();
        var weixin_one = $("#weixin_one").val();
        var weixin_two = $("#weixin_two").val();
        var weixin_three = $("#weixin_three").val();
        
        var zhifubao_one = $("#zhifubao_one").val();
        var zhifubao_two = $("#zhifubao_two").val();
        
        var unionpay_one = $("#unionpay_one").val();
        var unionpay_two = $("#unionpay_two").val();
        var unionpay_three = $("#unionpay_three").val();
         /*特殊字符规则*/
        var special_reg = /^([a-zA-Z0-9\u4E00-\u9FA5\uF900-\uFA2D]+)$/;
        /*数字*/
        var number_reg = /^[0-9]+$/;
        /*数字和字母*/
        var letter_reg = /^[A-Za-z0-9]+$/;
        /*中文*/
        var china_reg = /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/;
        var errorOff = true;
        if(!signature_system){
            $("#signature_system").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }
        if(!contract){
            $("#contract").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }
        if(!company_name){
            $("#company_name").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }
        if(!company_address){
            $("#company_address").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }
        if(!enterprise_type){
            $("#enterprise_type").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }
        if(!registration_type){
            $("#registration_type").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }
        if(!certificates_type){
            $("#certificates_type").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }
        if(!company_number){
            $("#company_number").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }
        if(!company_range){
            $("#company_range").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }
        if(!person_name){
            $("#person_name").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }
        if(!person_card){
            $("#person_card").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }else{
            var off = cidInfo(person_card);
            if(!off){
                $("#person_card").parent().siblings(".company_form_tip").html("<img src='images/login_error.png'><em>身份证输入错误，请重新输入</em>").show();
                errorOff = false;
            }
        }
        if(!person_address){
            $("#person_address").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }
        if(code_off){
            if(!agent_name){
            $("#agent_name").parent().siblings(".company_form_tip").show();
            errorOff = false;
            }
            if(!agent_card){
                $("#agent_card").parent().siblings(".company_form_tip").show();
                errorOff = false;
            }else{
                var off = cidInfo(agent_card);
                if(!off){
                    $("#agent_card").parent().siblings(".company_form_tip").html("<img src='images/login_error.png'><em>身份证输入错误，请重新输入</em>").show();
                    errorOff = false;
                }
            }
        }
        
        if(!contacts_name){
            $("#contacts_name").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }
        if(!contacts_phone){
            $("#contacts_phone").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }else{
            //手机号错误验证
            var reg = /(^13\d{9}$)|(^14\d{9}$)|(^15\d{9}$)|(^16\d{9}$)|(^17\d{9}$)|(^18\d{9}$)|(^19\d{9}$)/g;
            if (!reg.test(contacts_phone)) {
                $("#contacts_phone").parent().siblings(".company_form_tip").html("<img src='images/login_error.png'><em>手机号码输入错误，请重新输入</em>").show();
                errorOff = false;
            }
        }
        if(!contacts_email){
            $("#contacts_email").parent().siblings(".company_form_tip").show();
            errorOff = false;
        }
         if($("#wx_one").is(':checked')){
            if(!weixin_one){
                $("#weixin_one").siblings(".company_form_tip").show();
                errorOff = false;
            }
        }
        
        if($("#wx_two").is(':checked')){
            if(!weixin_two){
                $("#weixin_two").siblings(".company_form_tip").show();
                errorOff = false;
            }
        }
        if($("#wx_three").is(':checked')){
            if(!weixin_three){
                $("#weixin_three").siblings(".company_form_tip").show();
                errorOff = false;
            }
        }
        
        if($("#zhb_one").is(':checked')){
            if(!zhifubao_one){
                $("#zhifubao_one").siblings(".company_form_tip").show();
                errorOff = false;
            }
        }
        if($("#zhb_two").is(':checked')){
            if(!zhifubao_two){
                $("#zhifubao_two").siblings(".company_form_tip").show();
                errorOff = false;
            }
        }
        
        if($("#un_one").is(':checked')){
            if(!unionpay_one){
                $("#unionpay_one").siblings(".company_form_tip").show();
                errorOff = false;
            }
        }
        if($("#un_two").is(':checked')){
            if(!unionpay_two){
                $("#unionpay_two").siblings(".company_form_tip").show();
                errorOff = false;
            }
        }
        if($("#un_three").is(':checked')){
            if(!unionpay_three){
                $("#unionpay_three").siblings(".company_form_tip").show();
                errorOff = false;
            }
        }
        
        if(!errorOff){
            $("html,body").animate({scrollTop:0},500);
            return false;
        }
    });
    
     /*所有表单获取焦点*/
    $(".signaure_box input").on("focus", function () {
        $(this).parent().siblings(".company_form_tip").hide();
    });
    
     $(".sign_r input[type='text']").on("focus", function () {
        $(this).siblings(".company_form_tip").hide();
    });
    
    $(".sign_r input[type='checkbox']").on("click", function () {
        if($(this).is(':checked')){
            $(this).siblings("input").attr("disabled",false);
        }else{
            $(this).siblings("input").attr("disabled",true);
            $(this).siblings("input").val("");
            $(this).siblings(".company_form_tip").hide();
        }
        
    });
    
    
})    