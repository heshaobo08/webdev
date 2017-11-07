$(function(){
    /*向左查看海关*/
    var div_number = $(".customs_name").length-2;
    var number = 0;
    $(".customs_tip_left").on("click",function(){
        number--;
        console.log(Math.abs(number));
        if(Math.abs(number)>div_number){
            $('#cover').height($(document).height());
            $("#cover").show();
            $(".customs_pop_one").show();
            $(".customs_pop_box span").html("已经最后一页了！");
            $("html,body").animate({scrollTop:0},500);
            number=-div_number;
        }
        $(".customs_name_box").animate({"margin-left":number*(487)+"px"},1000);
    });
    
     /*向右查看海关*/
    $(".customs_tip_right").on("click",function(){
        console.log(number);
        if(number==0){
            $('#cover').height($(document).height());
            $("#cover").show();
            $(".customs_pop_one").show();
            $(".customs_pop_box span").html("已经是第一页了！");
            $("html,body").animate({scrollTop:0},500);
            return false;
        }
        number++;
        $(".customs_name_box").animate({"margin-left":number*(487)+"px"},1000);
    });
    
     $(".customs_pop_one em,.customs_pop_btn").on("click",function(){
        $("#cover").hide();
        $(".customs_pop_one").hide();
    });
  
})