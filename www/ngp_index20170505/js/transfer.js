$(function(){
  var off = true;
  $(".transfer_look_details").on("click",function(){
      if(off){
          $(".transfer_bank_details_one").slideDown();
          $(this).find("img").attr("src","images/transfer_tip2.png");
          $(".transfer_bank_details").css("border-bottom","none");
          off = false;
      }else{
          $(".transfer_bank_details_one").slideUp();
          $(this).find("img").attr("src","images/transfer_tip.png");
          $(".transfer_bank_details").css("border-bottom","");
          off = true;
      }
      
  });
  
    $(".transfer_fee img").on("click",function(e){
      e.stopPropagation();
      $(".transfer_fee_box").show();
    });
    $(document).click(function(){
        $(".transfer_fee_box").hide();
    });
  
  /*转账选项卡*/
    $(".transaction_tab_l ul li").on("click",function(){
        $(".transaction_tab_l ul li").removeClass("tab_active");
        $(this).addClass("tab_active");
        $(".transaction_query").hide();
        $(".transaction_query:eq('"+$(this).index()+"')").show();
        
    });
    
    $(".transfer_btn").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".ngp_pop_sex").show();
    });
    $(".ngp_pop_sex em").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_sex").hide();
    });
    
    $(".upload_btn").on("click",function(){
        $("#cover").height($(document).height());
        $("#cover").show();
        $(".ngp_pop_sex").show();
    });
    $(".ngp_pop_sex em").on("click",function(){
        $("#cover").hide();
        $(".ngp_pop_sex").hide();
    });
    
    
    /*获取上传后的文件名字*/
    $(".tr_upload").on("change","input[type='file']",function(){
    var filePath=$(this).val();
    if(filePath.indexOf("xls")!=-1 || filePath.indexOf("xlsx")!=-1){
        var arr=filePath.split('\\');
        var fileName=arr[arr.length-1];
        $(".tr_upload em").html(fileName);
    }else{
        $(".tr_upload em").html("文件类型有误");
        return false 
    }
});
    
    
/*备注*/
$(".transfer_note input").on("click",function(e){
    $(".transfer_note_box").hide();
    $(this).siblings(".transfer_note_box").show();
    e.stopPropagation(); 
});  
$(".transfer_note_box ul li").on("click",function(e){
    $(this).parent().parent().siblings("input").val($(this).text());
});
$(document).click(function(){
    $(".transfer_note_box").hide();
});
    
    
})