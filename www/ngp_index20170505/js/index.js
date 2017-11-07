$(function(){
    $(".nav_list ul li").on("click",function(){
        $(".nav_list ul li").removeClass("nav_ative");
        $(this).addClass("nav_ative");
    })
})