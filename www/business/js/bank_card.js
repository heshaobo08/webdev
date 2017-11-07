$(function(){
    /*三级城市联动*/
	function showLocation(province , city , town) {
		var title	= ['省/直辖市' , '请选择市' , '请选择区（县）'];
		$.each(title , function(k , v) {
			title[k]	= '<option value="">'+v+'</option>';
		})
		
		$('#loc_province').append(title[0]);
		$('#loc_city').append(title[1]);
		$('#loc_town').append(title[2]);
		
		$("#loc_province,#loc_city,#loc_town").select2();
		$('#loc_province').change(function() {
			$('#loc_city').empty();
			$('#loc_city').append(title[1]);
			var _province_id = $('#loc_province').val();
            //console.log(_province_id);
			if(_province_id!=''){
				get_cate_list('loc_city' , $('#loc_province').val(),"2");
			}
			$('#loc_city').change()
		})
		
		$('#loc_city').change(function() {
			$('#loc_town').empty();
			$('#loc_town').append(title[2]);
			var _city_id = $('#loc_city').val();
			if(_city_id!='' && _city_id!='0'){
				get_cate_list('loc_town' , $('#loc_city').val(),"3");
			}
			$('#loc_town').change()
		})
		
		$('#loc_town').change(function() {
			var _town_id = $(this).val();
			$('input[name=location_id]').val(_town_id);
			/*if(_town_id!='' && _town_id!='0'){
				change_url($(this).val());
			}*/
			
		})
		get_cate_list('loc_province' , '',"1");	
	}
	showLocation();
    function get_cate_list(el_id , loc_id,role) {
		var el	= $('#'+el_id); 
		$.ajax({
	           type: "GET",
	           url: "http://192.168.4.108:8080/test/three/select",
			   data: {'id':loc_id,'role':role},
			   dataType: 'jsonp',
               jsonp:'callback',
	           success: function(data){
	               //console.log(data);
				 $.each(data , function(k , v) {
						var option	= '<option value="'+v.id+'">'+v.name+'</option>';
						el.append(option);
				})
			   },
            error: function(){
                console.log("请求失败!");
            }
	    });	
	}
    
   function openBank(id){
       var title	= ['请选择'];
		$.each(title , function(k , v) {
			title[k]	= '<option value="">'+v+'</option>';
		})
		
       $('#'+id).append(title[0]);
       $("#"+id).select2();
       $('#'+id).change(function() {
			
		});
     get_cate_list(id , '',"1");	  
   } 
   openBank("open_bank");
   openBank("open_bank_name");
    
})