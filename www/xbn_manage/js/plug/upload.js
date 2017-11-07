/**
 * Created by Cheng Ran on 2015/5/19.
 * 上传插件
 */

//上传
function uploadFile(X /*X对象*/ , options) {

    //默认项
    options.JqueryEle = options.JqueryEle; //放于哪个原素
    options.text = options.text || ''; //文本
    options.uploadData = options.uploadData || {};
    options.successFn = options.successFn || $.loop;
    options.progressFn = options.progressFn || $.loop;
    options.startFn = options.startFn || $.loop;
    options.errorFn = options.errorFn || uploadError;
    options.file_size_limit = options.file_size_limit || '0';
    options.file_types = options.file_types || '*.*';
    options.file_upload_limit = options.file_upload_limit || '0';



    var swfu = '';

    $.ajax({
        url: mXbn.configer.__ROOT_PATH_HOST__ + 'api/auth/sessid',
        type: "get",
        async: false,
        success: function (data) {
            if (data.statusCode == "2000000") {
                options.JqueryEle.css('position', 'relative');
                //结构
                $('<div id="swf_content" style="position: absolute;height:100%;width:100%;left:0;top:0">' +
                    '<div class="upImg">' + options.text + '</div>' +
                    '<form style="width:100px;">' +
                    '<div style="display: inline;width:100%;height:100%;opacity:0;filter:alpha(opacity:0);position: absolute;top:0px;left:0px;">' +
                    '<span id="spanButtonPlaceholder"></span>' +
                    '<input id="btnCancel" style="display:none;" type="button" value="取消所有上传"onclick="cancelUpload();" disabled="disabled" class="btn3_mouseout" />' +
                    '</div>' +
                    '</form>' +
                    '<div id="divFileProgressContainer"  style="display:none"></div>' +
                    '<div id="thumbnails" style="display:none">' +
                    '<table id="infoTable" border="0" width="530" style="display: inline; border: solid 1px #7FAAFF; background-color: #C5D9FF; padding: 2px;margin-top:8px;"></table>' +
                    '</div>' +
                    /*'</div>').appendTo($('.uploadWrap'))*/
                    '</div>').appendTo(options.JqueryEle);




                var sesseionID = data.data;

                swfu = new SWFUpload({
                    upload_url: mXbn.configer.__ROOT_PATH_IMG_HOST__ + "file/image.upload;jsessionid=" + sesseionID,
                    post_params: options.uploadData,
                    use_query_string: true,
                    // File Upload Settings
                    file_size_limit: options.file_size_limit, // 文件大小控制
                    file_types: options.file_types,
                    file_types_description: "All Files",
                    file_upload_limit: options.file_upload_limit,

                    file_queue_error_handler: fileQueueError,
                    file_dialog_complete_handler: fileDialogComplete, //选择好文件后提交
                    file_queued_handler: fileQueued,
                    upload_progress_handler: function (file, bytesLoaded, totalbytes) {
                        options.progressFn && options.progressFn(file, bytesLoaded, totalbytes);
                    },
                    /* upload_error_handler : function(file, errorCode, message){
                     options.errorFn &&  options.errorFn(file, errorCode, message);
                     },*/

                    upload_error_handler: uploadError,

                    upload_success_handler: function (file, serverData) {
                        // options.successFn && options.successFn.call(this,file, serverData,sesseionID,swfu);
                        options.successFn && options.successFn(file, serverData, sesseionID, swfu);



                        var stats = this.getStats();
                        console.log(stats.successful_uploads);


                    },
                    upload_complete_handler: uploadComplete,
                    upload_start_handler: function () {
                        options.startFn && options.startFn();
                    },



                    button_placeholder_id: "spanButtonPlaceholder",
                    button_width: 120,
                    button_height: 18,
                    button_text: '<span class="button">请选择文件 </span>',
                    button_text_style: '.button { font-family: Helvetica, Arial, sans-serif; font-size: 12pt; } .buttonSmall { font-size: 10pt; }',
                    button_text_top_padding: 0,
                    button_text_left_padding: 18,
                    button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                    button_cursor: SWFUpload.CURSOR.HAND,

                    // Flash Settings
                    flash_url: "js/vendor/swfupload/swfupload.swf",

                    custom_settings: {
                        upload_target: "divFileProgressContainer"
                    },

                    auto_upload: true,
                    // Debug Settings
                    debug: false //是否显示调试窗口
                });


            }
        }

    });

    options.JqueryEle.find('object').css({
        width: '100%',
        height: '100%'
    })

    X.uploadArr.push(swfu);

    return swfu;

}



/*//上传
function uploadFile(X,options){

    // alert('upload')
}*/
