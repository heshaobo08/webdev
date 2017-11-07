/**
 * 手动选择银行
 * **/
require(['jquery', 'hasher', 'routeService', 'utils'], function ($, hasher, routeService, utils) {
    $(".js_card_type ul li").on("click",function() {
      $(".js_card_type ul li p").removeClass("select_bank_type");
      $(this).find("p").addClass("select_bank_type");
    });
    $(".js_banklist_type ul li").on("click",function() {
      $(".js_banklist_type ul li p").removeClass("select_bank_type");
      $(this).find("p").addClass("select_bank_type");
    });
   
    $(".success_on").on("click",function(){
       
    });
});