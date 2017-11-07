$(function(){
    var temp = 123;
    $("#moeny_number").on("focus",function(){
         $(this).removeClass("b_color").addClass("b_success_color");
         $(this).removeClass("b_error_color").addClass("b_success_color");
         $(".chance_number").show();
         $(".chance_number_error").hide();
    })
    $("#moeny_number").on("blur",function(){
         $(this).removeClass("b_success_color").addClass("b_color");
         var moeny_number = $(this).val();
         if(moeny_number){
            $(".bank_btn").css({"color":"#fff","background-color":"#2b91e6"});
             confirmBank();
         }else{
            $(".bank_btn").off("click");
            $(".bank_btn").css({"color":"#999","background-color":"#ddd"});
            $(".chance_number").hide();
         }
    });
/*确认*/
    function confirmBank(){
       $(".bank_btn").on("click",function(){
        var moeny_number = $("#moeny_number").val();
        if(moeny_number!=temp){
            $("#moeny_number").removeClass("b_success_color").addClass("b_error_color");
            $(".chance_number").hide();
            $(".chance_number_error").show();
            return false;
        }
        $("#moeny_number").removeClass("b_error_color").addClass("b_color");
        $(".chance_number_error").hide();
        alert(111);

     }) 
    }
     
   
})