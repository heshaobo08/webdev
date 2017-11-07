$(function(){
     /*获取上传后的文件名字*/
    $(".tr_upload").on("change","input[type='file']",function(){
        var filePath=$(this).val();
        if(filePath.indexOf("xls")!=-1 || filePath.indexOf("xlsx")!=-1){
            var arr=filePath.split('\\');
            var fileName=arr[arr.length-1].substring(0,10);
            $(".tr_upload em").html(fileName);
            $("#customs_btn_next").removeClass("customs_btn_dis").addClass("customs_btn");
        }else{
            $('#cover').height($(document).height());
            $("#cover").show();
            $(".customs_pop_one").show();
            $(".customs_pop_box span").html("上传文件格式错误！")
            $("html,body").animate({scrollTop:0},500);
            $("#customs_btn_next").removeClass("customs_btn").addClass("customs_btn_dis");
            return false 
        }
    });
    
    $(".customs_pop_one em,.customs_pop_btn").on("click",function(){
        $("#cover").hide();
        $(".customs_pop_one").hide();
    });
    
    /*点击下一步*/
    $("#customs_btn_next").on("click",function(){
        if($(this).hasClass('customs_btn_dis')){
            return false;
        }
       
    });
})