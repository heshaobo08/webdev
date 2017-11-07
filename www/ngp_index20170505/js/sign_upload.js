$(function(){
    var uploader = WebUploader.create({

    // swf文件路径
    swf: '/js/plug/upload/Uploader.swf',

    // 文件接收服务端。
    server: '',
    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: {
        id: '#picker',
        label: '',
        multiple:false
        },
    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
    resize: false
    });
    // 当有文件被添加进队列的时候
    var $list = $("#thelist");
    uploader.on( 'fileQueued', function( file ) {
    $list.append( '<div id="' + file.id + '" class="item">' +
        '<h4 class="info">' + file.name + '</h4>' +
        '<p class="state">等待上传...</p>' +
        '<div class="del"><img src="images/sign_dot_one.png"></div>' +
    '</div>' );
    });
    
    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
    var $li = $( '#'+file.id ),
        $percent = $li.find('.progress .progress-bar');

    // 避免重复创建
    if ( !$percent.length ) {
        $percent = $('<div class="progress progress-striped active">' +
          '<div class="progress-bar" role="progressbar" style="width: 0%">' +
          '</div>' +
        '</div>').appendTo( $li ).find('.progress-bar');
    }

    $li.find('p.state').text('上传中');

    $percent.css( 'width', percentage * 100 + '%' );
    });
    
    uploader.on( 'uploadSuccess', function( file ) {
        $( '#'+file.id ).find('p.state').text('已上传');
    });

    uploader.on( 'uploadError', function( file ) {
        $( '#'+file.id ).find('p.state').text('上传出错');
    });

    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').fadeOut();
    });
    
    var $btn = $("#ctlBtn");
    $btn.on("click",function(){
        uploader.upload();
    })
    
    
    //删除
    $list.on("click", ".del", function () {
        var $ele = $(this);
        var id = $ele.parent().attr("id");
        uploader.removeFile(id);
        $("#"+id).hide();
        
    });
 
    uploader.onError = function( code ) {
			switch( code ) {
				case 'Q_EXCEED_NUM_LIMIT':
					var text = '文件数量超出';
					var t_num=1;
					break;

				case 'Q_TYPE_DENIED':
					var text = '不符合上传格式';
					break;
				case 'F_DUPLICATE':
					var text = '文件重复';
					break;

				case 'F_EXCEED_SIZE':
					var text = '文件大小超出';
					break;

				default:
					var text = '上传失败，请重试';
					break;
			}
			var _height=$(document).height();
			$("#cover").css("height",_height);
			$("#cover").show();
			$(".pop_sign_upload p em").html(text);
			$(".pop_sign_upload").show();
            $("html,body").animate({scrollTop:0},500);
			$(".ngp_pop_btn").on("click",function(){
				$(".pop_sign_upload").hide();
				$("#cover").hide();
			});
        };
    
    
    uploader.onUploadSuccess=function(file,res){
        
    }

})