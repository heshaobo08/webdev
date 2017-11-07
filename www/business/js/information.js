$(function () {
    /*三级城市联动*/
    function showLocation(province, city, town) {
        var title = ['省/直辖市', '请选择市', '请选择区（县）'];
        $.each(title, function (k, v) {
            title[k] = '<option value="">' + v + '</option>';
        });
        $('#loc_province').append(title[0]);
        $('#loc_city').append(title[1]);
        $('#loc_town').append(title[2]);
        $("#loc_province,#loc_city,#loc_town").select2();
        $('#loc_province').change(function () {
            $('#loc_city').empty();
            $('#loc_city').append(title[1]);
            var _province_id = $('#loc_province').val();
            if (_province_id != '') {
                get_cate_list('loc_city', $('#loc_province').val(), "2");
            }
            $('#loc_city').change()
        });
        $('#loc_city').change(function () {
            $('#loc_town').empty();
            $('#loc_town').append(title[2]);
            var _city_id = $('#loc_city').val();
            if (_city_id != '' && _city_id != '0') {
                get_cate_list('loc_town', $('#loc_city').val(), "3");
            }
            $('#loc_town').change()
        });
        $('#loc_town').change(function () {
            var _town_id = $(this).val();
            $('input[name=location_id]').val(_town_id);
            /*if(_town_id!='' && _town_id!='0'){
             change_url($(this).val());
             }*/
        });
        get_cate_list('loc_province', '', "1");
    }
    showLocation();
    function get_cate_list(el_id, loc_id, role) {
        var el = $('#' + el_id);
        $.ajax({
            type: "GET",
            url: "/user/select",
            data: {'id': loc_id, 'role': role},
            dataType: 'jsonp',
            jsonp:'callback',
            success: function (data) {
                $.each(data, function (k, v) {
                    var option = '<option value="' + v.id + '">' + v.name + '</option>';
                    el.append(option);
                })
            },
            error: function () {
            }
        });
    }
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
    
  /*证件类型的切换*/
    var code_off = "";
   $(".message_company input").on("click",function(){
       //普通营业执照
      if($(this).val()=='ORDINA'){
          $(".code_number").show();
          $(".tax_code").show();
          code_off=false;
      }else{//多证合一营业执照
          $(".code_number").hide();
          $(".tax_code").hide();
          code_off=true;
      }
   }); 
    
    
    
/*点击下一步*/
    var script_reg = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    var messageAjax = null;
    $(".message_next").on("click", function () {
        var radio_type = $(".message_radio").find("input:radio:checked").val();
        var certificate_type = $(".message_company").find("input:radio:checked").val();
        var company_name = $("#company_name").val();
        //传输值
        var loc_province_pass = $("#loc_province").val();
        var loc_city_pass = $("#loc_city").val();
        var loc_town_pass = $("#loc_town").val();
        //显示值
        var loc_province = $("#loc_province").find("option:selected").text();
        var loc_city = $("#loc_city").find("option:selected").text();
        var loc_town = $("#loc_town").find("option:selected").text();
        var location = loc_province + loc_city + loc_town;
        //var company_address = $("#company_address").val().replace(script_reg,"");
        var company_web = $("#company_web").val();
        //var company_icp = $("#company_icp").val().replace(script_reg,"");
        var license_number = $("#license_number").val();
        var daily_time = $("#daily_time").val() ? $("#daily_time").val() : $("#daily_time").siblings("input:checkbox:checked").val();
        if(code_off){//多证合一营业执照默认值
            var code_number = 1;
            var tax_code = 1;
        }else{
            var code_number = $("#code_number").val().replace(script_reg,"");
            var tax_code = $("#tax_code").val();
        }
        var business_scope = $("#business_scope").val().replace(script_reg,"");
        var legal_name = $("#legal_name").val();
        var legal_card = $("#legal_card").val();
        var legal_time = $("#legal_time").val() ? $("#legal_time").val() : $("#legal_time").siblings("input:checkbox:checked").val();
        var contact_name = $("#contact_name").val();
        var contact_card = $("#contact_card").val();
        var contact_time = $("#contact_time").val() ? $("#contact_time").val() : $("#contact_time").siblings("input:checkbox:checked").val();
        var contact_phone = $("#contact_phone").val();
        /*特殊字符规则*/
        var special_reg = /^([a-zA-Z0-9\u4E00-\u9FA5\uF900-\uFA2D]+)$/;
        /*数字*/
        var number_reg = /^[0-9]+$/;
        /*中文*/
        var china_reg = /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/;
        var errorOff = true;
        if (!company_name) {
            $("#company_name").removeClass("b_success_color").addClass("b_error_color");
            $("#company_name").siblings(".company_form_tip").show();
            errorOff = false;
        }else{
            /*特殊字符验证*/
            if (!special_reg.test(company_name)) {
                $("#company_name").removeClass("b_success_color").addClass("b_error_color");
                $("#company_name").siblings(".company_form_tip").html("<img src='../static/images/login_error.png'><em>请输入企业名称</em>").show();
                errorOff = false;
            }else if(!china_reg.test(company_name)){
                $("#company_name").removeClass("b_success_color").addClass("b_error_color");
                $("#company_name").siblings(".company_form_tip").html("<img src='../static/images/login_error.png'><em>只能输入中文，请重新输入</em>").show();
                errorOff = false;
            }
        }
        if (loc_province == "省/直辖市" || loc_city == "请选择市" || loc_town == "请选择区（县）") {
            $(".company_sel").find(".company_form_tip").show();
            errorOff = false;
        }else{
            $(".company_sel").find(".company_form_tip").hide();
        }

        if (!company_address) {
            $("#company_address").removeClass("b_success_color").addClass("b_error_color");
            $("#company_address").siblings(".company_form_tip").show();
            errorOff = false;
        }
        if (!company_web) {
            $("#company_web").removeClass("b_success_color").addClass("b_error_color");
            $("#company_web").siblings(".company_form_tip").show();
            errorOff = false;
        }else{
            //var reg = /^(http(s)?:\/\/)?(www\.)?[\w-]+\.\w{2,4}(\/)?$/;
               var reg = /^(http:\/\/)?(www.)?(\w+\.)+\w{2,4}(\/)?$/;
            if (!reg.test(company_web)) {
                $("#company_web").removeClass("b_success_color").addClass("b_error_color");
                $("#company_web").siblings(".company_form_tip").html("<img src='../static/images/login_error.png'><em>输入的网址错误，请重新输入</em>").show();
                errorOff = false;
            }

        }
        if (!company_icp) {
            $("#company_icp").removeClass("b_success_color").addClass("b_error_color");
            $("#company_icp").siblings(".company_form_tip").show();
            errorOff = false;
        }/*else{
            /*特殊字符验证*/
            /*if (!special_reg.test(company_icp)) {
                $("#company_icp").removeClass("b_success_color").addClass("b_error_color");
                $("#company_icp").siblings(".company_form_tip").html("<img src='../static/images/login_error.png'><em>不能输入特殊字符，请重新输入</em>").show();
                errorOff = false;
            }
        }*/
        if (!license_number) {
            $("#license_number").removeClass("b_success_color").addClass("b_error_color");
            $("#license_number").siblings(".company_form_tip").show();
            errorOff = false;
        }else{
            if(!number_reg.test(license_number)){
                $("#license_number").removeClass("b_success_color").addClass("b_error_color");
                $("#license_number").siblings(".company_form_tip").html("<img src='../static/images/login_error.png'><em>只能输入数字，请重新输入</em>").show();
                errorOff = false;
            }
        }
        if (!daily_time && !$("#long_time").prop("checked")) {
            $("#daily_time").removeClass("b_success_color").addClass("b_error_color");
            $("#daily_time").siblings(".company_form_tip").show();
            errorOff = false;
        }
        if (!code_number) {
            $("#code_number").removeClass("b_success_color").addClass("b_error_color");
            $("#code_number").siblings(".company_form_tip").show();
            errorOff = false;
        }else{
            if(china_reg.test(code_number)){
                $("#code_number").removeClass("b_success_color").addClass("b_error_color");
                $("#code_number").siblings(".company_form_tip").html("<img src='../static/images/login_error.png'><em>不能输入中文，请重新输入</em>").show();
                errorOff = false;
            }
        }
        if (!tax_code) {
            $("#tax_code").removeClass("b_success_color").addClass("b_error_color");
            $("#tax_code").siblings(".company_form_tip").show();
            errorOff = false;
        }else{
            if(!number_reg.test(tax_code)){
                $("#tax_code").removeClass("b_success_color").addClass("b_error_color");
                $("#tax_code").siblings(".company_form_tip").html("<img src='../static/images/login_error.png'><em>只能输入数字，请重新输入</em>").show();
                errorOff = false;
            }
        }
        if (!business_scope) {
            $("#business_scope").removeClass("b_success_color").addClass("b_error_color");
            $("#business_scope").siblings(".company_form_tip").show();
            errorOff = false;
        }
        if (!legal_name) {
            $("#legal_name").removeClass("b_success_color").addClass("b_error_color");
            $("#legal_name").siblings(".company_form_tip").show();
            errorOff = false;
        }else{
            /*特殊字符验证*/
            if (!special_reg.test(legal_name)) {
                $("#legal_name").removeClass("b_success_color").addClass("b_error_color");
                $("#legal_name").siblings(".company_form_tip").html("<img src='../static/images/login_error.png'><em>不能输入特殊字符，请重新输入</em>").show();
                errorOff = false;
            }else if(!china_reg.test(legal_name)){
                $("#legal_name").removeClass("b_success_color").addClass("b_error_color");
                $("#legal_name").siblings(".company_form_tip").html("<img src='../static/images/login_error.png'><em>只能输入中文，请重新输入</em>").show();
                errorOff = false;
            }
        }
        if (!legal_card) {
            $("#legal_card").removeClass("b_success_color").addClass("b_error_color");
            $("#legal_card").siblings(".company_form_tip").show();
            errorOff = false;
        }else{
            var off = cidInfo(legal_card);
            if(!off){
                $("#legal_card").removeClass("b_success_color").addClass("b_error_color");
                $("#legal_card").siblings(".company_form_tip").html("<img src='../static/images/login_error.png'><em>身份证输入错误，请重新输入</em>").show();
                errorOff = false;
            }
        }
        if (!legal_time && !$("#legal_long").prop("checked")) {
            $("#legal_time").removeClass("b_success_color").addClass("b_error_color");
            $("#legal_time").siblings(".company_form_tip").show();
            errorOff = false;
        }
        if (!contact_name) {
            $("#contact_name").removeClass("b_success_color").addClass("b_error_color");
            $("#contact_name").siblings(".company_form_tip").show();
            errorOff = false;
        }else{
            /*特殊字符验证*/
            if (!special_reg.test(contact_name)) {
                $("#contact_name").removeClass("b_success_color").addClass("b_error_color");
                $("#contact_name").siblings(".company_form_tip").html("<img src='../static/images/login_error.png'><em>不能输入特殊字符，请重新输入</em>").show();
                errorOff = false;
            }else if(!china_reg.test(contact_name)){
                $("#contact_name").removeClass("b_success_color").addClass("b_error_color");
                $("#contact_name").siblings(".company_form_tip").html("<img src='../static/images/login_error.png'><em>只能输入中文，请重新输入</em>").show();
                errorOff = false;
            }
        }
        if (!contact_card) {
            $("#contact_card").removeClass("b_success_color").addClass("b_error_color");
            $("#contact_card").siblings(".company_form_tip").show();
            errorOff = false;
        }else{
            var off = cidInfo(contact_card);
            if(!off){
                $("#contact_card").removeClass("b_success_color").addClass("b_error_color");
                $("#contact_card").siblings(".company_form_tip").html("<img src='../static/images/login_error.png'><em>身份证输入错误，请重新输入</em>").show();
                errorOff = false;
            }
        }
        if (!contact_time && !$("#contact_long").prop("checked")) {
            $("#contact_time").removeClass("b_success_color").addClass("b_error_color");
            $("#contact_time").siblings(".company_form_tip").show();
            errorOff = false;
        }
        if (!contact_phone) {
            //手机号为空验证
            $("#contact_phone").removeClass("b_success_color").addClass("b_error_color");
            $("#contact_phone").siblings(".company_form_tip").show();
            errorOff = false;
        }else{
            //手机号错误验证
            var reg = /(^13\d{9}$)|(^14\d{9}$)|(^15\d{9}$)|(^16\d{9}$)|(^17\d{9}$)|(^18\d{9}$)|(^19\d{9}$)/g;
            if (!reg.test(contact_phone)) {
                $("#contact_phone").removeClass("b_success_color").addClass("b_error_color");
                $("#contact_phone").siblings(".company_form_tip").html("<img src='../static/images/login_error.png'><em>手机号码输入错误，请重新输入</em>").show();
                errorOff = false;
            }
        }
        if(!errorOff){
            $("html,body").animate({scrollTop:0},500);
            return false;
        }
        $('#cover').height($(document).height());
        $("#cover").show();
        $(".pop_message").show();
        $("html,body").animate({scrollTop:0},500);
        if($(window).height()<=900){
            $(".pop_message").css({"margin-top":"-200px"});
            $('#cover').height($(document).height());
            $("html,body").animate({scrollTop:0},500);
        }
        //赋值
        $("#spanid1").html($(".message_radio").find("input:radio:checked").data("name"));
        $("#spanid2").html($(".message_company").find("input:radio:checked").data("name"));
        $("#spanid3").html(company_name);
        $("#spanid4").html(location);
        $("#spanid5").html(company_address);
        
        $("#spanid6").html(company_web);
        $("#spanid7").html(company_icp);
        $("#spanid8").html(license_number);
        if(daily_time=="0000-00-00"){
        	$("#spanid9").html("长期");
        }else{
        	$("#spanid9").html(daily_time);
        }
        $("#spanid10").html(code_number);
        $("#spanid11").html(tax_code);
        $("#spanid12").html(business_scope);
        $("#spanid13").html(legal_name);
        $("#spanid14").html(legal_card);
        if(legal_time=="0000-00-00"){
        	$("#spanid15").html("长期");
        }else{
        	$("#spanid15").html(legal_time);
        }
        $("#spanid16").html(contact_name);
        $("#spanid17").html(contact_card);
        if(contact_time=="0000-00-00"){
        	$("#spanid18").html("长期");
        }else{
        	$("#spanid18").html(contact_time);
        }
        $("#spanid19").html(contact_phone);
        
        messageAjax = function () {
        	$("#companyType").val(radio_type);
            $("#papersType").val(certificate_type);
            $("#companyName").val(company_name);
            //省市县的代码
            $("#locProvinceCode").val(loc_province_pass);
            $("#locCityCode").val(loc_city_pass);
            $("#locTownCode").val(loc_town_pass);
            //省市县的名字（中文）
            $("#locProvince").val(loc_province);
            $("#locCity").val(loc_city);
            $("#locTown").val(loc_town);
            $("#detailedAddress").val(company_address);
            $("#companyWeb").val(company_web);
            $("#ICPCode").val(company_icp);
            $("#businessLicense").val(license_number);
            $("#businessLicenseIndate").val(daily_time);
            $("#organizationCode").val(code_number);
            $("#taxRegisterCode").val(tax_code);
            $("#businessScope").val(business_scope);
            $("#legalRepresentativeName").val(legal_name);
            $("#iDCardNo").val(legal_card);
            $("#iDCardIndate").val(legal_time);
            $("#contactsName").val(contact_name);
            $("#contactsIDCardNo").val(contact_card);
            $("#contactsIDCardIndate").val(contact_time);
            $("#contactsPhoneNo").val(contact_phone);
            $("#form").submit();
        };
    });
    /*弹窗消失*/
    $(".pop_hd img,.pop_revised").on("click", function () {
        $("#cover").hide();
        $(".pop_message").hide();
    })

    /*确认*/
    $(".pop_confirm").on("click", function () {
        $("#cover").hide();
        $(".pop_message").hide();
        $("#cover_two").height($(document).height());
        $("#cover_two").show();
        $(".loading").show();
        $("html,body").animate({scrollTop:0},500);
        messageAjax();
    });
    /*所有表单获取焦点*/
    $(".company_box input").on("focus", function () {
        $(this).removeClass("b_color").addClass("b_success_color");
        $(this).siblings(".company_form_tip").hide();
        $(".company_box input").removeClass("b_error_color").addClass("b_color");
    });
    /*所有表单失去焦点*/
    $(".company_box input").on("blur", function () {
        $(this).removeClass("b_success_color").addClass("b_color");
        $(this).removeClass("b_error_color").addClass("b_color");
    });
    $("#long_time").on("click", function () {
        if ($(this).prop("checked")) {
            $("#daily_time").val("");
        }
    });
    $("#daily_time").on("click", function () {
        $("#long_time").attr("checked", false);
    });
    $("#legal_long").on("click", function () {
        if ($(this).prop("checked")) {
            $("#legal_time").val("");
        }
    });
    $("#legal_time").on("click", function () {
        $("#legal_long").attr("checked", false);
    });
    $("#contact_long").on("click", function () {
        if ($(this).prop("checked")) {
            $("#contact_time").val("");
        }
    });
    $("#contact_time").on("click", function () {
        $("#contact_long").attr("checked", false);
    })
});