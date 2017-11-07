// 获取关联站点主商品状态值
function statuSite(data){
        var status = data.status,  //主状态 
            chkStatus = data.chkStatus,  //审核状态 
            cronStatus = data.cronStatus,  //定时状态 
            operateType = data.operateType,  //操作类型 
            operateMode = data.operateMode,  //操作模式 
            operateStage = data.operateStage; //操作阶段 
        var allStatus = "",
            otherStatus = null;


        if(status == "1"){ //status + otherStatus  = 1 + otherStatus

            if(chkStatus == "0"){
                otherStatus = 1;
            } else if(chkStatus == "1"){
                otherStatus = 2;
            } else if(chkStatus == "2"){
                otherStatus = 3;
            }

        } else if(status == "2"){  //status * 2 + otherStatus  = 4 + otherStatus

            if(chkStatus == "0"){
                otherStatus = 4;
            } else if(chkStatus == "1"){
                otherStatus = 5;
            } else if(chkStatus == "2"){
                otherStatus = 6;
            }

        } else if(status == "3"){  //status * 2 + 1 + otherStatus  = 7 + otherStatus

            if(chkStatus == "0"){
                otherStatus = 7;
            } else if(chkStatus == "1"){
                otherStatus = 8;
            } else if(chkStatus == "2"){
                otherStatus = 9;
            }

        }

        if(cronStatus == "2" && otherStatus == 6){
            allStatus = ""; //后台：无   允许编辑
        } else if (cronStatus == "2" && otherStatus == 9) {
            allStatus = ""; //后台：无   允许编辑
        } else {

            switch(operateType){

                case "UpdateActive":
                    if(otherStatus == 4){ //在线 前台：在线（编辑审核中）后台：无  |  审核中 前台：不显示  后台：在线待审核
                        allStatus = "在线待审核";
                    } else if(otherStatus == 5){
                        allStatus = "审核驳回";
                    } else if(otherStatus == 6){

                        if(cronStatus == "0"){

                            if(operateStage == "ActiveEditEnd"){
                                allStatus = ""; //后台 无
                            } else {
                                allStatus = "在线定时中"; //在线 前台：在线（编辑审核中）后台：无  |  审核中 前台：不显示  后台：在线定时中
                            }

                        } else if (cronStatus == "1"){

                            if(operateStage == "ActiveEditEnd"){
                                allStatus = ""; //允许编辑 //后台 无
                            } else {
                                allStatus = "在线系统驳回"; //允许编辑  //在线 前台：在线（编辑驳回）后台：无  |  审核不通过 前台：不显示  后台：在线系统驳回
                            }

                        } else if (cronStatus == "3"){
                            allStatus = "";//后台 无
                        }

                    } else if(otherStatus == 7){
                        allStatus = "待审核"; //后台 待审核
                    } else if(otherStatus == 8){
                        allStatus = "审核驳回"; //后台 审核驳回 //允许编辑
                    } else if(otherStatus == 9){

                        if(cronStatus == "0"){
                            allStatus = "定时中"; //后台 定时中
                        } else if (cronStatus == "1"){
                            allStatus = "系统驳回"; //后台 系统驳回 //允许编辑
                        } else if (cronStatus == "3"){
                            allStatus = "定时中"; //后台 定时中
                        }

                    }

                    break;

                case "UpdateActivePublish":

                    if(cronStatus == "0"){
                        allStatus = "";//后台 无
                    } else if (cronStatus == "1"){
                        allStatus = "";//后台 无 //允许编辑
                    } else if (cronStatus == "3"){
                        allStatus = "";//后台 无
                    }

                    break;

                case "End":

                    if(cronStatus == "0"){
                        allStatus = "";//后台 无
                    } else if (cronStatus == "1"){
                        allStatus = "允许编辑";//后台 无 //允许编辑
                    } else if (cronStatus == "3"){
                        allStatus = "";//后台 无
                    }

                    break;

                case "UpdateActiveStock": //1

                    if(cronStatus == "0"){
                        allStatus = "";//后台 无
                    } else if (cronStatus == "1"){
                        allStatus = "";//后台 无 //允许编辑
                    } else if (cronStatus == "3"){
                        allStatus = "";//后台 无
                    }

                    break;

                case "UpdateActivePrice": //1

                    if(cronStatus == "0"){
                        allStatus = "";//后台 无
                    } else if (cronStatus == "1"){
                        allStatus = "";//后台 无 //允许编辑
                    } else if (cronStatus == "3"){
                        allStatus = "";//后台 无
                    }

                    break;

                case "UpdateActiveShipping":

                    if(cronStatus == "0"){
                        allStatus = "";//后台 无
                    } else if (cronStatus == "1"){
                        allStatus = "";//后台 无 //允许编辑
                    }

                    break;

                case "UpdateActiveAddress":

                    if(cronStatus == "0"){
                        allStatus = "";//后台 无
                    } else if (cronStatus == "1"){
                        allStatus = "";//后台 无 //允许编辑
                    }

                    break;

                case "Relist":

                    if(cronStatus == "0"){
                        allStatus = ""; //后台 无
                    } else if (cronStatus == "1"){
                        allStatus = ""; //后台 无 //允许编辑
                    } else if (cronStatus == "3"){
                        allStatus = ""; //后台 无
                    }

                    break;

                case "UpdateEndPublish":

                    if(cronStatus == "0"){
                        allStatus = ""; //后台 无
                    } else if (cronStatus == "1"){
                        allStatus = ""; //后台 无 //允许编辑
                    } else if (cronStatus == "3"){
                        allStatus = ""; //后台 无
                    }

                    break;

                case "UpdateEnd"://审核中 编辑下线商品

                    if(otherStatus == 7){
                        allStatus = "待审核"; //后台 待审核
                    } else if(otherStatus == 8){
                        allStatus = "审核驳回"; //后台 审核驳回 //允许编辑
                    } else if(otherStatus == 9){

                        if(cronStatus == "0"){
                            allStatus = "定时中"; //后台 定时中
                        } else if (cronStatus == "1"){
                            allStatus = "系统驳回"; //后台 系统驳回 //允许编辑
                        } else if (cronStatus == "3"){
                            allStatus = "定时中"; //后台 定时中
                        }

                    }

                    break;

                case "CheckPublish"://审核中 审核刊登
                    if(otherStatus == 1){
                        allStatus = "待审核"; //后台 待审核
                    } else if(otherStatus == 2){
                        allStatus = "审核驳回"; //后台 审核驳回 //允许编辑
                    } else if(otherStatus == 3){
                        if(cronStatus == "1"){
                            allStatus = "系统驳回"; //后台 系统驳回 //允许编辑
                        } else {
                            allStatus = "定时中"; //后台 定时中
                        }
                    }
                    break;

                default:
                    allStatus='';


            }

        }

        return allStatus;

    };
