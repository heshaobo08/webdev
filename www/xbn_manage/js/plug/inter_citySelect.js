! function ($) {
    $.fn.citySelect = function (option) {
        var defaults = {
            pId:'',
            setId: ["jd-province","jd-city" ,"jd-county"],
            setText: ["请选择省份", "请选择城市", "请选择地区"],
            setVal: ["", "", ""]
        };
        var opt=$.extend(defaults,option),
            oParentBox=opt.pId || 'body',
            oProvince=$('#'+opt.setId[0]),
            oCity=$('#'+opt.setId[1]),
            oArea=$('#'+opt.setId[2]),
            provinceCode=opt.setVal[0],
            cityCode=opt.setVal[1],
            areaCode=opt.setVal[2],
            provinceHtml='',
            cityHtml='',
            areaHtml='',
            newData=$.fn.citySelect.getNewCityData();


        // 设置联动下拉html
        provinceHtml=$.fn.citySelect.setHtml(newData,'chinese','',provinceCode,oProvince);
        oProvince.find('ul').html("<li index-data=''><span>请选择省份</span></li>"+provinceHtml);
        // 城市
        if(cityCode){
            cityHtml=$.fn.citySelect.setHtml(newData,'pro',provinceCode,cityCode,oCity);
            oCity.find('ul').html("<li index-data=''><span>请选择城市</span></li>"+cityHtml);
        }
        // 地区
        if(areaCode){
            areaHtml=$.fn.citySelect.setHtml(newData,'city',cityCode,areaCode,oArea);
            oArea.find('ul').html("<li index-data=''><span>请选择地区</span></li>"+areaHtml);
        }

        selectFn('.select');

        function selectFn(ele) {
            // 下拉显示
            sele(ele,oParentBox,function (index,val) {
                // 省份
                if(this.attr('id')==opt.setId[0]){
                    oCity.find('i').attr('index-data','').html('请选择');
                    oCity.find('input').attr('index-data','').val('');
                    oArea.find('i').attr('index-data','').html('请选择');
                    oArea.find('input').attr('index-data','').val('');
                    oArea.find('ul').html('');
                    cityHtml=$.fn.citySelect.setHtml(newData,'pro',index,'',oCity);
                    oCity.find('ul').html("<li index-data=''><span>请选择城市</span></li>"+cityHtml);
                }else if(this.attr('id')==opt.setId[1]){
                    oArea.find('i').attr('index-data','').html('请选择');
                    oArea.find('input').attr('index-data','').val('');
                    areaHtml=$.fn.citySelect.setHtml(newData,'city',index,'',oArea);
                    oArea.find('ul').html("<li index-data=''><span>请选择地区</span></li>"+areaHtml);
                }else if(this.attr('id')==opt.setId[2]){
                    //地区
                    oArea.find('input,i').attr('index-dis',this.find('li.active').attr('index-dis'));
                }
            });
        }

    };

    $.fn.citySelect.getNewCityData=function () {
      var addressData=$.fn.citySelect.addressData;
      var newData={pro:{},city:{},dis:{}};

      $.each(addressData.pro,function (i,pro) {
        newData.pro[pro.ProID]=$.extend({},pro);
      });
      // 城市
      $.each(addressData.city,function (i,city) {
          var id=city.CityID,
              pId=city.ProID;
          newData.city[id]=$.extend({},city);
          if(newData.pro[pId] && typeof newData.pro[pId].children=='undefined'){
              newData.pro[pId].children=[];
          }
          if(newData.pro[pId] && typeof newData.pro[pId].children){
              newData.pro[pId].children.push(newData.city[id]);
          }

      });
      // 地区
      $.each(addressData.dis,function (i,area) {
          var id=area.Id,
              pId=area.CityID;
          newData.dis[id]=$.extend({},area);
          if(newData.city[pId] && typeof newData.city[pId].children=='undefined'){
              newData.city[pId].children=[];
          }
          if(newData.city[pId] && typeof newData.city[pId].children!='undefined'){
              newData.city[pId].children.push(newData.dis[id]);
          }

      });
      return newData;
    };

    $.fn.citySelect.getAreaVal=function () {
      var newData=$.fn.citySelect.getNewCityData();
      var proData=arguments[0]?newData['pro'][arguments[0]]:'',
          cityData=arguments[1]?newData['city'][arguments[1]]:'',
          disData=arguments[2]?newData['dis'][arguments[2]]:'';
        //return arguments.length?((proData?proData.ProName:'')+(cityData?'，'+cityData.CityName:'')+(disData?'，'+disData.DisName:'')):false;
      var returnAdd=[];
      if(proData && proData.ProName){
        returnAdd.push(proData.ProName);
      }
      if(cityData && cityData.CityName){
        returnAdd.push(cityData.CityName);
      }
      if(disData && disData.DisName){
        returnAdd.push(disData.DisName);
      }
      return returnAdd.join(',');
    }



    $.fn.citySelect.setHtml=function(newData,type,Code,selectCode,dom){
        var returnHtml='',
            addressData=newData,
            disData=null;
        if(type=='chinese'){
            disData=addressData.pro;
        }else if(type && addressData[type][Code]){
            disData=addressData[type][Code].children;
        }else{
            return '';
        }

        if( typeof disData == "undefined" ){
            disData = [];
        }

        $.each(disData,function (i,area) {
            var showClass='',
                selectName='',
                showName='',
                selectCode='';
            if(type=='city'){
                selectName='Id';
                selectCode='district_code';
                showName='DisName';
            }else if(type=='pro'){
                selectName='CityID';
                showName='CityName';
            }else if(type=='chinese'){
                selectName='ProID';
                showName='ProName';
            }
            if(selectCode && selectCode==area[selectName]){
                showClass="class='active'";
                //地区选择
                if(type=='city'){
                    dom.find('i').attr({"index-data":area[selectName],"index-dis":area[selectCode]}).html(area[showName]);
                    dom.find('input').attr({"index-data":area[selectName],"index-dis":area[selectCode]}).val(area[showName]);
                }else{
                    dom.find('i').html(area[showName]);
                    dom.find('input').attr("index-data",area[selectName]).val(area[showName]);
                }
            }
            returnHtml+="<li index-data='" + area[selectName] + "'"+(type=='city'?("index-dis='"+area[selectCode]+"'"):'')+ showClass;
            returnHtml+="><span>" + area[showName] + "</span></li>";
        });
        return returnHtml;
    }

    $.fn.citySelect.addressData = {
    "pro": [{
        "ProID": 1,
        "ProName": "北京",
        "ProSort": 1,
        "ProRemark": "直辖市",
        "ProNameEnglish": "Beijing",
        "ProRemarkEnglish": "Municipality"
    },
    {
        "ProID": 2,
        "ProName": "天津",
        "ProSort": 2,
        "ProRemark": "直辖市",
        "ProNameEnglish": "Tianjin",
        "ProRemarkEnglish": "Municipality"
    },
    {
        "ProID": 3,
        "ProName": "河北",
        "ProSort": 5,
        "ProRemark": "省份",
        "ProNameEnglish": "Hebei",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 4,
        "ProName": "山西",
        "ProSort": 6,
        "ProRemark": "省份",
        "ProNameEnglish": "Shanxi",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 5,
        "ProName": "内蒙古",
        "ProSort": 32,
        "ProRemark": "自治区",
        "ProNameEnglish": "Inner Mongolia",
        "ProRemarkEnglish": "Autonomous Region"
    },
    {
        "ProID": 6,
        "ProName": "辽宁",
        "ProSort": 8,
        "ProRemark": "省份",
        "ProNameEnglish": "Liaoning",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 7,
        "ProName": "吉林",
        "ProSort": 9,
        "ProRemark": "省份",
        "ProNameEnglish": "Jilin",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 8,
        "ProName": "黑龙江",
        "ProSort": 10,
        "ProRemark": "省份",
        "ProNameEnglish": "Heilongjiang",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 9,
        "ProName": "上海",
        "ProSort": 3,
        "ProRemark": "直辖市",
        "ProNameEnglish": "Shanghai",
        "ProRemarkEnglish": "Municipality"
    },
    {
        "ProID": 10,
        "ProName": "江苏",
        "ProSort": 11,
        "ProRemark": "省份",
        "ProNameEnglish": "Jiangsu",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 11,
        "ProName": "浙江",
        "ProSort": 12,
        "ProRemark": "省份",
        "ProNameEnglish": "Zhejiang",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 12,
        "ProName": "安徽",
        "ProSort": 13,
        "ProRemark": "省份",
        "ProNameEnglish": "Anhui",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 13,
        "ProName": "福建",
        "ProSort": 14,
        "ProRemark": "省份",
        "ProNameEnglish": "Fujian",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 14,
        "ProName": "江西",
        "ProSort": 15,
        "ProRemark": "省份",
        "ProNameEnglish": "Jiangxi",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 15,
        "ProName": "山东",
        "ProSort": 16,
        "ProRemark": "省份",
        "ProNameEnglish": "Shandong",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 16,
        "ProName": "河南",
        "ProSort": 17,
        "ProRemark": "省份",
        "ProNameEnglish": "Henan",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 17,
        "ProName": "湖北",
        "ProSort": 18,
        "ProRemark": "省份",
        "ProNameEnglish": "Hubei",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 18,
        "ProName": "湖南",
        "ProSort": 19,
        "ProRemark": "省份",
        "ProNameEnglish": "Hunan",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 19,
        "ProName": "广东",
        "ProSort": 20,
        "ProRemark": "省份",
        "ProNameEnglish": "Guangdong",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 20,
        "ProName": "海南",
        "ProSort": 24,
        "ProRemark": "省份",
        "ProNameEnglish": "Hainan",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 21,
        "ProName": "广西",
        "ProSort": 28,
        "ProRemark": "自治区",
        "ProNameEnglish": "Guangxi",
        "ProRemarkEnglish": "Autonomous Region"
    },
    {
        "ProID": 22,
        "ProName": "甘肃",
        "ProSort": 21,
        "ProRemark": "省份",
        "ProNameEnglish": "Gansu",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 23,
        "ProName": "陕西",
        "ProSort": 27,
        "ProRemark": "省份",
        "ProNameEnglish": "Shaanxi",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 24,
        "ProName": "新疆",
        "ProSort": 31,
        "ProRemark": "自治区",
        "ProNameEnglish": "Xinjiang",
        "ProRemarkEnglish": "Autonomous Region"
    },
    {
        "ProID": 25,
        "ProName": "青海",
        "ProSort": 26,
        "ProRemark": "省份",
        "ProNameEnglish": "Qinghai",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 26,
        "ProName": "宁夏",
        "ProSort": 30,
        "ProRemark": "自治区",
        "ProNameEnglish": "Ningxia",
        "ProRemarkEnglish": "Autonomous Region"
    },
    {
        "ProID": 27,
        "ProName": "重庆",
        "ProSort": 4,
        "ProRemark": "直辖市",
        "ProNameEnglish": "Chongqing",
        "ProRemarkEnglish": "Municipality"
    },
    {
        "ProID": 28,
        "ProName": "四川",
        "ProSort": 22,
        "ProRemark": "省份",
        "ProNameEnglish": "Sichuan",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 29,
        "ProName": "贵州",
        "ProSort": 23,
        "ProRemark": "省份",
        "ProNameEnglish": "Guizhou",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 30,
        "ProName": "云南",
        "ProSort": 25,
        "ProRemark": "省份",
        "ProNameEnglish": "Yunnan",
        "ProRemarkEnglish": "Province"
    },
    {
        "ProID": 31,
        "ProName": "西藏",
        "ProSort": 29,
        "ProRemark": "自治区",
        "ProNameEnglish": "Tibet",
        "ProRemarkEnglish": "Autonomous Region"
    }],
    "city": [{
        "CityID": 110100,
        "CityName": "北京",
        "ProID": 1,
        "CitySort": 1,
        "CityNameEnglish": "Beijing"
    },
    {
        "CityID": 120100,
        "CityName": "天津",
        "ProID": 2,
        "CitySort": 2,
        "CityNameEnglish": "Tianjin"
    },
    {
        "CityID": 310100,
        "CityName": "上海",
        "ProID": 9,
        "CitySort": 9,
        "CityNameEnglish": "Shanghai"
    },
    {
        "CityID": 500100,
        "CityName": "重庆",
        "ProID": 27,
        "CitySort": 9,
        "CityNameEnglish": "Chongqing"
    },
    {
        "CityID": 5,
        "CityName": "邯郸市",
        "ProID": 3,
        "CitySort": 5,
        "CityNameEnglish": "Handan"
    },
    {
        "CityID": 6,
        "CityName": "石家庄市",
        "ProID": 3,
        "CitySort": 6,
        "CityNameEnglish": "Shijiazhuang"
    },
    {
        "CityID": 7,
        "CityName": "保定市",
        "ProID": 3,
        "CitySort": 7,
        "CityNameEnglish": "Baoding"
    },
    {
        "CityID": 8,
        "CityName": "张家口市",
        "ProID": 3,
        "CitySort": 8,
        "CityNameEnglish": "Zhangjiakou"
    },
    {
        "CityID": 9,
        "CityName": "承德市",
        "ProID": 3,
        "CitySort": 9,
        "CityNameEnglish": "Chengde"
    },
    {
        "CityID": 10,
        "CityName": "唐山市",
        "ProID": 3,
        "CitySort": 10,
        "CityNameEnglish": "Tangshan"
    },
    {
        "CityID": 11,
        "CityName": "廊坊市",
        "ProID": 3,
        "CitySort": 11,
        "CityNameEnglish": "Langfang"
    },
    {
        "CityID": 12,
        "CityName": "沧州市",
        "ProID": 3,
        "CitySort": 12,
        "CityNameEnglish": "Cangzhou"
    },
    {
        "CityID": 13,
        "CityName": "衡水市",
        "ProID": 3,
        "CitySort": 13,
        "CityNameEnglish": "Hengshui"
    },
    {
        "CityID": 14,
        "CityName": "邢台市",
        "ProID": 3,
        "CitySort": 14,
        "CityNameEnglish": "Xingtai"
    },
    {
        "CityID": 16,
        "CityName": "朔州市",
        "ProID": 4,
        "CitySort": 16,
        "CityNameEnglish": "Shuozhou"
    },
    {
        "CityID": 17,
        "CityName": "忻州市",
        "ProID": 4,
        "CitySort": 17,
        "CityNameEnglish": "Xinzhou"
    },
    {
        "CityID": 18,
        "CityName": "太原市",
        "ProID": 4,
        "CitySort": 18,
        "CityNameEnglish": "Taiyuan"
    },
    {
        "CityID": 19,
        "CityName": "大同市",
        "ProID": 4,
        "CitySort": 19,
        "CityNameEnglish": "Datong"
    },
    {
        "CityID": 20,
        "CityName": "阳泉市",
        "ProID": 4,
        "CitySort": 20,
        "CityNameEnglish": "Yangquan"
    },
    {
        "CityID": 21,
        "CityName": "晋中市",
        "ProID": 4,
        "CitySort": 21,
        "CityNameEnglish": "Jinzhong"
    },
    {
        "CityID": 22,
        "CityName": "长治市",
        "ProID": 4,
        "CitySort": 22,
        "CityNameEnglish": "Changzhi"
    },
    {
        "CityID": 23,
        "CityName": "晋城市",
        "ProID": 4,
        "CitySort": 23,
        "CityNameEnglish": "Jincheng"
    },
    {
        "CityID": 24,
        "CityName": "临汾市",
        "ProID": 4,
        "CitySort": 24,
        "CityNameEnglish": "Linfen"
    },
    {
        "CityID": 25,
        "CityName": "吕梁市",
        "ProID": 4,
        "CitySort": 25,
        "CityNameEnglish": "Lvliang"
    },
    {
        "CityID": 26,
        "CityName": "运城市",
        "ProID": 4,
        "CitySort": 26,
        "CityNameEnglish": "Yuncheng"
    },
    {
        "CityID": 27,
        "CityName": "沈阳市",
        "ProID": 6,
        "CitySort": 27,
        "CityNameEnglish": "Shenyang"
    },
    {
        "CityID": 28,
        "CityName": "铁岭市",
        "ProID": 6,
        "CitySort": 28,
        "CityNameEnglish": "Tieling"
    },
    {
        "CityID": 29,
        "CityName": "大连市",
        "ProID": 6,
        "CitySort": 29,
        "CityNameEnglish": "Dalian"
    },
    {
        "CityID": 30,
        "CityName": "鞍山市",
        "ProID": 6,
        "CitySort": 30,
        "CityNameEnglish": "Anshan"
    },
    {
        "CityID": 31,
        "CityName": "抚顺市",
        "ProID": 6,
        "CitySort": 31,
        "CityNameEnglish": "Fushun"
    },
    {
        "CityID": 32,
        "CityName": "本溪市",
        "ProID": 6,
        "CitySort": 32,
        "CityNameEnglish": "Benxi"
    },
    {
        "CityID": 33,
        "CityName": "丹东市",
        "ProID": 6,
        "CitySort": 33,
        "CityNameEnglish": "Dandong"
    },
    {
        "CityID": 34,
        "CityName": "锦州市",
        "ProID": 6,
        "CitySort": 34,
        "CityNameEnglish": "Jinzhou"
    },
    {
        "CityID": 35,
        "CityName": "营口市",
        "ProID": 6,
        "CitySort": 35,
        "CityNameEnglish": "Yingkou"
    },
    {
        "CityID": 36,
        "CityName": "阜新市",
        "ProID": 6,
        "CitySort": 36,
        "CityNameEnglish": "Fuxin"
    },
    {
        "CityID": 37,
        "CityName": "辽阳市",
        "ProID": 6,
        "CitySort": 37,
        "CityNameEnglish": "Liaoyang"
    },
    {
        "CityID": 38,
        "CityName": "朝阳市",
        "ProID": 6,
        "CitySort": 38,
        "CityNameEnglish": "Chaoyang"
    },
    {
        "CityID": 39,
        "CityName": "盘锦市",
        "ProID": 6,
        "CitySort": 39,
        "CityNameEnglish": "Panjin"
    },
    {
        "CityID": 40,
        "CityName": "葫芦岛市",
        "ProID": 6,
        "CitySort": 40,
        "CityNameEnglish": "Huludao"
    },
    {
        "CityID": 41,
        "CityName": "长春市",
        "ProID": 7,
        "CitySort": 41,
        "CityNameEnglish": "Changchun"
    },
    {
        "CityID": 42,
        "CityName": "吉林市",
        "ProID": 7,
        "CitySort": 42,
        "CityNameEnglish": "Jilin"
    },
    {
        "CityID": 43,
        "CityName": "延边朝鲜族自治州",
        "ProID": 7,
        "CitySort": 43,
        "CityNameEnglish": "Yanbian"
    },
    {
        "CityID": 44,
        "CityName": "四平市",
        "ProID": 7,
        "CitySort": 44,
        "CityNameEnglish": "Siping"
    },
    {
        "CityID": 45,
        "CityName": "通化市",
        "ProID": 7,
        "CitySort": 45,
        "CityNameEnglish": "Tonghua"
    },
    {
        "CityID": 46,
        "CityName": "白城市",
        "ProID": 7,
        "CitySort": 46,
        "CityNameEnglish": "Baicheng"
    },
    {
        "CityID": 47,
        "CityName": "辽源市",
        "ProID": 7,
        "CitySort": 47,
        "CityNameEnglish": "Liaoyuan"
    },
    {
        "CityID": 48,
        "CityName": "松原市",
        "ProID": 7,
        "CitySort": 48,
        "CityNameEnglish": "Songyuan"
    },
    {
        "CityID": 49,
        "CityName": "白山市",
        "ProID": 7,
        "CitySort": 49,
        "CityNameEnglish": "Baishan"
    },
    {
        "CityID": 50,
        "CityName": "哈尔滨市",
        "ProID": 8,
        "CitySort": 50,
        "CityNameEnglish": "Harbin"
    },
    {
        "CityID": 51,
        "CityName": "齐齐哈尔市",
        "ProID": 8,
        "CitySort": 51,
        "CityNameEnglish": "Qiqihar"
    },
    {
        "CityID": 52,
        "CityName": "鸡西市",
        "ProID": 8,
        "CitySort": 52,
        "CityNameEnglish": "Jixi"
    },
    {
        "CityID": 53,
        "CityName": "牡丹江市",
        "ProID": 8,
        "CitySort": 53,
        "CityNameEnglish": "Mudanjiang"
    },
    {
        "CityID": 54,
        "CityName": "七台河市",
        "ProID": 8,
        "CitySort": 54,
        "CityNameEnglish": "Qitaihe"
    },
    {
        "CityID": 55,
        "CityName": "佳木斯市",
        "ProID": 8,
        "CitySort": 55,
        "CityNameEnglish": "Jiamusi"
    },
    {
        "CityID": 56,
        "CityName": "鹤岗市",
        "ProID": 8,
        "CitySort": 56,
        "CityNameEnglish": "Hegang"
    },
    {
        "CityID": 57,
        "CityName": "双鸭山市",
        "ProID": 8,
        "CitySort": 57,
        "CityNameEnglish": "Shuangyashan"
    },
    {
        "CityID": 58,
        "CityName": "绥化市",
        "ProID": 8,
        "CitySort": 58,
        "CityNameEnglish": "Suihua"
    },
    {
        "CityID": 59,
        "CityName": "黑河市",
        "ProID": 8,
        "CitySort": 59,
        "CityNameEnglish": "Heihe"
    },
    {
        "CityID": 60,
        "CityName": "大兴安岭地区",
        "ProID": 8,
        "CitySort": 60,
        "CityNameEnglish": "DaXingAnLing"
    },
    {
        "CityID": 61,
        "CityName": "伊春市",
        "ProID": 8,
        "CitySort": 61,
        "CityNameEnglish": "Yichun"
    },
    {
        "CityID": 62,
        "CityName": "大庆市",
        "ProID": 8,
        "CitySort": 62,
        "CityNameEnglish": "Daqing"
    },
    {
        "CityID": 63,
        "CityName": "南京市",
        "ProID": 10,
        "CitySort": 63,
        "CityNameEnglish": "Nanjing"
    },
    {
        "CityID": 64,
        "CityName": "无锡市",
        "ProID": 10,
        "CitySort": 64,
        "CityNameEnglish": "Wuxi"
    },
    {
        "CityID": 65,
        "CityName": "镇江市",
        "ProID": 10,
        "CitySort": 65,
        "CityNameEnglish": "Zhenjiang"
    },
    {
        "CityID": 66,
        "CityName": "苏州市",
        "ProID": 10,
        "CitySort": 66,
        "CityNameEnglish": "Suzhou"
    },
    {
        "CityID": 67,
        "CityName": "南通市",
        "ProID": 10,
        "CitySort": 67,
        "CityNameEnglish": "Nantong"
    },
    {
        "CityID": 68,
        "CityName": "扬州市",
        "ProID": 10,
        "CitySort": 68,
        "CityNameEnglish": "Yangzhou"
    },
    {
        "CityID": 69,
        "CityName": "盐城市",
        "ProID": 10,
        "CitySort": 69,
        "CityNameEnglish": "Yancheng"
    },
    {
        "CityID": 70,
        "CityName": "徐州市",
        "ProID": 10,
        "CitySort": 70,
        "CityNameEnglish": "Xuzhou"
    },
    {
        "CityID": 71,
        "CityName": "淮安市",
        "ProID": 10,
        "CitySort": 71,
        "CityNameEnglish": "Huaian"
    },
    {
        "CityID": 72,
        "CityName": "连云港市",
        "ProID": 10,
        "CitySort": 72,
        "CityNameEnglish": "Lianyungang"
    },
    {
        "CityID": 73,
        "CityName": "常州市",
        "ProID": 10,
        "CitySort": 73,
        "CityNameEnglish": "Changzhou"
    },
    {
        "CityID": 74,
        "CityName": "泰州市",
        "ProID": 10,
        "CitySort": 74,
        "CityNameEnglish": "Taizhou"
    },
    {
        "CityID": 75,
        "CityName": "宿迁市",
        "ProID": 10,
        "CitySort": 75,
        "CityNameEnglish": "Suqian"
    },
    {
        "CityID": 76,
        "CityName": "舟山市",
        "ProID": 11,
        "CitySort": 76,
        "CityNameEnglish": "Zhoushan"
    },
    {
        "CityID": 77,
        "CityName": "衢州市",
        "ProID": 11,
        "CitySort": 77,
        "CityNameEnglish": "Quzhou"
    },
    {
        "CityID": 78,
        "CityName": "杭州市",
        "ProID": 11,
        "CitySort": 78,
        "CityNameEnglish": "Hangzhou"
    },
    {
        "CityID": 79,
        "CityName": "湖州市",
        "ProID": 11,
        "CitySort": 79,
        "CityNameEnglish": "Huzhou"
    },
    {
        "CityID": 80,
        "CityName": "嘉兴市",
        "ProID": 11,
        "CitySort": 80,
        "CityNameEnglish": "Jiaxing"
    },
    {
        "CityID": 81,
        "CityName": "宁波市",
        "ProID": 11,
        "CitySort": 81,
        "CityNameEnglish": "Ningbo"
    },
    {
        "CityID": 82,
        "CityName": "绍兴市",
        "ProID": 11,
        "CitySort": 82,
        "CityNameEnglish": "Shaoxing"
    },
    {
        "CityID": 83,
        "CityName": "温州市",
        "ProID": 11,
        "CitySort": 83,
        "CityNameEnglish": "Wenzhou"
    },
    {
        "CityID": 84,
        "CityName": "丽水市",
        "ProID": 11,
        "CitySort": 84,
        "CityNameEnglish": "Lishui"
    },
    {
        "CityID": 85,
        "CityName": "金华市",
        "ProID": 11,
        "CitySort": 85,
        "CityNameEnglish": "Jinhua"
    },
    {
        "CityID": 86,
        "CityName": "台州市",
        "ProID": 11,
        "CitySort": 86,
        "CityNameEnglish": "Taizhou"
    },
    {
        "CityID": 87,
        "CityName": "合肥市",
        "ProID": 12,
        "CitySort": 87,
        "CityNameEnglish": "Hefei"
    },
    {
        "CityID": 88,
        "CityName": "芜湖市",
        "ProID": 12,
        "CitySort": 88,
        "CityNameEnglish": "Wuhu"
    },
    {
        "CityID": 89,
        "CityName": "蚌埠市",
        "ProID": 12,
        "CitySort": 89,
        "CityNameEnglish": "Bengbu"
    },
    {
        "CityID": 90,
        "CityName": "淮南市",
        "ProID": 12,
        "CitySort": 90,
        "CityNameEnglish": "Huainan"
    },
    {
        "CityID": 91,
        "CityName": "马鞍山市",
        "ProID": 12,
        "CitySort": 91,
        "CityNameEnglish": "Ma'anshan"
    },
    {
        "CityID": 92,
        "CityName": "淮北市",
        "ProID": 12,
        "CitySort": 92,
        "CityNameEnglish": "Huaibei"
    },
    {
        "CityID": 93,
        "CityName": "铜陵市",
        "ProID": 12,
        "CitySort": 93,
        "CityNameEnglish": "Tongling"
    },
    {
        "CityID": 94,
        "CityName": "安庆市",
        "ProID": 12,
        "CitySort": 94,
        "CityNameEnglish": "Anqing"
    },
    {
        "CityID": 95,
        "CityName": "黄山市",
        "ProID": 12,
        "CitySort": 95,
        "CityNameEnglish": "Huangshan"
    },
    {
        "CityID": 96,
        "CityName": "滁州市",
        "ProID": 12,
        "CitySort": 96,
        "CityNameEnglish": "Chuzhou"
    },
    {
        "CityID": 97,
        "CityName": "阜阳市",
        "ProID": 12,
        "CitySort": 97,
        "CityNameEnglish": "Fuyang"
    },
    {
        "CityID": 98,
        "CityName": "宿州市",
        "ProID": 12,
        "CitySort": 98,
        "CityNameEnglish": "Suzhou"
    },
    {
        "CityID": 99,
        "CityName": "巢湖市",
        "ProID": 12,
        "CitySort": 99,
        "CityNameEnglish": "Chaohu"
    },
    {
        "CityID": 100,
        "CityName": "六安市",
        "ProID": 12,
        "CitySort": 100,
        "CityNameEnglish": "Lu'an"
    },
    {
        "CityID": 101,
        "CityName": "亳州市",
        "ProID": 12,
        "CitySort": 101,
        "CityNameEnglish": "Bozhou"
    },
    {
        "CityID": 102,
        "CityName": "池州市",
        "ProID": 12,
        "CitySort": 102,
        "CityNameEnglish": "Chizhou"
    },
    {
        "CityID": 103,
        "CityName": "宣城市",
        "ProID": 12,
        "CitySort": 103,
        "CityNameEnglish": "Xuancheng"
    },
    {
        "CityID": 104,
        "CityName": "福州市",
        "ProID": 13,
        "CitySort": 104,
        "CityNameEnglish": "Fuzhou"
    },
    {
        "CityID": 105,
        "CityName": "厦门市",
        "ProID": 13,
        "CitySort": 105,
        "CityNameEnglish": "Xiamen"
    },
    {
        "CityID": 106,
        "CityName": "宁德市",
        "ProID": 13,
        "CitySort": 106,
        "CityNameEnglish": "Ningde"
    },
    {
        "CityID": 107,
        "CityName": "莆田市",
        "ProID": 13,
        "CitySort": 107,
        "CityNameEnglish": "Putian"
    },
    {
        "CityID": 108,
        "CityName": "泉州市",
        "ProID": 13,
        "CitySort": 108,
        "CityNameEnglish": "Quanzhou"
    },
    {
        "CityID": 109,
        "CityName": "漳州市",
        "ProID": 13,
        "CitySort": 109,
        "CityNameEnglish": "Zhangzhou"
    },
    {
        "CityID": 110,
        "CityName": "龙岩市",
        "ProID": 13,
        "CitySort": 110,
        "CityNameEnglish": "Longyan"
    },
    {
        "CityID": 111,
        "CityName": "三明市",
        "ProID": 13,
        "CitySort": 111,
        "CityNameEnglish": "Sanming"
    },
    {
        "CityID": 112,
        "CityName": "南平市",
        "ProID": 13,
        "CitySort": 112,
        "CityNameEnglish": "Nanping"
    },
    {
        "CityID": 113,
        "CityName": "鹰潭市",
        "ProID": 14,
        "CitySort": 113,
        "CityNameEnglish": "Yingtan"
    },
    {
        "CityID": 114,
        "CityName": "新余市",
        "ProID": 14,
        "CitySort": 114,
        "CityNameEnglish": "Xinyu"
    },
    {
        "CityID": 115,
        "CityName": "南昌市",
        "ProID": 14,
        "CitySort": 115,
        "CityNameEnglish": "Nanchang"
    },
    {
        "CityID": 116,
        "CityName": "九江市",
        "ProID": 14,
        "CitySort": 116,
        "CityNameEnglish": "Jiujiang"
    },
    {
        "CityID": 117,
        "CityName": "上饶市",
        "ProID": 14,
        "CitySort": 117,
        "CityNameEnglish": "Shangrao"
    },
    {
        "CityID": 118,
        "CityName": "抚州市",
        "ProID": 14,
        "CitySort": 118,
        "CityNameEnglish": "Fuzhou"
    },
    {
        "CityID": 119,
        "CityName": "宜春市",
        "ProID": 14,
        "CitySort": 119,
        "CityNameEnglish": "Yichun"
    },
    {
        "CityID": 120,
        "CityName": "吉安市",
        "ProID": 14,
        "CitySort": 120,
        "CityNameEnglish": "Ji'an"
    },
    {
        "CityID": 121,
        "CityName": "赣州市",
        "ProID": 14,
        "CitySort": 121,
        "CityNameEnglish": "Ganzhou"
    },
    {
        "CityID": 122,
        "CityName": "景德镇市",
        "ProID": 14,
        "CitySort": 122,
        "CityNameEnglish": "Jingdezhen"
    },
    {
        "CityID": 123,
        "CityName": "萍乡市",
        "ProID": 14,
        "CitySort": 123,
        "CityNameEnglish": "Pingxiang"
    },
    {
        "CityID": 124,
        "CityName": "菏泽市",
        "ProID": 15,
        "CitySort": 124,
        "CityNameEnglish": "Heze"
    },
    {
        "CityID": 125,
        "CityName": "济南市",
        "ProID": 15,
        "CitySort": 125,
        "CityNameEnglish": "Ji'nan"
    },
    {
        "CityID": 126,
        "CityName": "青岛市",
        "ProID": 15,
        "CitySort": 126,
        "CityNameEnglish": "Qingdao"
    },
    {
        "CityID": 127,
        "CityName": "淄博市",
        "ProID": 15,
        "CitySort": 127,
        "CityNameEnglish": "Zibo"
    },
    {
        "CityID": 128,
        "CityName": "德州市",
        "ProID": 15,
        "CitySort": 128,
        "CityNameEnglish": "Dezhou"
    },
    {
        "CityID": 129,
        "CityName": "烟台市",
        "ProID": 15,
        "CitySort": 129,
        "CityNameEnglish": "Yantai"
    },
    {
        "CityID": 130,
        "CityName": "潍坊市",
        "ProID": 15,
        "CitySort": 130,
        "CityNameEnglish": "Weifang"
    },
    {
        "CityID": 131,
        "CityName": "济宁市",
        "ProID": 15,
        "CitySort": 131,
        "CityNameEnglish": "Jining"
    },
    {
        "CityID": 132,
        "CityName": "泰安市",
        "ProID": 15,
        "CitySort": 132,
        "CityNameEnglish": "Tai'an"
    },
    {
        "CityID": 133,
        "CityName": "临沂市",
        "ProID": 15,
        "CitySort": 133,
        "CityNameEnglish": "Linyi"
    },
    {
        "CityID": 134,
        "CityName": "滨州市",
        "ProID": 15,
        "CitySort": 134,
        "CityNameEnglish": "Binzhou"
    },
    {
        "CityID": 135,
        "CityName": "东营市",
        "ProID": 15,
        "CitySort": 135,
        "CityNameEnglish": "Dongying"
    },
    {
        "CityID": 136,
        "CityName": "威海市",
        "ProID": 15,
        "CitySort": 136,
        "CityNameEnglish": "Weihai"
    },
    {
        "CityID": 137,
        "CityName": "枣庄市",
        "ProID": 15,
        "CitySort": 137,
        "CityNameEnglish": "Zaozhuang"
    },
    {
        "CityID": 138,
        "CityName": "日照市",
        "ProID": 15,
        "CitySort": 138,
        "CityNameEnglish": "Rizhao"
    },
    {
        "CityID": 139,
        "CityName": "莱芜市",
        "ProID": 15,
        "CitySort": 139,
        "CityNameEnglish": "Laiwu"
    },
    {
        "CityID": 140,
        "CityName": "聊城市",
        "ProID": 15,
        "CitySort": 140,
        "CityNameEnglish": "Liaocheng"
    },
    {
        "CityID": 141,
        "CityName": "商丘市",
        "ProID": 16,
        "CitySort": 141,
        "CityNameEnglish": "Shangqiu"
    },
    {
        "CityID": 142,
        "CityName": "郑州市",
        "ProID": 16,
        "CitySort": 142,
        "CityNameEnglish": "Zhengzhou"
    },
    {
        "CityID": 143,
        "CityName": "安阳市",
        "ProID": 16,
        "CitySort": 143,
        "CityNameEnglish": "Anyang"
    },
    {
        "CityID": 144,
        "CityName": "新乡市",
        "ProID": 16,
        "CitySort": 144,
        "CityNameEnglish": "Xinxiang"
    },
    {
        "CityID": 145,
        "CityName": "许昌市",
        "ProID": 16,
        "CitySort": 145,
        "CityNameEnglish": "Xuchang"
    },
    {
        "CityID": 146,
        "CityName": "平顶山市",
        "ProID": 16,
        "CitySort": 146,
        "CityNameEnglish": "Pingdingshan"
    },
    {
        "CityID": 147,
        "CityName": "信阳市",
        "ProID": 16,
        "CitySort": 147,
        "CityNameEnglish": "Xinyang"
    },
    {
        "CityID": 148,
        "CityName": "南阳市",
        "ProID": 16,
        "CitySort": 148,
        "CityNameEnglish": "Nanyang"
    },
    {
        "CityID": 149,
        "CityName": "开封市",
        "ProID": 16,
        "CitySort": 149,
        "CityNameEnglish": "Kaifeng"
    },
    {
        "CityID": 150,
        "CityName": "洛阳市",
        "ProID": 16,
        "CitySort": 150,
        "CityNameEnglish": "Luoyang"
    },
    {
        "CityID": 151,
        "CityName": "济源市",
        "ProID": 16,
        "CitySort": 151,
        "CityNameEnglish": "Jiyuan"
    },
    {
        "CityID": 152,
        "CityName": "焦作市",
        "ProID": 16,
        "CitySort": 152,
        "CityNameEnglish": "Jiaozuo"
    },
    {
        "CityID": 153,
        "CityName": "鹤壁市",
        "ProID": 16,
        "CitySort": 153,
        "CityNameEnglish": "Hebi"
    },
    {
        "CityID": 154,
        "CityName": "濮阳市",
        "ProID": 16,
        "CitySort": 154,
        "CityNameEnglish": "Puyang"
    },
    {
        "CityID": 155,
        "CityName": "周口市",
        "ProID": 16,
        "CitySort": 155,
        "CityNameEnglish": "Zhoukou"
    },
    {
        "CityID": 156,
        "CityName": "漯河市",
        "ProID": 16,
        "CitySort": 156,
        "CityNameEnglish": "Luohe"
    },
    {
        "CityID": 157,
        "CityName": "驻马店市",
        "ProID": 16,
        "CitySort": 157,
        "CityNameEnglish": "Zhumadian"
    },
    {
        "CityID": 158,
        "CityName": "三门峡市",
        "ProID": 16,
        "CitySort": 158,
        "CityNameEnglish": "Sanmenxia"
    },
    {
        "CityID": 159,
        "CityName": "武汉市",
        "ProID": 17,
        "CitySort": 159,
        "CityNameEnglish": "Wuhan"
    },
    {
        "CityID": 160,
        "CityName": "襄阳市",
        "ProID": 17,
        "CitySort": 160,
        "CityNameEnglish": "Xiangyang"
    },
    {
        "CityID": 161,
        "CityName": "鄂州市",
        "ProID": 17,
        "CitySort": 161,
        "CityNameEnglish": "Ezhou"
    },
    {
        "CityID": 162,
        "CityName": "孝感市",
        "ProID": 17,
        "CitySort": 162,
        "CityNameEnglish": "Xiaogan"
    },
    {
        "CityID": 163,
        "CityName": "黄冈市",
        "ProID": 17,
        "CitySort": 163,
        "CityNameEnglish": "Huanggang"
    },
    {
        "CityID": 164,
        "CityName": "黄石市",
        "ProID": 17,
        "CitySort": 164,
        "CityNameEnglish": "Huangshi"
    },
    {
        "CityID": 165,
        "CityName": "咸宁市",
        "ProID": 17,
        "CitySort": 165,
        "CityNameEnglish": "Xianning"
    },
    {
        "CityID": 166,
        "CityName": "荆州市",
        "ProID": 17,
        "CitySort": 166,
        "CityNameEnglish": "Jingzhou"
    },
    {
        "CityID": 167,
        "CityName": "宜昌市",
        "ProID": 17,
        "CitySort": 167,
        "CityNameEnglish": "Yichang"
    },
    {
        "CityID": 168,
        "CityName": "恩施土家族苗族自治州",
        "ProID": 17,
        "CitySort": 168,
        "CityNameEnglish": "Enshi"
    },
    {
        "CityID": 169,
        "CityName": "神农架林区",
        "ProID": 17,
        "CitySort": 169,
        "CityNameEnglish": "Shennongjia"
    },
    {
        "CityID": 170,
        "CityName": "十堰市",
        "ProID": 17,
        "CitySort": 170,
        "CityNameEnglish": "Shiyan"
    },
    {
        "CityID": 171,
        "CityName": "随州市",
        "ProID": 17,
        "CitySort": 171,
        "CityNameEnglish": "Suizhou"
    },
    {
        "CityID": 172,
        "CityName": "荆门市",
        "ProID": 17,
        "CitySort": 172,
        "CityNameEnglish": "Jingmen"
    },
    {
        "CityID": 173,
        "CityName": "仙桃市",
        "ProID": 17,
        "CitySort": 173,
        "CityNameEnglish": "Xiantao"
    },
    {
        "CityID": 174,
        "CityName": "天门市",
        "ProID": 17,
        "CitySort": 174,
        "CityNameEnglish": "Tianmen"
    },
    {
        "CityID": 175,
        "CityName": "潜江市",
        "ProID": 17,
        "CitySort": 175,
        "CityNameEnglish": "Qianjiang"
    },
    {
        "CityID": 176,
        "CityName": "岳阳市",
        "ProID": 18,
        "CitySort": 176,
        "CityNameEnglish": "Yueyang"
    },
    {
        "CityID": 177,
        "CityName": "长沙市",
        "ProID": 18,
        "CitySort": 177,
        "CityNameEnglish": "Changsha"
    },
    {
        "CityID": 178,
        "CityName": "湘潭市",
        "ProID": 18,
        "CitySort": 178,
        "CityNameEnglish": "Xiangtan"
    },
    {
        "CityID": 179,
        "CityName": "株洲市",
        "ProID": 18,
        "CitySort": 179,
        "CityNameEnglish": "Zhuzhou"
    },
    {
        "CityID": 180,
        "CityName": "衡阳市",
        "ProID": 18,
        "CitySort": 180,
        "CityNameEnglish": "Hengyang"
    },
    {
        "CityID": 181,
        "CityName": "郴州市",
        "ProID": 18,
        "CitySort": 181,
        "CityNameEnglish": "Chenzhou"
    },
    {
        "CityID": 182,
        "CityName": "常德市",
        "ProID": 18,
        "CitySort": 182,
        "CityNameEnglish": "Changde"
    },
    {
        "CityID": 183,
        "CityName": "益阳市",
        "ProID": 18,
        "CitySort": 183,
        "CityNameEnglish": "Yiyang"
    },
    {
        "CityID": 184,
        "CityName": "娄底市",
        "ProID": 18,
        "CitySort": 184,
        "CityNameEnglish": "Loudi"
    },
    {
        "CityID": 185,
        "CityName": "邵阳市",
        "ProID": 18,
        "CitySort": 185,
        "CityNameEnglish": "Shaoyang"
    },
    {
        "CityID": 186,
        "CityName": "湘西土家族苗族自治州",
        "ProID": 18,
        "CitySort": 186,
        "CityNameEnglish": "Xiangxi"
    },
    {
        "CityID": 187,
        "CityName": "张家界市",
        "ProID": 18,
        "CitySort": 187,
        "CityNameEnglish": "Zhangjiajie"
    },
    {
        "CityID": 188,
        "CityName": "怀化市",
        "ProID": 18,
        "CitySort": 188,
        "CityNameEnglish": "Huaihua"
    },
    {
        "CityID": 189,
        "CityName": "永州市",
        "ProID": 18,
        "CitySort": 189,
        "CityNameEnglish": "Yongzhou"
    },
    {
        "CityID": 190,
        "CityName": "广州市",
        "ProID": 19,
        "CitySort": 190,
        "CityNameEnglish": "Guangzhou"
    },
    {
        "CityID": 191,
        "CityName": "汕尾市",
        "ProID": 19,
        "CitySort": 191,
        "CityNameEnglish": "Shanwei"
    },
    {
        "CityID": 192,
        "CityName": "阳江市",
        "ProID": 19,
        "CitySort": 192,
        "CityNameEnglish": "Yangjiang"
    },
    {
        "CityID": 193,
        "CityName": "揭阳市",
        "ProID": 19,
        "CitySort": 193,
        "CityNameEnglish": "Jieyang"
    },
    {
        "CityID": 194,
        "CityName": "茂名市",
        "ProID": 19,
        "CitySort": 194,
        "CityNameEnglish": "Maoming"
    },
    {
        "CityID": 195,
        "CityName": "惠州市",
        "ProID": 19,
        "CitySort": 195,
        "CityNameEnglish": "Huizhou"
    },
    {
        "CityID": 196,
        "CityName": "江门市",
        "ProID": 19,
        "CitySort": 196,
        "CityNameEnglish": "Jiangmen"
    },
    {
        "CityID": 197,
        "CityName": "韶关市",
        "ProID": 19,
        "CitySort": 197,
        "CityNameEnglish": "Shaoguan"
    },
    {
        "CityID": 198,
        "CityName": "梅州市",
        "ProID": 19,
        "CitySort": 198,
        "CityNameEnglish": "Meizhou"
    },
    {
        "CityID": 199,
        "CityName": "汕头市",
        "ProID": 19,
        "CitySort": 199,
        "CityNameEnglish": "Shantou"
    },
    {
        "CityID": 200,
        "CityName": "深圳市",
        "ProID": 19,
        "CitySort": 200,
        "CityNameEnglish": "Shenzhen"
    },
    {
        "CityID": 201,
        "CityName": "珠海市",
        "ProID": 19,
        "CitySort": 201,
        "CityNameEnglish": "Zhuhai"
    },
    {
        "CityID": 202,
        "CityName": "佛山市",
        "ProID": 19,
        "CitySort": 202,
        "CityNameEnglish": "Foshan"
    },
    {
        "CityID": 203,
        "CityName": "肇庆市",
        "ProID": 19,
        "CitySort": 203,
        "CityNameEnglish": "Zhaoqing"
    },
    {
        "CityID": 204,
        "CityName": "湛江市",
        "ProID": 19,
        "CitySort": 204,
        "CityNameEnglish": "Zhanjiang"
    },
    {
        "CityID": 205,
        "CityName": "中山市",
        "ProID": 19,
        "CitySort": 205,
        "CityNameEnglish": "Zhongshan"
    },
    {
        "CityID": 206,
        "CityName": "河源市",
        "ProID": 19,
        "CitySort": 206,
        "CityNameEnglish": "Heyuan"
    },
    {
        "CityID": 207,
        "CityName": "清远市",
        "ProID": 19,
        "CitySort": 207,
        "CityNameEnglish": "Qingyuan"
    },
    {
        "CityID": 208,
        "CityName": "云浮市",
        "ProID": 19,
        "CitySort": 208,
        "CityNameEnglish": "Yunfu"
    },
    {
        "CityID": 209,
        "CityName": "潮州市",
        "ProID": 19,
        "CitySort": 209,
        "CityNameEnglish": "Chaozhou"
    },
    {
        "CityID": 210,
        "CityName": "东莞市",
        "ProID": 19,
        "CitySort": 210,
        "CityNameEnglish": "Dongguan"
    },
    {
        "CityID": 211,
        "CityName": "兰州市",
        "ProID": 22,
        "CitySort": 211,
        "CityNameEnglish": "Lanzhou"
    },
    {
        "CityID": 212,
        "CityName": "金昌市",
        "ProID": 22,
        "CitySort": 212,
        "CityNameEnglish": "Jinchang"
    },
    {
        "CityID": 213,
        "CityName": "白银市",
        "ProID": 22,
        "CitySort": 213,
        "CityNameEnglish": "Baiyin"
    },
    {
        "CityID": 214,
        "CityName": "天水市",
        "ProID": 22,
        "CitySort": 214,
        "CityNameEnglish": "Tianshui"
    },
    {
        "CityID": 215,
        "CityName": "嘉峪关市",
        "ProID": 22,
        "CitySort": 215,
        "CityNameEnglish": "Jiayuguan"
    },
    {
        "CityID": 216,
        "CityName": "武威市",
        "ProID": 22,
        "CitySort": 216,
        "CityNameEnglish": "Wuwei"
    },
    {
        "CityID": 217,
        "CityName": "张掖市",
        "ProID": 22,
        "CitySort": 217,
        "CityNameEnglish": "Zhangye"
    },
    {
        "CityID": 218,
        "CityName": "平凉市",
        "ProID": 22,
        "CitySort": 218,
        "CityNameEnglish": "Pingliang"
    },
    {
        "CityID": 219,
        "CityName": "酒泉市",
        "ProID": 22,
        "CitySort": 219,
        "CityNameEnglish": "Jiuquan"
    },
    {
        "CityID": 220,
        "CityName": "庆阳市",
        "ProID": 22,
        "CitySort": 220,
        "CityNameEnglish": "Qingyang"
    },
    {
        "CityID": 221,
        "CityName": "定西市",
        "ProID": 22,
        "CitySort": 221,
        "CityNameEnglish": "Dingxi"
    },
    {
        "CityID": 222,
        "CityName": "陇南市",
        "ProID": 22,
        "CitySort": 222,
        "CityNameEnglish": "Longnan"
    },
    {
        "CityID": 223,
        "CityName": "临夏回族自治州",
        "ProID": 22,
        "CitySort": 223,
        "CityNameEnglish": "Linxia"
    },
    {
        "CityID": 224,
        "CityName": "甘南藏族自治州",
        "ProID": 22,
        "CitySort": 224,
        "CityNameEnglish": "Gannan"
    },
    {
        "CityID": 225,
        "CityName": "成都市",
        "ProID": 28,
        "CitySort": 225,
        "CityNameEnglish": "Chengdu"
    },
    {
        "CityID": 226,
        "CityName": "攀枝花市",
        "ProID": 28,
        "CitySort": 226,
        "CityNameEnglish": "Panzhihua"
    },
    {
        "CityID": 227,
        "CityName": "自贡市",
        "ProID": 28,
        "CitySort": 227,
        "CityNameEnglish": "Zigong"
    },
    {
        "CityID": 228,
        "CityName": "绵阳市",
        "ProID": 28,
        "CitySort": 228,
        "CityNameEnglish": "Mianyang"
    },
    {
        "CityID": 229,
        "CityName": "南充市",
        "ProID": 28,
        "CitySort": 229,
        "CityNameEnglish": "Nanchong"
    },
    {
        "CityID": 230,
        "CityName": "达州市",
        "ProID": 28,
        "CitySort": 230,
        "CityNameEnglish": "Dazhou"
    },
    {
        "CityID": 231,
        "CityName": "遂宁市",
        "ProID": 28,
        "CitySort": 231,
        "CityNameEnglish": "Suining"
    },
    {
        "CityID": 232,
        "CityName": "广安市",
        "ProID": 28,
        "CitySort": 232,
        "CityNameEnglish": "Guang'an"
    },
    {
        "CityID": 233,
        "CityName": "巴中市",
        "ProID": 28,
        "CitySort": 233,
        "CityNameEnglish": "Bazhong"
    },
    {
        "CityID": 234,
        "CityName": "泸州市",
        "ProID": 28,
        "CitySort": 234,
        "CityNameEnglish": "Luzhou"
    },
    {
        "CityID": 235,
        "CityName": "宜宾市",
        "ProID": 28,
        "CitySort": 235,
        "CityNameEnglish": "Yibin"
    },
    {
        "CityID": 236,
        "CityName": "资阳市",
        "ProID": 28,
        "CitySort": 236,
        "CityNameEnglish": "Ziyang"
    },
    {
        "CityID": 237,
        "CityName": "内江市",
        "ProID": 28,
        "CitySort": 237,
        "CityNameEnglish": "Neijiang"
    },
    {
        "CityID": 238,
        "CityName": "乐山市",
        "ProID": 28,
        "CitySort": 238,
        "CityNameEnglish": "Leshan"
    },
    {
        "CityID": 239,
        "CityName": "眉山市",
        "ProID": 28,
        "CitySort": 239,
        "CityNameEnglish": "Meishan"
    },
    {
        "CityID": 240,
        "CityName": "凉山彝族自治州",
        "ProID": 28,
        "CitySort": 240,
        "CityNameEnglish": "Liangshan"
    },
    {
        "CityID": 241,
        "CityName": "雅安市",
        "ProID": 28,
        "CitySort": 241,
        "CityNameEnglish": "Ya'an"
    },
    {
        "CityID": 242,
        "CityName": "甘孜藏族自治州",
        "ProID": 28,
        "CitySort": 242,
        "CityNameEnglish": "Ganzi"
    },
    {
        "CityID": 243,
        "CityName": "阿坝藏族羌族自治州",
        "ProID": 28,
        "CitySort": 243,
        "CityNameEnglish": "Aba"
    },
    {
        "CityID": 244,
        "CityName": "德阳市",
        "ProID": 28,
        "CitySort": 244,
        "CityNameEnglish": "Deyang"
    },
    {
        "CityID": 245,
        "CityName": "广元市",
        "ProID": 28,
        "CitySort": 245,
        "CityNameEnglish": "Guangyuan"
    },
    {
        "CityID": 246,
        "CityName": "贵阳市",
        "ProID": 29,
        "CitySort": 246,
        "CityNameEnglish": "Guiyang"
    },
    {
        "CityID": 247,
        "CityName": "遵义市",
        "ProID": 29,
        "CitySort": 247,
        "CityNameEnglish": "Zunyi"
    },
    {
        "CityID": 248,
        "CityName": "安顺市",
        "ProID": 29,
        "CitySort": 248,
        "CityNameEnglish": "Anshun"
    },
    {
        "CityID": 249,
        "CityName": "黔南布依族苗族自治州",
        "ProID": 29,
        "CitySort": 249,
        "CityNameEnglish": "Qiannan"
    },
    {
        "CityID": 250,
        "CityName": "黔东南苗族侗族自治州",
        "ProID": 29,
        "CitySort": 250,
        "CityNameEnglish": "Qiandongnan"
    },
    {
        "CityID": 251,
        "CityName": "铜仁地区",
        "ProID": 29,
        "CitySort": 251,
        "CityNameEnglish": "Tongren area"
    },
    {
        "CityID": 252,
        "CityName": "毕节地区",
        "ProID": 29,
        "CitySort": 252,
        "CityNameEnglish": "Bijie area"
    },
    {
        "CityID": 253,
        "CityName": "六盘水市",
        "ProID": 29,
        "CitySort": 253,
        "CityNameEnglish": "Liupanshui"
    },
    {
        "CityID": 254,
        "CityName": "黔西南布依族苗族自治州",
        "ProID": 29,
        "CitySort": 254,
        "CityNameEnglish": "Qianxinan"
    },
    {
        "CityID": 255,
        "CityName": "海口市",
        "ProID": 20,
        "CitySort": 255,
        "CityNameEnglish": "Haikou"
    },
    {
        "CityID": 256,
        "CityName": "三亚市",
        "ProID": 20,
        "CitySort": 256,
        "CityNameEnglish": "Sanya"
    },
    {
        "CityID": 257,
        "CityName": "五指山市",
        "ProID": 20,
        "CitySort": 257,
        "CityNameEnglish": "Wuzhishan"
    },
    {
        "CityID": 258,
        "CityName": "琼海市",
        "ProID": 20,
        "CitySort": 258,
        "CityNameEnglish": "Qionghai"
    },
    {
        "CityID": 259,
        "CityName": "儋州市",
        "ProID": 20,
        "CitySort": 259,
        "CityNameEnglish": "Danzhou"
    },
    {
        "CityID": 260,
        "CityName": "文昌市",
        "ProID": 20,
        "CitySort": 260,
        "CityNameEnglish": "Wenchang"
    },
    {
        "CityID": 261,
        "CityName": "万宁市",
        "ProID": 20,
        "CitySort": 261,
        "CityNameEnglish": "Wanning"
    },
    {
        "CityID": 262,
        "CityName": "东方市",
        "ProID": 20,
        "CitySort": 262,
        "CityNameEnglish": "Dongfang"
    },
    {
        "CityID": 263,
        "CityName": "澄迈县",
        "ProID": 20,
        "CitySort": 263,
        "CityNameEnglish": "Chengmai"
    },
    {
        "CityID": 264,
        "CityName": "定安县",
        "ProID": 20,
        "CitySort": 264,
        "CityNameEnglish": "Ding'an"
    },
    {
        "CityID": 265,
        "CityName": "屯昌县",
        "ProID": 20,
        "CitySort": 265,
        "CityNameEnglish": "Tunchang"
    },
    {
        "CityID": 266,
        "CityName": "临高县",
        "ProID": 20,
        "CitySort": 266,
        "CityNameEnglish": "Lingao"
    },
    {
        "CityID": 267,
        "CityName": "白沙黎族自治县",
        "ProID": 20,
        "CitySort": 267,
        "CityNameEnglish": "Baisha"
    },
    {
        "CityID": 268,
        "CityName": "昌江黎族自治县",
        "ProID": 20,
        "CitySort": 268,
        "CityNameEnglish": "Changjiang"
    },
    {
        "CityID": 269,
        "CityName": "乐东黎族自治县",
        "ProID": 20,
        "CitySort": 269,
        "CityNameEnglish": "Ledong"
    },
    {
        "CityID": 270,
        "CityName": "陵水黎族自治县",
        "ProID": 20,
        "CitySort": 270,
        "CityNameEnglish": "Lingshui"
    },
    {
        "CityID": 271,
        "CityName": "保亭黎族苗族自治县",
        "ProID": 20,
        "CitySort": 271,
        "CityNameEnglish": "Baoting"
    },
    {
        "CityID": 272,
        "CityName": "琼中黎族苗族自治县",
        "ProID": 20,
        "CitySort": 272,
        "CityNameEnglish": "Qiongzhong"
    },
    {
        "CityID": 273,
        "CityName": "西双版纳傣族自治州",
        "ProID": 30,
        "CitySort": 273,
        "CityNameEnglish": "Xishuangbanna"
    },
    {
        "CityID": 274,
        "CityName": "德宏傣族景颇族自治州",
        "ProID": 30,
        "CitySort": 274,
        "CityNameEnglish": "Dehong"
    },
    {
        "CityID": 275,
        "CityName": "昭通市",
        "ProID": 30,
        "CitySort": 275,
        "CityNameEnglish": "Zhaotong"
    },
    {
        "CityID": 276,
        "CityName": "昆明市",
        "ProID": 30,
        "CitySort": 276,
        "CityNameEnglish": "Kunming"
    },
    {
        "CityID": 277,
        "CityName": "大理白族自治州",
        "ProID": 30,
        "CitySort": 277,
        "CityNameEnglish": "Dali"
    },
    {
        "CityID": 278,
        "CityName": "红河哈尼族彝族自治州",
        "ProID": 30,
        "CitySort": 278,
        "CityNameEnglish": "Honghe"
    },
    {
        "CityID": 279,
        "CityName": "曲靖市",
        "ProID": 30,
        "CitySort": 279,
        "CityNameEnglish": "Qujing"
    },
    {
        "CityID": 280,
        "CityName": "保山市",
        "ProID": 30,
        "CitySort": 280,
        "CityNameEnglish": "Baoshan"
    },
    {
        "CityID": 281,
        "CityName": "文山壮族苗族自治州",
        "ProID": 30,
        "CitySort": 281,
        "CityNameEnglish": "Wenshan"
    },
    {
        "CityID": 282,
        "CityName": "玉溪市",
        "ProID": 30,
        "CitySort": 282,
        "CityNameEnglish": "Yuxi"
    },
    {
        "CityID": 283,
        "CityName": "楚雄彝族自治州",
        "ProID": 30,
        "CitySort": 283,
        "CityNameEnglish": "Chuxiong"
    },
    {
        "CityID": 284,
        "CityName": "普洱市",
        "ProID": 30,
        "CitySort": 284,
        "CityNameEnglish": "Pu'er"
    },
    {
        "CityID": 285,
        "CityName": "临沧市",
        "ProID": 30,
        "CitySort": 285,
        "CityNameEnglish": "Lincang"
    },
    {
        "CityID": 286,
        "CityName": "怒江傈傈族自治州",
        "ProID": 30,
        "CitySort": 286,
        "CityNameEnglish": "Nujiang"
    },
    {
        "CityID": 287,
        "CityName": "迪庆藏族自治州",
        "ProID": 30,
        "CitySort": 287,
        "CityNameEnglish": "Diqing"
    },
    {
        "CityID": 288,
        "CityName": "丽江市",
        "ProID": 30,
        "CitySort": 288,
        "CityNameEnglish": "Lijiang"
    },
    {
        "CityID": 289,
        "CityName": "海北藏族自治州",
        "ProID": 25,
        "CitySort": 289,
        "CityNameEnglish": "Haibei"
    },
    {
        "CityID": 290,
        "CityName": "西宁市",
        "ProID": 25,
        "CitySort": 290,
        "CityNameEnglish": "Xining"
    },
    {
        "CityID": 291,
        "CityName": "海东地区",
        "ProID": 25,
        "CitySort": 291,
        "CityNameEnglish": "Haidong"
    },
    {
        "CityID": 292,
        "CityName": "黄南藏族自治州",
        "ProID": 25,
        "CitySort": 292,
        "CityNameEnglish": "Huangnan"
    },
    {
        "CityID": 293,
        "CityName": "海南藏族自治州",
        "ProID": 25,
        "CitySort": 293,
        "CityNameEnglish": "Hainan"
    },
    {
        "CityID": 294,
        "CityName": "果洛藏族自治州",
        "ProID": 25,
        "CitySort": 294,
        "CityNameEnglish": "Golog"
    },
    {
        "CityID": 295,
        "CityName": "玉树藏族自治州",
        "ProID": 25,
        "CitySort": 295,
        "CityNameEnglish": "Yushu"
    },
    {
        "CityID": 296,
        "CityName": "海西蒙古族藏族自治州",
        "ProID": 25,
        "CitySort": 296,
        "CityNameEnglish": "Haixi"
    },
    {
        "CityID": 297,
        "CityName": "西安市",
        "ProID": 23,
        "CitySort": 297,
        "CityNameEnglish": "Xi'an"
    },
    {
        "CityID": 298,
        "CityName": "咸阳市",
        "ProID": 23,
        "CitySort": 298,
        "CityNameEnglish": "Xianyang"
    },
    {
        "CityID": 299,
        "CityName": "延安市",
        "ProID": 23,
        "CitySort": 299,
        "CityNameEnglish": "Yanan"
    },
    {
        "CityID": 300,
        "CityName": "榆林市",
        "ProID": 23,
        "CitySort": 300,
        "CityNameEnglish": "Yulin"
    },
    {
        "CityID": 301,
        "CityName": "渭南市",
        "ProID": 23,
        "CitySort": 301,
        "CityNameEnglish": "Weinan"
    },
    {
        "CityID": 302,
        "CityName": "商洛市",
        "ProID": 23,
        "CitySort": 302,
        "CityNameEnglish": "Shangluo"
    },
    {
        "CityID": 303,
        "CityName": "安康市",
        "ProID": 23,
        "CitySort": 303,
        "CityNameEnglish": "Ankang"
    },
    {
        "CityID": 304,
        "CityName": "汉中市",
        "ProID": 23,
        "CitySort": 304,
        "CityNameEnglish": "Hanzhoung"
    },
    {
        "CityID": 305,
        "CityName": "宝鸡市",
        "ProID": 23,
        "CitySort": 305,
        "CityNameEnglish": "Baoji"
    },
    {
        "CityID": 306,
        "CityName": "铜川市",
        "ProID": 23,
        "CitySort": 306,
        "CityNameEnglish": "Tongchuan"
    },
    {
        "CityID": 307,
        "CityName": "防城港市",
        "ProID": 21,
        "CitySort": 307,
        "CityNameEnglish": "Fangchenggang"
    },
    {
        "CityID": 308,
        "CityName": "南宁市",
        "ProID": 21,
        "CitySort": 308,
        "CityNameEnglish": "Nanning"
    },
    {
        "CityID": 309,
        "CityName": "崇左市",
        "ProID": 21,
        "CitySort": 309,
        "CityNameEnglish": "Chongzuo"
    },
    {
        "CityID": 310,
        "CityName": "来宾市",
        "ProID": 21,
        "CitySort": 310,
        "CityNameEnglish": "Laibin"
    },
    {
        "CityID": 311,
        "CityName": "柳州市",
        "ProID": 21,
        "CitySort": 311,
        "CityNameEnglish": "Liuzhou"
    },
    {
        "CityID": 312,
        "CityName": "桂林市",
        "ProID": 21,
        "CitySort": 312,
        "CityNameEnglish": "Guilin"
    },
    {
        "CityID": 313,
        "CityName": "梧州市",
        "ProID": 21,
        "CitySort": 313,
        "CityNameEnglish": "Wuzhou"
    },
    {
        "CityID": 314,
        "CityName": "贺州市",
        "ProID": 21,
        "CitySort": 314,
        "CityNameEnglish": "Hezhou"
    },
    {
        "CityID": 315,
        "CityName": "贵港市",
        "ProID": 21,
        "CitySort": 315,
        "CityNameEnglish": "Guigang"
    },
    {
        "CityID": 316,
        "CityName": "玉林市",
        "ProID": 21,
        "CitySort": 316,
        "CityNameEnglish": "Yulin"
    },
    {
        "CityID": 317,
        "CityName": "百色市",
        "ProID": 21,
        "CitySort": 317,
        "CityNameEnglish": "Baise"
    },
    {
        "CityID": 318,
        "CityName": "钦州市",
        "ProID": 21,
        "CitySort": 318,
        "CityNameEnglish": "Qinzhou"
    },
    {
        "CityID": 319,
        "CityName": "河池市",
        "ProID": 21,
        "CitySort": 319,
        "CityNameEnglish": "Hechi"
    },
    {
        "CityID": 320,
        "CityName": "北海市",
        "ProID": 21,
        "CitySort": 320,
        "CityNameEnglish": "Beihai"
    },
    {
        "CityID": 321,
        "CityName": "拉萨市",
        "ProID": 31,
        "CitySort": 321,
        "CityNameEnglish": "Lhasa"
    },
    {
        "CityID": 322,
        "CityName": "日喀则地区",
        "ProID": 31,
        "CitySort": 322,
        "CityNameEnglish": "Shigatse area"
    },
    {
        "CityID": 323,
        "CityName": "山南地区",
        "ProID": 31,
        "CitySort": 323,
        "CityNameEnglish": "Shannan area"
    },
    {
        "CityID": 324,
        "CityName": "林芝地区",
        "ProID": 31,
        "CitySort": 324,
        "CityNameEnglish": "Linzhi area"
    },
    {
        "CityID": 325,
        "CityName": "昌都地区",
        "ProID": 31,
        "CitySort": 325,
        "CityNameEnglish": "Changdu area"
    },
    {
        "CityID": 326,
        "CityName": "那曲地区",
        "ProID": 31,
        "CitySort": 326,
        "CityNameEnglish": "Naqu"
    },
    {
        "CityID": 327,
        "CityName": "阿里地区",
        "ProID": 31,
        "CitySort": 327,
        "CityNameEnglish": "Ali area"
    },
    {
        "CityID": 328,
        "CityName": "银川市",
        "ProID": 26,
        "CitySort": 328,
        "CityNameEnglish": "Yinchuan"
    },
    {
        "CityID": 329,
        "CityName": "石嘴山市",
        "ProID": 26,
        "CitySort": 329,
        "CityNameEnglish": "Shizuishan"
    },
    {
        "CityID": 330,
        "CityName": "吴忠市",
        "ProID": 26,
        "CitySort": 330,
        "CityNameEnglish": "Wuzhong"
    },
    {
        "CityID": 331,
        "CityName": "固原市",
        "ProID": 26,
        "CitySort": 331,
        "CityNameEnglish": "Guyuan"
    },
    {
        "CityID": 332,
        "CityName": "中卫市",
        "ProID": 26,
        "CitySort": 332,
        "CityNameEnglish": "Zhongwei"
    },
    {
        "CityID": 333,
        "CityName": "塔城地区",
        "ProID": 24,
        "CitySort": 333,
        "CityNameEnglish": "Tacheng area"
    },
    {
        "CityID": 334,
        "CityName": "哈密地区",
        "ProID": 24,
        "CitySort": 334,
        "CityNameEnglish": "Hami area"
    },
    {
        "CityID": 335,
        "CityName": "和田地区",
        "ProID": 24,
        "CitySort": 335,
        "CityNameEnglish": "Hetian area"
    },
    {
        "CityID": 336,
        "CityName": "阿勒泰地区",
        "ProID": 24,
        "CitySort": 336,
        "CityNameEnglish": "Aletai area"
    },
    {
        "CityID": 337,
        "CityName": "克孜勒苏柯尔克孜自治州",
        "ProID": 24,
        "CitySort": 337,
        "CityNameEnglish": "Kirgiz"
    },
    {
        "CityID": 338,
        "CityName": "博尔塔拉蒙古自治州",
        "ProID": 24,
        "CitySort": 338,
        "CityNameEnglish": "Bortala"
    },
    {
        "CityID": 339,
        "CityName": "克拉玛依市",
        "ProID": 24,
        "CitySort": 339,
        "CityNameEnglish": "Karamay"
    },
    {
        "CityID": 340,
        "CityName": "乌鲁木齐市",
        "ProID": 24,
        "CitySort": 340,
        "CityNameEnglish": "Urumqi"
    },
    {
        "CityID": 341,
        "CityName": "石河子市",
        "ProID": 24,
        "CitySort": 341,
        "CityNameEnglish": "Shihezi"
    },
    {
        "CityID": 342,
        "CityName": "昌吉回族自治州",
        "ProID": 24,
        "CitySort": 342,
        "CityNameEnglish": "Changji"
    },
    {
        "CityID": 343,
        "CityName": "五家渠市",
        "ProID": 24,
        "CitySort": 343,
        "CityNameEnglish": "Wujiaqu"
    },
    {
        "CityID": 344,
        "CityName": "吐鲁番地区",
        "ProID": 24,
        "CitySort": 344,
        "CityNameEnglish": "Turpan area"
    },
    {
        "CityID": 345,
        "CityName": "巴音郭楞蒙古自治州",
        "ProID": 24,
        "CitySort": 345,
        "CityNameEnglish": "Bayinguoleng"
    },
    {
        "CityID": 346,
        "CityName": "阿克苏地区",
        "ProID": 24,
        "CitySort": 346,
        "CityNameEnglish": "Akesu area"
    },
    {
        "CityID": 347,
        "CityName": "阿拉尔市",
        "ProID": 24,
        "CitySort": 347,
        "CityNameEnglish": "Alar"
    },
    {
        "CityID": 348,
        "CityName": "喀什地区",
        "ProID": 24,
        "CitySort": 348,
        "CityNameEnglish": "Kashi area"
    },
    {
        "CityID": 349,
        "CityName": "图木舒克市",
        "ProID": 24,
        "CitySort": 349,
        "CityNameEnglish": "Tumushuke"
    },
    {
        "CityID": 350,
        "CityName": "伊犁哈萨克自治州",
        "ProID": 24,
        "CitySort": 350,
        "CityNameEnglish": "Yili"
    },
    {
        "CityID": 351,
        "CityName": "呼伦贝尔市",
        "ProID": 5,
        "CitySort": 351,
        "CityNameEnglish": "Hulun Buir"
    },
    {
        "CityID": 352,
        "CityName": "呼和浩特市",
        "ProID": 5,
        "CitySort": 352,
        "CityNameEnglish": "Hohhot"
    },
    {
        "CityID": 353,
        "CityName": "包头市",
        "ProID": 5,
        "CitySort": 353,
        "CityNameEnglish": "Baotou"
    },
    {
        "CityID": 354,
        "CityName": "乌海市",
        "ProID": 5,
        "CitySort": 354,
        "CityNameEnglish": "Wuhai"
    },
    {
        "CityID": 355,
        "CityName": "乌兰察布市",
        "ProID": 5,
        "CitySort": 355,
        "CityNameEnglish": "Wulanchabu"
    },
    {
        "CityID": 356,
        "CityName": "通辽市",
        "ProID": 5,
        "CitySort": 356,
        "CityNameEnglish": "Tongliao"
    },
    {
        "CityID": 357,
        "CityName": "赤峰市",
        "ProID": 5,
        "CitySort": 357,
        "CityNameEnglish": "Chifeng"
    },
    {
        "CityID": 358,
        "CityName": "鄂尔多斯市",
        "ProID": 5,
        "CitySort": 358,
        "CityNameEnglish": "Ordos"
    },
    {
        "CityID": 359,
        "CityName": "巴彦淖尔市",
        "ProID": 5,
        "CitySort": 359,
        "CityNameEnglish": "Bayannaoer"
    },
    {
        "CityID": 360,
        "CityName": "锡林郭勒盟",
        "ProID": 5,
        "CitySort": 360,
        "CityNameEnglish": "Xilinguole"
    },
    {
        "CityID": 361,
        "CityName": "兴安盟",
        "ProID": 5,
        "CitySort": 361,
        "CityNameEnglish": "Xingan"
    },
    {
        "CityID": 362,
        "CityName": "阿拉善盟",
        "ProID": 5,
        "CitySort": 362,
        "CityNameEnglish": "Alashan"
    },
    {
        "CityID": 363,
        "CityName": "秦皇岛市",
        "ProID": 3,
        "CitySort": 363,
        "CityNameEnglish": "Qinhuangdao"
    }],
    "dis": [{
        "Id": 1,
        "DisName": "邯山区",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Hanshan",
        "district_code": 130402,
        "chinese_name": "邯山区"
    },
    {
        "Id": 2,
        "DisName": "丛台区",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Congtai",
        "district_code": 130403,
        "chinese_name": "丛台区"
    },
    {
        "Id": 3,
        "DisName": "复兴区",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Fuxing",
        "district_code": 130404,
        "chinese_name": "复兴区"
    },
    {
        "Id": 4,
        "DisName": "峰峰矿区",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Fengfeng",
        "district_code": 130406,
        "chinese_name": "峰峰矿区"
    },
    {
        "Id": 5,
        "DisName": "邯郸县",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Handan",
        "district_code": 130421,
        "chinese_name": "邯郸县"
    },
    {
        "Id": 6,
        "DisName": "临漳县",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Linzhang",
        "district_code": 130423,
        "chinese_name": "临漳县"
    },
    {
        "Id": 7,
        "DisName": "成安县",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Cheng'an",
        "district_code": 130424,
        "chinese_name": "成安县"
    },
    {
        "Id": 8,
        "DisName": "大名县",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Daming",
        "district_code": 130425,
        "chinese_name": "大名县"
    },
    {
        "Id": 9,
        "DisName": "涉县",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Shexian",
        "district_code": 130426,
        "chinese_name": "涉县"
    },
    {
        "Id": 10,
        "DisName": "磁县",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Cixian",
        "district_code": 130427,
        "chinese_name": "磁县"
    },
    {
        "Id": 11,
        "DisName": "肥乡县",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Feixiang",
        "district_code": 130428,
        "chinese_name": "肥乡县"
    },
    {
        "Id": 12,
        "DisName": "永年县",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Yongnian",
        "district_code": 130429,
        "chinese_name": "永年县"
    },
    {
        "Id": 13,
        "DisName": "邱县",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Qiuxian",
        "district_code": 130430,
        "chinese_name": "邱县"
    },
    {
        "Id": 14,
        "DisName": "鸡泽县",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Jize",
        "district_code": 130431,
        "chinese_name": "鸡泽县"
    },
    {
        "Id": 15,
        "DisName": "广平县",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Guangping",
        "district_code": 130432,
        "chinese_name": "广平县"
    },
    {
        "Id": 16,
        "DisName": "馆陶县",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Guantao",
        "district_code": 130433,
        "chinese_name": "馆陶县"
    },
    {
        "Id": 17,
        "DisName": "魏县",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Weixian",
        "district_code": 130434,
        "chinese_name": "魏县"
    },
    {
        "Id": 18,
        "DisName": "曲周县",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Quzhou",
        "district_code": 130435,
        "chinese_name": "曲周县"
    },
    {
        "Id": 19,
        "DisName": "武安市",
        "CityID": 5,
        "DisSort": null,
        "CityNameEnglish": "Wuan",
        "district_code": 130481,
        "chinese_name": "武安市"
    },
    {
        "Id": 20,
        "DisName": "长安区",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Changan",
        "district_code": 130102,
        "chinese_name": "长安区"
    },
    {
        "Id": 21,
        "DisName": "桥东区",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Qiaodong",
        "district_code": 130103,
        "chinese_name": "桥东区"
    },
    {
        "Id": 22,
        "DisName": "桥西区",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Qiaoxi",
        "district_code": 130104,
        "chinese_name": "桥西区"
    },
    {
        "Id": 23,
        "DisName": "新华区",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Xinhua",
        "district_code": 130105,
        "chinese_name": "新华区"
    },
    {
        "Id": 24,
        "DisName": "井陉矿区",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Jingxing",
        "district_code": 130107,
        "chinese_name": "井陉矿区"
    },
    {
        "Id": 25,
        "DisName": "裕华区",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Yuhua",
        "district_code": 130108,
        "chinese_name": "裕华区"
    },
    {
        "Id": 26,
        "DisName": "井陉县",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Jingxing",
        "district_code": 130121,
        "chinese_name": "井陉县"
    },
    {
        "Id": 27,
        "DisName": "正定县",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Zhengding",
        "district_code": 130123,
        "chinese_name": "正定县"
    },
    {
        "Id": 28,
        "DisName": "栾城县",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Luancheng",
        "district_code": 130124,
        "chinese_name": "栾城县"
    },
    {
        "Id": 29,
        "DisName": "行唐县",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Xingtang",
        "district_code": 130125,
        "chinese_name": "行唐县"
    },
    {
        "Id": 30,
        "DisName": "灵寿县",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Lingshou",
        "district_code": 130126,
        "chinese_name": "灵寿县"
    },
    {
        "Id": 31,
        "DisName": "高邑县",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Gaoyi",
        "district_code": 130127,
        "chinese_name": "高邑县"
    },
    {
        "Id": 32,
        "DisName": "深泽县",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Shenze",
        "district_code": 130128,
        "chinese_name": "深泽县"
    },
    {
        "Id": 33,
        "DisName": "赞皇县",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Zanhuang",
        "district_code": 130129,
        "chinese_name": "赞皇县"
    },
    {
        "Id": 34,
        "DisName": "无极县",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Wuji",
        "district_code": 130130,
        "chinese_name": "无极县"
    },
    {
        "Id": 35,
        "DisName": "平山县",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Pingshan",
        "district_code": 130131,
        "chinese_name": "平山县"
    },
    {
        "Id": 36,
        "DisName": "元氏县",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Yuanshi",
        "district_code": 130132,
        "chinese_name": "元氏县"
    },
    {
        "Id": 37,
        "DisName": "赵县",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Zhaoxian",
        "district_code": 130133,
        "chinese_name": "赵县"
    },
    {
        "Id": 38,
        "DisName": "辛集市",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Xinji",
        "district_code": 130181,
        "chinese_name": "辛集市"
    },
    {
        "Id": 39,
        "DisName": "藁城市",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Gaocheng",
        "district_code": 130182,
        "chinese_name": "藁城市"
    },
    {
        "Id": 40,
        "DisName": "晋州市",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Jinzhou",
        "district_code": 130183,
        "chinese_name": "晋州市"
    },
    {
        "Id": 41,
        "DisName": "新乐市",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Xinle",
        "district_code": 130184,
        "chinese_name": "新乐市"
    },
    {
        "Id": 42,
        "DisName": "鹿泉市",
        "CityID": 6,
        "DisSort": null,
        "CityNameEnglish": "Luquan",
        "district_code": 130185,
        "chinese_name": "鹿泉市"
    },
    {
        "Id": 43,
        "DisName": "新市区",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Xinshi",
        "district_code": 130602,
        "chinese_name": "新市区"
    },
    {
        "Id": 44,
        "DisName": "北市区",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Beishi",
        "district_code": 130603,
        "chinese_name": "北市区"
    },
    {
        "Id": 45,
        "DisName": "南市区",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Nanshi",
        "district_code": 130604,
        "chinese_name": "南市区"
    },
    {
        "Id": 46,
        "DisName": "满城县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Mancheng",
        "district_code": 130621,
        "chinese_name": "满城县"
    },
    {
        "Id": 47,
        "DisName": "清苑县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Qingyuan",
        "district_code": 130622,
        "chinese_name": "清苑县"
    },
    {
        "Id": 48,
        "DisName": "涞水县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Laishui",
        "district_code": 130623,
        "chinese_name": "涞水县"
    },
    {
        "Id": 49,
        "DisName": "阜平县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Fuping",
        "district_code": 130624,
        "chinese_name": "阜平县"
    },
    {
        "Id": 50,
        "DisName": "徐水县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Xushui",
        "district_code": 130625,
        "chinese_name": "徐水县"
    },
    {
        "Id": 51,
        "DisName": "定兴县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Dingxing",
        "district_code": 130626,
        "chinese_name": "定兴县"
    },
    {
        "Id": 52,
        "DisName": "唐县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Tangxian",
        "district_code": 130627,
        "chinese_name": "唐县"
    },
    {
        "Id": 53,
        "DisName": "高阳县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Gaoyang",
        "district_code": 130628,
        "chinese_name": "高阳县"
    },
    {
        "Id": 54,
        "DisName": "容城县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Rongcheng",
        "district_code": 130629,
        "chinese_name": "容城县"
    },
    {
        "Id": 55,
        "DisName": "涞源县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Laiyuan",
        "district_code": 130630,
        "chinese_name": "涞源县"
    },
    {
        "Id": 56,
        "DisName": "望都县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Wangdu",
        "district_code": 130631,
        "chinese_name": "望都县"
    },
    {
        "Id": 57,
        "DisName": "安新县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Anxin",
        "district_code": 130632,
        "chinese_name": "安新县"
    },
    {
        "Id": 58,
        "DisName": "易县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Yixian",
        "district_code": 130633,
        "chinese_name": "易县"
    },
    {
        "Id": 59,
        "DisName": "曲阳县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Quyang",
        "district_code": 130634,
        "chinese_name": "曲阳县"
    },
    {
        "Id": 60,
        "DisName": "蠡县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Lixian",
        "district_code": 130635,
        "chinese_name": "蠡县"
    },
    {
        "Id": 61,
        "DisName": "顺平县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Shunping",
        "district_code": 130636,
        "chinese_name": "顺平县"
    },
    {
        "Id": 62,
        "DisName": "博野县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Boye",
        "district_code": 130637,
        "chinese_name": "博野县"
    },
    {
        "Id": 63,
        "DisName": "雄县",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Xiongxian",
        "district_code": 130638,
        "chinese_name": "雄县"
    },
    {
        "Id": 64,
        "DisName": "涿州市",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Zhuozhou",
        "district_code": 130681,
        "chinese_name": "涿州市"
    },
    {
        "Id": 65,
        "DisName": "定州市",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Dingzhou",
        "district_code": 130682,
        "chinese_name": "定州市"
    },
    {
        "Id": 66,
        "DisName": "安国市",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Anguo",
        "district_code": 130683,
        "chinese_name": "安国市"
    },
    {
        "Id": 67,
        "DisName": "高碑店市",
        "CityID": 7,
        "DisSort": null,
        "CityNameEnglish": "Gaobeidian",
        "district_code": 130684,
        "chinese_name": "高碑店市"
    },
    {
        "Id": 68,
        "DisName": "桥东区",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Qiaodong",
        "district_code": 130702,
        "chinese_name": "桥东区"
    },
    {
        "Id": 69,
        "DisName": "桥西区",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Qiaoxi",
        "district_code": 130703,
        "chinese_name": "桥西区"
    },
    {
        "Id": 70,
        "DisName": "宣化区",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Xuanhua",
        "district_code": 130705,
        "chinese_name": "宣化区"
    },
    {
        "Id": 71,
        "DisName": "下花园区",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Xiahuayuan",
        "district_code": 130706,
        "chinese_name": "下花园区"
    },
    {
        "Id": 72,
        "DisName": "宣化县",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Xuanhua",
        "district_code": 130721,
        "chinese_name": "宣化县"
    },
    {
        "Id": 73,
        "DisName": "张北县",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Zhangbei",
        "district_code": 130722,
        "chinese_name": "张北县"
    },
    {
        "Id": 74,
        "DisName": "康保县",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Kangbao",
        "district_code": 130723,
        "chinese_name": "康保县"
    },
    {
        "Id": 75,
        "DisName": "沽源县",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Guyuan",
        "district_code": 130724,
        "chinese_name": "沽源县"
    },
    {
        "Id": 76,
        "DisName": "尚义县",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Shangyi",
        "district_code": 130725,
        "chinese_name": "尚义县"
    },
    {
        "Id": 77,
        "DisName": "蔚县",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Yuxian",
        "district_code": 130726,
        "chinese_name": "蔚县"
    },
    {
        "Id": 78,
        "DisName": "阳原县",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Yangyuan",
        "district_code": 130727,
        "chinese_name": "阳原县"
    },
    {
        "Id": 79,
        "DisName": "怀安县",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Huai'an",
        "district_code": 130728,
        "chinese_name": "怀安县"
    },
    {
        "Id": 80,
        "DisName": "万全县",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Wanquan",
        "district_code": 130729,
        "chinese_name": "万全县"
    },
    {
        "Id": 81,
        "DisName": "怀来县",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Huailai",
        "district_code": 130730,
        "chinese_name": "怀来县"
    },
    {
        "Id": 82,
        "DisName": "涿鹿县",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Zhuolu",
        "district_code": 130731,
        "chinese_name": "涿鹿县"
    },
    {
        "Id": 83,
        "DisName": "赤城县",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Chicheng",
        "district_code": 130732,
        "chinese_name": "赤城县"
    },
    {
        "Id": 84,
        "DisName": "崇礼县",
        "CityID": 8,
        "DisSort": null,
        "CityNameEnglish": "Chongli",
        "district_code": 130733,
        "chinese_name": "崇礼县"
    },
    {
        "Id": 85,
        "DisName": "双桥区",
        "CityID": 9,
        "DisSort": null,
        "CityNameEnglish": "Shuangqiao",
        "district_code": 130802,
        "chinese_name": "双桥区"
    },
    {
        "Id": 86,
        "DisName": "双滦区",
        "CityID": 9,
        "DisSort": null,
        "CityNameEnglish": "Shuangluan",
        "district_code": 130803,
        "chinese_name": "双滦区"
    },
    {
        "Id": 87,
        "DisName": "鹰手营子矿区",
        "CityID": 9,
        "DisSort": null,
        "CityNameEnglish": "Yingshouyingzi",
        "district_code": 130804,
        "chinese_name": "鹰手营子矿区"
    },
    {
        "Id": 88,
        "DisName": "承德县",
        "CityID": 9,
        "DisSort": null,
        "CityNameEnglish": "Chengde",
        "district_code": 130821,
        "chinese_name": "承德县"
    },
    {
        "Id": 89,
        "DisName": "兴隆县",
        "CityID": 9,
        "DisSort": null,
        "CityNameEnglish": "Xinglong",
        "district_code": 130822,
        "chinese_name": "兴隆县"
    },
    {
        "Id": 90,
        "DisName": "平泉县",
        "CityID": 9,
        "DisSort": null,
        "CityNameEnglish": "Pingquan",
        "district_code": 130823,
        "chinese_name": "平泉县"
    },
    {
        "Id": 91,
        "DisName": "滦平县",
        "CityID": 9,
        "DisSort": null,
        "CityNameEnglish": "Luanping",
        "district_code": 130824,
        "chinese_name": "滦平县"
    },
    {
        "Id": 92,
        "DisName": "隆化县",
        "CityID": 9,
        "DisSort": null,
        "CityNameEnglish": "Longhua",
        "district_code": 130825,
        "chinese_name": "隆化县"
    },
    {
        "Id": 93,
        "DisName": "丰宁满族自治县",
        "CityID": 9,
        "DisSort": null,
        "CityNameEnglish": "Fengning",
        "district_code": 130826,
        "chinese_name": "丰宁满族自治县"
    },
    {
        "Id": 94,
        "DisName": "宽城满族自治县",
        "CityID": 9,
        "DisSort": null,
        "CityNameEnglish": "Kuancheng",
        "district_code": 130827,
        "chinese_name": "宽城满族自治县"
    },
    {
        "Id": 95,
        "DisName": "围场满族蒙古族自治县",
        "CityID": 9,
        "DisSort": null,
        "CityNameEnglish": "Weichang",
        "district_code": 130828,
        "chinese_name": "围场满族蒙古族自治县"
    },
    {
        "Id": 96,
        "DisName": "路南区",
        "CityID": 10,
        "DisSort": null,
        "CityNameEnglish": "Lunan",
        "district_code": 130202,
        "chinese_name": "路南区"
    },
    {
        "Id": 97,
        "DisName": "路北区",
        "CityID": 10,
        "DisSort": null,
        "CityNameEnglish": "Lubei",
        "district_code": 130203,
        "chinese_name": "路北区"
    },
    {
        "Id": 98,
        "DisName": "古冶区",
        "CityID": 10,
        "DisSort": null,
        "CityNameEnglish": "Guye",
        "district_code": 130204,
        "chinese_name": "古冶区"
    },
    {
        "Id": 99,
        "DisName": "开平区",
        "CityID": 10,
        "DisSort": null,
        "CityNameEnglish": "Kaiping",
        "district_code": 130205,
        "chinese_name": "开平区"
    },
    {
        "Id": 100,
        "DisName": "丰南区",
        "CityID": 10,
        "DisSort": null,
        "CityNameEnglish": "Fengnan",
        "district_code": 130207,
        "chinese_name": "丰南区"
    },
    {
        "Id": 101,
        "DisName": "丰润区",
        "CityID": 10,
        "DisSort": null,
        "CityNameEnglish": "Fengrun",
        "district_code": 130208,
        "chinese_name": "丰润区"
    },
    {
        "Id": 102,
        "DisName": "滦县",
        "CityID": 10,
        "DisSort": null,
        "CityNameEnglish": "Luanxian",
        "district_code": 130223,
        "chinese_name": "滦县"
    },
    {
        "Id": 103,
        "DisName": "滦南县",
        "CityID": 10,
        "DisSort": null,
        "CityNameEnglish": "Luannan",
        "district_code": 130224,
        "chinese_name": "滦南县"
    },
    {
        "Id": 104,
        "DisName": "乐亭县",
        "CityID": 10,
        "DisSort": null,
        "CityNameEnglish": "Laoting",
        "district_code": 130225,
        "chinese_name": "乐亭县"
    },
    {
        "Id": 105,
        "DisName": "迁西县",
        "CityID": 10,
        "DisSort": null,
        "CityNameEnglish": "Qianxi",
        "district_code": 130227,
        "chinese_name": "迁西县"
    },
    {
        "Id": 106,
        "DisName": "玉田县",
        "CityID": 10,
        "DisSort": null,
        "CityNameEnglish": "Yutian",
        "district_code": 130229,
        "chinese_name": "玉田县"
    },
    {
        "Id": 107,
        "DisName": "唐海县",
        "CityID": 10,
        "DisSort": null,
        "CityNameEnglish": "Tanghai",
        "district_code": 130230,
        "chinese_name": "唐海县"
    },
    {
        "Id": 108,
        "DisName": "遵化市",
        "CityID": 10,
        "DisSort": null,
        "CityNameEnglish": "Zunhua",
        "district_code": 130281,
        "chinese_name": "遵化市"
    },
    {
        "Id": 109,
        "DisName": "迁安市",
        "CityID": 10,
        "DisSort": null,
        "CityNameEnglish": "Qian'an",
        "district_code": 130283,
        "chinese_name": "迁安市"
    },
    {
        "Id": 110,
        "DisName": "安次区",
        "CityID": 11,
        "DisSort": null,
        "CityNameEnglish": "Anci",
        "district_code": 131002,
        "chinese_name": "安次区"
    },
    {
        "Id": 111,
        "DisName": "广阳区",
        "CityID": 11,
        "DisSort": null,
        "CityNameEnglish": "Guangyang",
        "district_code": 131003,
        "chinese_name": "广阳区"
    },
    {
        "Id": 112,
        "DisName": "固安县",
        "CityID": 11,
        "DisSort": null,
        "CityNameEnglish": "Gu'an",
        "district_code": 131022,
        "chinese_name": "固安县"
    },
    {
        "Id": 113,
        "DisName": "永清县",
        "CityID": 11,
        "DisSort": null,
        "CityNameEnglish": "Yongqing",
        "district_code": 131023,
        "chinese_name": "永清县"
    },
    {
        "Id": 114,
        "DisName": "香河县",
        "CityID": 11,
        "DisSort": null,
        "CityNameEnglish": "Xianghe",
        "district_code": 131024,
        "chinese_name": "香河县"
    },
    {
        "Id": 115,
        "DisName": "大城县",
        "CityID": 11,
        "DisSort": null,
        "CityNameEnglish": "Dacheng",
        "district_code": 131025,
        "chinese_name": "大城县"
    },
    {
        "Id": 116,
        "DisName": "文安县",
        "CityID": 11,
        "DisSort": null,
        "CityNameEnglish": "Wen'an",
        "district_code": 131026,
        "chinese_name": "文安县"
    },
    {
        "Id": 117,
        "DisName": "大厂回族自治县",
        "CityID": 11,
        "DisSort": null,
        "CityNameEnglish": "Dachang",
        "district_code": 131028,
        "chinese_name": "大厂回族自治县"
    },
    {
        "Id": 118,
        "DisName": "霸州市",
        "CityID": 11,
        "DisSort": null,
        "CityNameEnglish": "Bazhou",
        "district_code": 131081,
        "chinese_name": "霸州市"
    },
    {
        "Id": 119,
        "DisName": "三河市",
        "CityID": 11,
        "DisSort": null,
        "CityNameEnglish": "Sanhe",
        "district_code": 131082,
        "chinese_name": "三河市"
    },
    {
        "Id": 120,
        "DisName": "新华区",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Xinhua",
        "district_code": 130902,
        "chinese_name": "新华区"
    },
    {
        "Id": 121,
        "DisName": "运河区",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Yunhe",
        "district_code": 130903,
        "chinese_name": "运河区"
    },
    {
        "Id": 122,
        "DisName": "沧县",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Cangxian",
        "district_code": 130921,
        "chinese_name": "沧县"
    },
    {
        "Id": 123,
        "DisName": "青县",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Qingxian",
        "district_code": 130922,
        "chinese_name": "青县"
    },
    {
        "Id": 124,
        "DisName": "东光县",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Dongguang",
        "district_code": 130923,
        "chinese_name": "东光县"
    },
    {
        "Id": 125,
        "DisName": "海兴县",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Haixing",
        "district_code": 130924,
        "chinese_name": "海兴县"
    },
    {
        "Id": 126,
        "DisName": "盐山县",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Yanshan",
        "district_code": 130925,
        "chinese_name": "盐山县"
    },
    {
        "Id": 127,
        "DisName": "肃宁县",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Suning",
        "district_code": 130926,
        "chinese_name": "肃宁县"
    },
    {
        "Id": 128,
        "DisName": "南皮县",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Nanpi",
        "district_code": 130927,
        "chinese_name": "南皮县"
    },
    {
        "Id": 129,
        "DisName": "吴桥县",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Wuqiao",
        "district_code": 130928,
        "chinese_name": "吴桥县"
    },
    {
        "Id": 130,
        "DisName": "献县",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Xianxian",
        "district_code": 130929,
        "chinese_name": "献县"
    },
    {
        "Id": 131,
        "DisName": "孟村回族自治县",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Mengcun",
        "district_code": 130930,
        "chinese_name": "孟村回族自治县"
    },
    {
        "Id": 132,
        "DisName": "泊头市",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Botou",
        "district_code": 130981,
        "chinese_name": "泊头市"
    },
    {
        "Id": 133,
        "DisName": "任丘市",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Renqiu",
        "district_code": 130982,
        "chinese_name": "任丘市"
    },
    {
        "Id": 134,
        "DisName": "黄骅市",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Huanghua",
        "district_code": 130983,
        "chinese_name": "黄骅市"
    },
    {
        "Id": 135,
        "DisName": "河间市",
        "CityID": 12,
        "DisSort": null,
        "CityNameEnglish": "Hejian",
        "district_code": 130984,
        "chinese_name": "河间市"
    },
    {
        "Id": 136,
        "DisName": "桃城区",
        "CityID": 13,
        "DisSort": null,
        "CityNameEnglish": "Taocheng",
        "district_code": 131102,
        "chinese_name": "桃城区"
    },
    {
        "Id": 137,
        "DisName": "枣强县",
        "CityID": 13,
        "DisSort": null,
        "CityNameEnglish": "Zaoqiang",
        "district_code": 131121,
        "chinese_name": "枣强县"
    },
    {
        "Id": 138,
        "DisName": "武邑县",
        "CityID": 13,
        "DisSort": null,
        "CityNameEnglish": "Wuyi",
        "district_code": 131122,
        "chinese_name": "武邑县"
    },
    {
        "Id": 139,
        "DisName": "武强县",
        "CityID": 13,
        "DisSort": null,
        "CityNameEnglish": "Wuqiang",
        "district_code": 131123,
        "chinese_name": "武强县"
    },
    {
        "Id": 140,
        "DisName": "饶阳县",
        "CityID": 13,
        "DisSort": null,
        "CityNameEnglish": "Raoyang",
        "district_code": 131124,
        "chinese_name": "饶阳县"
    },
    {
        "Id": 141,
        "DisName": "安平县",
        "CityID": 13,
        "DisSort": null,
        "CityNameEnglish": "Anping",
        "district_code": 131125,
        "chinese_name": "安平县"
    },
    {
        "Id": 142,
        "DisName": "故城县",
        "CityID": 13,
        "DisSort": null,
        "CityNameEnglish": "Gucheng",
        "district_code": 131126,
        "chinese_name": "故城县"
    },
    {
        "Id": 143,
        "DisName": "景县",
        "CityID": 13,
        "DisSort": null,
        "CityNameEnglish": "Jingxian",
        "district_code": 131127,
        "chinese_name": "景县"
    },
    {
        "Id": 144,
        "DisName": "阜城县",
        "CityID": 13,
        "DisSort": null,
        "CityNameEnglish": "Fucheng",
        "district_code": 131128,
        "chinese_name": "阜城县"
    },
    {
        "Id": 145,
        "DisName": "冀州市",
        "CityID": 13,
        "DisSort": null,
        "CityNameEnglish": "Jizhou",
        "district_code": 131181,
        "chinese_name": "冀州市"
    },
    {
        "Id": 146,
        "DisName": "深州市",
        "CityID": 13,
        "DisSort": null,
        "CityNameEnglish": "Shenzhou",
        "district_code": 131182,
        "chinese_name": "深州市"
    },
    {
        "Id": 147,
        "DisName": "桥东区",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Qiaodong",
        "district_code": 130502,
        "chinese_name": "桥东区"
    },
    {
        "Id": 148,
        "DisName": "桥西区",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Qiaoxi",
        "district_code": 130503,
        "chinese_name": "桥西区"
    },
    {
        "Id": 149,
        "DisName": "邢台县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Xingtai",
        "district_code": 130521,
        "chinese_name": "邢台县"
    },
    {
        "Id": 150,
        "DisName": "临城县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Lincheng",
        "district_code": 130522,
        "chinese_name": "临城县"
    },
    {
        "Id": 151,
        "DisName": "内丘县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Neiqiu",
        "district_code": 130523,
        "chinese_name": "内丘县"
    },
    {
        "Id": 152,
        "DisName": "柏乡县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Baixiang",
        "district_code": 130524,
        "chinese_name": "柏乡县"
    },
    {
        "Id": 153,
        "DisName": "隆尧县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Longyao",
        "district_code": 130525,
        "chinese_name": "隆尧县"
    },
    {
        "Id": 154,
        "DisName": "任县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Renxian",
        "district_code": 130526,
        "chinese_name": "任县"
    },
    {
        "Id": 155,
        "DisName": "南和县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Nanhe",
        "district_code": 130527,
        "chinese_name": "南和县"
    },
    {
        "Id": 156,
        "DisName": "宁晋县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Ningjin",
        "district_code": 130528,
        "chinese_name": "宁晋县"
    },
    {
        "Id": 157,
        "DisName": "巨鹿县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Julu",
        "district_code": 130529,
        "chinese_name": "巨鹿县"
    },
    {
        "Id": 158,
        "DisName": "新河县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Xinhe",
        "district_code": 130530,
        "chinese_name": "新河县"
    },
    {
        "Id": 159,
        "DisName": "广宗县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Guangzong",
        "district_code": 130531,
        "chinese_name": "广宗县"
    },
    {
        "Id": 160,
        "DisName": "平乡县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Pingxiang",
        "district_code": 130532,
        "chinese_name": "平乡县"
    },
    {
        "Id": 161,
        "DisName": "威县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Weixian",
        "district_code": 130533,
        "chinese_name": "威县"
    },
    {
        "Id": 162,
        "DisName": "清河县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Qinghe",
        "district_code": 130534,
        "chinese_name": "清河县"
    },
    {
        "Id": 163,
        "DisName": "临西县",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Linxi",
        "district_code": 130535,
        "chinese_name": "临西县"
    },
    {
        "Id": 164,
        "DisName": "南宫市",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Nangong",
        "district_code": 130581,
        "chinese_name": "南宫市"
    },
    {
        "Id": 165,
        "DisName": "沙河市",
        "CityID": 14,
        "DisSort": null,
        "CityNameEnglish": "Shahe",
        "district_code": 130582,
        "chinese_name": "沙河市"
    },
    {
        "Id": 173,
        "DisName": "朔城区",
        "CityID": 16,
        "DisSort": null,
        "CityNameEnglish": "Shuocheng",
        "district_code": 140602,
        "chinese_name": "朔城区"
    },
    {
        "Id": 174,
        "DisName": "平鲁区",
        "CityID": 16,
        "DisSort": null,
        "CityNameEnglish": "Pinglu",
        "district_code": 140603,
        "chinese_name": "平鲁区"
    },
    {
        "Id": 175,
        "DisName": "山阴县",
        "CityID": 16,
        "DisSort": null,
        "CityNameEnglish": "Shanyin",
        "district_code": 140621,
        "chinese_name": "山阴县"
    },
    {
        "Id": 176,
        "DisName": "应县",
        "CityID": 16,
        "DisSort": null,
        "CityNameEnglish": "Yingxian",
        "district_code": 140622,
        "chinese_name": "应县"
    },
    {
        "Id": 177,
        "DisName": "右玉县",
        "CityID": 16,
        "DisSort": null,
        "CityNameEnglish": "Youyu",
        "district_code": 140623,
        "chinese_name": "右玉县"
    },
    {
        "Id": 178,
        "DisName": "怀仁县",
        "CityID": 16,
        "DisSort": null,
        "CityNameEnglish": "Huairen",
        "district_code": 140624,
        "chinese_name": "怀仁县"
    },
    {
        "Id": 179,
        "DisName": "忻府区",
        "CityID": 17,
        "DisSort": null,
        "CityNameEnglish": "Xinfu",
        "district_code": 140902,
        "chinese_name": "忻府区"
    },
    {
        "Id": 180,
        "DisName": "定襄县",
        "CityID": 17,
        "DisSort": null,
        "CityNameEnglish": "Dingxiang",
        "district_code": 140921,
        "chinese_name": "定襄县"
    },
    {
        "Id": 181,
        "DisName": "五台县",
        "CityID": 17,
        "DisSort": null,
        "CityNameEnglish": "Wutai",
        "district_code": 140922,
        "chinese_name": "五台县"
    },
    {
        "Id": 182,
        "DisName": "代县",
        "CityID": 17,
        "DisSort": null,
        "CityNameEnglish": "Daixian",
        "district_code": 140923,
        "chinese_name": "代县"
    },
    {
        "Id": 183,
        "DisName": "繁峙县",
        "CityID": 17,
        "DisSort": null,
        "CityNameEnglish": "Fanshi",
        "district_code": 140924,
        "chinese_name": "繁峙县"
    },
    {
        "Id": 184,
        "DisName": "宁武县",
        "CityID": 17,
        "DisSort": null,
        "CityNameEnglish": "Ningwu",
        "district_code": 140925,
        "chinese_name": "宁武县"
    },
    {
        "Id": 185,
        "DisName": "静乐县",
        "CityID": 17,
        "DisSort": null,
        "CityNameEnglish": "Jingle",
        "district_code": 140926,
        "chinese_name": "静乐县"
    },
    {
        "Id": 186,
        "DisName": "神池县",
        "CityID": 17,
        "DisSort": null,
        "CityNameEnglish": "Shenchi",
        "district_code": 140927,
        "chinese_name": "神池县"
    },
    {
        "Id": 187,
        "DisName": "五寨县",
        "CityID": 17,
        "DisSort": null,
        "CityNameEnglish": "Wuzhai",
        "district_code": 140928,
        "chinese_name": "五寨县"
    },
    {
        "Id": 188,
        "DisName": "岢岚县",
        "CityID": 17,
        "DisSort": null,
        "CityNameEnglish": "Kelan",
        "district_code": 140929,
        "chinese_name": "岢岚县"
    },
    {
        "Id": 189,
        "DisName": "河曲县",
        "CityID": 17,
        "DisSort": null,
        "CityNameEnglish": "Hequ",
        "district_code": 140930,
        "chinese_name": "河曲县"
    },
    {
        "Id": 190,
        "DisName": "保德县",
        "CityID": 17,
        "DisSort": null,
        "CityNameEnglish": "Baode",
        "district_code": 140931,
        "chinese_name": "保德县"
    },
    {
        "Id": 191,
        "DisName": "偏关县",
        "CityID": 17,
        "DisSort": null,
        "CityNameEnglish": "Pianguan",
        "district_code": 140932,
        "chinese_name": "偏关县"
    },
    {
        "Id": 192,
        "DisName": "原平市",
        "CityID": 17,
        "DisSort": null,
        "CityNameEnglish": "Yuanping",
        "district_code": 140981,
        "chinese_name": "原平市"
    },
    {
        "Id": 193,
        "DisName": "小店区",
        "CityID": 18,
        "DisSort": null,
        "CityNameEnglish": "Xiaodian",
        "district_code": 140105,
        "chinese_name": "小店区"
    },
    {
        "Id": 194,
        "DisName": "迎泽区",
        "CityID": 18,
        "DisSort": null,
        "CityNameEnglish": "Yingze",
        "district_code": 140106,
        "chinese_name": "迎泽区"
    },
    {
        "Id": 195,
        "DisName": "杏花岭区",
        "CityID": 18,
        "DisSort": null,
        "CityNameEnglish": "Xinghualing",
        "district_code": 140107,
        "chinese_name": "杏花岭区"
    },
    {
        "Id": 196,
        "DisName": "尖草坪区",
        "CityID": 18,
        "DisSort": null,
        "CityNameEnglish": "Jiancaoping",
        "district_code": 140108,
        "chinese_name": "尖草坪区"
    },
    {
        "Id": 197,
        "DisName": "万柏林区",
        "CityID": 18,
        "DisSort": null,
        "CityNameEnglish": "Wanbailin",
        "district_code": 140109,
        "chinese_name": "万柏林区"
    },
    {
        "Id": 198,
        "DisName": "晋源区",
        "CityID": 18,
        "DisSort": null,
        "CityNameEnglish": "Jinyuan",
        "district_code": 140110,
        "chinese_name": "晋源区"
    },
    {
        "Id": 199,
        "DisName": "清徐县",
        "CityID": 18,
        "DisSort": null,
        "CityNameEnglish": "Qingxu",
        "district_code": 140121,
        "chinese_name": "清徐县"
    },
    {
        "Id": 200,
        "DisName": "阳曲县",
        "CityID": 18,
        "DisSort": null,
        "CityNameEnglish": "Yangqu",
        "district_code": 140122,
        "chinese_name": "阳曲县"
    },
    {
        "Id": 201,
        "DisName": "娄烦县",
        "CityID": 18,
        "DisSort": null,
        "CityNameEnglish": "Loufan",
        "district_code": 140123,
        "chinese_name": "娄烦县"
    },
    {
        "Id": 202,
        "DisName": "古交市",
        "CityID": 18,
        "DisSort": null,
        "CityNameEnglish": "Gujiao",
        "district_code": 140181,
        "chinese_name": "古交市"
    },
    {
        "Id": 203,
        "DisName": "城区",
        "CityID": 19,
        "DisSort": null,
        "CityNameEnglish": "Chengqu",
        "district_code": 140202,
        "chinese_name": "城区"
    },
    {
        "Id": 204,
        "DisName": "矿区",
        "CityID": 19,
        "DisSort": null,
        "CityNameEnglish": "Kuangqu",
        "district_code": 140203,
        "chinese_name": "矿区"
    },
    {
        "Id": 205,
        "DisName": "南郊区",
        "CityID": 19,
        "DisSort": null,
        "CityNameEnglish": "Nanjiao",
        "district_code": 140211,
        "chinese_name": "南郊区"
    },
    {
        "Id": 206,
        "DisName": "新荣区",
        "CityID": 19,
        "DisSort": null,
        "CityNameEnglish": "Xinrong",
        "district_code": 140212,
        "chinese_name": "新荣区"
    },
    {
        "Id": 207,
        "DisName": "阳高县",
        "CityID": 19,
        "DisSort": null,
        "CityNameEnglish": "Yanggao",
        "district_code": 140221,
        "chinese_name": "阳高县"
    },
    {
        "Id": 208,
        "DisName": "天镇县",
        "CityID": 19,
        "DisSort": null,
        "CityNameEnglish": "Tianzhen",
        "district_code": 140222,
        "chinese_name": "天镇县"
    },
    {
        "Id": 209,
        "DisName": "广灵县",
        "CityID": 19,
        "DisSort": null,
        "CityNameEnglish": "Guangling",
        "district_code": 140223,
        "chinese_name": "广灵县"
    },
    {
        "Id": 210,
        "DisName": "灵丘县",
        "CityID": 19,
        "DisSort": null,
        "CityNameEnglish": "Lingqiu",
        "district_code": 140224,
        "chinese_name": "灵丘县"
    },
    {
        "Id": 211,
        "DisName": "浑源县",
        "CityID": 19,
        "DisSort": null,
        "CityNameEnglish": "Hunyuan",
        "district_code": 140225,
        "chinese_name": "浑源县"
    },
    {
        "Id": 212,
        "DisName": "左云县",
        "CityID": 19,
        "DisSort": null,
        "CityNameEnglish": "Zuoyun",
        "district_code": 140226,
        "chinese_name": "左云县"
    },
    {
        "Id": 213,
        "DisName": "大同县",
        "CityID": 19,
        "DisSort": null,
        "CityNameEnglish": "Datong",
        "district_code": 140227,
        "chinese_name": "大同县"
    },
    {
        "Id": 214,
        "DisName": "城区",
        "CityID": 20,
        "DisSort": null,
        "CityNameEnglish": "Chengqu",
        "district_code": 140302,
        "chinese_name": "城区"
    },
    {
        "Id": 215,
        "DisName": "矿区",
        "CityID": 20,
        "DisSort": null,
        "CityNameEnglish": "Kuangqu",
        "district_code": 140303,
        "chinese_name": "矿区"
    },
    {
        "Id": 216,
        "DisName": "郊区",
        "CityID": 20,
        "DisSort": null,
        "CityNameEnglish": "Jiaoqu",
        "district_code": 140311,
        "chinese_name": "郊区"
    },
    {
        "Id": 217,
        "DisName": "平定县",
        "CityID": 20,
        "DisSort": null,
        "CityNameEnglish": "Pingding",
        "district_code": 140321,
        "chinese_name": "平定县"
    },
    {
        "Id": 218,
        "DisName": "盂县",
        "CityID": 20,
        "DisSort": null,
        "CityNameEnglish": "Yuxian",
        "district_code": 140322,
        "chinese_name": "盂县"
    },
    {
        "Id": 219,
        "DisName": "榆次区",
        "CityID": 21,
        "DisSort": null,
        "CityNameEnglish": "Yuci",
        "district_code": 140702,
        "chinese_name": "榆次区"
    },
    {
        "Id": 220,
        "DisName": "榆社县",
        "CityID": 21,
        "DisSort": null,
        "CityNameEnglish": "Yushe",
        "district_code": 140721,
        "chinese_name": "榆社县"
    },
    {
        "Id": 221,
        "DisName": "左权县",
        "CityID": 21,
        "DisSort": null,
        "CityNameEnglish": "Zuoquan",
        "district_code": 140722,
        "chinese_name": "左权县"
    },
    {
        "Id": 222,
        "DisName": "和顺县",
        "CityID": 21,
        "DisSort": null,
        "CityNameEnglish": "Heshun",
        "district_code": 140723,
        "chinese_name": "和顺县"
    },
    {
        "Id": 223,
        "DisName": "昔阳县",
        "CityID": 21,
        "DisSort": null,
        "CityNameEnglish": "Xiyang",
        "district_code": 140724,
        "chinese_name": "昔阳县"
    },
    {
        "Id": 224,
        "DisName": "寿阳县",
        "CityID": 21,
        "DisSort": null,
        "CityNameEnglish": "Shouyang",
        "district_code": 140725,
        "chinese_name": "寿阳县"
    },
    {
        "Id": 225,
        "DisName": "太谷县",
        "CityID": 21,
        "DisSort": null,
        "CityNameEnglish": "Taigu",
        "district_code": 140726,
        "chinese_name": "太谷县"
    },
    {
        "Id": 226,
        "DisName": "祁县",
        "CityID": 21,
        "DisSort": null,
        "CityNameEnglish": "Qi",
        "district_code": 140727,
        "chinese_name": "祁县"
    },
    {
        "Id": 227,
        "DisName": "平遥县",
        "CityID": 21,
        "DisSort": null,
        "CityNameEnglish": "Pingyao",
        "district_code": 140728,
        "chinese_name": "平遥县"
    },
    {
        "Id": 228,
        "DisName": "灵石县",
        "CityID": 21,
        "DisSort": null,
        "CityNameEnglish": "Lingshi",
        "district_code": 140729,
        "chinese_name": "灵石县"
    },
    {
        "Id": 229,
        "DisName": "介休市",
        "CityID": 21,
        "DisSort": null,
        "CityNameEnglish": "Jiexiu",
        "district_code": 140781,
        "chinese_name": "介休市"
    },
    {
        "Id": 230,
        "DisName": "长治县",
        "CityID": 22,
        "DisSort": null,
        "CityNameEnglish": "Changzhi",
        "district_code": 140421,
        "chinese_name": "长治县"
    },
    {
        "Id": 231,
        "DisName": "襄垣县",
        "CityID": 22,
        "DisSort": null,
        "CityNameEnglish": "Xiangyuan",
        "district_code": 140423,
        "chinese_name": "襄垣县"
    },
    {
        "Id": 232,
        "DisName": "屯留县",
        "CityID": 22,
        "DisSort": null,
        "CityNameEnglish": "Tunliu",
        "district_code": 140424,
        "chinese_name": "屯留县"
    },
    {
        "Id": 233,
        "DisName": "平顺县",
        "CityID": 22,
        "DisSort": null,
        "CityNameEnglish": "Pingshun",
        "district_code": 140425,
        "chinese_name": "平顺县"
    },
    {
        "Id": 234,
        "DisName": "黎城县",
        "CityID": 22,
        "DisSort": null,
        "CityNameEnglish": "Licheng",
        "district_code": 140426,
        "chinese_name": "黎城县"
    },
    {
        "Id": 235,
        "DisName": "壶关县",
        "CityID": 22,
        "DisSort": null,
        "CityNameEnglish": "Huguan",
        "district_code": 140427,
        "chinese_name": "壶关县"
    },
    {
        "Id": 236,
        "DisName": "长子县",
        "CityID": 22,
        "DisSort": null,
        "CityNameEnglish": "Zhangzi",
        "district_code": 140428,
        "chinese_name": "长子县"
    },
    {
        "Id": 237,
        "DisName": "武乡县",
        "CityID": 22,
        "DisSort": null,
        "CityNameEnglish": "Wuxiang",
        "district_code": 140429,
        "chinese_name": "武乡县"
    },
    {
        "Id": 238,
        "DisName": "沁县",
        "CityID": 22,
        "DisSort": null,
        "CityNameEnglish": "Qinxian",
        "district_code": 140430,
        "chinese_name": "沁县"
    },
    {
        "Id": 239,
        "DisName": "沁源县",
        "CityID": 22,
        "DisSort": null,
        "CityNameEnglish": "Qinyuan",
        "district_code": 140431,
        "chinese_name": "沁源县"
    },
    {
        "Id": 240,
        "DisName": "潞城市",
        "CityID": 22,
        "DisSort": null,
        "CityNameEnglish": "Lucheng",
        "district_code": 140481,
        "chinese_name": "潞城市"
    },
    {
        "Id": 241,
        "DisName": "沁水县",
        "CityID": 23,
        "DisSort": null,
        "CityNameEnglish": "Qinshui",
        "district_code": 140521,
        "chinese_name": "沁水县"
    },
    {
        "Id": 242,
        "DisName": "阳城县",
        "CityID": 23,
        "DisSort": null,
        "CityNameEnglish": "Yangcheng",
        "district_code": 140522,
        "chinese_name": "阳城县"
    },
    {
        "Id": 243,
        "DisName": "陵川县",
        "CityID": 23,
        "DisSort": null,
        "CityNameEnglish": "Lingchuan",
        "district_code": 140524,
        "chinese_name": "陵川县"
    },
    {
        "Id": 244,
        "DisName": "泽州县",
        "CityID": 23,
        "DisSort": null,
        "CityNameEnglish": "Zezhou",
        "district_code": 140525,
        "chinese_name": "泽州县"
    },
    {
        "Id": 245,
        "DisName": "高平市",
        "CityID": 23,
        "DisSort": null,
        "CityNameEnglish": "Gaoping",
        "district_code": 140581,
        "chinese_name": "高平市"
    },
    {
        "Id": 246,
        "DisName": "尧都区",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Yaodu",
        "district_code": 141002,
        "chinese_name": "尧都区"
    },
    {
        "Id": 247,
        "DisName": "曲沃县",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Quwo",
        "district_code": 141021,
        "chinese_name": "曲沃县"
    },
    {
        "Id": 248,
        "DisName": "翼城县",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Yicheng",
        "district_code": 141022,
        "chinese_name": "翼城县"
    },
    {
        "Id": 249,
        "DisName": "襄汾县",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Xiangfen",
        "district_code": 141023,
        "chinese_name": "襄汾县"
    },
    {
        "Id": 250,
        "DisName": "洪洞县",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Hongdong",
        "district_code": 141024,
        "chinese_name": "洪洞县"
    },
    {
        "Id": 251,
        "DisName": "古县",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Guxian",
        "district_code": 141025,
        "chinese_name": "古县"
    },
    {
        "Id": 252,
        "DisName": "安泽县",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Anze",
        "district_code": 141026,
        "chinese_name": "安泽县"
    },
    {
        "Id": 253,
        "DisName": "浮山县",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Fushan",
        "district_code": 141027,
        "chinese_name": "浮山县"
    },
    {
        "Id": 254,
        "DisName": "吉县",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Jixian",
        "district_code": 141028,
        "chinese_name": "吉县"
    },
    {
        "Id": 255,
        "DisName": "乡宁县",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Xiangning",
        "district_code": 141029,
        "chinese_name": "乡宁县"
    },
    {
        "Id": 256,
        "DisName": "大宁县",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Daning",
        "district_code": 141030,
        "chinese_name": "大宁县"
    },
    {
        "Id": 257,
        "DisName": "隰县",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Xixian",
        "district_code": 141031,
        "chinese_name": "隰县"
    },
    {
        "Id": 258,
        "DisName": "永和县",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Yonghe",
        "district_code": 141032,
        "chinese_name": "永和县"
    },
    {
        "Id": 259,
        "DisName": "蒲县",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Puxian",
        "district_code": 141033,
        "chinese_name": "蒲县"
    },
    {
        "Id": 260,
        "DisName": "汾西县",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Fenxi",
        "district_code": 141034,
        "chinese_name": "汾西县"
    },
    {
        "Id": 261,
        "DisName": "侯马市",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Houma",
        "district_code": 141081,
        "chinese_name": "侯马市"
    },
    {
        "Id": 262,
        "DisName": "霍州市",
        "CityID": 24,
        "DisSort": null,
        "CityNameEnglish": "Huozhou",
        "district_code": 141082,
        "chinese_name": "霍州市"
    },
    {
        "Id": 263,
        "DisName": "离石区",
        "CityID": 25,
        "DisSort": null,
        "CityNameEnglish": "Lishi",
        "district_code": 141102,
        "chinese_name": "离石区"
    },
    {
        "Id": 264,
        "DisName": "文水县",
        "CityID": 25,
        "DisSort": null,
        "CityNameEnglish": "Wenshui",
        "district_code": 141121,
        "chinese_name": "文水县"
    },
    {
        "Id": 265,
        "DisName": "交城县",
        "CityID": 25,
        "DisSort": null,
        "CityNameEnglish": "Jiaocheng",
        "district_code": 141122,
        "chinese_name": "交城县"
    },
    {
        "Id": 266,
        "DisName": "兴县",
        "CityID": 25,
        "DisSort": null,
        "CityNameEnglish": "Xingxian",
        "district_code": 141123,
        "chinese_name": "兴县"
    },
    {
        "Id": 267,
        "DisName": "临县",
        "CityID": 25,
        "DisSort": null,
        "CityNameEnglish": "Linxian",
        "district_code": 141124,
        "chinese_name": "临县"
    },
    {
        "Id": 268,
        "DisName": "柳林县",
        "CityID": 25,
        "DisSort": null,
        "CityNameEnglish": "Liulin",
        "district_code": 141125,
        "chinese_name": "柳林县"
    },
    {
        "Id": 269,
        "DisName": "石楼县",
        "CityID": 25,
        "DisSort": null,
        "CityNameEnglish": "Shilou",
        "district_code": 141126,
        "chinese_name": "石楼县"
    },
    {
        "Id": 270,
        "DisName": "岚县",
        "CityID": 25,
        "DisSort": null,
        "CityNameEnglish": "Lanxian",
        "district_code": 141127,
        "chinese_name": "岚县"
    },
    {
        "Id": 271,
        "DisName": "方山县",
        "CityID": 25,
        "DisSort": null,
        "CityNameEnglish": "Fangshan",
        "district_code": 141128,
        "chinese_name": "方山县"
    },
    {
        "Id": 272,
        "DisName": "中阳县",
        "CityID": 25,
        "DisSort": null,
        "CityNameEnglish": "Zhongyang",
        "district_code": 141129,
        "chinese_name": "中阳县"
    },
    {
        "Id": 273,
        "DisName": "交口县",
        "CityID": 25,
        "DisSort": null,
        "CityNameEnglish": "Jiaokou",
        "district_code": 141130,
        "chinese_name": "交口县"
    },
    {
        "Id": 274,
        "DisName": "孝义市",
        "CityID": 25,
        "DisSort": null,
        "CityNameEnglish": "Xiaoyi",
        "district_code": 141181,
        "chinese_name": "孝义市"
    },
    {
        "Id": 275,
        "DisName": "汾阳市",
        "CityID": 25,
        "DisSort": null,
        "CityNameEnglish": "Fenyang",
        "district_code": 141182,
        "chinese_name": "汾阳市"
    },
    {
        "Id": 276,
        "DisName": "盐湖区",
        "CityID": 26,
        "DisSort": null,
        "CityNameEnglish": "Yanhu",
        "district_code": 140802,
        "chinese_name": "盐湖区"
    },
    {
        "Id": 277,
        "DisName": "临猗县",
        "CityID": 26,
        "DisSort": null,
        "CityNameEnglish": "Linyi",
        "district_code": 140821,
        "chinese_name": "临猗县"
    },
    {
        "Id": 278,
        "DisName": "万荣县",
        "CityID": 26,
        "DisSort": null,
        "CityNameEnglish": "Wanrong",
        "district_code": 140822,
        "chinese_name": "万荣县"
    },
    {
        "Id": 279,
        "DisName": "闻喜县",
        "CityID": 26,
        "DisSort": null,
        "CityNameEnglish": "Wenxi",
        "district_code": 140823,
        "chinese_name": "闻喜县"
    },
    {
        "Id": 280,
        "DisName": "稷山县",
        "CityID": 26,
        "DisSort": null,
        "CityNameEnglish": "Jishan",
        "district_code": 140824,
        "chinese_name": "稷山县"
    },
    {
        "Id": 281,
        "DisName": "新绛县",
        "CityID": 26,
        "DisSort": null,
        "CityNameEnglish": "Xinjiang",
        "district_code": 140825,
        "chinese_name": "新绛县"
    },
    {
        "Id": 282,
        "DisName": "绛县",
        "CityID": 26,
        "DisSort": null,
        "CityNameEnglish": "Jiangxian",
        "district_code": 140826,
        "chinese_name": "绛县"
    },
    {
        "Id": 283,
        "DisName": "垣曲县",
        "CityID": 26,
        "DisSort": null,
        "CityNameEnglish": "Yuanqu",
        "district_code": 140827,
        "chinese_name": "垣曲县"
    },
    {
        "Id": 284,
        "DisName": "夏县",
        "CityID": 26,
        "DisSort": null,
        "CityNameEnglish": "Xiaxian",
        "district_code": 140828,
        "chinese_name": "夏县"
    },
    {
        "Id": 285,
        "DisName": "平陆县",
        "CityID": 26,
        "DisSort": null,
        "CityNameEnglish": "Pinglu",
        "district_code": 140829,
        "chinese_name": "平陆县"
    },
    {
        "Id": 286,
        "DisName": "芮城县",
        "CityID": 26,
        "DisSort": null,
        "CityNameEnglish": "Ruicheng",
        "district_code": 140830,
        "chinese_name": "芮城县"
    },
    {
        "Id": 287,
        "DisName": "永济市",
        "CityID": 26,
        "DisSort": null,
        "CityNameEnglish": "Yongji",
        "district_code": 140881,
        "chinese_name": "永济市"
    },
    {
        "Id": 288,
        "DisName": "河津市",
        "CityID": 26,
        "DisSort": null,
        "CityNameEnglish": "Hejin",
        "district_code": 140882,
        "chinese_name": "河津市"
    },
    {
        "Id": 289,
        "DisName": "和平区",
        "CityID": 27,
        "DisSort": null,
        "CityNameEnglish": "Heping",
        "district_code": 210102,
        "chinese_name": "和平区"
    },
    {
        "Id": 290,
        "DisName": "沈河区",
        "CityID": 27,
        "DisSort": null,
        "CityNameEnglish": "Shenhe",
        "district_code": 210103,
        "chinese_name": "沈河区"
    },
    {
        "Id": 291,
        "DisName": "大东区",
        "CityID": 27,
        "DisSort": null,
        "CityNameEnglish": "Dadong",
        "district_code": 210104,
        "chinese_name": "大东区"
    },
    {
        "Id": 292,
        "DisName": "皇姑区",
        "CityID": 27,
        "DisSort": null,
        "CityNameEnglish": "Huanggu",
        "district_code": 210105,
        "chinese_name": "皇姑区"
    },
    {
        "Id": 293,
        "DisName": "铁西区",
        "CityID": 27,
        "DisSort": null,
        "CityNameEnglish": "Tiexi",
        "district_code": 210106,
        "chinese_name": "铁西区"
    },
    {
        "Id": 294,
        "DisName": "苏家屯区",
        "CityID": 27,
        "DisSort": null,
        "CityNameEnglish": "Sujiatun",
        "district_code": 210111,
        "chinese_name": "苏家屯区"
    },
    {
        "Id": 295,
        "DisName": "东陵区",
        "CityID": 27,
        "DisSort": null,
        "CityNameEnglish": "Dongling",
        "district_code": 210112,
        "chinese_name": "东陵区"
    },
    {
        "Id": 296,
        "DisName": "沈北新区",
        "CityID": 27,
        "DisSort": null,
        "CityNameEnglish": "Shenbei New",
        "district_code": 210184,
        "chinese_name": "沈北新区"
    },
    {
        "Id": 297,
        "DisName": "于洪区",
        "CityID": 27,
        "DisSort": null,
        "CityNameEnglish": "Yuhong",
        "district_code": 210114,
        "chinese_name": "于洪区"
    },
    {
        "Id": 298,
        "DisName": "辽中县",
        "CityID": 27,
        "DisSort": null,
        "CityNameEnglish": "Liaozhong",
        "district_code": 210122,
        "chinese_name": "辽中县"
    },
    {
        "Id": 299,
        "DisName": "康平县",
        "CityID": 27,
        "DisSort": null,
        "CityNameEnglish": "Kangping",
        "district_code": 210123,
        "chinese_name": "康平县"
    },
    {
        "Id": 300,
        "DisName": "法库县",
        "CityID": 27,
        "DisSort": null,
        "CityNameEnglish": "Faku",
        "district_code": 210124,
        "chinese_name": "法库县"
    },
    {
        "Id": 301,
        "DisName": "新民市",
        "CityID": 27,
        "DisSort": null,
        "CityNameEnglish": "Xinmin",
        "district_code": 210181,
        "chinese_name": "新民市"
    },
    {
        "Id": 302,
        "DisName": "银州区",
        "CityID": 28,
        "DisSort": null,
        "CityNameEnglish": "Yinzhou",
        "district_code": 211202,
        "chinese_name": "银州区"
    },
    {
        "Id": 303,
        "DisName": "清河区",
        "CityID": 28,
        "DisSort": null,
        "CityNameEnglish": "Qinghe",
        "district_code": 211204,
        "chinese_name": "清河区"
    },
    {
        "Id": 304,
        "DisName": "铁岭县",
        "CityID": 28,
        "DisSort": null,
        "CityNameEnglish": "Tieling",
        "district_code": 211221,
        "chinese_name": "铁岭县"
    },
    {
        "Id": 305,
        "DisName": "西丰县",
        "CityID": 28,
        "DisSort": null,
        "CityNameEnglish": "Xifeng",
        "district_code": 211223,
        "chinese_name": "西丰县"
    },
    {
        "Id": 306,
        "DisName": "昌图县",
        "CityID": 28,
        "DisSort": null,
        "CityNameEnglish": "Changtu",
        "district_code": 211224,
        "chinese_name": "昌图县"
    },
    {
        "Id": 307,
        "DisName": "调兵山市",
        "CityID": 28,
        "DisSort": null,
        "CityNameEnglish": "Diaobingshan",
        "district_code": 211281,
        "chinese_name": "调兵山市"
    },
    {
        "Id": 308,
        "DisName": "开原市",
        "CityID": 28,
        "DisSort": null,
        "CityNameEnglish": "Kaiyuan",
        "district_code": 211282,
        "chinese_name": "开原市"
    },
    {
        "Id": 309,
        "DisName": "长海县",
        "CityID": 29,
        "DisSort": null,
        "CityNameEnglish": "Changhai",
        "district_code": 210224,
        "chinese_name": "长海县"
    },
    {
        "Id": 310,
        "DisName": "旅顺口区",
        "CityID": 29,
        "DisSort": null,
        "CityNameEnglish": "Lushunkou",
        "district_code": 210212,
        "chinese_name": "旅顺口区"
    },
    {
        "Id": 311,
        "DisName": "中山区",
        "CityID": 29,
        "DisSort": null,
        "CityNameEnglish": "Zhongshan",
        "district_code": 210202,
        "chinese_name": "中山区"
    },
    {
        "Id": 312,
        "DisName": "西岗区",
        "CityID": 29,
        "DisSort": null,
        "CityNameEnglish": "Xigang",
        "district_code": 210203,
        "chinese_name": "西岗区"
    },
    {
        "Id": 313,
        "DisName": "沙河口区",
        "CityID": 29,
        "DisSort": null,
        "CityNameEnglish": "Shahekou",
        "district_code": 210204,
        "chinese_name": "沙河口区"
    },
    {
        "Id": 314,
        "DisName": "甘井子区",
        "CityID": 29,
        "DisSort": null,
        "CityNameEnglish": "Ganjingzi",
        "district_code": 210211,
        "chinese_name": "甘井子区"
    },
    {
        "Id": 315,
        "DisName": "金州区",
        "CityID": 29,
        "DisSort": null,
        "CityNameEnglish": "Jinzhou",
        "district_code": 210213,
        "chinese_name": "金州区"
    },
    {
        "Id": 316,
        "DisName": "普兰店市",
        "CityID": 29,
        "DisSort": null,
        "CityNameEnglish": "Pulandian",
        "district_code": 210282,
        "chinese_name": "普兰店市"
    },
    {
        "Id": 317,
        "DisName": "瓦房店市",
        "CityID": 29,
        "DisSort": null,
        "CityNameEnglish": "Wafangdian",
        "district_code": 210281,
        "chinese_name": "瓦房店市"
    },
    {
        "Id": 318,
        "DisName": "庄河市",
        "CityID": 29,
        "DisSort": null,
        "CityNameEnglish": "Zhuanghe",
        "district_code": 210283,
        "chinese_name": "庄河市"
    },
    {
        "Id": 319,
        "DisName": "铁东区",
        "CityID": 30,
        "DisSort": null,
        "CityNameEnglish": "Tiedong",
        "district_code": 210302,
        "chinese_name": "铁东区"
    },
    {
        "Id": 320,
        "DisName": "铁西区",
        "CityID": 30,
        "DisSort": null,
        "CityNameEnglish": "Tiexi",
        "district_code": 210303,
        "chinese_name": "铁西区"
    },
    {
        "Id": 321,
        "DisName": "立山区",
        "CityID": 30,
        "DisSort": null,
        "CityNameEnglish": "Lishan",
        "district_code": 210304,
        "chinese_name": "立山区"
    },
    {
        "Id": 322,
        "DisName": "千山区",
        "CityID": 30,
        "DisSort": null,
        "CityNameEnglish": "Qianshan",
        "district_code": 210311,
        "chinese_name": "千山区"
    },
    {
        "Id": 323,
        "DisName": "台安县",
        "CityID": 30,
        "DisSort": null,
        "CityNameEnglish": "Taian",
        "district_code": 210321,
        "chinese_name": "台安县"
    },
    {
        "Id": 324,
        "DisName": "岫岩满族自治县",
        "CityID": 30,
        "DisSort": null,
        "CityNameEnglish": "Xiuyan",
        "district_code": 210323,
        "chinese_name": "岫岩满族自治县"
    },
    {
        "Id": 325,
        "DisName": "海城市",
        "CityID": 30,
        "DisSort": null,
        "CityNameEnglish": "Haicheng",
        "district_code": 210381,
        "chinese_name": "海城市"
    },
    {
        "Id": 326,
        "DisName": "新抚区",
        "CityID": 31,
        "DisSort": null,
        "CityNameEnglish": "Xinfu",
        "district_code": 210402,
        "chinese_name": "新抚区"
    },
    {
        "Id": 327,
        "DisName": "东洲区",
        "CityID": 31,
        "DisSort": null,
        "CityNameEnglish": "Dongzhou",
        "district_code": 210403,
        "chinese_name": "东洲区"
    },
    {
        "Id": 328,
        "DisName": "望花区",
        "CityID": 31,
        "DisSort": null,
        "CityNameEnglish": "Wanghua",
        "district_code": 210404,
        "chinese_name": "望花区"
    },
    {
        "Id": 329,
        "DisName": "顺城区",
        "CityID": 31,
        "DisSort": null,
        "CityNameEnglish": "Shuncheng",
        "district_code": 210411,
        "chinese_name": "顺城区"
    },
    {
        "Id": 330,
        "DisName": "抚顺县",
        "CityID": 31,
        "DisSort": null,
        "CityNameEnglish": "Fushun",
        "district_code": 210421,
        "chinese_name": "抚顺县"
    },
    {
        "Id": 331,
        "DisName": "新宾满族自治县",
        "CityID": 31,
        "DisSort": null,
        "CityNameEnglish": "Xinbin",
        "district_code": 210422,
        "chinese_name": "新宾满族自治县"
    },
    {
        "Id": 332,
        "DisName": "清原满族自治县",
        "CityID": 31,
        "DisSort": null,
        "CityNameEnglish": "Qingyuan",
        "district_code": 210423,
        "chinese_name": "清原满族自治县"
    },
    {
        "Id": 333,
        "DisName": "平山区",
        "CityID": 32,
        "DisSort": null,
        "CityNameEnglish": "Pingshan",
        "district_code": 210502,
        "chinese_name": "平山区"
    },
    {
        "Id": 334,
        "DisName": "溪湖区",
        "CityID": 32,
        "DisSort": null,
        "CityNameEnglish": "Xihu",
        "district_code": 210503,
        "chinese_name": "溪湖区"
    },
    {
        "Id": 335,
        "DisName": "明山区",
        "CityID": 32,
        "DisSort": null,
        "CityNameEnglish": "Mingshan",
        "district_code": 210504,
        "chinese_name": "明山区"
    },
    {
        "Id": 336,
        "DisName": "南芬区",
        "CityID": 32,
        "DisSort": null,
        "CityNameEnglish": "Nanfen",
        "district_code": 210505,
        "chinese_name": "南芬区"
    },
    {
        "Id": 337,
        "DisName": "本溪满族自治县",
        "CityID": 32,
        "DisSort": null,
        "CityNameEnglish": "Benxi",
        "district_code": 210521,
        "chinese_name": "本溪满族自治县"
    },
    {
        "Id": 338,
        "DisName": "桓仁满族自治县",
        "CityID": 32,
        "DisSort": null,
        "CityNameEnglish": "Huanren",
        "district_code": 210522,
        "chinese_name": "桓仁满族自治县"
    },
    {
        "Id": 339,
        "DisName": "元宝区",
        "CityID": 33,
        "DisSort": null,
        "CityNameEnglish": "Yuanbao",
        "district_code": 210602,
        "chinese_name": "元宝区"
    },
    {
        "Id": 340,
        "DisName": "振兴区",
        "CityID": 33,
        "DisSort": null,
        "CityNameEnglish": "Zhenxing",
        "district_code": 210603,
        "chinese_name": "振兴区"
    },
    {
        "Id": 341,
        "DisName": "振安区",
        "CityID": 33,
        "DisSort": null,
        "CityNameEnglish": "Zhen'an",
        "district_code": 210604,
        "chinese_name": "振安区"
    },
    {
        "Id": 342,
        "DisName": "宽甸满族自治县",
        "CityID": 33,
        "DisSort": null,
        "CityNameEnglish": "Kuandian",
        "district_code": 210624,
        "chinese_name": "宽甸满族自治县"
    },
    {
        "Id": 343,
        "DisName": "东港市",
        "CityID": 33,
        "DisSort": null,
        "CityNameEnglish": "Donggang",
        "district_code": 210681,
        "chinese_name": "东港市"
    },
    {
        "Id": 344,
        "DisName": "凤城市",
        "CityID": 33,
        "DisSort": null,
        "CityNameEnglish": "Fengcheng",
        "district_code": 210682,
        "chinese_name": "凤城市"
    },
    {
        "Id": 345,
        "DisName": "古塔区",
        "CityID": 34,
        "DisSort": null,
        "CityNameEnglish": "Guta",
        "district_code": 210702,
        "chinese_name": "古塔区"
    },
    {
        "Id": 346,
        "DisName": "凌河区",
        "CityID": 34,
        "DisSort": null,
        "CityNameEnglish": "Linghe",
        "district_code": 210703,
        "chinese_name": "凌河区"
    },
    {
        "Id": 347,
        "DisName": "太和区",
        "CityID": 34,
        "DisSort": null,
        "CityNameEnglish": "Taihe",
        "district_code": 210711,
        "chinese_name": "太和区"
    },
    {
        "Id": 348,
        "DisName": "黑山县",
        "CityID": 34,
        "DisSort": null,
        "CityNameEnglish": "Heishan",
        "district_code": 210726,
        "chinese_name": "黑山县"
    },
    {
        "Id": 349,
        "DisName": "义县",
        "CityID": 34,
        "DisSort": null,
        "CityNameEnglish": "Yixian",
        "district_code": 210727,
        "chinese_name": "义县"
    },
    {
        "Id": 350,
        "DisName": "凌海市",
        "CityID": 34,
        "DisSort": null,
        "CityNameEnglish": "Linghai",
        "district_code": 210781,
        "chinese_name": "凌海市"
    },
    {
        "Id": 351,
        "DisName": "北镇市",
        "CityID": 34,
        "DisSort": null,
        "CityNameEnglish": "Beizhen",
        "district_code": 210782,
        "chinese_name": "北镇市"
    },
    {
        "Id": 352,
        "DisName": "站前区",
        "CityID": 35,
        "DisSort": null,
        "CityNameEnglish": "Zhanqian",
        "district_code": 210802,
        "chinese_name": "站前区"
    },
    {
        "Id": 353,
        "DisName": "西市区",
        "CityID": 35,
        "DisSort": null,
        "CityNameEnglish": "West",
        "district_code": 210803,
        "chinese_name": "西市区"
    },
    {
        "Id": 354,
        "DisName": "鮁鱼圈区",
        "CityID": 35,
        "DisSort": null,
        "CityNameEnglish": "Bayuquan",
        "district_code": 210804,
        "chinese_name": "鲅鱼圈区"
    },
    {
        "Id": 355,
        "DisName": "老边区",
        "CityID": 35,
        "DisSort": null,
        "CityNameEnglish": "Laobian",
        "district_code": 210811,
        "chinese_name": "老边区"
    },
    {
        "Id": 356,
        "DisName": "盖州市",
        "CityID": 35,
        "DisSort": null,
        "CityNameEnglish": "Gaizhou",
        "district_code": 210881,
        "chinese_name": "盖州市"
    },
    {
        "Id": 357,
        "DisName": "大石桥市",
        "CityID": 35,
        "DisSort": null,
        "CityNameEnglish": "Dashiqiao",
        "district_code": 210882,
        "chinese_name": "大石桥市"
    },
    {
        "Id": 358,
        "DisName": "海州区",
        "CityID": 36,
        "DisSort": null,
        "CityNameEnglish": "Haizhou",
        "district_code": 210902,
        "chinese_name": "海州区"
    },
    {
        "Id": 359,
        "DisName": "新邱区",
        "CityID": 36,
        "DisSort": null,
        "CityNameEnglish": "Xinqiu",
        "district_code": 210903,
        "chinese_name": "新邱区"
    },
    {
        "Id": 360,
        "DisName": "太平区",
        "CityID": 36,
        "DisSort": null,
        "CityNameEnglish": "Taiping",
        "district_code": 210904,
        "chinese_name": "太平区"
    },
    {
        "Id": 361,
        "DisName": "清河门区",
        "CityID": 36,
        "DisSort": null,
        "CityNameEnglish": "Qinghemen",
        "district_code": 210905,
        "chinese_name": "清河门区"
    },
    {
        "Id": 362,
        "DisName": "细河区",
        "CityID": 36,
        "DisSort": null,
        "CityNameEnglish": "Xihe",
        "district_code": 210911,
        "chinese_name": "细河区"
    },
    {
        "Id": 363,
        "DisName": "阜新蒙古族自治县",
        "CityID": 36,
        "DisSort": null,
        "CityNameEnglish": "Fuxin",
        "district_code": 210921,
        "chinese_name": "阜新蒙古族自治县"
    },
    {
        "Id": 364,
        "DisName": "彰武县",
        "CityID": 36,
        "DisSort": null,
        "CityNameEnglish": "Zhangwu",
        "district_code": 210922,
        "chinese_name": "彰武县"
    },
    {
        "Id": 365,
        "DisName": "白塔区",
        "CityID": 37,
        "DisSort": null,
        "CityNameEnglish": "Baita",
        "district_code": 211002,
        "chinese_name": "白塔区"
    },
    {
        "Id": 366,
        "DisName": "文圣区",
        "CityID": 37,
        "DisSort": null,
        "CityNameEnglish": "Wensheng",
        "district_code": 211003,
        "chinese_name": "文圣区"
    },
    {
        "Id": 367,
        "DisName": "宏伟区",
        "CityID": 37,
        "DisSort": null,
        "CityNameEnglish": "Hongwei",
        "district_code": 211004,
        "chinese_name": "宏伟区"
    },
    {
        "Id": 368,
        "DisName": "弓长岭区",
        "CityID": 37,
        "DisSort": null,
        "CityNameEnglish": "Gongchangling",
        "district_code": 211005,
        "chinese_name": "弓长岭区"
    },
    {
        "Id": 369,
        "DisName": "太子河区",
        "CityID": 37,
        "DisSort": null,
        "CityNameEnglish": "Taizihe",
        "district_code": 211011,
        "chinese_name": "太子河区"
    },
    {
        "Id": 370,
        "DisName": "辽阳县",
        "CityID": 37,
        "DisSort": null,
        "CityNameEnglish": "Liaoyang",
        "district_code": 211021,
        "chinese_name": "辽阳县"
    },
    {
        "Id": 371,
        "DisName": "灯塔市",
        "CityID": 37,
        "DisSort": null,
        "CityNameEnglish": "Beacon",
        "district_code": 211081,
        "chinese_name": "灯塔市"
    },
    {
        "Id": 372,
        "DisName": "双塔区",
        "CityID": 38,
        "DisSort": null,
        "CityNameEnglish": "Shuangta",
        "district_code": 211302,
        "chinese_name": "双塔区"
    },
    {
        "Id": 373,
        "DisName": "龙城区",
        "CityID": 38,
        "DisSort": null,
        "CityNameEnglish": "Longcheng",
        "district_code": 211303,
        "chinese_name": "龙城区"
    },
    {
        "Id": 374,
        "DisName": "朝阳县",
        "CityID": 38,
        "DisSort": null,
        "CityNameEnglish": "Chaoyang",
        "district_code": 211321,
        "chinese_name": "朝阳县"
    },
    {
        "Id": 375,
        "DisName": "建平县",
        "CityID": 38,
        "DisSort": null,
        "CityNameEnglish": "Jianping",
        "district_code": 211322,
        "chinese_name": "建平县"
    },
    {
        "Id": 376,
        "DisName": "喀喇沁左翼蒙古族自治县",
        "CityID": 38,
        "DisSort": null,
        "CityNameEnglish": "Haraqin　Zuoyi",
        "district_code": 211324,
        "chinese_name": "喀喇沁左翼蒙古族自治县"
    },
    {
        "Id": 377,
        "DisName": "北票市",
        "CityID": 38,
        "DisSort": null,
        "CityNameEnglish": "Beipiao",
        "district_code": 211381,
        "chinese_name": "北票市"
    },
    {
        "Id": 378,
        "DisName": "凌源市",
        "CityID": 38,
        "DisSort": null,
        "CityNameEnglish": "Lingyuan",
        "district_code": 211382,
        "chinese_name": "凌源市"
    },
    {
        "Id": 379,
        "DisName": "双台子区",
        "CityID": 39,
        "DisSort": null,
        "CityNameEnglish": "Shuangtaizi",
        "district_code": 211102,
        "chinese_name": "双台子区"
    },
    {
        "Id": 380,
        "DisName": "兴隆台区",
        "CityID": 39,
        "DisSort": null,
        "CityNameEnglish": "Xinglongtai",
        "district_code": 211103,
        "chinese_name": "兴隆台区"
    },
    {
        "Id": 381,
        "DisName": "大洼县",
        "CityID": 39,
        "DisSort": null,
        "CityNameEnglish": "Dawa",
        "district_code": 211121,
        "chinese_name": "大洼县"
    },
    {
        "Id": 382,
        "DisName": "盘山县",
        "CityID": 39,
        "DisSort": null,
        "CityNameEnglish": "Panshan",
        "district_code": 211122,
        "chinese_name": "盘山县"
    },
    {
        "Id": 383,
        "DisName": "连山区",
        "CityID": 40,
        "DisSort": null,
        "CityNameEnglish": "Lianshan",
        "district_code": 211402,
        "chinese_name": "连山区"
    },
    {
        "Id": 384,
        "DisName": "龙港区",
        "CityID": 40,
        "DisSort": null,
        "CityNameEnglish": "Longgang",
        "district_code": 211403,
        "chinese_name": "龙港区"
    },
    {
        "Id": 385,
        "DisName": "南票区",
        "CityID": 40,
        "DisSort": null,
        "CityNameEnglish": "Nanpiao",
        "district_code": 211404,
        "chinese_name": "南票区"
    },
    {
        "Id": 386,
        "DisName": "绥中县",
        "CityID": 40,
        "DisSort": null,
        "CityNameEnglish": "Suizhong",
        "district_code": 211421,
        "chinese_name": "绥中县"
    },
    {
        "Id": 387,
        "DisName": "建昌县",
        "CityID": 40,
        "DisSort": null,
        "CityNameEnglish": "Jianchang",
        "district_code": 211422,
        "chinese_name": "建昌县"
    },
    {
        "Id": 388,
        "DisName": "兴城市",
        "CityID": 40,
        "DisSort": null,
        "CityNameEnglish": "Xingcheng",
        "district_code": 211481,
        "chinese_name": "兴城市"
    },
    {
        "Id": 389,
        "DisName": "南关区",
        "CityID": 41,
        "DisSort": null,
        "CityNameEnglish": "Nanguan",
        "district_code": 220102,
        "chinese_name": "南关区"
    },
    {
        "Id": 390,
        "DisName": "宽城区",
        "CityID": 41,
        "DisSort": null,
        "CityNameEnglish": "Kuancheng",
        "district_code": 220103,
        "chinese_name": "宽城区"
    },
    {
        "Id": 391,
        "DisName": "朝阳区",
        "CityID": 41,
        "DisSort": null,
        "CityNameEnglish": "Chaoyang",
        "district_code": 220104,
        "chinese_name": "朝阳区"
    },
    {
        "Id": 392,
        "DisName": "二道区",
        "CityID": 41,
        "DisSort": null,
        "CityNameEnglish": "Erdao",
        "district_code": 220105,
        "chinese_name": "二道区"
    },
    {
        "Id": 393,
        "DisName": "绿园区",
        "CityID": 41,
        "DisSort": null,
        "CityNameEnglish": "Luyuan",
        "district_code": 220106,
        "chinese_name": "绿园区"
    },
    {
        "Id": 394,
        "DisName": "双阳区",
        "CityID": 41,
        "DisSort": null,
        "CityNameEnglish": "Shuangyang",
        "district_code": 220112,
        "chinese_name": "双阳区"
    },
    {
        "Id": 395,
        "DisName": "农安县",
        "CityID": 41,
        "DisSort": null,
        "CityNameEnglish": "Nong'an",
        "district_code": 220122,
        "chinese_name": "农安县"
    },
    {
        "Id": 396,
        "DisName": "九台市",
        "CityID": 41,
        "DisSort": null,
        "CityNameEnglish": "Jiutai",
        "district_code": 220181,
        "chinese_name": "九台市"
    },
    {
        "Id": 397,
        "DisName": "榆树市",
        "CityID": 41,
        "DisSort": null,
        "CityNameEnglish": "Yushu",
        "district_code": 220182,
        "chinese_name": "榆树市"
    },
    {
        "Id": 398,
        "DisName": "德惠市",
        "CityID": 41,
        "DisSort": null,
        "CityNameEnglish": "Dehui",
        "district_code": 220183,
        "chinese_name": "德惠市"
    },
    {
        "Id": 449,
        "DisName": "道里区",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Daoli",
        "district_code": 230102,
        "chinese_name": "道里区"
    },
    {
        "Id": 450,
        "DisName": "南岗区",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Nangang",
        "district_code": 230103,
        "chinese_name": "南岗区"
    },
    {
        "Id": 451,
        "DisName": "道外区",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Daowai",
        "district_code": 230104,
        "chinese_name": "道外区"
    },
    {
        "Id": 452,
        "DisName": "平房区",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Pingfang",
        "district_code": 230108,
        "chinese_name": "平房区"
    },
    {
        "Id": 453,
        "DisName": "松北区",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Songbei",
        "district_code": 230109,
        "chinese_name": "松北区"
    },
    {
        "Id": 454,
        "DisName": "香坊区",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Xiangfang",
        "district_code": 230106,
        "chinese_name": "香坊区"
    },
    {
        "Id": 455,
        "DisName": "呼兰区",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Hulan",
        "district_code": 230111,
        "chinese_name": "呼兰区"
    },
    {
        "Id": 456,
        "DisName": "阿城区",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Acheng",
        "district_code": 230181,
        "chinese_name": "阿城市"
    },
    {
        "Id": 457,
        "DisName": "依兰县",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Yilan",
        "district_code": 230123,
        "chinese_name": "依兰县"
    },
    {
        "Id": 458,
        "DisName": "方正县",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Fangzheng",
        "district_code": 230124,
        "chinese_name": "方正县"
    },
    {
        "Id": 459,
        "DisName": "宾县",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Binxian",
        "district_code": 230125,
        "chinese_name": "宾县"
    },
    {
        "Id": 460,
        "DisName": "巴彦县",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Bayan",
        "district_code": 230126,
        "chinese_name": "巴彦县"
    },
    {
        "Id": 461,
        "DisName": "木兰县",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Mulan",
        "district_code": 230127,
        "chinese_name": "木兰县"
    },
    {
        "Id": 462,
        "DisName": "通河县",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Tonghe",
        "district_code": 230128,
        "chinese_name": "通河县"
    },
    {
        "Id": 463,
        "DisName": "延寿县",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Yanshou",
        "district_code": 230129,
        "chinese_name": "延寿县"
    },
    {
        "Id": 464,
        "DisName": "双城市",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Shuangcheng",
        "district_code": 230182,
        "chinese_name": "双城市"
    },
    {
        "Id": 465,
        "DisName": "尚志市",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Shangzhi",
        "district_code": 230183,
        "chinese_name": "尚志市"
    },
    {
        "Id": 466,
        "DisName": "五常市",
        "CityID": 50,
        "DisSort": null,
        "CityNameEnglish": "Wuchang",
        "district_code": 230184,
        "chinese_name": "五常市"
    },
    {
        "Id": 502,
        "DisName": "新兴区",
        "CityID": 54,
        "DisSort": null,
        "CityNameEnglish": "Emerging",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 503,
        "DisName": "桃山区",
        "CityID": 54,
        "DisSort": null,
        "CityNameEnglish": "Taoshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 504,
        "DisName": "茄子河区",
        "CityID": 54,
        "DisSort": null,
        "CityNameEnglish": "Qiezihe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 505,
        "DisName": "勃利县",
        "CityID": 54,
        "DisSort": null,
        "CityNameEnglish": "Boli",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 515,
        "DisName": "向阳区",
        "CityID": 56,
        "DisSort": null,
        "CityNameEnglish": "Xiangyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 516,
        "DisName": "工农区",
        "CityID": 56,
        "DisSort": null,
        "CityNameEnglish": "Gongnong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 517,
        "DisName": "南山区",
        "CityID": 56,
        "DisSort": null,
        "CityNameEnglish": "Nanshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 518,
        "DisName": "兴安区",
        "CityID": 56,
        "DisSort": null,
        "CityNameEnglish": "Xing'an",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 519,
        "DisName": "东山区",
        "CityID": 56,
        "DisSort": null,
        "CityNameEnglish": "Dongshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 520,
        "DisName": "兴山区",
        "CityID": 56,
        "DisSort": null,
        "CityNameEnglish": "Xingshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 521,
        "DisName": "萝北县",
        "CityID": 56,
        "DisSort": null,
        "CityNameEnglish": "Luobei",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 522,
        "DisName": "绥滨县",
        "CityID": 56,
        "DisSort": null,
        "CityNameEnglish": "Suibin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 523,
        "DisName": "尖山区",
        "CityID": 57,
        "DisSort": null,
        "CityNameEnglish": "Jianshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 524,
        "DisName": "岭东区",
        "CityID": 57,
        "DisSort": null,
        "CityNameEnglish": "Lingdong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 525,
        "DisName": "四方台区",
        "CityID": 57,
        "DisSort": null,
        "CityNameEnglish": "Sifangtai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 526,
        "DisName": "宝山区",
        "CityID": 57,
        "DisSort": null,
        "CityNameEnglish": "Baoshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 527,
        "DisName": "集贤县",
        "CityID": 57,
        "DisSort": null,
        "CityNameEnglish": "Jixian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 528,
        "DisName": "友谊县",
        "CityID": 57,
        "DisSort": null,
        "CityNameEnglish": "Youyi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 529,
        "DisName": "宝清县",
        "CityID": 57,
        "DisSort": null,
        "CityNameEnglish": "Baoqing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 530,
        "DisName": "饶河县",
        "CityID": 57,
        "DisSort": null,
        "CityNameEnglish": "Raohe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 542,
        "DisName": "嫩江县",
        "CityID": 59,
        "DisSort": null,
        "CityNameEnglish": "Nenjiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 543,
        "DisName": "逊克县",
        "CityID": 59,
        "DisSort": null,
        "CityNameEnglish": "Xunke",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 544,
        "DisName": "孙吴县",
        "CityID": 59,
        "DisSort": null,
        "CityNameEnglish": "Sunwu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 545,
        "DisName": "北安市",
        "CityID": 59,
        "DisSort": null,
        "CityNameEnglish": "Bei'an",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 546,
        "DisName": "五大连池市",
        "CityID": 59,
        "DisSort": null,
        "CityNameEnglish": "Wudalianchi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 547,
        "DisName": "呼玛县",
        "CityID": 60,
        "DisSort": null,
        "CityNameEnglish": "Huma",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 548,
        "DisName": "塔河县",
        "CityID": 60,
        "DisSort": null,
        "CityNameEnglish": "Tahe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 549,
        "DisName": "漠河县",
        "CityID": 60,
        "DisSort": null,
        "CityNameEnglish": "Mohe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 550,
        "DisName": "伊春区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Yichun",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 551,
        "DisName": "南岔区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Nancha",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 552,
        "DisName": "友好区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Youhao",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 553,
        "DisName": "西林区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Xilin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 554,
        "DisName": "翠峦区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Cuiluan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 555,
        "DisName": "新青区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Xinqing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 556,
        "DisName": "美溪区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Meixi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 557,
        "DisName": "金山屯区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Jinshantun",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 558,
        "DisName": "五营区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Wuying",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 559,
        "DisName": "乌马河区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Wumahe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 560,
        "DisName": "汤旺河区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Tangwanghe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 561,
        "DisName": "带岭区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Dailing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 562,
        "DisName": "乌伊岭区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Wuyiling",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 563,
        "DisName": "红星区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Hongxing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 564,
        "DisName": "上甘岭区",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Shangganling",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 565,
        "DisName": "嘉荫县",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Jiayin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 566,
        "DisName": "铁力市",
        "CityID": 61,
        "DisSort": null,
        "CityNameEnglish": "Tieli",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 576,
        "DisName": "江宁区",
        "CityID": 63,
        "DisSort": null,
        "CityNameEnglish": "Jiangning",
        "district_code": 320115,
        "chinese_name": "江宁区"
    },
    {
        "Id": 577,
        "DisName": "浦口区",
        "CityID": 63,
        "DisSort": null,
        "CityNameEnglish": "Pukou",
        "district_code": 320111,
        "chinese_name": "浦口区"
    },
    {
        "Id": 578,
        "DisName": "玄武区",
        "CityID": 63,
        "DisSort": null,
        "CityNameEnglish": "Xuanwu",
        "district_code": 320102,
        "chinese_name": "玄武区"
    },
    {
        "Id": 579,
        "DisName": "白下区",
        "CityID": 63,
        "DisSort": null,
        "CityNameEnglish": "Baixia",
        "district_code": 320103,
        "chinese_name": "白下区"
    },
    {
        "Id": 580,
        "DisName": "秦淮区",
        "CityID": 63,
        "DisSort": null,
        "CityNameEnglish": "Qinhuai",
        "district_code": 320104,
        "chinese_name": "秦淮区"
    },
    {
        "Id": 581,
        "DisName": "建邺区",
        "CityID": 63,
        "DisSort": null,
        "CityNameEnglish": "Jianye",
        "district_code": 320105,
        "chinese_name": "建邺区"
    },
    {
        "Id": 582,
        "DisName": "鼓楼区",
        "CityID": 63,
        "DisSort": null,
        "CityNameEnglish": "Gulou",
        "district_code": 320106,
        "chinese_name": "鼓楼区"
    },
    {
        "Id": 583,
        "DisName": "下关区",
        "CityID": 63,
        "DisSort": null,
        "CityNameEnglish": "Xiaguan",
        "district_code": 320107,
        "chinese_name": "下关区"
    },
    {
        "Id": 584,
        "DisName": "栖霞区",
        "CityID": 63,
        "DisSort": null,
        "CityNameEnglish": "Qixia",
        "district_code": 320113,
        "chinese_name": "栖霞区"
    },
    {
        "Id": 585,
        "DisName": "雨花台区",
        "CityID": 63,
        "DisSort": null,
        "CityNameEnglish": "Yuhuatai",
        "district_code": 320114,
        "chinese_name": "雨花台区"
    },
    {
        "Id": 586,
        "DisName": "六合区",
        "CityID": 63,
        "DisSort": null,
        "CityNameEnglish": "Liuhe",
        "district_code": 320116,
        "chinese_name": "六合区"
    },
    {
        "Id": 587,
        "DisName": "溧水县",
        "CityID": 63,
        "DisSort": null,
        "CityNameEnglish": "Lishui",
        "district_code": 320124,
        "chinese_name": "溧水县"
    },
    {
        "Id": 588,
        "DisName": "高淳县",
        "CityID": 63,
        "DisSort": null,
        "CityNameEnglish": "Gaochun",
        "district_code": 320125,
        "chinese_name": "高淳县"
    },
    {
        "Id": 589,
        "DisName": "崇安区",
        "CityID": 64,
        "DisSort": null,
        "CityNameEnglish": "Chong'an",
        "district_code": 320202,
        "chinese_name": "崇安区"
    },
    {
        "Id": 590,
        "DisName": "南长区",
        "CityID": 64,
        "DisSort": null,
        "CityNameEnglish": "Nanchang",
        "district_code": 320203,
        "chinese_name": "南长区"
    },
    {
        "Id": 591,
        "DisName": "北塘区",
        "CityID": 64,
        "DisSort": null,
        "CityNameEnglish": "Beitang",
        "district_code": 320204,
        "chinese_name": "北塘区"
    },
    {
        "Id": 592,
        "DisName": "锡山区",
        "CityID": 64,
        "DisSort": null,
        "CityNameEnglish": "Xishan",
        "district_code": 320205,
        "chinese_name": "锡山区"
    },
    {
        "Id": 593,
        "DisName": "惠山区",
        "CityID": 64,
        "DisSort": null,
        "CityNameEnglish": "Huishan",
        "district_code": 320206,
        "chinese_name": "惠山区"
    },
    {
        "Id": 594,
        "DisName": "滨湖区",
        "CityID": 64,
        "DisSort": null,
        "CityNameEnglish": "Binhu",
        "district_code": 320211,
        "chinese_name": "滨湖区"
    },
    {
        "Id": 595,
        "DisName": "江阴市",
        "CityID": 64,
        "DisSort": null,
        "CityNameEnglish": "Jiangyin",
        "district_code": 320281,
        "chinese_name": "江阴市"
    },
    {
        "Id": 596,
        "DisName": "宜兴市",
        "CityID": 64,
        "DisSort": null,
        "CityNameEnglish": "Yixing",
        "district_code": 320282,
        "chinese_name": "宜兴市"
    },
    {
        "Id": 597,
        "DisName": "京口区",
        "CityID": 65,
        "DisSort": null,
        "CityNameEnglish": "Jingkou",
        "district_code": 321102,
        "chinese_name": "京口区"
    },
    {
        "Id": 598,
        "DisName": "润州区",
        "CityID": 65,
        "DisSort": null,
        "CityNameEnglish": "Runzhou",
        "district_code": 321111,
        "chinese_name": "润州区"
    },
    {
        "Id": 599,
        "DisName": "丹徒区",
        "CityID": 65,
        "DisSort": null,
        "CityNameEnglish": "Dantu",
        "district_code": 321112,
        "chinese_name": "丹徒区"
    },
    {
        "Id": 600,
        "DisName": "丹阳市",
        "CityID": 65,
        "DisSort": null,
        "CityNameEnglish": "Danyang",
        "district_code": 321181,
        "chinese_name": "丹阳市"
    },
    {
        "Id": 601,
        "DisName": "扬中市",
        "CityID": 65,
        "DisSort": null,
        "CityNameEnglish": "Yangzhong",
        "district_code": 321182,
        "chinese_name": "扬中市"
    },
    {
        "Id": 602,
        "DisName": "句容市",
        "CityID": 65,
        "DisSort": null,
        "CityNameEnglish": "Jurong",
        "district_code": 321183,
        "chinese_name": "句容市"
    },
    {
        "Id": 603,
        "DisName": "沧浪区",
        "CityID": 66,
        "DisSort": null,
        "CityNameEnglish": "Canglang",
        "district_code": 320502,
        "chinese_name": "沧浪区"
    },
    {
        "Id": 604,
        "DisName": "常熟市",
        "CityID": 66,
        "DisSort": null,
        "CityNameEnglish": "Changshou",
        "district_code": 320581,
        "chinese_name": "常熟市"
    },
    {
        "Id": 605,
        "DisName": "平江区",
        "CityID": 66,
        "DisSort": null,
        "CityNameEnglish": "Pingjiang",
        "district_code": 320503,
        "chinese_name": "平江区"
    },
    {
        "Id": 606,
        "DisName": "金阊区",
        "CityID": 66,
        "DisSort": null,
        "CityNameEnglish": "Jinchang",
        "district_code": 320504,
        "chinese_name": "金阊区"
    },
    {
        "Id": 607,
        "DisName": "虎丘区",
        "CityID": 66,
        "DisSort": null,
        "CityNameEnglish": "Huqiu",
        "district_code": 320505,
        "chinese_name": "虎丘区"
    },
    {
        "Id": 608,
        "DisName": "昆山市",
        "CityID": 66,
        "DisSort": null,
        "CityNameEnglish": "Kunshan",
        "district_code": 320583,
        "chinese_name": "昆山市"
    },
    {
        "Id": 609,
        "DisName": "太仓市",
        "CityID": 66,
        "DisSort": null,
        "CityNameEnglish": "Taicang",
        "district_code": 320585,
        "chinese_name": "太仓市"
    },
    {
        "Id": 610,
        "DisName": "吴江市",
        "CityID": 66,
        "DisSort": null,
        "CityNameEnglish": "Wujiang",
        "district_code": 320584,
        "chinese_name": "吴江市"
    },
    {
        "Id": 611,
        "DisName": "吴中区",
        "CityID": 66,
        "DisSort": null,
        "CityNameEnglish": "Wuzhong",
        "district_code": 320506,
        "chinese_name": "吴中区"
    },
    {
        "Id": 612,
        "DisName": "相城区",
        "CityID": 66,
        "DisSort": null,
        "CityNameEnglish": "Xiangcheng",
        "district_code": 320507,
        "chinese_name": "相城区"
    },
    {
        "Id": 613,
        "DisName": "张家港市",
        "CityID": 66,
        "DisSort": null,
        "CityNameEnglish": "Zhangjiagang",
        "district_code": 320582,
        "chinese_name": "张家港市"
    },
    {
        "Id": 614,
        "DisName": "崇川区",
        "CityID": 67,
        "DisSort": null,
        "CityNameEnglish": "Chongchuan",
        "district_code": 320602,
        "chinese_name": "崇川区"
    },
    {
        "Id": 615,
        "DisName": "港闸区",
        "CityID": 67,
        "DisSort": null,
        "CityNameEnglish": "Gangzha",
        "district_code": 320611,
        "chinese_name": "港闸区"
    },
    {
        "Id": 616,
        "DisName": "海安县",
        "CityID": 67,
        "DisSort": null,
        "CityNameEnglish": "Haian",
        "district_code": 320621,
        "chinese_name": "海安县"
    },
    {
        "Id": 617,
        "DisName": "如东县",
        "CityID": 67,
        "DisSort": null,
        "CityNameEnglish": "Rudong",
        "district_code": 320623,
        "chinese_name": "如东县"
    },
    {
        "Id": 618,
        "DisName": "启东市",
        "CityID": 67,
        "DisSort": null,
        "CityNameEnglish": "Qidong",
        "district_code": 320681,
        "chinese_name": "启东市"
    },
    {
        "Id": 619,
        "DisName": "如皋市",
        "CityID": 67,
        "DisSort": null,
        "CityNameEnglish": "Rugao",
        "district_code": 320682,
        "chinese_name": "如皋市"
    },
    {
        "Id": 620,
        "DisName": "通州市",
        "CityID": 67,
        "DisSort": null,
        "CityNameEnglish": "Tongzhou",
        "district_code": 320683,
        "chinese_name": "通州市"
    },
    {
        "Id": 621,
        "DisName": "海门市",
        "CityID": 67,
        "DisSort": null,
        "CityNameEnglish": "Haimen",
        "district_code": 320684,
        "chinese_name": "海门市"
    },
    {
        "Id": 622,
        "DisName": "高邮市",
        "CityID": 68,
        "DisSort": null,
        "CityNameEnglish": "Gaoyou",
        "district_code": 321084,
        "chinese_name": "高邮市"
    },
    {
        "Id": 623,
        "DisName": "广陵区",
        "CityID": 68,
        "DisSort": null,
        "CityNameEnglish": "Guangling",
        "district_code": 321002,
        "chinese_name": "广陵区"
    },
    {
        "Id": 624,
        "DisName": "邗江区",
        "CityID": 68,
        "DisSort": null,
        "CityNameEnglish": "Hanjiang",
        "district_code": 321003,
        "chinese_name": "邗江区"
    },
    {
        "Id": 625,
        "DisName": "维扬区",
        "CityID": 68,
        "DisSort": null,
        "CityNameEnglish": "Weiyang",
        "district_code": 321011,
        "chinese_name": "维扬区"
    },
    {
        "Id": 626,
        "DisName": "宝应县",
        "CityID": 68,
        "DisSort": null,
        "CityNameEnglish": "Baoying",
        "district_code": 321023,
        "chinese_name": "宝应县"
    },
    {
        "Id": 627,
        "DisName": "江都市",
        "CityID": 68,
        "DisSort": null,
        "CityNameEnglish": "Jiangdu",
        "district_code": 321088,
        "chinese_name": "江都市"
    },
    {
        "Id": 628,
        "DisName": "仪征市",
        "CityID": 68,
        "DisSort": null,
        "CityNameEnglish": "Yizheng",
        "district_code": 321081,
        "chinese_name": "仪征市"
    },
    {
        "Id": 629,
        "DisName": "亭湖区",
        "CityID": 69,
        "DisSort": null,
        "CityNameEnglish": "Tinghu",
        "district_code": 320902,
        "chinese_name": "亭湖区"
    },
    {
        "Id": 630,
        "DisName": "盐都区",
        "CityID": 69,
        "DisSort": null,
        "CityNameEnglish": "Yandu",
        "district_code": 320903,
        "chinese_name": "盐都区"
    },
    {
        "Id": 631,
        "DisName": "响水县",
        "CityID": 69,
        "DisSort": null,
        "CityNameEnglish": "Xiangshui",
        "district_code": 320921,
        "chinese_name": "响水县"
    },
    {
        "Id": 632,
        "DisName": "滨海县",
        "CityID": 69,
        "DisSort": null,
        "CityNameEnglish": "Binhai",
        "district_code": 320922,
        "chinese_name": "滨海县"
    },
    {
        "Id": 633,
        "DisName": "阜宁县",
        "CityID": 69,
        "DisSort": null,
        "CityNameEnglish": "Funing",
        "district_code": 320923,
        "chinese_name": "阜宁县"
    },
    {
        "Id": 634,
        "DisName": "射阳县",
        "CityID": 69,
        "DisSort": null,
        "CityNameEnglish": "Sheyang",
        "district_code": 320924,
        "chinese_name": "射阳县"
    },
    {
        "Id": 635,
        "DisName": "建湖县",
        "CityID": 69,
        "DisSort": null,
        "CityNameEnglish": "Jianhu",
        "district_code": 320925,
        "chinese_name": "建湖县"
    },
    {
        "Id": 636,
        "DisName": "东台市",
        "CityID": 69,
        "DisSort": null,
        "CityNameEnglish": "Dongtai",
        "district_code": 320981,
        "chinese_name": "东台市"
    },
    {
        "Id": 637,
        "DisName": "大丰市",
        "CityID": 69,
        "DisSort": null,
        "CityNameEnglish": "Dafeng",
        "district_code": 320982,
        "chinese_name": "大丰市"
    },
    {
        "Id": 638,
        "DisName": "鼓楼区",
        "CityID": 70,
        "DisSort": null,
        "CityNameEnglish": "Gulou",
        "district_code": 320302,
        "chinese_name": "鼓楼区"
    },
    {
        "Id": 639,
        "DisName": "云龙区",
        "CityID": 70,
        "DisSort": null,
        "CityNameEnglish": "Yunlong",
        "district_code": 320303,
        "chinese_name": "云龙区"
    },
    {
        "Id": 640,
        "DisName": "九里区",
        "CityID": 70,
        "DisSort": null,
        "CityNameEnglish": "Jiuli",
        "district_code": 320304,
        "chinese_name": "九里区"
    },
    {
        "Id": 641,
        "DisName": "贾汪区",
        "CityID": 70,
        "DisSort": null,
        "CityNameEnglish": "Jiawang",
        "district_code": 320305,
        "chinese_name": "贾汪区"
    },
    {
        "Id": 642,
        "DisName": "泉山区",
        "CityID": 70,
        "DisSort": null,
        "CityNameEnglish": "Quanshan",
        "district_code": 320311,
        "chinese_name": "泉山区"
    },
    {
        "Id": 643,
        "DisName": "丰县",
        "CityID": 70,
        "DisSort": null,
        "CityNameEnglish": "Fengxian",
        "district_code": 320321,
        "chinese_name": "丰县"
    },
    {
        "Id": 644,
        "DisName": "沛县",
        "CityID": 70,
        "DisSort": null,
        "CityNameEnglish": "Peixian",
        "district_code": 320322,
        "chinese_name": "沛县"
    },
    {
        "Id": 645,
        "DisName": "铜山县",
        "CityID": 70,
        "DisSort": null,
        "CityNameEnglish": "Tongshan",
        "district_code": 320323,
        "chinese_name": "铜山县"
    },
    {
        "Id": 646,
        "DisName": "睢宁县",
        "CityID": 70,
        "DisSort": null,
        "CityNameEnglish": "Suining",
        "district_code": 320324,
        "chinese_name": "睢宁县"
    },
    {
        "Id": 647,
        "DisName": "新沂市",
        "CityID": 70,
        "DisSort": null,
        "CityNameEnglish": "Xinyi",
        "district_code": 320381,
        "chinese_name": "新沂市"
    },
    {
        "Id": 648,
        "DisName": "邳州市",
        "CityID": 70,
        "DisSort": null,
        "CityNameEnglish": "Pizhou",
        "district_code": 320382,
        "chinese_name": "邳州市"
    },
    {
        "Id": 649,
        "DisName": "清河区",
        "CityID": 71,
        "DisSort": null,
        "CityNameEnglish": "Qinghe",
        "district_code": 350102,
        "chinese_name": "鼓楼区"
    },
    {
        "Id": 650,
        "DisName": "楚州区",
        "CityID": 71,
        "DisSort": null,
        "CityNameEnglish": "Chuzhou",
        "district_code": 320803,
        "chinese_name": "楚州区"
    },
    {
        "Id": 651,
        "DisName": "淮阴区",
        "CityID": 71,
        "DisSort": null,
        "CityNameEnglish": "Huaiyin",
        "district_code": 320804,
        "chinese_name": "淮阴区"
    },
    {
        "Id": 652,
        "DisName": "清浦区",
        "CityID": 71,
        "DisSort": null,
        "CityNameEnglish": "Qingpu",
        "district_code": 320811,
        "chinese_name": "清浦区"
    },
    {
        "Id": 653,
        "DisName": "涟水县",
        "CityID": 71,
        "DisSort": null,
        "CityNameEnglish": "Lianshui",
        "district_code": 320826,
        "chinese_name": "涟水县"
    },
    {
        "Id": 654,
        "DisName": "洪泽县",
        "CityID": 71,
        "DisSort": null,
        "CityNameEnglish": "Hongze",
        "district_code": 320829,
        "chinese_name": "洪泽县"
    },
    {
        "Id": 655,
        "DisName": "盱眙县",
        "CityID": 71,
        "DisSort": null,
        "CityNameEnglish": "Xuyi",
        "district_code": 320830,
        "chinese_name": "盱眙县"
    },
    {
        "Id": 656,
        "DisName": "金湖县",
        "CityID": 71,
        "DisSort": null,
        "CityNameEnglish": "Jinhu",
        "district_code": 320831,
        "chinese_name": "金湖县"
    },
    {
        "Id": 657,
        "DisName": "连云区",
        "CityID": 72,
        "DisSort": null,
        "CityNameEnglish": "Lianyun",
        "district_code": 320703,
        "chinese_name": "连云区"
    },
    {
        "Id": 658,
        "DisName": "新浦区",
        "CityID": 72,
        "DisSort": null,
        "CityNameEnglish": "Sinpo",
        "district_code": 320705,
        "chinese_name": "新浦区"
    },
    {
        "Id": 659,
        "DisName": "海州区",
        "CityID": 72,
        "DisSort": null,
        "CityNameEnglish": "Haizhou",
        "district_code": 320706,
        "chinese_name": "海州区"
    },
    {
        "Id": 660,
        "DisName": "赣榆县",
        "CityID": 72,
        "DisSort": null,
        "CityNameEnglish": "Ganyu",
        "district_code": 320721,
        "chinese_name": "赣榆县"
    },
    {
        "Id": 661,
        "DisName": "东海县",
        "CityID": 72,
        "DisSort": null,
        "CityNameEnglish": "Donghai",
        "district_code": 320722,
        "chinese_name": "东海县"
    },
    {
        "Id": 662,
        "DisName": "灌云县",
        "CityID": 72,
        "DisSort": null,
        "CityNameEnglish": "Guanyun",
        "district_code": 320723,
        "chinese_name": "灌云县"
    },
    {
        "Id": 663,
        "DisName": "灌南县",
        "CityID": 72,
        "DisSort": null,
        "CityNameEnglish": "Guannan",
        "district_code": 320724,
        "chinese_name": "灌南县"
    },
    {
        "Id": 664,
        "DisName": "天宁区",
        "CityID": 73,
        "DisSort": null,
        "CityNameEnglish": "Tianning",
        "district_code": 320402,
        "chinese_name": "天宁区"
    },
    {
        "Id": 665,
        "DisName": "钟楼区",
        "CityID": 73,
        "DisSort": null,
        "CityNameEnglish": "Zhonglou",
        "district_code": 320404,
        "chinese_name": "钟楼区"
    },
    {
        "Id": 666,
        "DisName": "戚墅堰区",
        "CityID": 73,
        "DisSort": null,
        "CityNameEnglish": "Qishuyan",
        "district_code": 320405,
        "chinese_name": "戚墅堰区"
    },
    {
        "Id": 667,
        "DisName": "新北区",
        "CityID": 73,
        "DisSort": null,
        "CityNameEnglish": "Xinbei",
        "district_code": 320411,
        "chinese_name": "新北区"
    },
    {
        "Id": 668,
        "DisName": "武进区",
        "CityID": 73,
        "DisSort": null,
        "CityNameEnglish": "Wujin",
        "district_code": 320412,
        "chinese_name": "武进区"
    },
    {
        "Id": 669,
        "DisName": "溧阳市",
        "CityID": 73,
        "DisSort": null,
        "CityNameEnglish": "Liyang",
        "district_code": 320481,
        "chinese_name": "溧阳市"
    },
    {
        "Id": 670,
        "DisName": "金坛市",
        "CityID": 73,
        "DisSort": null,
        "CityNameEnglish": "Jintan",
        "district_code": 320482,
        "chinese_name": "金坛市"
    },
    {
        "Id": 671,
        "DisName": "海陵区",
        "CityID": 74,
        "DisSort": null,
        "CityNameEnglish": "Hailing",
        "district_code": 321202,
        "chinese_name": "海陵区"
    },
    {
        "Id": 672,
        "DisName": "高港区",
        "CityID": 74,
        "DisSort": null,
        "CityNameEnglish": "Gaogang",
        "district_code": 321203,
        "chinese_name": "高港区"
    },
    {
        "Id": 673,
        "DisName": "兴化市",
        "CityID": 74,
        "DisSort": null,
        "CityNameEnglish": "Xinghua",
        "district_code": 321281,
        "chinese_name": "兴化市"
    },
    {
        "Id": 674,
        "DisName": "靖江市",
        "CityID": 74,
        "DisSort": null,
        "CityNameEnglish": "Jingjiang",
        "district_code": 321282,
        "chinese_name": "靖江市"
    },
    {
        "Id": 675,
        "DisName": "泰兴市",
        "CityID": 74,
        "DisSort": null,
        "CityNameEnglish": "Taixing",
        "district_code": 321283,
        "chinese_name": "泰兴市"
    },
    {
        "Id": 676,
        "DisName": "姜堰市",
        "CityID": 74,
        "DisSort": null,
        "CityNameEnglish": "Jiangyan",
        "district_code": 321284,
        "chinese_name": "姜堰市"
    },
    {
        "Id": 677,
        "DisName": "宿城区",
        "CityID": 75,
        "DisSort": null,
        "CityNameEnglish": "Sucheng",
        "district_code": 321302,
        "chinese_name": "宿城区"
    },
    {
        "Id": 678,
        "DisName": "宿豫区",
        "CityID": 75,
        "DisSort": null,
        "CityNameEnglish": "Suyu",
        "district_code": 321311,
        "chinese_name": "宿豫区"
    },
    {
        "Id": 679,
        "DisName": "沭阳县",
        "CityID": 75,
        "DisSort": null,
        "CityNameEnglish": "Shuyang",
        "district_code": 321322,
        "chinese_name": "沭阳县"
    },
    {
        "Id": 680,
        "DisName": "泗阳县",
        "CityID": 75,
        "DisSort": null,
        "CityNameEnglish": "Siyang",
        "district_code": 321323,
        "chinese_name": "泗阳县"
    },
    {
        "Id": 681,
        "DisName": "泗洪县",
        "CityID": 75,
        "DisSort": null,
        "CityNameEnglish": "Sihong",
        "district_code": 321324,
        "chinese_name": "泗洪县"
    },
    {
        "Id": 682,
        "DisName": "定海区",
        "CityID": 76,
        "DisSort": null,
        "CityNameEnglish": "Dinghai",
        "district_code": 330902,
        "chinese_name": "定海区"
    },
    {
        "Id": 683,
        "DisName": "普陀区",
        "CityID": 76,
        "DisSort": null,
        "CityNameEnglish": "Putuo",
        "district_code": 330903,
        "chinese_name": "普陀区"
    },
    {
        "Id": 684,
        "DisName": "岱山县",
        "CityID": 76,
        "DisSort": null,
        "CityNameEnglish": "Daishan",
        "district_code": 330921,
        "chinese_name": "岱山县"
    },
    {
        "Id": 685,
        "DisName": "嵊泗县",
        "CityID": 76,
        "DisSort": null,
        "CityNameEnglish": "Shengsi",
        "district_code": 330922,
        "chinese_name": "嵊泗县"
    },
    {
        "Id": 686,
        "DisName": "柯城区",
        "CityID": 77,
        "DisSort": null,
        "CityNameEnglish": "Kecheng",
        "district_code": 330802,
        "chinese_name": "柯城区"
    },
    {
        "Id": 687,
        "DisName": "衢江区",
        "CityID": 77,
        "DisSort": null,
        "CityNameEnglish": "Qujiang",
        "district_code": 330803,
        "chinese_name": "衢江区"
    },
    {
        "Id": 688,
        "DisName": "常山县",
        "CityID": 77,
        "DisSort": null,
        "CityNameEnglish": "Changshan",
        "district_code": 330822,
        "chinese_name": "常山县"
    },
    {
        "Id": 689,
        "DisName": "开化县",
        "CityID": 77,
        "DisSort": null,
        "CityNameEnglish": "Kaihua",
        "district_code": 330824,
        "chinese_name": "开化县"
    },
    {
        "Id": 690,
        "DisName": "龙游县",
        "CityID": 77,
        "DisSort": null,
        "CityNameEnglish": "Longyou",
        "district_code": 330825,
        "chinese_name": "龙游县"
    },
    {
        "Id": 691,
        "DisName": "江山市",
        "CityID": 77,
        "DisSort": null,
        "CityNameEnglish": "Jiangshan",
        "district_code": 330881,
        "chinese_name": "江山市"
    },
    {
        "Id": 692,
        "DisName": "上城区",
        "CityID": 78,
        "DisSort": null,
        "CityNameEnglish": "Shangcheng",
        "district_code": 330102,
        "chinese_name": "上城区"
    },
    {
        "Id": 693,
        "DisName": "下城区",
        "CityID": 78,
        "DisSort": null,
        "CityNameEnglish": "Xiacheng",
        "district_code": 330103,
        "chinese_name": "下城区"
    },
    {
        "Id": 694,
        "DisName": "江干区",
        "CityID": 78,
        "DisSort": null,
        "CityNameEnglish": "Jianggan",
        "district_code": 330104,
        "chinese_name": "江干区"
    },
    {
        "Id": 695,
        "DisName": "拱墅区",
        "CityID": 78,
        "DisSort": null,
        "CityNameEnglish": "Gongshu",
        "district_code": 330105,
        "chinese_name": "拱墅区"
    },
    {
        "Id": 696,
        "DisName": "西湖区",
        "CityID": 78,
        "DisSort": null,
        "CityNameEnglish": "Xihu",
        "district_code": 330106,
        "chinese_name": "西湖区"
    },
    {
        "Id": 697,
        "DisName": "滨江区",
        "CityID": 78,
        "DisSort": null,
        "CityNameEnglish": "Binjiang",
        "district_code": 330108,
        "chinese_name": "滨江区"
    },
    {
        "Id": 698,
        "DisName": "余杭区",
        "CityID": 78,
        "DisSort": null,
        "CityNameEnglish": "Yuhang",
        "district_code": 330110,
        "chinese_name": "余杭区"
    },
    {
        "Id": 699,
        "DisName": "桐庐县",
        "CityID": 78,
        "DisSort": null,
        "CityNameEnglish": "Tonglu",
        "district_code": 330122,
        "chinese_name": "桐庐县"
    },
    {
        "Id": 700,
        "DisName": "淳安县",
        "CityID": 78,
        "DisSort": null,
        "CityNameEnglish": "Chunan",
        "district_code": 330127,
        "chinese_name": "淳安县"
    },
    {
        "Id": 701,
        "DisName": "建德市",
        "CityID": 78,
        "DisSort": null,
        "CityNameEnglish": "Jiande",
        "district_code": 330182,
        "chinese_name": "建德市"
    },
    {
        "Id": 702,
        "DisName": "富阳市",
        "CityID": 78,
        "DisSort": null,
        "CityNameEnglish": "Fuyang",
        "district_code": 330183,
        "chinese_name": "富阳市"
    },
    {
        "Id": 703,
        "DisName": "临安市",
        "CityID": 78,
        "DisSort": null,
        "CityNameEnglish": "Ling'an",
        "district_code": 330185,
        "chinese_name": "临安市"
    },
    {
        "Id": 704,
        "DisName": "萧山区",
        "CityID": 78,
        "DisSort": null,
        "CityNameEnglish": "Xiaoshan",
        "district_code": 330109,
        "chinese_name": "萧山区"
    },
    {
        "Id": 705,
        "DisName": "吴兴区",
        "CityID": 79,
        "DisSort": null,
        "CityNameEnglish": "Wuxing",
        "district_code": 330502,
        "chinese_name": "吴兴区"
    },
    {
        "Id": 706,
        "DisName": "南浔区",
        "CityID": 79,
        "DisSort": null,
        "CityNameEnglish": "Nanxun",
        "district_code": 330503,
        "chinese_name": "南浔区"
    },
    {
        "Id": 707,
        "DisName": "德清县",
        "CityID": 79,
        "DisSort": null,
        "CityNameEnglish": "Deqing",
        "district_code": 330521,
        "chinese_name": "德清县"
    },
    {
        "Id": 708,
        "DisName": "长兴县",
        "CityID": 79,
        "DisSort": null,
        "CityNameEnglish": "Changxing",
        "district_code": 330522,
        "chinese_name": "长兴县"
    },
    {
        "Id": 709,
        "DisName": "安吉县",
        "CityID": 79,
        "DisSort": null,
        "CityNameEnglish": "Anji",
        "district_code": 330523,
        "chinese_name": "安吉县"
    },
    {
        "Id": 710,
        "DisName": " 南湖区",
        "CityID": 80,
        "DisSort": null,
        "CityNameEnglish": "Nanhu",
        "district_code": 330402,
        "chinese_name": "南湖区"
    },
    {
        "Id": 711,
        "DisName": " 秀洲区",
        "CityID": 80,
        "DisSort": null,
        "CityNameEnglish": "Xiuzhou",
        "district_code": 330411,
        "chinese_name": "秀洲区"
    },
    {
        "Id": 712,
        "DisName": " 嘉善县",
        "CityID": 80,
        "DisSort": null,
        "CityNameEnglish": "Jiashan",
        "district_code": 330421,
        "chinese_name": "嘉善县"
    },
    {
        "Id": 713,
        "DisName": " 海盐县",
        "CityID": 80,
        "DisSort": null,
        "CityNameEnglish": "Haiyan",
        "district_code": 330424,
        "chinese_name": "海盐县"
    },
    {
        "Id": 714,
        "DisName": " 海宁市",
        "CityID": 80,
        "DisSort": null,
        "CityNameEnglish": "Haining",
        "district_code": 330481,
        "chinese_name": "海宁市"
    },
    {
        "Id": 715,
        "DisName": " 平湖市",
        "CityID": 80,
        "DisSort": null,
        "CityNameEnglish": "Pinghu",
        "district_code": 330482,
        "chinese_name": "平湖市"
    },
    {
        "Id": 716,
        "DisName": " 桐乡市",
        "CityID": 80,
        "DisSort": null,
        "CityNameEnglish": "Tongxiang",
        "district_code": 330483,
        "chinese_name": "桐乡市"
    },
    {
        "Id": 717,
        "DisName": "海曙区",
        "CityID": 81,
        "DisSort": null,
        "CityNameEnglish": "Haishu",
        "district_code": 330203,
        "chinese_name": "海曙区"
    },
    {
        "Id": 718,
        "DisName": "江东区",
        "CityID": 81,
        "DisSort": null,
        "CityNameEnglish": "Jiangdong",
        "district_code": 330204,
        "chinese_name": "江东区"
    },
    {
        "Id": 719,
        "DisName": "江北区",
        "CityID": 81,
        "DisSort": null,
        "CityNameEnglish": "Jiangbei",
        "district_code": 330205,
        "chinese_name": "江北区"
    },
    {
        "Id": 720,
        "DisName": "北仑区",
        "CityID": 81,
        "DisSort": null,
        "CityNameEnglish": "Beilun",
        "district_code": 330206,
        "chinese_name": "北仑区"
    },
    {
        "Id": 721,
        "DisName": "镇海区",
        "CityID": 81,
        "DisSort": null,
        "CityNameEnglish": "Zhenhai",
        "district_code": 330211,
        "chinese_name": "镇海区"
    },
    {
        "Id": 722,
        "DisName": "鄞州区",
        "CityID": 81,
        "DisSort": null,
        "CityNameEnglish": "Yinzhou",
        "district_code": 330212,
        "chinese_name": "鄞州区"
    },
    {
        "Id": 723,
        "DisName": "象山县",
        "CityID": 81,
        "DisSort": null,
        "CityNameEnglish": "Xiangshan",
        "district_code": 330225,
        "chinese_name": "象山县"
    },
    {
        "Id": 724,
        "DisName": "宁海县",
        "CityID": 81,
        "DisSort": null,
        "CityNameEnglish": "Ninghai",
        "district_code": 330226,
        "chinese_name": "宁海县"
    },
    {
        "Id": 725,
        "DisName": "余姚市",
        "CityID": 81,
        "DisSort": null,
        "CityNameEnglish": "Yuyao",
        "district_code": 330281,
        "chinese_name": "余姚市"
    },
    {
        "Id": 726,
        "DisName": "慈溪市",
        "CityID": 81,
        "DisSort": null,
        "CityNameEnglish": "Cixi",
        "district_code": 330282,
        "chinese_name": "慈溪市"
    },
    {
        "Id": 727,
        "DisName": "奉化市",
        "CityID": 81,
        "DisSort": null,
        "CityNameEnglish": "Fenghua",
        "district_code": 330283,
        "chinese_name": "奉化市"
    },
    {
        "Id": 728,
        "DisName": "越城区",
        "CityID": 82,
        "DisSort": null,
        "CityNameEnglish": "Yuecheng",
        "district_code": 330602,
        "chinese_name": "越城区"
    },
    {
        "Id": 729,
        "DisName": "绍兴县",
        "CityID": 82,
        "DisSort": null,
        "CityNameEnglish": "Shaoxing",
        "district_code": 330621,
        "chinese_name": "绍兴县"
    },
    {
        "Id": 730,
        "DisName": "新昌县",
        "CityID": 82,
        "DisSort": null,
        "CityNameEnglish": "Xinchang",
        "district_code": 330624,
        "chinese_name": "新昌县"
    },
    {
        "Id": 731,
        "DisName": "诸暨市",
        "CityID": 82,
        "DisSort": null,
        "CityNameEnglish": "Zhuji",
        "district_code": 330681,
        "chinese_name": "诸暨市"
    },
    {
        "Id": 732,
        "DisName": "上虞市",
        "CityID": 82,
        "DisSort": null,
        "CityNameEnglish": "Shangyu",
        "district_code": 330682,
        "chinese_name": "上虞市"
    },
    {
        "Id": 733,
        "DisName": "嵊州市",
        "CityID": 82,
        "DisSort": null,
        "CityNameEnglish": "Shengzhou",
        "district_code": 330683,
        "chinese_name": "嵊州市"
    },
    {
        "Id": 734,
        "DisName": "鹿城区",
        "CityID": 83,
        "DisSort": null,
        "CityNameEnglish": "Lucheng",
        "district_code": 330302,
        "chinese_name": "鹿城区"
    },
    {
        "Id": 735,
        "DisName": "龙湾区",
        "CityID": 83,
        "DisSort": null,
        "CityNameEnglish": "Longwan",
        "district_code": 330303,
        "chinese_name": "龙湾区"
    },
    {
        "Id": 736,
        "DisName": "瓯海区",
        "CityID": 83,
        "DisSort": null,
        "CityNameEnglish": "Ouhai",
        "district_code": 330304,
        "chinese_name": "瓯海区"
    },
    {
        "Id": 737,
        "DisName": "洞头县",
        "CityID": 83,
        "DisSort": null,
        "CityNameEnglish": "Dongtou",
        "district_code": 330322,
        "chinese_name": "洞头县"
    },
    {
        "Id": 738,
        "DisName": "永嘉县",
        "CityID": 83,
        "DisSort": null,
        "CityNameEnglish": "Yongjia",
        "district_code": 330324,
        "chinese_name": "永嘉县"
    },
    {
        "Id": 739,
        "DisName": "平阳县",
        "CityID": 83,
        "DisSort": null,
        "CityNameEnglish": "Pingyang",
        "district_code": 330326,
        "chinese_name": "平阳县"
    },
    {
        "Id": 740,
        "DisName": "苍南县",
        "CityID": 83,
        "DisSort": null,
        "CityNameEnglish": "Cangnan",
        "district_code": 330327,
        "chinese_name": "苍南县"
    },
    {
        "Id": 741,
        "DisName": "文成县",
        "CityID": 83,
        "DisSort": null,
        "CityNameEnglish": "Wencheng",
        "district_code": 330328,
        "chinese_name": "文成县"
    },
    {
        "Id": 742,
        "DisName": "泰顺县",
        "CityID": 83,
        "DisSort": null,
        "CityNameEnglish": "Taishun",
        "district_code": 330329,
        "chinese_name": "泰顺县"
    },
    {
        "Id": 743,
        "DisName": "瑞安市",
        "CityID": 83,
        "DisSort": null,
        "CityNameEnglish": "Ruian",
        "district_code": 330381,
        "chinese_name": "瑞安市"
    },
    {
        "Id": 744,
        "DisName": "乐清市",
        "CityID": 83,
        "DisSort": null,
        "CityNameEnglish": "Yueqing",
        "district_code": 330382,
        "chinese_name": "乐清市"
    },
    {
        "Id": 745,
        "DisName": "莲都区",
        "CityID": 84,
        "DisSort": null,
        "CityNameEnglish": "Liandu",
        "district_code": 331102,
        "chinese_name": "莲都区"
    },
    {
        "Id": 746,
        "DisName": "青田县",
        "CityID": 84,
        "DisSort": null,
        "CityNameEnglish": "Qingtian",
        "district_code": 331121,
        "chinese_name": "青田县"
    },
    {
        "Id": 747,
        "DisName": "缙云县",
        "CityID": 84,
        "DisSort": null,
        "CityNameEnglish": "Jinyun",
        "district_code": 331122,
        "chinese_name": "缙云县"
    },
    {
        "Id": 748,
        "DisName": "遂昌县",
        "CityID": 84,
        "DisSort": null,
        "CityNameEnglish": "Suichang",
        "district_code": 331123,
        "chinese_name": "遂昌县"
    },
    {
        "Id": 749,
        "DisName": "松阳县",
        "CityID": 84,
        "DisSort": null,
        "CityNameEnglish": "Songyang",
        "district_code": 331124,
        "chinese_name": "松阳县"
    },
    {
        "Id": 750,
        "DisName": "云和县",
        "CityID": 84,
        "DisSort": null,
        "CityNameEnglish": "Yuehe",
        "district_code": 331125,
        "chinese_name": "云和县"
    },
    {
        "Id": 751,
        "DisName": "庆元县",
        "CityID": 84,
        "DisSort": null,
        "CityNameEnglish": "Qingyuan",
        "district_code": 331126,
        "chinese_name": "庆元县"
    },
    {
        "Id": 752,
        "DisName": "景宁畲族自治县",
        "CityID": 84,
        "DisSort": null,
        "CityNameEnglish": "Jingning",
        "district_code": 331127,
        "chinese_name": "景宁畲族自治县"
    },
    {
        "Id": 753,
        "DisName": "龙泉市",
        "CityID": 84,
        "DisSort": null,
        "CityNameEnglish": "Longquan",
        "district_code": 331181,
        "chinese_name": "龙泉市"
    },
    {
        "Id": 754,
        "DisName": "婺城区",
        "CityID": 85,
        "DisSort": null,
        "CityNameEnglish": "Wucheng",
        "district_code": 330702,
        "chinese_name": "婺城区"
    },
    {
        "Id": 755,
        "DisName": "金东区",
        "CityID": 85,
        "DisSort": null,
        "CityNameEnglish": "Jindong",
        "district_code": 330703,
        "chinese_name": "金东区"
    },
    {
        "Id": 756,
        "DisName": "武义县",
        "CityID": 85,
        "DisSort": null,
        "CityNameEnglish": "Wuyi",
        "district_code": 330723,
        "chinese_name": "武义县"
    },
    {
        "Id": 757,
        "DisName": "浦江县",
        "CityID": 85,
        "DisSort": null,
        "CityNameEnglish": "Pujiang",
        "district_code": 330726,
        "chinese_name": "浦江县"
    },
    {
        "Id": 758,
        "DisName": "磐安县",
        "CityID": 85,
        "DisSort": null,
        "CityNameEnglish": "Pan'an",
        "district_code": 330727,
        "chinese_name": "磐安县"
    },
    {
        "Id": 759,
        "DisName": "兰溪市",
        "CityID": 85,
        "DisSort": null,
        "CityNameEnglish": "Lanxi",
        "district_code": 330781,
        "chinese_name": "兰溪市"
    },
    {
        "Id": 760,
        "DisName": "义乌市",
        "CityID": 85,
        "DisSort": null,
        "CityNameEnglish": "Yiwu",
        "district_code": 330782,
        "chinese_name": "义乌市"
    },
    {
        "Id": 761,
        "DisName": "东阳市",
        "CityID": 85,
        "DisSort": null,
        "CityNameEnglish": "Dongyang",
        "district_code": 330783,
        "chinese_name": "东阳市"
    },
    {
        "Id": 762,
        "DisName": "永康市",
        "CityID": 85,
        "DisSort": null,
        "CityNameEnglish": "Yongkang",
        "district_code": 330784,
        "chinese_name": "永康市"
    },
    {
        "Id": 763,
        "DisName": "椒江区",
        "CityID": 86,
        "DisSort": null,
        "CityNameEnglish": "Jiaojiang",
        "district_code": 331002,
        "chinese_name": "椒江区"
    },
    {
        "Id": 764,
        "DisName": "黄岩区",
        "CityID": 86,
        "DisSort": null,
        "CityNameEnglish": "Huangyan",
        "district_code": 331003,
        "chinese_name": "黄岩区"
    },
    {
        "Id": 765,
        "DisName": "路桥区",
        "CityID": 86,
        "DisSort": null,
        "CityNameEnglish": "Luqiao",
        "district_code": 331004,
        "chinese_name": "路桥区"
    },
    {
        "Id": 766,
        "DisName": "玉环县",
        "CityID": 86,
        "DisSort": null,
        "CityNameEnglish": "Yuhuan",
        "district_code": 331021,
        "chinese_name": "玉环县"
    },
    {
        "Id": 767,
        "DisName": "三门县",
        "CityID": 86,
        "DisSort": null,
        "CityNameEnglish": "Sanmen",
        "district_code": 331022,
        "chinese_name": "三门县"
    },
    {
        "Id": 768,
        "DisName": "天台县",
        "CityID": 86,
        "DisSort": null,
        "CityNameEnglish": "Tiantai",
        "district_code": 331023,
        "chinese_name": "天台县"
    },
    {
        "Id": 769,
        "DisName": "仙居县",
        "CityID": 86,
        "DisSort": null,
        "CityNameEnglish": "Xianju",
        "district_code": 331024,
        "chinese_name": "仙居县"
    },
    {
        "Id": 770,
        "DisName": "温岭市",
        "CityID": 86,
        "DisSort": null,
        "CityNameEnglish": "Wenling",
        "district_code": 331081,
        "chinese_name": "温岭市"
    },
    {
        "Id": 771,
        "DisName": "临海市",
        "CityID": 86,
        "DisSort": null,
        "CityNameEnglish": "Linhai",
        "district_code": 331082,
        "chinese_name": "临海市"
    },
    {
        "Id": 772,
        "DisName": "瑶海区",
        "CityID": 87,
        "DisSort": null,
        "CityNameEnglish": "Yaohai",
        "district_code": 340102,
        "chinese_name": "瑶海区"
    },
    {
        "Id": 773,
        "DisName": "庐阳区",
        "CityID": 87,
        "DisSort": null,
        "CityNameEnglish": "Luyang",
        "district_code": 340103,
        "chinese_name": "庐阳区"
    },
    {
        "Id": 774,
        "DisName": "蜀山区",
        "CityID": 87,
        "DisSort": null,
        "CityNameEnglish": "Shushan",
        "district_code": 340104,
        "chinese_name": "蜀山区"
    },
    {
        "Id": 775,
        "DisName": "包河区",
        "CityID": 87,
        "DisSort": null,
        "CityNameEnglish": "Baohe",
        "district_code": 340111,
        "chinese_name": "包河区"
    },
    {
        "Id": 776,
        "DisName": "长丰县",
        "CityID": 87,
        "DisSort": null,
        "CityNameEnglish": "Changfeng",
        "district_code": 340121,
        "chinese_name": "长丰县"
    },
    {
        "Id": 777,
        "DisName": "肥东县",
        "CityID": 87,
        "DisSort": null,
        "CityNameEnglish": "Feidong",
        "district_code": 340122,
        "chinese_name": "肥东县"
    },
    {
        "Id": 778,
        "DisName": "肥西县",
        "CityID": 87,
        "DisSort": null,
        "CityNameEnglish": "Feixi",
        "district_code": 340123,
        "chinese_name": "肥西县"
    },
    {
        "Id": 779,
        "DisName": "镜湖区",
        "CityID": 88,
        "DisSort": null,
        "CityNameEnglish": "Jinghu",
        "district_code": 340202,
        "chinese_name": "镜湖区"
    },
    {
        "Id": 780,
        "DisName": "弋江区",
        "CityID": 88,
        "DisSort": null,
        "CityNameEnglish": "Yijiang",
        "district_code": 340203,
        "chinese_name": "弋江区"
    },
    {
        "Id": 781,
        "DisName": "鸠江区",
        "CityID": 88,
        "DisSort": null,
        "CityNameEnglish": "Jiujiang",
        "district_code": 340207,
        "chinese_name": "鸠江区"
    },
    {
        "Id": 782,
        "DisName": "三山区",
        "CityID": 88,
        "DisSort": null,
        "CityNameEnglish": "Sanshan",
        "district_code": 340208,
        "chinese_name": "三山区"
    },
    {
        "Id": 783,
        "DisName": "芜湖县",
        "CityID": 88,
        "DisSort": null,
        "CityNameEnglish": "Wuhu",
        "district_code": 340221,
        "chinese_name": "芜湖县"
    },
    {
        "Id": 784,
        "DisName": "繁昌县",
        "CityID": 88,
        "DisSort": null,
        "CityNameEnglish": "Fanchang",
        "district_code": 340222,
        "chinese_name": "繁昌县"
    },
    {
        "Id": 785,
        "DisName": "南陵县",
        "CityID": 88,
        "DisSort": null,
        "CityNameEnglish": "Nanling",
        "district_code": 340223,
        "chinese_name": "南陵县"
    },
    {
        "Id": 786,
        "DisName": "龙子湖区",
        "CityID": 89,
        "DisSort": null,
        "CityNameEnglish": "Longzihu",
        "district_code": 340302,
        "chinese_name": "龙子湖区"
    },
    {
        "Id": 787,
        "DisName": "蚌山区",
        "CityID": 89,
        "DisSort": null,
        "CityNameEnglish": "Bangshan",
        "district_code": 340303,
        "chinese_name": "蚌山区"
    },
    {
        "Id": 788,
        "DisName": "禹会区",
        "CityID": 89,
        "DisSort": null,
        "CityNameEnglish": "Yuhui",
        "district_code": 340304,
        "chinese_name": "禹会区"
    },
    {
        "Id": 789,
        "DisName": "淮上区",
        "CityID": 89,
        "DisSort": null,
        "CityNameEnglish": "Huaishang",
        "district_code": 340311,
        "chinese_name": "淮上区"
    },
    {
        "Id": 790,
        "DisName": "怀远县",
        "CityID": 89,
        "DisSort": null,
        "CityNameEnglish": "Huaiyuan",
        "district_code": 340321,
        "chinese_name": "怀远县"
    },
    {
        "Id": 791,
        "DisName": "五河县",
        "CityID": 89,
        "DisSort": null,
        "CityNameEnglish": "Wuhe",
        "district_code": 340322,
        "chinese_name": "五河县"
    },
    {
        "Id": 792,
        "DisName": "固镇县",
        "CityID": 89,
        "DisSort": null,
        "CityNameEnglish": "Guzhen",
        "district_code": 340323,
        "chinese_name": "固镇县"
    },
    {
        "Id": 810,
        "DisName": "迎江区",
        "CityID": 94,
        "DisSort": null,
        "CityNameEnglish": "Yingjiang",
        "district_code": 340802,
        "chinese_name": "迎江区"
    },
    {
        "Id": 811,
        "DisName": "大观区",
        "CityID": 94,
        "DisSort": null,
        "CityNameEnglish": "Daguan",
        "district_code": 340803,
        "chinese_name": "大观区"
    },
    {
        "Id": 812,
        "DisName": "宜秀区",
        "CityID": 94,
        "DisSort": null,
        "CityNameEnglish": "Yixiu",
        "district_code": 340811,
        "chinese_name": "宜秀区"
    },
    {
        "Id": 813,
        "DisName": "怀宁县",
        "CityID": 94,
        "DisSort": null,
        "CityNameEnglish": "Huaining",
        "district_code": 340822,
        "chinese_name": "怀宁县"
    },
    {
        "Id": 814,
        "DisName": "枞阳县",
        "CityID": 94,
        "DisSort": null,
        "CityNameEnglish": "Zongyang",
        "district_code": 340823,
        "chinese_name": "枞阳县"
    },
    {
        "Id": 815,
        "DisName": "潜山县",
        "CityID": 94,
        "DisSort": null,
        "CityNameEnglish": "Qianshan",
        "district_code": 340824,
        "chinese_name": "潜山县"
    },
    {
        "Id": 816,
        "DisName": "太湖县",
        "CityID": 94,
        "DisSort": null,
        "CityNameEnglish": "Taihu",
        "district_code": 340825,
        "chinese_name": "太湖县"
    },
    {
        "Id": 817,
        "DisName": "宿松县",
        "CityID": 94,
        "DisSort": null,
        "CityNameEnglish": "Susong",
        "district_code": 340826,
        "chinese_name": "宿松县"
    },
    {
        "Id": 818,
        "DisName": "望江县",
        "CityID": 94,
        "DisSort": null,
        "CityNameEnglish": "Wangjiang",
        "district_code": 340827,
        "chinese_name": "望江县"
    },
    {
        "Id": 819,
        "DisName": "岳西县",
        "CityID": 94,
        "DisSort": null,
        "CityNameEnglish": "Yuexi",
        "district_code": 340828,
        "chinese_name": "岳西县"
    },
    {
        "Id": 820,
        "DisName": "桐城市",
        "CityID": 94,
        "DisSort": null,
        "CityNameEnglish": "Tongcheng",
        "district_code": 340881,
        "chinese_name": "桐城市"
    },
    {
        "Id": 821,
        "DisName": "屯溪区",
        "CityID": 95,
        "DisSort": null,
        "CityNameEnglish": "Tunxi",
        "district_code": 341002,
        "chinese_name": "屯溪区"
    },
    {
        "Id": 822,
        "DisName": "黄山区",
        "CityID": 95,
        "DisSort": null,
        "CityNameEnglish": "Huangshan",
        "district_code": 341003,
        "chinese_name": "黄山区"
    },
    {
        "Id": 823,
        "DisName": "徽州区",
        "CityID": 95,
        "DisSort": null,
        "CityNameEnglish": "Huizhou",
        "district_code": 341004,
        "chinese_name": "徽州区"
    },
    {
        "Id": 824,
        "DisName": "歙县",
        "CityID": 95,
        "DisSort": null,
        "CityNameEnglish": "Shexian",
        "district_code": 341021,
        "chinese_name": "歙县"
    },
    {
        "Id": 825,
        "DisName": "休宁县",
        "CityID": 95,
        "DisSort": null,
        "CityNameEnglish": "Xiuning",
        "district_code": 341022,
        "chinese_name": "休宁县"
    },
    {
        "Id": 826,
        "DisName": "黟县",
        "CityID": 95,
        "DisSort": null,
        "CityNameEnglish": "Yixian",
        "district_code": 341023,
        "chinese_name": "黟县"
    },
    {
        "Id": 827,
        "DisName": "祁门县",
        "CityID": 95,
        "DisSort": null,
        "CityNameEnglish": "Qimen",
        "district_code": 341024,
        "chinese_name": "祁门县"
    },
    {
        "Id": 828,
        "DisName": "琅琊区",
        "CityID": 96,
        "DisSort": null,
        "CityNameEnglish": "Langya",
        "district_code": 341102,
        "chinese_name": "琅琊区"
    },
    {
        "Id": 829,
        "DisName": "南谯区",
        "CityID": 96,
        "DisSort": null,
        "CityNameEnglish": "Nanqiao",
        "district_code": 341103,
        "chinese_name": "南谯区"
    },
    {
        "Id": 830,
        "DisName": "来安县",
        "CityID": 96,
        "DisSort": null,
        "CityNameEnglish": "Laian",
        "district_code": 341122,
        "chinese_name": "来安县"
    },
    {
        "Id": 831,
        "DisName": "全椒县",
        "CityID": 96,
        "DisSort": null,
        "CityNameEnglish": "Quanjiao",
        "district_code": 341124,
        "chinese_name": "全椒县"
    },
    {
        "Id": 832,
        "DisName": "定远县",
        "CityID": 96,
        "DisSort": null,
        "CityNameEnglish": "Dingyuan",
        "district_code": 341125,
        "chinese_name": "定远县"
    },
    {
        "Id": 833,
        "DisName": "凤阳县",
        "CityID": 96,
        "DisSort": null,
        "CityNameEnglish": "Fengyang",
        "district_code": 341126,
        "chinese_name": "凤阳县"
    },
    {
        "Id": 834,
        "DisName": "天长市",
        "CityID": 96,
        "DisSort": null,
        "CityNameEnglish": "Tianchang",
        "district_code": 341181,
        "chinese_name": "天长市"
    },
    {
        "Id": 835,
        "DisName": "明光市",
        "CityID": 96,
        "DisSort": null,
        "CityNameEnglish": "Mingguang",
        "district_code": 341182,
        "chinese_name": "明光市"
    },
    {
        "Id": 836,
        "DisName": "颍州区",
        "CityID": 97,
        "DisSort": null,
        "CityNameEnglish": "Yingzhou",
        "district_code": 341202,
        "chinese_name": "颍州区"
    },
    {
        "Id": 837,
        "DisName": "颍东区",
        "CityID": 97,
        "DisSort": null,
        "CityNameEnglish": "Yingdong",
        "district_code": 341203,
        "chinese_name": "颍东区"
    },
    {
        "Id": 838,
        "DisName": "颍泉区",
        "CityID": 97,
        "DisSort": null,
        "CityNameEnglish": "Yingquan",
        "district_code": 341204,
        "chinese_name": "颍泉区"
    },
    {
        "Id": 839,
        "DisName": "临泉县",
        "CityID": 97,
        "DisSort": null,
        "CityNameEnglish": "Linquan",
        "district_code": 341221,
        "chinese_name": "临泉县"
    },
    {
        "Id": 840,
        "DisName": "太和县",
        "CityID": 97,
        "DisSort": null,
        "CityNameEnglish": "Taihe",
        "district_code": 341222,
        "chinese_name": "太和县"
    },
    {
        "Id": 841,
        "DisName": "阜南县",
        "CityID": 97,
        "DisSort": null,
        "CityNameEnglish": "Funan",
        "district_code": 341225,
        "chinese_name": "阜南县"
    },
    {
        "Id": 842,
        "DisName": "颍上县",
        "CityID": 97,
        "DisSort": null,
        "CityNameEnglish": "Yingshang",
        "district_code": 341226,
        "chinese_name": "颍上县"
    },
    {
        "Id": 843,
        "DisName": "界首市",
        "CityID": 97,
        "DisSort": null,
        "CityNameEnglish": "Jieshou",
        "district_code": 341282,
        "chinese_name": "界首市"
    },
    {
        "Id": 844,
        "DisName": "埇桥区",
        "CityID": 98,
        "DisSort": null,
        "CityNameEnglish": "Yongqiao",
        "district_code": 341302,
        "chinese_name": "埇桥区"
    },
    {
        "Id": 845,
        "DisName": "砀山县",
        "CityID": 98,
        "DisSort": null,
        "CityNameEnglish": "Dangshan",
        "district_code": 341321,
        "chinese_name": "砀山县"
    },
    {
        "Id": 846,
        "DisName": "萧县",
        "CityID": 98,
        "DisSort": null,
        "CityNameEnglish": "Xiaoxian",
        "district_code": 341322,
        "chinese_name": "萧县"
    },
    {
        "Id": 847,
        "DisName": "灵璧县",
        "CityID": 98,
        "DisSort": null,
        "CityNameEnglish": "Lingbi",
        "district_code": 341323,
        "chinese_name": "灵璧县"
    },
    {
        "Id": 848,
        "DisName": "泗县",
        "CityID": 98,
        "DisSort": null,
        "CityNameEnglish": "Sixian",
        "district_code": 341324,
        "chinese_name": "泗县"
    },
    {
        "Id": 854,
        "DisName": "金安区",
        "CityID": 100,
        "DisSort": null,
        "CityNameEnglish": "Jin'an",
        "district_code": 341502,
        "chinese_name": "金安区"
    },
    {
        "Id": 855,
        "DisName": "裕安区",
        "CityID": 100,
        "DisSort": null,
        "CityNameEnglish": "Yu'an",
        "district_code": 341503,
        "chinese_name": "裕安区"
    },
    {
        "Id": 856,
        "DisName": "寿县",
        "CityID": 100,
        "DisSort": null,
        "CityNameEnglish": "Shouxian",
        "district_code": 341521,
        "chinese_name": "寿县"
    },
    {
        "Id": 857,
        "DisName": "霍邱县",
        "CityID": 100,
        "DisSort": null,
        "CityNameEnglish": "Huoqiu",
        "district_code": 341522,
        "chinese_name": "霍邱县"
    },
    {
        "Id": 858,
        "DisName": "舒城县",
        "CityID": 100,
        "DisSort": null,
        "CityNameEnglish": "Shucheng",
        "district_code": 341523,
        "chinese_name": "舒城县"
    },
    {
        "Id": 859,
        "DisName": "金寨县",
        "CityID": 100,
        "DisSort": null,
        "CityNameEnglish": "Jinzhai",
        "district_code": 341524,
        "chinese_name": "金寨县"
    },
    {
        "Id": 860,
        "DisName": "霍山县",
        "CityID": 100,
        "DisSort": null,
        "CityNameEnglish": "Huoshan",
        "district_code": 341525,
        "chinese_name": "霍山县"
    },
    {
        "Id": 876,
        "DisName": "鼓楼区",
        "CityID": 104,
        "DisSort": null,
        "CityNameEnglish": "Gulou",
        "district_code": 410204,
        "chinese_name": "鼓楼区"
    },
    {
        "Id": 877,
        "DisName": "台江区",
        "CityID": 104,
        "DisSort": null,
        "CityNameEnglish": "Taijiang",
        "district_code": 350103,
        "chinese_name": "台江区"
    },
    {
        "Id": 878,
        "DisName": "仓山区",
        "CityID": 104,
        "DisSort": null,
        "CityNameEnglish": "Cangshan",
        "district_code": 350104,
        "chinese_name": "仓山区"
    },
    {
        "Id": 879,
        "DisName": "马尾区",
        "CityID": 104,
        "DisSort": null,
        "CityNameEnglish": "Mawei",
        "district_code": 350105,
        "chinese_name": "马尾区"
    },
    {
        "Id": 880,
        "DisName": "晋安区",
        "CityID": 104,
        "DisSort": null,
        "CityNameEnglish": "Jinan",
        "district_code": 350111,
        "chinese_name": "晋安区"
    },
    {
        "Id": 881,
        "DisName": "闽侯县",
        "CityID": 104,
        "DisSort": null,
        "CityNameEnglish": "Minhou",
        "district_code": 350121,
        "chinese_name": "闽侯县"
    },
    {
        "Id": 882,
        "DisName": "连江县",
        "CityID": 104,
        "DisSort": null,
        "CityNameEnglish": "Lianjiang",
        "district_code": 350122,
        "chinese_name": "连江县"
    },
    {
        "Id": 883,
        "DisName": "罗源县",
        "CityID": 104,
        "DisSort": null,
        "CityNameEnglish": "Luoyuan",
        "district_code": 350123,
        "chinese_name": "罗源县"
    },
    {
        "Id": 884,
        "DisName": "闽清县",
        "CityID": 104,
        "DisSort": null,
        "CityNameEnglish": "Minqing",
        "district_code": 350124,
        "chinese_name": "闽清县"
    },
    {
        "Id": 885,
        "DisName": "永泰县",
        "CityID": 104,
        "DisSort": null,
        "CityNameEnglish": "Yongtai",
        "district_code": 350125,
        "chinese_name": "永泰县"
    },
    {
        "Id": 886,
        "DisName": "平潭县",
        "CityID": 104,
        "DisSort": null,
        "CityNameEnglish": "Pingtan",
        "district_code": 350128,
        "chinese_name": "平潭县"
    },
    {
        "Id": 887,
        "DisName": "福清市",
        "CityID": 104,
        "DisSort": null,
        "CityNameEnglish": "Fuqing",
        "district_code": 350181,
        "chinese_name": "福清市"
    },
    {
        "Id": 888,
        "DisName": "长乐市",
        "CityID": 104,
        "DisSort": null,
        "CityNameEnglish": "Changle",
        "district_code": 350182,
        "chinese_name": "长乐市"
    },
    {
        "Id": 889,
        "DisName": "思明区",
        "CityID": 105,
        "DisSort": null,
        "CityNameEnglish": "Siming",
        "district_code": 350203,
        "chinese_name": "思明区"
    },
    {
        "Id": 890,
        "DisName": "海沧区",
        "CityID": 105,
        "DisSort": null,
        "CityNameEnglish": "Haicang",
        "district_code": 350205,
        "chinese_name": "海沧区"
    },
    {
        "Id": 891,
        "DisName": "湖里区",
        "CityID": 105,
        "DisSort": null,
        "CityNameEnglish": "Huli",
        "district_code": 350206,
        "chinese_name": "湖里区"
    },
    {
        "Id": 892,
        "DisName": "集美区",
        "CityID": 105,
        "DisSort": null,
        "CityNameEnglish": "Jimei",
        "district_code": 350211,
        "chinese_name": "集美区"
    },
    {
        "Id": 893,
        "DisName": "同安区",
        "CityID": 105,
        "DisSort": null,
        "CityNameEnglish": "Tong'an",
        "district_code": 350212,
        "chinese_name": "同安区"
    },
    {
        "Id": 894,
        "DisName": "翔安区",
        "CityID": 105,
        "DisSort": null,
        "CityNameEnglish": "Xiang'an",
        "district_code": 350213,
        "chinese_name": "翔安区"
    },
    {
        "Id": 895,
        "DisName": "蕉城区",
        "CityID": 106,
        "DisSort": null,
        "CityNameEnglish": "Jiaocheng",
        "district_code": 350902,
        "chinese_name": "蕉城区"
    },
    {
        "Id": 896,
        "DisName": "霞浦县",
        "CityID": 106,
        "DisSort": null,
        "CityNameEnglish": "Xiapu",
        "district_code": 350921,
        "chinese_name": "霞浦县"
    },
    {
        "Id": 897,
        "DisName": "古田县",
        "CityID": 106,
        "DisSort": null,
        "CityNameEnglish": "Gutian",
        "district_code": 350922,
        "chinese_name": "古田县"
    },
    {
        "Id": 898,
        "DisName": "屏南县",
        "CityID": 106,
        "DisSort": null,
        "CityNameEnglish": "Pingnan",
        "district_code": 350923,
        "chinese_name": "屏南县"
    },
    {
        "Id": 899,
        "DisName": "寿宁县",
        "CityID": 106,
        "DisSort": null,
        "CityNameEnglish": "Shouning",
        "district_code": 350924,
        "chinese_name": "寿宁县"
    },
    {
        "Id": 900,
        "DisName": "周宁县",
        "CityID": 106,
        "DisSort": null,
        "CityNameEnglish": "Zhouning",
        "district_code": 350925,
        "chinese_name": "周宁县"
    },
    {
        "Id": 901,
        "DisName": "柘荣县",
        "CityID": 106,
        "DisSort": null,
        "CityNameEnglish": "Zherong",
        "district_code": 350926,
        "chinese_name": "柘荣县"
    },
    {
        "Id": 902,
        "DisName": "福安市",
        "CityID": 106,
        "DisSort": null,
        "CityNameEnglish": "Fu'an",
        "district_code": 350981,
        "chinese_name": "福安市"
    },
    {
        "Id": 903,
        "DisName": "福鼎市",
        "CityID": 106,
        "DisSort": null,
        "CityNameEnglish": "Fuding",
        "district_code": 350982,
        "chinese_name": "福鼎市"
    },
    {
        "Id": 904,
        "DisName": "城厢区",
        "CityID": 107,
        "DisSort": null,
        "CityNameEnglish": "Chengxiang",
        "district_code": 350302,
        "chinese_name": "城厢区"
    },
    {
        "Id": 905,
        "DisName": "涵江区",
        "CityID": 107,
        "DisSort": null,
        "CityNameEnglish": "Hanjiang",
        "district_code": 350303,
        "chinese_name": "涵江区"
    },
    {
        "Id": 906,
        "DisName": "荔城区",
        "CityID": 107,
        "DisSort": null,
        "CityNameEnglish": "Licheng",
        "district_code": 350304,
        "chinese_name": "荔城区"
    },
    {
        "Id": 907,
        "DisName": "秀屿区",
        "CityID": 107,
        "DisSort": null,
        "CityNameEnglish": "Xiuyu",
        "district_code": 350305,
        "chinese_name": "秀屿区"
    },
    {
        "Id": 908,
        "DisName": "仙游县",
        "CityID": 107,
        "DisSort": null,
        "CityNameEnglish": "Xianyou",
        "district_code": 350322,
        "chinese_name": "仙游县"
    },
    {
        "Id": 909,
        "DisName": "鲤城区",
        "CityID": 108,
        "DisSort": null,
        "CityNameEnglish": "Licheng",
        "district_code": 350502,
        "chinese_name": "鲤城区"
    },
    {
        "Id": 910,
        "DisName": "丰泽区",
        "CityID": 108,
        "DisSort": null,
        "CityNameEnglish": "Fengze",
        "district_code": 350503,
        "chinese_name": "丰泽区"
    },
    {
        "Id": 911,
        "DisName": "洛江区",
        "CityID": 108,
        "DisSort": null,
        "CityNameEnglish": "Luojiang",
        "district_code": 350504,
        "chinese_name": "洛江区"
    },
    {
        "Id": 912,
        "DisName": "泉港区",
        "CityID": 108,
        "DisSort": null,
        "CityNameEnglish": "Quangang",
        "district_code": 350505,
        "chinese_name": "泉港区"
    },
    {
        "Id": 913,
        "DisName": "惠安县",
        "CityID": 108,
        "DisSort": null,
        "CityNameEnglish": "Huian",
        "district_code": 350521,
        "chinese_name": "惠安县"
    },
    {
        "Id": 914,
        "DisName": "安溪县",
        "CityID": 108,
        "DisSort": null,
        "CityNameEnglish": "Anxi",
        "district_code": 350524,
        "chinese_name": "安溪县"
    },
    {
        "Id": 915,
        "DisName": "永春县",
        "CityID": 108,
        "DisSort": null,
        "CityNameEnglish": "Yongchun",
        "district_code": 350525,
        "chinese_name": "永春县"
    },
    {
        "Id": 916,
        "DisName": "德化县",
        "CityID": 108,
        "DisSort": null,
        "CityNameEnglish": "Dehua",
        "district_code": 350526,
        "chinese_name": "德化县"
    },
    {
        "Id": 917,
        "DisName": "石狮市",
        "CityID": 108,
        "DisSort": null,
        "CityNameEnglish": "Shishi",
        "district_code": 350581,
        "chinese_name": "石狮市"
    },
    {
        "Id": 918,
        "DisName": "晋江市",
        "CityID": 108,
        "DisSort": null,
        "CityNameEnglish": "Jinjiang",
        "district_code": 350582,
        "chinese_name": "晋江市"
    },
    {
        "Id": 919,
        "DisName": "南安市",
        "CityID": 108,
        "DisSort": null,
        "CityNameEnglish": "Nanan",
        "district_code": 350583,
        "chinese_name": "南安市"
    },
    {
        "Id": 920,
        "DisName": "芗城区",
        "CityID": 109,
        "DisSort": null,
        "CityNameEnglish": "Xiangcheng",
        "district_code": 350602,
        "chinese_name": "芗城区"
    },
    {
        "Id": 921,
        "DisName": "龙文区",
        "CityID": 109,
        "DisSort": null,
        "CityNameEnglish": "Longwen",
        "district_code": 350603,
        "chinese_name": "龙文区"
    },
    {
        "Id": 922,
        "DisName": "云霄县",
        "CityID": 109,
        "DisSort": null,
        "CityNameEnglish": "Yunxiao",
        "district_code": 350622,
        "chinese_name": "云霄县"
    },
    {
        "Id": 923,
        "DisName": "漳浦县",
        "CityID": 109,
        "DisSort": null,
        "CityNameEnglish": "Zhangpu",
        "district_code": 350623,
        "chinese_name": "漳浦县"
    },
    {
        "Id": 924,
        "DisName": "诏安县",
        "CityID": 109,
        "DisSort": null,
        "CityNameEnglish": "Zhaoan",
        "district_code": 350624,
        "chinese_name": "诏安县"
    },
    {
        "Id": 925,
        "DisName": "长泰县",
        "CityID": 109,
        "DisSort": null,
        "CityNameEnglish": "Changtai",
        "district_code": 350625,
        "chinese_name": "长泰县"
    },
    {
        "Id": 926,
        "DisName": "东山县",
        "CityID": 109,
        "DisSort": null,
        "CityNameEnglish": "Dongshan",
        "district_code": 350626,
        "chinese_name": "东山县"
    },
    {
        "Id": 927,
        "DisName": "南靖县",
        "CityID": 109,
        "DisSort": null,
        "CityNameEnglish": "Nanjing",
        "district_code": 350627,
        "chinese_name": "南靖县"
    },
    {
        "Id": 928,
        "DisName": "平和县",
        "CityID": 109,
        "DisSort": null,
        "CityNameEnglish": "Pinghe",
        "district_code": 350628,
        "chinese_name": "平和县"
    },
    {
        "Id": 929,
        "DisName": "华安县",
        "CityID": 109,
        "DisSort": null,
        "CityNameEnglish": "Huaan",
        "district_code": 350629,
        "chinese_name": "华安县"
    },
    {
        "Id": 930,
        "DisName": "龙海市",
        "CityID": 109,
        "DisSort": null,
        "CityNameEnglish": "Longhai",
        "district_code": 350681,
        "chinese_name": "龙海市"
    },
    {
        "Id": 931,
        "DisName": "新罗区",
        "CityID": 110,
        "DisSort": null,
        "CityNameEnglish": "Xinluo",
        "district_code": 350802,
        "chinese_name": "新罗区"
    },
    {
        "Id": 932,
        "DisName": "长汀县",
        "CityID": 110,
        "DisSort": null,
        "CityNameEnglish": "Changting",
        "district_code": 350821,
        "chinese_name": "长汀县"
    },
    {
        "Id": 933,
        "DisName": "永定县",
        "CityID": 110,
        "DisSort": null,
        "CityNameEnglish": "Yongding",
        "district_code": 350822,
        "chinese_name": "永定县"
    },
    {
        "Id": 934,
        "DisName": "上杭县",
        "CityID": 110,
        "DisSort": null,
        "CityNameEnglish": "Shanghang",
        "district_code": 350823,
        "chinese_name": "上杭县"
    },
    {
        "Id": 935,
        "DisName": "武平县",
        "CityID": 110,
        "DisSort": null,
        "CityNameEnglish": "Wuping",
        "district_code": 350824,
        "chinese_name": "武平县"
    },
    {
        "Id": 936,
        "DisName": "连城县",
        "CityID": 110,
        "DisSort": null,
        "CityNameEnglish": "Liancheng",
        "district_code": 350825,
        "chinese_name": "连城县"
    },
    {
        "Id": 937,
        "DisName": "漳平市",
        "CityID": 110,
        "DisSort": null,
        "CityNameEnglish": "Zhangping",
        "district_code": 350881,
        "chinese_name": "漳平市"
    },
    {
        "Id": 938,
        "DisName": "梅列区",
        "CityID": 111,
        "DisSort": null,
        "CityNameEnglish": "Melie",
        "district_code": 350402,
        "chinese_name": "梅列区"
    },
    {
        "Id": 939,
        "DisName": "三元区",
        "CityID": 111,
        "DisSort": null,
        "CityNameEnglish": "Sanyuan",
        "district_code": 350403,
        "chinese_name": "三元区"
    },
    {
        "Id": 940,
        "DisName": "明溪县",
        "CityID": 111,
        "DisSort": null,
        "CityNameEnglish": "Mingxi",
        "district_code": 350421,
        "chinese_name": "明溪县"
    },
    {
        "Id": 941,
        "DisName": "清流县",
        "CityID": 111,
        "DisSort": null,
        "CityNameEnglish": "Qingliu",
        "district_code": 350423,
        "chinese_name": "清流县"
    },
    {
        "Id": 942,
        "DisName": "宁化县",
        "CityID": 111,
        "DisSort": null,
        "CityNameEnglish": "Ninghua",
        "district_code": 350424,
        "chinese_name": "宁化县"
    },
    {
        "Id": 943,
        "DisName": "大田县",
        "CityID": 111,
        "DisSort": null,
        "CityNameEnglish": "Datian",
        "district_code": 350425,
        "chinese_name": "大田县"
    },
    {
        "Id": 944,
        "DisName": "尤溪县",
        "CityID": 111,
        "DisSort": null,
        "CityNameEnglish": "Youxi",
        "district_code": 350426,
        "chinese_name": "尤溪县"
    },
    {
        "Id": 945,
        "DisName": "沙县",
        "CityID": 111,
        "DisSort": null,
        "CityNameEnglish": "Shaxian",
        "district_code": 350427,
        "chinese_name": "沙县"
    },
    {
        "Id": 946,
        "DisName": "将乐县",
        "CityID": 111,
        "DisSort": null,
        "CityNameEnglish": "Jiangle",
        "district_code": 350428,
        "chinese_name": "将乐县"
    },
    {
        "Id": 947,
        "DisName": "泰宁县",
        "CityID": 111,
        "DisSort": null,
        "CityNameEnglish": "Taining",
        "district_code": 350429,
        "chinese_name": "泰宁县"
    },
    {
        "Id": 948,
        "DisName": "建宁县",
        "CityID": 111,
        "DisSort": null,
        "CityNameEnglish": "Jianning",
        "district_code": 350430,
        "chinese_name": "建宁县"
    },
    {
        "Id": 949,
        "DisName": "永安市",
        "CityID": 111,
        "DisSort": null,
        "CityNameEnglish": "Yongan",
        "district_code": 350481,
        "chinese_name": "永安市"
    },
    {
        "Id": 950,
        "DisName": "延平区",
        "CityID": 112,
        "DisSort": null,
        "CityNameEnglish": "Yanping",
        "district_code": 350702,
        "chinese_name": "延平区"
    },
    {
        "Id": 951,
        "DisName": "顺昌县",
        "CityID": 112,
        "DisSort": null,
        "CityNameEnglish": "Shunchang",
        "district_code": 350721,
        "chinese_name": "顺昌县"
    },
    {
        "Id": 952,
        "DisName": "浦城县",
        "CityID": 112,
        "DisSort": null,
        "CityNameEnglish": "Pucheng",
        "district_code": 350722,
        "chinese_name": "浦城县"
    },
    {
        "Id": 953,
        "DisName": "光泽县",
        "CityID": 112,
        "DisSort": null,
        "CityNameEnglish": "Glossy",
        "district_code": 350723,
        "chinese_name": "光泽县"
    },
    {
        "Id": 954,
        "DisName": "松溪县",
        "CityID": 112,
        "DisSort": null,
        "CityNameEnglish": "Songxi",
        "district_code": 350724,
        "chinese_name": "松溪县"
    },
    {
        "Id": 955,
        "DisName": "政和县",
        "CityID": 112,
        "DisSort": null,
        "CityNameEnglish": "Zhenghe",
        "district_code": 350725,
        "chinese_name": "政和县"
    },
    {
        "Id": 956,
        "DisName": "邵武市",
        "CityID": 112,
        "DisSort": null,
        "CityNameEnglish": "Shaowu",
        "district_code": 350781,
        "chinese_name": "邵武市"
    },
    {
        "Id": 957,
        "DisName": "武夷山市",
        "CityID": 112,
        "DisSort": null,
        "CityNameEnglish": "Wuyishan",
        "district_code": 350782,
        "chinese_name": "武夷山市"
    },
    {
        "Id": 958,
        "DisName": "建瓯市",
        "CityID": 112,
        "DisSort": null,
        "CityNameEnglish": "Jianou",
        "district_code": 350783,
        "chinese_name": "建瓯市"
    },
    {
        "Id": 959,
        "DisName": "建阳市",
        "CityID": 112,
        "DisSort": null,
        "CityNameEnglish": "Jianyang",
        "district_code": 350784,
        "chinese_name": "建阳市"
    },
    {
        "Id": 965,
        "DisName": "东湖区",
        "CityID": 115,
        "DisSort": null,
        "CityNameEnglish": "Donghu",
        "district_code": 360102,
        "chinese_name": "东湖区"
    },
    {
        "Id": 966,
        "DisName": "西湖区",
        "CityID": 115,
        "DisSort": null,
        "CityNameEnglish": "Xihu",
        "district_code": 360103,
        "chinese_name": "西湖区"
    },
    {
        "Id": 967,
        "DisName": "青云谱区",
        "CityID": 115,
        "DisSort": null,
        "CityNameEnglish": "Qingyunpu",
        "district_code": 360104,
        "chinese_name": "青云谱区"
    },
    {
        "Id": 968,
        "DisName": "湾里区",
        "CityID": 115,
        "DisSort": null,
        "CityNameEnglish": "Wanli",
        "district_code": 360105,
        "chinese_name": "湾里区"
    },
    {
        "Id": 969,
        "DisName": "青山湖区",
        "CityID": 115,
        "DisSort": null,
        "CityNameEnglish": "Qingshanhu",
        "district_code": 360111,
        "chinese_name": "青山湖区"
    },
    {
        "Id": 970,
        "DisName": "南昌县",
        "CityID": 115,
        "DisSort": null,
        "CityNameEnglish": "Nanchang",
        "district_code": 360121,
        "chinese_name": "南昌县"
    },
    {
        "Id": 971,
        "DisName": "新建县",
        "CityID": 115,
        "DisSort": null,
        "CityNameEnglish": "Xinjian",
        "district_code": 360122,
        "chinese_name": "新建县"
    },
    {
        "Id": 972,
        "DisName": "安义县",
        "CityID": 115,
        "DisSort": null,
        "CityNameEnglish": "Anyi",
        "district_code": 360123,
        "chinese_name": "安义县"
    },
    {
        "Id": 973,
        "DisName": "进贤县",
        "CityID": 115,
        "DisSort": null,
        "CityNameEnglish": "Jinxian",
        "district_code": 360124,
        "chinese_name": "进贤县"
    },
    {
        "Id": 1059,
        "DisName": "牡丹区",
        "CityID": 124,
        "DisSort": null,
        "CityNameEnglish": "Mudan",
        "district_code": 371702,
        "chinese_name": "牡丹区"
    },
    {
        "Id": 1060,
        "DisName": "曹县",
        "CityID": 124,
        "DisSort": null,
        "CityNameEnglish": "Caoxian",
        "district_code": 371721,
        "chinese_name": "曹县"
    },
    {
        "Id": 1061,
        "DisName": "单县",
        "CityID": 124,
        "DisSort": null,
        "CityNameEnglish": "Shanxian",
        "district_code": 371722,
        "chinese_name": "单县"
    },
    {
        "Id": 1062,
        "DisName": "成武县",
        "CityID": 124,
        "DisSort": null,
        "CityNameEnglish": "Chengwu",
        "district_code": 371723,
        "chinese_name": "成武县"
    },
    {
        "Id": 1063,
        "DisName": "巨野县",
        "CityID": 124,
        "DisSort": null,
        "CityNameEnglish": "Juye",
        "district_code": 371724,
        "chinese_name": "巨野县"
    },
    {
        "Id": 1064,
        "DisName": "郓城县",
        "CityID": 124,
        "DisSort": null,
        "CityNameEnglish": "Yuncheng",
        "district_code": 371725,
        "chinese_name": "郓城县"
    },
    {
        "Id": 1065,
        "DisName": "鄄城县",
        "CityID": 124,
        "DisSort": null,
        "CityNameEnglish": "Juancheng",
        "district_code": 371726,
        "chinese_name": "鄄城县"
    },
    {
        "Id": 1066,
        "DisName": "定陶县",
        "CityID": 124,
        "DisSort": null,
        "CityNameEnglish": "Dingtao",
        "district_code": 371727,
        "chinese_name": "定陶县"
    },
    {
        "Id": 1067,
        "DisName": "东明县",
        "CityID": 124,
        "DisSort": null,
        "CityNameEnglish": "Dongming",
        "district_code": 371728,
        "chinese_name": "东明县"
    },
    {
        "Id": 1068,
        "DisName": "历下区",
        "CityID": 125,
        "DisSort": null,
        "CityNameEnglish": "Lixia",
        "district_code": 370102,
        "chinese_name": "历下区"
    },
    {
        "Id": 1069,
        "DisName": "市中区",
        "CityID": 125,
        "DisSort": null,
        "CityNameEnglish": "Shizhong",
        "district_code": 370103,
        "chinese_name": "市中区"
    },
    {
        "Id": 1070,
        "DisName": "槐荫区",
        "CityID": 125,
        "DisSort": null,
        "CityNameEnglish": "Huaiyin",
        "district_code": 370104,
        "chinese_name": "槐荫区"
    },
    {
        "Id": 1071,
        "DisName": "天桥区",
        "CityID": 125,
        "DisSort": null,
        "CityNameEnglish": "Tianqiao",
        "district_code": 370105,
        "chinese_name": "天桥区"
    },
    {
        "Id": 1072,
        "DisName": "历城区",
        "CityID": 125,
        "DisSort": null,
        "CityNameEnglish": "Licheng",
        "district_code": 370112,
        "chinese_name": "历城区"
    },
    {
        "Id": 1073,
        "DisName": "长清区",
        "CityID": 125,
        "DisSort": null,
        "CityNameEnglish": "Changqing",
        "district_code": 370113,
        "chinese_name": "长清区"
    },
    {
        "Id": 1074,
        "DisName": "平阴县",
        "CityID": 125,
        "DisSort": null,
        "CityNameEnglish": "Pingyin",
        "district_code": 370124,
        "chinese_name": "平阴县"
    },
    {
        "Id": 1075,
        "DisName": "济阳县",
        "CityID": 125,
        "DisSort": null,
        "CityNameEnglish": "Jiyang",
        "district_code": 370125,
        "chinese_name": "济阳县"
    },
    {
        "Id": 1076,
        "DisName": "商河县",
        "CityID": 125,
        "DisSort": null,
        "CityNameEnglish": "Shanghe",
        "district_code": 370126,
        "chinese_name": "商河县"
    },
    {
        "Id": 1077,
        "DisName": "章丘市",
        "CityID": 125,
        "DisSort": null,
        "CityNameEnglish": "Zhangqiu",
        "district_code": 370181,
        "chinese_name": "章丘市"
    },
    {
        "Id": 1078,
        "DisName": "市南区",
        "CityID": 126,
        "DisSort": null,
        "CityNameEnglish": "Shinan",
        "district_code": 370202,
        "chinese_name": "市南区"
    },
    {
        "Id": 1079,
        "DisName": "市北区",
        "CityID": 126,
        "DisSort": null,
        "CityNameEnglish": "Shibei",
        "district_code": 370203,
        "chinese_name": "市北区"
    },
    {
        "Id": 1080,
        "DisName": "四方区",
        "CityID": 126,
        "DisSort": null,
        "CityNameEnglish": "Shifang",
        "district_code": 370205,
        "chinese_name": "四方区"
    },
    {
        "Id": 1081,
        "DisName": "黄岛区",
        "CityID": 126,
        "DisSort": null,
        "CityNameEnglish": "Huangdao",
        "district_code": 370211,
        "chinese_name": "黄岛区"
    },
    {
        "Id": 1082,
        "DisName": "崂山区",
        "CityID": 126,
        "DisSort": null,
        "CityNameEnglish": "Laoshan",
        "district_code": 370212,
        "chinese_name": "崂山区"
    },
    {
        "Id": 1083,
        "DisName": "李沧区",
        "CityID": 126,
        "DisSort": null,
        "CityNameEnglish": "Licang",
        "district_code": 370213,
        "chinese_name": "李沧区"
    },
    {
        "Id": 1084,
        "DisName": "城阳区",
        "CityID": 126,
        "DisSort": null,
        "CityNameEnglish": "Chengyang",
        "district_code": 370214,
        "chinese_name": "城阳区"
    },
    {
        "Id": 1085,
        "DisName": "胶州市",
        "CityID": 126,
        "DisSort": null,
        "CityNameEnglish": "Jiaozhou",
        "district_code": 370281,
        "chinese_name": "胶州市"
    },
    {
        "Id": 1086,
        "DisName": "即墨市",
        "CityID": 126,
        "DisSort": null,
        "CityNameEnglish": "Jimo",
        "district_code": 370282,
        "chinese_name": "即墨市"
    },
    {
        "Id": 1087,
        "DisName": "平度市",
        "CityID": 126,
        "DisSort": null,
        "CityNameEnglish": "Pingdu",
        "district_code": 370283,
        "chinese_name": "平度市"
    },
    {
        "Id": 1088,
        "DisName": "胶南市",
        "CityID": 126,
        "DisSort": null,
        "CityNameEnglish": "Jiaonan",
        "district_code": 370284,
        "chinese_name": "胶南市"
    },
    {
        "Id": 1089,
        "DisName": "莱西市",
        "CityID": 126,
        "DisSort": null,
        "CityNameEnglish": "Laixi",
        "district_code": 370285,
        "chinese_name": "莱西市"
    },
    {
        "Id": 1090,
        "DisName": "淄川区",
        "CityID": 127,
        "DisSort": null,
        "CityNameEnglish": "Zichuan",
        "district_code": 370302,
        "chinese_name": "淄川区"
    },
    {
        "Id": 1091,
        "DisName": "张店区",
        "CityID": 127,
        "DisSort": null,
        "CityNameEnglish": "Zhangdian",
        "district_code": 370303,
        "chinese_name": "张店区"
    },
    {
        "Id": 1092,
        "DisName": "博山区",
        "CityID": 127,
        "DisSort": null,
        "CityNameEnglish": "Boshan",
        "district_code": 370304,
        "chinese_name": "博山区"
    },
    {
        "Id": 1093,
        "DisName": "临淄区",
        "CityID": 127,
        "DisSort": null,
        "CityNameEnglish": "Linzi",
        "district_code": 370305,
        "chinese_name": "临淄区"
    },
    {
        "Id": 1094,
        "DisName": "周村区",
        "CityID": 127,
        "DisSort": null,
        "CityNameEnglish": "Zhoucun",
        "district_code": 370306,
        "chinese_name": "周村区"
    },
    {
        "Id": 1095,
        "DisName": "桓台县",
        "CityID": 127,
        "DisSort": null,
        "CityNameEnglish": "Huantai",
        "district_code": 370321,
        "chinese_name": "桓台县"
    },
    {
        "Id": 1096,
        "DisName": "高青县",
        "CityID": 127,
        "DisSort": null,
        "CityNameEnglish": "Gaoqing",
        "district_code": 370322,
        "chinese_name": "高青县"
    },
    {
        "Id": 1097,
        "DisName": "沂源县",
        "CityID": 127,
        "DisSort": null,
        "CityNameEnglish": "Yiyuan",
        "district_code": 370323,
        "chinese_name": "沂源县"
    },
    {
        "Id": 1098,
        "DisName": "德城区",
        "CityID": 128,
        "DisSort": null,
        "CityNameEnglish": "Decheng",
        "district_code": 371402,
        "chinese_name": "德城区"
    },
    {
        "Id": 1099,
        "DisName": "陵县",
        "CityID": 128,
        "DisSort": null,
        "CityNameEnglish": "Lingxian",
        "district_code": 371421,
        "chinese_name": "陵县"
    },
    {
        "Id": 1100,
        "DisName": "宁津县",
        "CityID": 128,
        "DisSort": null,
        "CityNameEnglish": "Ningjin",
        "district_code": 371422,
        "chinese_name": "宁津县"
    },
    {
        "Id": 1101,
        "DisName": "庆云县",
        "CityID": 128,
        "DisSort": null,
        "CityNameEnglish": "Qingyun",
        "district_code": 371423,
        "chinese_name": "庆云县"
    },
    {
        "Id": 1102,
        "DisName": "临邑县",
        "CityID": 128,
        "DisSort": null,
        "CityNameEnglish": "Linyi",
        "district_code": 371424,
        "chinese_name": "临邑县"
    },
    {
        "Id": 1103,
        "DisName": "齐河县",
        "CityID": 128,
        "DisSort": null,
        "CityNameEnglish": "Qihe",
        "district_code": 371425,
        "chinese_name": "齐河县"
    },
    {
        "Id": 1104,
        "DisName": "平原县",
        "CityID": 128,
        "DisSort": null,
        "CityNameEnglish": "Pingyuan",
        "district_code": 371426,
        "chinese_name": "平原县"
    },
    {
        "Id": 1105,
        "DisName": "夏津县",
        "CityID": 128,
        "DisSort": null,
        "CityNameEnglish": "Xiajin",
        "district_code": 371427,
        "chinese_name": "夏津县"
    },
    {
        "Id": 1106,
        "DisName": "武城县",
        "CityID": 128,
        "DisSort": null,
        "CityNameEnglish": "Wucheng",
        "district_code": 371428,
        "chinese_name": "武城县"
    },
    {
        "Id": 1107,
        "DisName": "乐陵市",
        "CityID": 128,
        "DisSort": null,
        "CityNameEnglish": "Leling",
        "district_code": 371481,
        "chinese_name": "乐陵市"
    },
    {
        "Id": 1108,
        "DisName": "禹城市",
        "CityID": 128,
        "DisSort": null,
        "CityNameEnglish": "Yucheng",
        "district_code": 371482,
        "chinese_name": "禹城市"
    },
    {
        "Id": 1109,
        "DisName": "芝罘区",
        "CityID": 129,
        "DisSort": null,
        "CityNameEnglish": "Zhifu",
        "district_code": 370602,
        "chinese_name": "芝罘区"
    },
    {
        "Id": 1110,
        "DisName": "福山区",
        "CityID": 129,
        "DisSort": null,
        "CityNameEnglish": "Fushan",
        "district_code": 370611,
        "chinese_name": "福山区"
    },
    {
        "Id": 1111,
        "DisName": "牟平区",
        "CityID": 129,
        "DisSort": null,
        "CityNameEnglish": "Muping",
        "district_code": 370612,
        "chinese_name": "牟平区"
    },
    {
        "Id": 1112,
        "DisName": "莱山区",
        "CityID": 129,
        "DisSort": null,
        "CityNameEnglish": "Laishan",
        "district_code": 370613,
        "chinese_name": "莱山区"
    },
    {
        "Id": 1113,
        "DisName": "长岛县",
        "CityID": 129,
        "DisSort": null,
        "CityNameEnglish": "Changdao",
        "district_code": 370634,
        "chinese_name": "长岛县"
    },
    {
        "Id": 1114,
        "DisName": "龙口市",
        "CityID": 129,
        "DisSort": null,
        "CityNameEnglish": "Longkou",
        "district_code": 370681,
        "chinese_name": "龙口市"
    },
    {
        "Id": 1115,
        "DisName": "莱阳市",
        "CityID": 129,
        "DisSort": null,
        "CityNameEnglish": "Laiyang",
        "district_code": 370682,
        "chinese_name": "莱阳市"
    },
    {
        "Id": 1116,
        "DisName": "莱州市",
        "CityID": 129,
        "DisSort": null,
        "CityNameEnglish": "Laizhou",
        "district_code": 370683,
        "chinese_name": "莱州市"
    },
    {
        "Id": 1117,
        "DisName": "蓬莱市",
        "CityID": 129,
        "DisSort": null,
        "CityNameEnglish": "Penglai",
        "district_code": 370684,
        "chinese_name": "蓬莱市"
    },
    {
        "Id": 1118,
        "DisName": "招远市",
        "CityID": 129,
        "DisSort": null,
        "CityNameEnglish": "Zhaoyuan",
        "district_code": 370685,
        "chinese_name": "招远市"
    },
    {
        "Id": 1119,
        "DisName": "栖霞市",
        "CityID": 129,
        "DisSort": null,
        "CityNameEnglish": "Qixia",
        "district_code": 370686,
        "chinese_name": "栖霞市"
    },
    {
        "Id": 1120,
        "DisName": "海阳市",
        "CityID": 129,
        "DisSort": null,
        "CityNameEnglish": "Haiyang",
        "district_code": 370687,
        "chinese_name": "海阳市"
    },
    {
        "Id": 1121,
        "DisName": "潍城区",
        "CityID": 130,
        "DisSort": null,
        "CityNameEnglish": "Weicheng",
        "district_code": 370702,
        "chinese_name": "潍城区"
    },
    {
        "Id": 1122,
        "DisName": "寒亭区",
        "CityID": 130,
        "DisSort": null,
        "CityNameEnglish": "Hanting",
        "district_code": 370703,
        "chinese_name": "寒亭区"
    },
    {
        "Id": 1123,
        "DisName": "坊子区",
        "CityID": 130,
        "DisSort": null,
        "CityNameEnglish": "Fangzi",
        "district_code": 370704,
        "chinese_name": "坊子区"
    },
    {
        "Id": 1124,
        "DisName": "奎文区",
        "CityID": 130,
        "DisSort": null,
        "CityNameEnglish": "Kuiwei",
        "district_code": 370705,
        "chinese_name": "奎文区"
    },
    {
        "Id": 1125,
        "DisName": "临朐县",
        "CityID": 130,
        "DisSort": null,
        "CityNameEnglish": "Linqu",
        "district_code": 370724,
        "chinese_name": "临朐县"
    },
    {
        "Id": 1126,
        "DisName": "昌乐县",
        "CityID": 130,
        "DisSort": null,
        "CityNameEnglish": "Changle",
        "district_code": 370725,
        "chinese_name": "昌乐县"
    },
    {
        "Id": 1127,
        "DisName": "青州市",
        "CityID": 130,
        "DisSort": null,
        "CityNameEnglish": "Qingzhou",
        "district_code": 370781,
        "chinese_name": "青州市"
    },
    {
        "Id": 1128,
        "DisName": "诸城市",
        "CityID": 130,
        "DisSort": null,
        "CityNameEnglish": "Zhucheng",
        "district_code": 370782,
        "chinese_name": "诸城市"
    },
    {
        "Id": 1129,
        "DisName": "寿光市",
        "CityID": 130,
        "DisSort": null,
        "CityNameEnglish": "Shouguang",
        "district_code": 370783,
        "chinese_name": "寿光市"
    },
    {
        "Id": 1130,
        "DisName": "安丘市",
        "CityID": 130,
        "DisSort": null,
        "CityNameEnglish": "Anqiu",
        "district_code": 370784,
        "chinese_name": "安丘市"
    },
    {
        "Id": 1131,
        "DisName": "高密市",
        "CityID": 130,
        "DisSort": null,
        "CityNameEnglish": "Gaomi",
        "district_code": 370785,
        "chinese_name": "高密市"
    },
    {
        "Id": 1132,
        "DisName": "昌邑市",
        "CityID": 130,
        "DisSort": null,
        "CityNameEnglish": "Changyi",
        "district_code": 370786,
        "chinese_name": "昌邑市"
    },
    {
        "Id": 1133,
        "DisName": "市中区",
        "CityID": 131,
        "DisSort": null,
        "CityNameEnglish": "Shizhong",
        "district_code": 370802,
        "chinese_name": "市中区"
    },
    {
        "Id": 1134,
        "DisName": "任城区",
        "CityID": 131,
        "DisSort": null,
        "CityNameEnglish": "Rencheng",
        "district_code": 370811,
        "chinese_name": "任城区"
    },
    {
        "Id": 1135,
        "DisName": "微山县",
        "CityID": 131,
        "DisSort": null,
        "CityNameEnglish": "Weishan",
        "district_code": 370826,
        "chinese_name": "微山县"
    },
    {
        "Id": 1136,
        "DisName": "鱼台县",
        "CityID": 131,
        "DisSort": null,
        "CityNameEnglish": "Yutai",
        "district_code": 370827,
        "chinese_name": "鱼台县"
    },
    {
        "Id": 1137,
        "DisName": "金乡县",
        "CityID": 131,
        "DisSort": null,
        "CityNameEnglish": "Jinxiang",
        "district_code": 370828,
        "chinese_name": "金乡县"
    },
    {
        "Id": 1138,
        "DisName": "嘉祥县",
        "CityID": 131,
        "DisSort": null,
        "CityNameEnglish": "Jiaxiang",
        "district_code": 370829,
        "chinese_name": "嘉祥县"
    },
    {
        "Id": 1139,
        "DisName": "汶上县",
        "CityID": 131,
        "DisSort": null,
        "CityNameEnglish": "Wenshang",
        "district_code": 370830,
        "chinese_name": "汶上县"
    },
    {
        "Id": 1140,
        "DisName": "泗水县",
        "CityID": 131,
        "DisSort": null,
        "CityNameEnglish": "Sishui",
        "district_code": 370831,
        "chinese_name": "泗水县"
    },
    {
        "Id": 1141,
        "DisName": "梁山县",
        "CityID": 131,
        "DisSort": null,
        "CityNameEnglish": "Liangshan",
        "district_code": 370832,
        "chinese_name": "梁山县"
    },
    {
        "Id": 1142,
        "DisName": "曲阜市",
        "CityID": 131,
        "DisSort": null,
        "CityNameEnglish": "Qufu",
        "district_code": 370881,
        "chinese_name": "曲阜市"
    },
    {
        "Id": 1143,
        "DisName": "兖州市",
        "CityID": 131,
        "DisSort": null,
        "CityNameEnglish": "Yanzhou",
        "district_code": 370882,
        "chinese_name": "兖州市"
    },
    {
        "Id": 1144,
        "DisName": "邹城市",
        "CityID": 131,
        "DisSort": null,
        "CityNameEnglish": "Zoucheng",
        "district_code": 370883,
        "chinese_name": "邹城市"
    },
    {
        "Id": 1145,
        "DisName": "泰山区",
        "CityID": 132,
        "DisSort": null,
        "CityNameEnglish": "Taishan",
        "district_code": 370902,
        "chinese_name": "泰山区"
    },
    {
        "Id": 1146,
        "DisName": "岱岳区",
        "CityID": 132,
        "DisSort": null,
        "CityNameEnglish": "Daiyue",
        "district_code": 370903,
        "chinese_name": "岱岳区"
    },
    {
        "Id": 1147,
        "DisName": "宁阳县",
        "CityID": 132,
        "DisSort": null,
        "CityNameEnglish": "Ningyang",
        "district_code": 370921,
        "chinese_name": "宁阳县"
    },
    {
        "Id": 1148,
        "DisName": "东平县",
        "CityID": 132,
        "DisSort": null,
        "CityNameEnglish": "Dongping",
        "district_code": 370923,
        "chinese_name": "东平县"
    },
    {
        "Id": 1149,
        "DisName": "新泰市",
        "CityID": 132,
        "DisSort": null,
        "CityNameEnglish": "Xintai",
        "district_code": 370982,
        "chinese_name": "新泰市"
    },
    {
        "Id": 1150,
        "DisName": "肥城市",
        "CityID": 132,
        "DisSort": null,
        "CityNameEnglish": "Feicheng",
        "district_code": 370983,
        "chinese_name": "肥城市"
    },
    {
        "Id": 1151,
        "DisName": "兰山区",
        "CityID": 133,
        "DisSort": null,
        "CityNameEnglish": "Lanshan",
        "district_code": 371302,
        "chinese_name": "兰山区"
    },
    {
        "Id": 1152,
        "DisName": "罗庄区",
        "CityID": 133,
        "DisSort": null,
        "CityNameEnglish": "Luozhuang",
        "district_code": 371311,
        "chinese_name": "罗庄区"
    },
    {
        "Id": 1153,
        "DisName": "河东区",
        "CityID": 133,
        "DisSort": null,
        "CityNameEnglish": "Hedong",
        "district_code": 371312,
        "chinese_name": "河东区"
    },
    {
        "Id": 1154,
        "DisName": "沂南县",
        "CityID": 133,
        "DisSort": null,
        "CityNameEnglish": "Yinan",
        "district_code": 371321,
        "chinese_name": "沂南县"
    },
    {
        "Id": 1155,
        "DisName": "郯城县",
        "CityID": 133,
        "DisSort": null,
        "CityNameEnglish": "Tancheng",
        "district_code": 371322,
        "chinese_name": "郯城县"
    },
    {
        "Id": 1156,
        "DisName": "沂水县",
        "CityID": 133,
        "DisSort": null,
        "CityNameEnglish": "Yishui",
        "district_code": 371323,
        "chinese_name": "沂水县"
    },
    {
        "Id": 1157,
        "DisName": "苍山县",
        "CityID": 133,
        "DisSort": null,
        "CityNameEnglish": "Cangshan",
        "district_code": 371324,
        "chinese_name": "苍山县"
    },
    {
        "Id": 1158,
        "DisName": "费县",
        "CityID": 133,
        "DisSort": null,
        "CityNameEnglish": "Feixian",
        "district_code": 371325,
        "chinese_name": "费县"
    },
    {
        "Id": 1159,
        "DisName": "平邑县",
        "CityID": 133,
        "DisSort": null,
        "CityNameEnglish": "Pingyi",
        "district_code": 371326,
        "chinese_name": "平邑县"
    },
    {
        "Id": 1160,
        "DisName": "莒南县",
        "CityID": 133,
        "DisSort": null,
        "CityNameEnglish": "Junan",
        "district_code": 371327,
        "chinese_name": "莒南县"
    },
    {
        "Id": 1161,
        "DisName": "蒙阴县",
        "CityID": 133,
        "DisSort": null,
        "CityNameEnglish": "Mengyin",
        "district_code": 371328,
        "chinese_name": "蒙阴县"
    },
    {
        "Id": 1162,
        "DisName": "临沭县",
        "CityID": 133,
        "DisSort": null,
        "CityNameEnglish": "Linshu",
        "district_code": 371329,
        "chinese_name": "临沭县"
    },
    {
        "Id": 1163,
        "DisName": "滨城区",
        "CityID": 134,
        "DisSort": null,
        "CityNameEnglish": "Waterfront",
        "district_code": 371602,
        "chinese_name": "滨城区"
    },
    {
        "Id": 1164,
        "DisName": "惠民县",
        "CityID": 134,
        "DisSort": null,
        "CityNameEnglish": "Huimin",
        "district_code": 371621,
        "chinese_name": "惠民县"
    },
    {
        "Id": 1165,
        "DisName": "阳信县",
        "CityID": 134,
        "DisSort": null,
        "CityNameEnglish": "Yangxin",
        "district_code": 371622,
        "chinese_name": "阳信县"
    },
    {
        "Id": 1166,
        "DisName": "无棣县",
        "CityID": 134,
        "DisSort": null,
        "CityNameEnglish": "Wudi",
        "district_code": 371623,
        "chinese_name": "无棣县"
    },
    {
        "Id": 1167,
        "DisName": "沾化县",
        "CityID": 134,
        "DisSort": null,
        "CityNameEnglish": "Zhanhua",
        "district_code": 371624,
        "chinese_name": "沾化县"
    },
    {
        "Id": 1168,
        "DisName": "博兴县",
        "CityID": 134,
        "DisSort": null,
        "CityNameEnglish": "Boxing",
        "district_code": 371625,
        "chinese_name": "博兴县"
    },
    {
        "Id": 1169,
        "DisName": "邹平县",
        "CityID": 134,
        "DisSort": null,
        "CityNameEnglish": "Zouping",
        "district_code": 371626,
        "chinese_name": "邹平县"
    },
    {
        "Id": 1170,
        "DisName": "东营区",
        "CityID": 135,
        "DisSort": null,
        "CityNameEnglish": "Dongying",
        "district_code": 370502,
        "chinese_name": "东营区"
    },
    {
        "Id": 1171,
        "DisName": "河口区",
        "CityID": 135,
        "DisSort": null,
        "CityNameEnglish": "Hekou",
        "district_code": 370503,
        "chinese_name": "河口区"
    },
    {
        "Id": 1172,
        "DisName": "垦利县",
        "CityID": 135,
        "DisSort": null,
        "CityNameEnglish": "Kenli",
        "district_code": 370521,
        "chinese_name": "垦利县"
    },
    {
        "Id": 1173,
        "DisName": "利津县",
        "CityID": 135,
        "DisSort": null,
        "CityNameEnglish": "Lijin",
        "district_code": 370522,
        "chinese_name": "利津县"
    },
    {
        "Id": 1174,
        "DisName": "广饶县",
        "CityID": 135,
        "DisSort": null,
        "CityNameEnglish": "Guangrao",
        "district_code": 370523,
        "chinese_name": "广饶县"
    },
    {
        "Id": 1175,
        "DisName": "环翠区",
        "CityID": 136,
        "DisSort": null,
        "CityNameEnglish": "Huancui",
        "district_code": 371002,
        "chinese_name": "环翠区"
    },
    {
        "Id": 1176,
        "DisName": "文登市",
        "CityID": 136,
        "DisSort": null,
        "CityNameEnglish": "Wendeng",
        "district_code": 371081,
        "chinese_name": "文登市"
    },
    {
        "Id": 1177,
        "DisName": "荣成市",
        "CityID": 136,
        "DisSort": null,
        "CityNameEnglish": "Rongcheng",
        "district_code": 371082,
        "chinese_name": "荣成市"
    },
    {
        "Id": 1178,
        "DisName": "乳山市",
        "CityID": 136,
        "DisSort": null,
        "CityNameEnglish": "Rushan",
        "district_code": 371083,
        "chinese_name": "乳山市"
    },
    {
        "Id": 1179,
        "DisName": "市中区",
        "CityID": 137,
        "DisSort": null,
        "CityNameEnglish": "Shizhong",
        "district_code": 370402,
        "chinese_name": "市中区"
    },
    {
        "Id": 1180,
        "DisName": "薛城区",
        "CityID": 137,
        "DisSort": null,
        "CityNameEnglish": "Xuecheng",
        "district_code": 370403,
        "chinese_name": "薛城区"
    },
    {
        "Id": 1181,
        "DisName": "峄城区",
        "CityID": 137,
        "DisSort": null,
        "CityNameEnglish": "Yicheng",
        "district_code": 370404,
        "chinese_name": "峄城区"
    },
    {
        "Id": 1182,
        "DisName": "台儿庄区",
        "CityID": 137,
        "DisSort": null,
        "CityNameEnglish": "Taierzhuang",
        "district_code": 370405,
        "chinese_name": "台儿庄区"
    },
    {
        "Id": 1183,
        "DisName": "山亭区",
        "CityID": 137,
        "DisSort": null,
        "CityNameEnglish": "Shanting",
        "district_code": 370406,
        "chinese_name": "山亭区"
    },
    {
        "Id": 1184,
        "DisName": "滕州市",
        "CityID": 137,
        "DisSort": null,
        "CityNameEnglish": "Tengzhou",
        "district_code": 370481,
        "chinese_name": "滕州市"
    },
    {
        "Id": 1185,
        "DisName": "东港区",
        "CityID": 138,
        "DisSort": null,
        "CityNameEnglish": "Donggang",
        "district_code": 371102,
        "chinese_name": "东港区"
    },
    {
        "Id": 1186,
        "DisName": "岚山区",
        "CityID": 138,
        "DisSort": null,
        "CityNameEnglish": "Lanshan",
        "district_code": 371103,
        "chinese_name": "岚山区"
    },
    {
        "Id": 1187,
        "DisName": "五莲县",
        "CityID": 138,
        "DisSort": null,
        "CityNameEnglish": "Wulian",
        "district_code": 371121,
        "chinese_name": "五莲县"
    },
    {
        "Id": 1188,
        "DisName": "莒县",
        "CityID": 138,
        "DisSort": null,
        "CityNameEnglish": "Juxian",
        "district_code": 371122,
        "chinese_name": "莒县"
    },
    {
        "Id": 1189,
        "DisName": "莱城区",
        "CityID": 139,
        "DisSort": null,
        "CityNameEnglish": "Laicheng",
        "district_code": 371202,
        "chinese_name": "莱城区"
    },
    {
        "Id": 1190,
        "DisName": "钢城区",
        "CityID": 139,
        "DisSort": null,
        "CityNameEnglish": "Gancheng",
        "district_code": 371203,
        "chinese_name": "钢城区"
    },
    {
        "Id": 1191,
        "DisName": "东昌府区",
        "CityID": 140,
        "DisSort": null,
        "CityNameEnglish": "Dongchangfu",
        "district_code": 371502,
        "chinese_name": "东昌府区"
    },
    {
        "Id": 1192,
        "DisName": "阳谷县",
        "CityID": 140,
        "DisSort": null,
        "CityNameEnglish": "Yanggu",
        "district_code": 371521,
        "chinese_name": "阳谷县"
    },
    {
        "Id": 1193,
        "DisName": "莘县",
        "CityID": 140,
        "DisSort": null,
        "CityNameEnglish": "Shenxian",
        "district_code": 371522,
        "chinese_name": "莘县"
    },
    {
        "Id": 1194,
        "DisName": "茌平县",
        "CityID": 140,
        "DisSort": null,
        "CityNameEnglish": "Chiping",
        "district_code": 371523,
        "chinese_name": "茌平县"
    },
    {
        "Id": 1195,
        "DisName": "东阿县",
        "CityID": 140,
        "DisSort": null,
        "CityNameEnglish": "Dong'e",
        "district_code": 371524,
        "chinese_name": "东阿县"
    },
    {
        "Id": 1196,
        "DisName": "冠县",
        "CityID": 140,
        "DisSort": null,
        "CityNameEnglish": "Guanxian",
        "district_code": 371525,
        "chinese_name": "冠县"
    },
    {
        "Id": 1197,
        "DisName": "高唐县",
        "CityID": 140,
        "DisSort": null,
        "CityNameEnglish": "Gaotang",
        "district_code": 371526,
        "chinese_name": "高唐县"
    },
    {
        "Id": 1198,
        "DisName": "临清市",
        "CityID": 140,
        "DisSort": null,
        "CityNameEnglish": "Linqing",
        "district_code": 371581,
        "chinese_name": "临清市"
    },
    {
        "Id": 1199,
        "DisName": "梁园区",
        "CityID": 141,
        "DisSort": null,
        "CityNameEnglish": "Liangyuan",
        "district_code": 411402,
        "chinese_name": "梁园区"
    },
    {
        "Id": 1200,
        "DisName": "睢阳区",
        "CityID": 141,
        "DisSort": null,
        "CityNameEnglish": "Suiyang",
        "district_code": 411403,
        "chinese_name": "睢阳区"
    },
    {
        "Id": 1201,
        "DisName": "民权县",
        "CityID": 141,
        "DisSort": null,
        "CityNameEnglish": "Minquan",
        "district_code": 411421,
        "chinese_name": "民权县"
    },
    {
        "Id": 1202,
        "DisName": "睢县",
        "CityID": 141,
        "DisSort": null,
        "CityNameEnglish": "Suixian",
        "district_code": 411422,
        "chinese_name": "睢县"
    },
    {
        "Id": 1203,
        "DisName": "宁陵县",
        "CityID": 141,
        "DisSort": null,
        "CityNameEnglish": "Ningling",
        "district_code": 411423,
        "chinese_name": "宁陵县"
    },
    {
        "Id": 1204,
        "DisName": "柘城县",
        "CityID": 141,
        "DisSort": null,
        "CityNameEnglish": "Zhecheng",
        "district_code": 411424,
        "chinese_name": "柘城县"
    },
    {
        "Id": 1205,
        "DisName": "虞城县",
        "CityID": 141,
        "DisSort": null,
        "CityNameEnglish": "Yucheng",
        "district_code": 411425,
        "chinese_name": "虞城县"
    },
    {
        "Id": 1206,
        "DisName": "夏邑县",
        "CityID": 141,
        "DisSort": null,
        "CityNameEnglish": "Xiayi",
        "district_code": 411426,
        "chinese_name": "夏邑县"
    },
    {
        "Id": 1207,
        "DisName": "永城市",
        "CityID": 141,
        "DisSort": null,
        "CityNameEnglish": "Yongcheng",
        "district_code": 411481,
        "chinese_name": "永城市"
    },
    {
        "Id": 1208,
        "DisName": "中原区",
        "CityID": 142,
        "DisSort": null,
        "CityNameEnglish": "Zhongyuan",
        "district_code": 410102,
        "chinese_name": "中原区"
    },
    {
        "Id": 1209,
        "DisName": "二七区",
        "CityID": 142,
        "DisSort": null,
        "CityNameEnglish": "Erqi",
        "district_code": 410103,
        "chinese_name": "二七区"
    },
    {
        "Id": 1210,
        "DisName": "管城回族区",
        "CityID": 142,
        "DisSort": null,
        "CityNameEnglish": "Guancheng",
        "district_code": 410104,
        "chinese_name": "管城回族区"
    },
    {
        "Id": 1211,
        "DisName": "金水区",
        "CityID": 142,
        "DisSort": null,
        "CityNameEnglish": "Jinshui",
        "district_code": 410105,
        "chinese_name": "金水区"
    },
    {
        "Id": 1212,
        "DisName": "上街区",
        "CityID": 142,
        "DisSort": null,
        "CityNameEnglish": "Shangjie",
        "district_code": 410106,
        "chinese_name": "上街区"
    },
    {
        "Id": 1213,
        "DisName": "惠济区",
        "CityID": 142,
        "DisSort": null,
        "CityNameEnglish": "Huiji",
        "district_code": 410151,
        "chinese_name": "惠济区"
    },
    {
        "Id": 1214,
        "DisName": "中牟县",
        "CityID": 142,
        "DisSort": null,
        "CityNameEnglish": "Zhongmu",
        "district_code": 410122,
        "chinese_name": "中牟县"
    },
    {
        "Id": 1215,
        "DisName": "巩义市",
        "CityID": 142,
        "DisSort": null,
        "CityNameEnglish": "Gongyi",
        "district_code": 410181,
        "chinese_name": "巩义市"
    },
    {
        "Id": 1216,
        "DisName": "荥阳市",
        "CityID": 142,
        "DisSort": null,
        "CityNameEnglish": "Xingyang",
        "district_code": 410182,
        "chinese_name": "荥阳市"
    },
    {
        "Id": 1217,
        "DisName": "新密市",
        "CityID": 142,
        "DisSort": null,
        "CityNameEnglish": "Xinmi",
        "district_code": 410183,
        "chinese_name": "新密市"
    },
    {
        "Id": 1218,
        "DisName": "新郑市",
        "CityID": 142,
        "DisSort": null,
        "CityNameEnglish": "Xinzheng",
        "district_code": 410184,
        "chinese_name": "新郑市"
    },
    {
        "Id": 1219,
        "DisName": "登封市",
        "CityID": 142,
        "DisSort": null,
        "CityNameEnglish": "Dengfeng",
        "district_code": 410185,
        "chinese_name": "登封市"
    },
    {
        "Id": 1220,
        "DisName": "文峰区",
        "CityID": 143,
        "DisSort": null,
        "CityNameEnglish": "Wenfeng",
        "district_code": 410502,
        "chinese_name": "文峰区"
    },
    {
        "Id": 1221,
        "DisName": "北关区",
        "CityID": 143,
        "DisSort": null,
        "CityNameEnglish": "Beiguan",
        "district_code": 410503,
        "chinese_name": "北关区"
    },
    {
        "Id": 1222,
        "DisName": "殷都区",
        "CityID": 143,
        "DisSort": null,
        "CityNameEnglish": "Yindu",
        "district_code": 410505,
        "chinese_name": "殷都区"
    },
    {
        "Id": 1223,
        "DisName": "龙安区",
        "CityID": 143,
        "DisSort": null,
        "CityNameEnglish": "Long'an",
        "district_code": 410506,
        "chinese_name": "龙安区"
    },
    {
        "Id": 1224,
        "DisName": "安阳县",
        "CityID": 143,
        "DisSort": null,
        "CityNameEnglish": "Anyang",
        "district_code": 410522,
        "chinese_name": "安阳县"
    },
    {
        "Id": 1225,
        "DisName": "汤阴县",
        "CityID": 143,
        "DisSort": null,
        "CityNameEnglish": "Tangyin",
        "district_code": 410523,
        "chinese_name": "汤阴县"
    },
    {
        "Id": 1226,
        "DisName": "滑县",
        "CityID": 143,
        "DisSort": null,
        "CityNameEnglish": "Huaxian",
        "district_code": 410526,
        "chinese_name": "滑县"
    },
    {
        "Id": 1227,
        "DisName": "内黄县",
        "CityID": 143,
        "DisSort": null,
        "CityNameEnglish": "Neihuang",
        "district_code": 410527,
        "chinese_name": "内黄县"
    },
    {
        "Id": 1228,
        "DisName": "林州市",
        "CityID": 143,
        "DisSort": null,
        "CityNameEnglish": "Linzhou",
        "district_code": 410581,
        "chinese_name": "林州市"
    },
    {
        "Id": 1229,
        "DisName": "红旗区",
        "CityID": 144,
        "DisSort": null,
        "CityNameEnglish": "Hongqi",
        "district_code": 410702,
        "chinese_name": "红旗区"
    },
    {
        "Id": 1230,
        "DisName": "卫滨区",
        "CityID": 144,
        "DisSort": null,
        "CityNameEnglish": "Weibin",
        "district_code": 410703,
        "chinese_name": "卫滨区"
    },
    {
        "Id": 1231,
        "DisName": "凤泉区",
        "CityID": 144,
        "DisSort": null,
        "CityNameEnglish": "Fengquan",
        "district_code": 410704,
        "chinese_name": "凤泉区"
    },
    {
        "Id": 1232,
        "DisName": "牧野区",
        "CityID": 144,
        "DisSort": null,
        "CityNameEnglish": "Muye",
        "district_code": 410711,
        "chinese_name": "牧野区"
    },
    {
        "Id": 1233,
        "DisName": "新乡县",
        "CityID": 144,
        "DisSort": null,
        "CityNameEnglish": "Xinxiang",
        "district_code": 410721,
        "chinese_name": "新乡县"
    },
    {
        "Id": 1234,
        "DisName": "获嘉县",
        "CityID": 144,
        "DisSort": null,
        "CityNameEnglish": "Huojia",
        "district_code": 410724,
        "chinese_name": "获嘉县"
    },
    {
        "Id": 1235,
        "DisName": "原阳县",
        "CityID": 144,
        "DisSort": null,
        "CityNameEnglish": "Yuanyang",
        "district_code": 410725,
        "chinese_name": "原阳县"
    },
    {
        "Id": 1236,
        "DisName": "延津县",
        "CityID": 144,
        "DisSort": null,
        "CityNameEnglish": "Yanjin",
        "district_code": 410726,
        "chinese_name": "延津县"
    },
    {
        "Id": 1237,
        "DisName": "封丘县",
        "CityID": 144,
        "DisSort": null,
        "CityNameEnglish": "Fengqiu",
        "district_code": 410727,
        "chinese_name": "封丘县"
    },
    {
        "Id": 1238,
        "DisName": "长垣县",
        "CityID": 144,
        "DisSort": null,
        "CityNameEnglish": "Changyuan",
        "district_code": 410728,
        "chinese_name": "长垣县"
    },
    {
        "Id": 1239,
        "DisName": "卫辉市",
        "CityID": 144,
        "DisSort": null,
        "CityNameEnglish": "Weihui",
        "district_code": 410781,
        "chinese_name": "卫辉市"
    },
    {
        "Id": 1240,
        "DisName": "辉县市",
        "CityID": 144,
        "DisSort": null,
        "CityNameEnglish": "Huixian",
        "district_code": 410782,
        "chinese_name": "辉县市"
    },
    {
        "Id": 1241,
        "DisName": "魏都区",
        "CityID": 145,
        "DisSort": null,
        "CityNameEnglish": "Weidu",
        "district_code": 411002,
        "chinese_name": "魏都区"
    },
    {
        "Id": 1242,
        "DisName": "许昌县",
        "CityID": 145,
        "DisSort": null,
        "CityNameEnglish": "Xuchang",
        "district_code": 411023,
        "chinese_name": "许昌县"
    },
    {
        "Id": 1243,
        "DisName": "鄢陵县",
        "CityID": 145,
        "DisSort": null,
        "CityNameEnglish": "Yanling",
        "district_code": 411024,
        "chinese_name": "鄢陵县"
    },
    {
        "Id": 1244,
        "DisName": "襄城县",
        "CityID": 145,
        "DisSort": null,
        "CityNameEnglish": "Xiangcheng",
        "district_code": 411025,
        "chinese_name": "襄城县"
    },
    {
        "Id": 1245,
        "DisName": "禹州市",
        "CityID": 145,
        "DisSort": null,
        "CityNameEnglish": "Yuzhou",
        "district_code": 411081,
        "chinese_name": "禹州市"
    },
    {
        "Id": 1246,
        "DisName": "长葛市",
        "CityID": 145,
        "DisSort": null,
        "CityNameEnglish": "Changge",
        "district_code": 411082,
        "chinese_name": "长葛市"
    },
    {
        "Id": 1247,
        "DisName": "新华区",
        "CityID": 146,
        "DisSort": null,
        "CityNameEnglish": "Xinhua",
        "district_code": 410402,
        "chinese_name": "新华区"
    },
    {
        "Id": 1248,
        "DisName": "卫东区",
        "CityID": 146,
        "DisSort": null,
        "CityNameEnglish": "Weidong",
        "district_code": 410403,
        "chinese_name": "卫东区"
    },
    {
        "Id": 1249,
        "DisName": "石龙区",
        "CityID": 146,
        "DisSort": null,
        "CityNameEnglish": "Shilong",
        "district_code": 410404,
        "chinese_name": "石龙区"
    },
    {
        "Id": 1250,
        "DisName": "湛河区",
        "CityID": 146,
        "DisSort": null,
        "CityNameEnglish": "Zhanhe",
        "district_code": 410411,
        "chinese_name": "湛河区"
    },
    {
        "Id": 1251,
        "DisName": "宝丰县",
        "CityID": 146,
        "DisSort": null,
        "CityNameEnglish": "Baofeng",
        "district_code": 410421,
        "chinese_name": "宝丰县"
    },
    {
        "Id": 1252,
        "DisName": "叶县",
        "CityID": 146,
        "DisSort": null,
        "CityNameEnglish": "Yexian",
        "district_code": 410422,
        "chinese_name": "叶县"
    },
    {
        "Id": 1253,
        "DisName": "鲁山县",
        "CityID": 146,
        "DisSort": null,
        "CityNameEnglish": "Lushan",
        "district_code": 410423,
        "chinese_name": "鲁山县"
    },
    {
        "Id": 1254,
        "DisName": "郏县",
        "CityID": 146,
        "DisSort": null,
        "CityNameEnglish": "Jiaxian",
        "district_code": 410425,
        "chinese_name": "郏县"
    },
    {
        "Id": 1255,
        "DisName": "舞钢市",
        "CityID": 146,
        "DisSort": null,
        "CityNameEnglish": "Wugang",
        "district_code": 410481,
        "chinese_name": "舞钢市"
    },
    {
        "Id": 1256,
        "DisName": "汝州市",
        "CityID": 146,
        "DisSort": null,
        "CityNameEnglish": "Ruzhou",
        "district_code": 410482,
        "chinese_name": "汝州市"
    },
    {
        "Id": 1257,
        "DisName": "浉河区",
        "CityID": 147,
        "DisSort": null,
        "CityNameEnglish": "Shihe",
        "district_code": 411502,
        "chinese_name": "浉河区"
    },
    {
        "Id": 1258,
        "DisName": "平桥区",
        "CityID": 147,
        "DisSort": null,
        "CityNameEnglish": "Pingqiao",
        "district_code": 411503,
        "chinese_name": "平桥区"
    },
    {
        "Id": 1259,
        "DisName": "罗山县",
        "CityID": 147,
        "DisSort": null,
        "CityNameEnglish": "Luoshan",
        "district_code": 411521,
        "chinese_name": "罗山县"
    },
    {
        "Id": 1260,
        "DisName": "光山县",
        "CityID": 147,
        "DisSort": null,
        "CityNameEnglish": "Guangshan",
        "district_code": 411522,
        "chinese_name": "光山县"
    },
    {
        "Id": 1261,
        "DisName": "新县",
        "CityID": 147,
        "DisSort": null,
        "CityNameEnglish": "Xinxian",
        "district_code": 411523,
        "chinese_name": "新县"
    },
    {
        "Id": 1262,
        "DisName": "商城县",
        "CityID": 147,
        "DisSort": null,
        "CityNameEnglish": "Shangcheng",
        "district_code": 411524,
        "chinese_name": "商城县"
    },
    {
        "Id": 1263,
        "DisName": "固始县",
        "CityID": 147,
        "DisSort": null,
        "CityNameEnglish": "Gushi",
        "district_code": 411525,
        "chinese_name": "固始县"
    },
    {
        "Id": 1264,
        "DisName": "潢川县",
        "CityID": 147,
        "DisSort": null,
        "CityNameEnglish": "Huangchuan",
        "district_code": 411526,
        "chinese_name": "潢川县"
    },
    {
        "Id": 1265,
        "DisName": "淮滨县",
        "CityID": 147,
        "DisSort": null,
        "CityNameEnglish": "Huaibin",
        "district_code": 411527,
        "chinese_name": "淮滨县"
    },
    {
        "Id": 1266,
        "DisName": "息县",
        "CityID": 147,
        "DisSort": null,
        "CityNameEnglish": "Xixian",
        "district_code": 411528,
        "chinese_name": "息县"
    },
    {
        "Id": 1267,
        "DisName": "宛城区",
        "CityID": 148,
        "DisSort": null,
        "CityNameEnglish": "Wancheng",
        "district_code": 411302,
        "chinese_name": "宛城区"
    },
    {
        "Id": 1268,
        "DisName": "卧龙区",
        "CityID": 148,
        "DisSort": null,
        "CityNameEnglish": "Wolong",
        "district_code": 411303,
        "chinese_name": "卧龙区"
    },
    {
        "Id": 1269,
        "DisName": "南召县",
        "CityID": 148,
        "DisSort": null,
        "CityNameEnglish": "Nanzhao",
        "district_code": 411321,
        "chinese_name": "南召县"
    },
    {
        "Id": 1270,
        "DisName": "方城县",
        "CityID": 148,
        "DisSort": null,
        "CityNameEnglish": "Fangcheng",
        "district_code": 411322,
        "chinese_name": "方城县"
    },
    {
        "Id": 1271,
        "DisName": "西峡县",
        "CityID": 148,
        "DisSort": null,
        "CityNameEnglish": "Xixia",
        "district_code": 411323,
        "chinese_name": "西峡县"
    },
    {
        "Id": 1272,
        "DisName": "镇平县",
        "CityID": 148,
        "DisSort": null,
        "CityNameEnglish": "Zhenping",
        "district_code": 411324,
        "chinese_name": "镇平县"
    },
    {
        "Id": 1273,
        "DisName": "内乡县",
        "CityID": 148,
        "DisSort": null,
        "CityNameEnglish": "Neixiang",
        "district_code": 411325,
        "chinese_name": "内乡县"
    },
    {
        "Id": 1274,
        "DisName": "淅川县",
        "CityID": 148,
        "DisSort": null,
        "CityNameEnglish": "Xichuan",
        "district_code": 411326,
        "chinese_name": "淅川县"
    },
    {
        "Id": 1275,
        "DisName": "社旗县",
        "CityID": 148,
        "DisSort": null,
        "CityNameEnglish": "Sheqi",
        "district_code": 411327,
        "chinese_name": "社旗县"
    },
    {
        "Id": 1276,
        "DisName": "唐河县",
        "CityID": 148,
        "DisSort": null,
        "CityNameEnglish": "Tanghe",
        "district_code": 411328,
        "chinese_name": "唐河县"
    },
    {
        "Id": 1277,
        "DisName": "新野县",
        "CityID": 148,
        "DisSort": null,
        "CityNameEnglish": "Xinye",
        "district_code": 411329,
        "chinese_name": "新野县"
    },
    {
        "Id": 1278,
        "DisName": "桐柏县",
        "CityID": 148,
        "DisSort": null,
        "CityNameEnglish": "Tongbai",
        "district_code": 411330,
        "chinese_name": "桐柏县"
    },
    {
        "Id": 1279,
        "DisName": "邓州市",
        "CityID": 148,
        "DisSort": null,
        "CityNameEnglish": "Dengzhou",
        "district_code": 411381,
        "chinese_name": "邓州市"
    },
    {
        "Id": 1280,
        "DisName": "龙亭区",
        "CityID": 149,
        "DisSort": null,
        "CityNameEnglish": "Longting",
        "district_code": 410202,
        "chinese_name": "龙亭区"
    },
    {
        "Id": 1281,
        "DisName": "顺河回族区",
        "CityID": 149,
        "DisSort": null,
        "CityNameEnglish": "Shunhe",
        "district_code": 410203,
        "chinese_name": "顺河回族区"
    },
    {
        "Id": 1282,
        "DisName": "鼓楼区",
        "CityID": 149,
        "DisSort": null,
        "CityNameEnglish": "Gulou",
        "district_code": 410204,
        "chinese_name": "鼓楼区"
    },
    {
        "Id": 1283,
        "DisName": "禹王台区",
        "CityID": 149,
        "DisSort": null,
        "CityNameEnglish": "Yuwangtai",
        "district_code": 410205,
        "chinese_name": "禹王台区"
    },
    {
        "Id": 1284,
        "DisName": "金明区",
        "CityID": 149,
        "DisSort": null,
        "CityNameEnglish": "Jinming",
        "district_code": 410211,
        "chinese_name": "金明区"
    },
    {
        "Id": 1285,
        "DisName": "杞县",
        "CityID": 149,
        "DisSort": null,
        "CityNameEnglish": "Qixian",
        "district_code": 410221,
        "chinese_name": "杞县"
    },
    {
        "Id": 1286,
        "DisName": "通许县",
        "CityID": 149,
        "DisSort": null,
        "CityNameEnglish": "Tongxu",
        "district_code": 410222,
        "chinese_name": "通许县"
    },
    {
        "Id": 1287,
        "DisName": "尉氏县",
        "CityID": 149,
        "DisSort": null,
        "CityNameEnglish": "Weishi",
        "district_code": 410223,
        "chinese_name": "尉氏县"
    },
    {
        "Id": 1288,
        "DisName": "开封县",
        "CityID": 149,
        "DisSort": null,
        "CityNameEnglish": "Kaifeng",
        "district_code": 410224,
        "chinese_name": "开封县"
    },
    {
        "Id": 1289,
        "DisName": "兰考县",
        "CityID": 149,
        "DisSort": null,
        "CityNameEnglish": "Lankao",
        "district_code": 410225,
        "chinese_name": "兰考县"
    },
    {
        "Id": 1290,
        "DisName": "老城区",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Laocheng",
        "district_code": 410302,
        "chinese_name": "老城区"
    },
    {
        "Id": 1291,
        "DisName": "西工区",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Xigong",
        "district_code": 410303,
        "chinese_name": "西工区"
    },
    {
        "Id": 1292,
        "DisName": "瀍河回族区",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Chanhe",
        "district_code": 410304,
        "chinese_name": "廛河回族区"
    },
    {
        "Id": 1293,
        "DisName": "涧西区",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Jianxi",
        "district_code": 410305,
        "chinese_name": "涧西区"
    },
    {
        "Id": 1294,
        "DisName": "吉利区",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Jili",
        "district_code": 410306,
        "chinese_name": "吉利区"
    },
    {
        "Id": 1295,
        "DisName": "洛龙区",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Luolong",
        "district_code": 410307,
        "chinese_name": "洛龙区"
    },
    {
        "Id": 1296,
        "DisName": "孟津县",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Mengjin",
        "district_code": 410322,
        "chinese_name": "孟津县"
    },
    {
        "Id": 1297,
        "DisName": "新安县",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Xin'an",
        "district_code": 410323,
        "chinese_name": "新安县"
    },
    {
        "Id": 1298,
        "DisName": "栾川县",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Luanchuan",
        "district_code": 410324,
        "chinese_name": "栾川县"
    },
    {
        "Id": 1299,
        "DisName": "嵩县",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Songxian",
        "district_code": 410325,
        "chinese_name": "嵩县"
    },
    {
        "Id": 1300,
        "DisName": "汝阳县",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Ruyang",
        "district_code": 410326,
        "chinese_name": "汝阳县"
    },
    {
        "Id": 1301,
        "DisName": "宜阳县",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Yiyang",
        "district_code": 410327,
        "chinese_name": "宜阳县"
    },
    {
        "Id": 1302,
        "DisName": "洛宁县",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Luoning",
        "district_code": 410328,
        "chinese_name": "洛宁县"
    },
    {
        "Id": 1303,
        "DisName": "伊川县",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Yichuan",
        "district_code": 410329,
        "chinese_name": "伊川县"
    },
    {
        "Id": 1304,
        "DisName": "偃师市",
        "CityID": 150,
        "DisSort": null,
        "CityNameEnglish": "Yanshi",
        "district_code": 410381,
        "chinese_name": "偃师市"
    },
    {
        "Id": 1305,
        "DisName": "解放区",
        "CityID": 152,
        "DisSort": null,
        "CityNameEnglish": "Jiefang",
        "district_code": 410802,
        "chinese_name": "解放区"
    },
    {
        "Id": 1306,
        "DisName": "中站区",
        "CityID": 152,
        "DisSort": null,
        "CityNameEnglish": "Zhongzhan",
        "district_code": 410803,
        "chinese_name": "中站区"
    },
    {
        "Id": 1307,
        "DisName": "马村区",
        "CityID": 152,
        "DisSort": null,
        "CityNameEnglish": "Macun",
        "district_code": 410804,
        "chinese_name": "马村区"
    },
    {
        "Id": 1308,
        "DisName": "山阳区",
        "CityID": 152,
        "DisSort": null,
        "CityNameEnglish": "Shanyang",
        "district_code": 410811,
        "chinese_name": "山阳区"
    },
    {
        "Id": 1309,
        "DisName": "修武县",
        "CityID": 152,
        "DisSort": null,
        "CityNameEnglish": "Xiuwu",
        "district_code": 410821,
        "chinese_name": "修武县"
    },
    {
        "Id": 1310,
        "DisName": "博爱县",
        "CityID": 152,
        "DisSort": null,
        "CityNameEnglish": "Boai",
        "district_code": 410822,
        "chinese_name": "博爱县"
    },
    {
        "Id": 1311,
        "DisName": "武陟县",
        "CityID": 152,
        "DisSort": null,
        "CityNameEnglish": "Wuzhi",
        "district_code": 410823,
        "chinese_name": "武陟县"
    },
    {
        "Id": 1312,
        "DisName": "温县",
        "CityID": 152,
        "DisSort": null,
        "CityNameEnglish": "Wenxian",
        "district_code": 410825,
        "chinese_name": "温县"
    },
    {
        "Id": 1313,
        "DisName": "沁阳市",
        "CityID": 152,
        "DisSort": null,
        "CityNameEnglish": "Qinyang",
        "district_code": 410882,
        "chinese_name": "沁阳市"
    },
    {
        "Id": 1314,
        "DisName": "孟州市",
        "CityID": 152,
        "DisSort": null,
        "CityNameEnglish": "Mengzhou",
        "district_code": 410883,
        "chinese_name": "孟州市"
    },
    {
        "Id": 1315,
        "DisName": "鹤山区",
        "CityID": 153,
        "DisSort": null,
        "CityNameEnglish": "Heshan",
        "district_code": 410602,
        "chinese_name": "鹤山区"
    },
    {
        "Id": 1316,
        "DisName": "山城区",
        "CityID": 153,
        "DisSort": null,
        "CityNameEnglish": "Shancheng",
        "district_code": 410603,
        "chinese_name": "山城区"
    },
    {
        "Id": 1317,
        "DisName": "淇滨区",
        "CityID": 153,
        "DisSort": null,
        "CityNameEnglish": "Qibin",
        "district_code": 410611,
        "chinese_name": "淇滨区"
    },
    {
        "Id": 1318,
        "DisName": "浚县",
        "CityID": 153,
        "DisSort": null,
        "CityNameEnglish": "Xunxian",
        "district_code": 410621,
        "chinese_name": "浚县"
    },
    {
        "Id": 1319,
        "DisName": "淇县",
        "CityID": 153,
        "DisSort": null,
        "CityNameEnglish": "Qixian",
        "district_code": 410622,
        "chinese_name": "淇县"
    },
    {
        "Id": 1320,
        "DisName": "华龙区",
        "CityID": 154,
        "DisSort": null,
        "CityNameEnglish": "Hualong",
        "district_code": 410902,
        "chinese_name": "华龙区"
    },
    {
        "Id": 1321,
        "DisName": "清丰县",
        "CityID": 154,
        "DisSort": null,
        "CityNameEnglish": "Qingfeng",
        "district_code": 410922,
        "chinese_name": "清丰县"
    },
    {
        "Id": 1322,
        "DisName": "南乐县",
        "CityID": 154,
        "DisSort": null,
        "CityNameEnglish": "Nanle",
        "district_code": 410923,
        "chinese_name": "南乐县"
    },
    {
        "Id": 1323,
        "DisName": "范县",
        "CityID": 154,
        "DisSort": null,
        "CityNameEnglish": "Fanxian",
        "district_code": 410926,
        "chinese_name": "范县"
    },
    {
        "Id": 1324,
        "DisName": "台前县",
        "CityID": 154,
        "DisSort": null,
        "CityNameEnglish": "Taiqian",
        "district_code": 410927,
        "chinese_name": "台前县"
    },
    {
        "Id": 1325,
        "DisName": "濮阳县",
        "CityID": 154,
        "DisSort": null,
        "CityNameEnglish": "Puyang",
        "district_code": 410928,
        "chinese_name": "濮阳县"
    },
    {
        "Id": 1326,
        "DisName": "川汇区",
        "CityID": 155,
        "DisSort": null,
        "CityNameEnglish": "Chuanhui",
        "district_code": 411602,
        "chinese_name": "川汇区"
    },
    {
        "Id": 1327,
        "DisName": "扶沟县",
        "CityID": 155,
        "DisSort": null,
        "CityNameEnglish": "Fugou",
        "district_code": 411621,
        "chinese_name": "扶沟县"
    },
    {
        "Id": 1328,
        "DisName": "西华县",
        "CityID": 155,
        "DisSort": null,
        "CityNameEnglish": "Xihua",
        "district_code": 411622,
        "chinese_name": "西华县"
    },
    {
        "Id": 1329,
        "DisName": "商水县",
        "CityID": 155,
        "DisSort": null,
        "CityNameEnglish": "Shangshui",
        "district_code": 411623,
        "chinese_name": "商水县"
    },
    {
        "Id": 1330,
        "DisName": "沈丘县",
        "CityID": 155,
        "DisSort": null,
        "CityNameEnglish": "Shenqiu",
        "district_code": 411624,
        "chinese_name": "沈丘县"
    },
    {
        "Id": 1331,
        "DisName": "郸城县",
        "CityID": 155,
        "DisSort": null,
        "CityNameEnglish": "Dancheng",
        "district_code": 411625,
        "chinese_name": "郸城县"
    },
    {
        "Id": 1332,
        "DisName": "淮阳县",
        "CityID": 155,
        "DisSort": null,
        "CityNameEnglish": "Huaiyang",
        "district_code": 411626,
        "chinese_name": "淮阳县"
    },
    {
        "Id": 1333,
        "DisName": "太康县",
        "CityID": 155,
        "DisSort": null,
        "CityNameEnglish": "Taikang",
        "district_code": 411627,
        "chinese_name": "太康县"
    },
    {
        "Id": 1334,
        "DisName": "鹿邑县",
        "CityID": 155,
        "DisSort": null,
        "CityNameEnglish": "Luyi",
        "district_code": 411628,
        "chinese_name": "鹿邑县"
    },
    {
        "Id": 1335,
        "DisName": "项城市",
        "CityID": 155,
        "DisSort": null,
        "CityNameEnglish": "Xiangcheng",
        "district_code": 411681,
        "chinese_name": "项城市"
    },
    {
        "Id": 1336,
        "DisName": "源汇区",
        "CityID": 156,
        "DisSort": null,
        "CityNameEnglish": "Yuanhui",
        "district_code": 411102,
        "chinese_name": "源汇区"
    },
    {
        "Id": 1337,
        "DisName": "郾城区",
        "CityID": 156,
        "DisSort": null,
        "CityNameEnglish": "Yancheng",
        "district_code": 411103,
        "chinese_name": "郾城区"
    },
    {
        "Id": 1338,
        "DisName": "召陵区",
        "CityID": 156,
        "DisSort": null,
        "CityNameEnglish": "Zhaoling",
        "district_code": 411104,
        "chinese_name": "召陵区"
    },
    {
        "Id": 1339,
        "DisName": "舞阳县",
        "CityID": 156,
        "DisSort": null,
        "CityNameEnglish": "Wuyang",
        "district_code": 411121,
        "chinese_name": "舞阳县"
    },
    {
        "Id": 1340,
        "DisName": "临颍县",
        "CityID": 156,
        "DisSort": null,
        "CityNameEnglish": "Linying",
        "district_code": 411122,
        "chinese_name": "临颍县"
    },
    {
        "Id": 1341,
        "DisName": "驿城区",
        "CityID": 157,
        "DisSort": null,
        "CityNameEnglish": "Yicheng",
        "district_code": 411702,
        "chinese_name": "驿城区"
    },
    {
        "Id": 1342,
        "DisName": "西平县",
        "CityID": 157,
        "DisSort": null,
        "CityNameEnglish": "Xiping",
        "district_code": 411721,
        "chinese_name": "西平县"
    },
    {
        "Id": 1343,
        "DisName": "上蔡县",
        "CityID": 157,
        "DisSort": null,
        "CityNameEnglish": "Shangcai",
        "district_code": 411722,
        "chinese_name": "上蔡县"
    },
    {
        "Id": 1344,
        "DisName": "平舆县",
        "CityID": 157,
        "DisSort": null,
        "CityNameEnglish": "Pingyu",
        "district_code": 411723,
        "chinese_name": "平舆县"
    },
    {
        "Id": 1345,
        "DisName": "正阳县",
        "CityID": 157,
        "DisSort": null,
        "CityNameEnglish": "Zhengyang",
        "district_code": 411724,
        "chinese_name": "正阳县"
    },
    {
        "Id": 1346,
        "DisName": "确山县",
        "CityID": 157,
        "DisSort": null,
        "CityNameEnglish": "Queshan",
        "district_code": 411725,
        "chinese_name": "确山县"
    },
    {
        "Id": 1347,
        "DisName": "泌阳县",
        "CityID": 157,
        "DisSort": null,
        "CityNameEnglish": "Biyang",
        "district_code": 411726,
        "chinese_name": "泌阳县"
    },
    {
        "Id": 1348,
        "DisName": "汝南县",
        "CityID": 157,
        "DisSort": null,
        "CityNameEnglish": "Ru'nan",
        "district_code": 411727,
        "chinese_name": "汝南县"
    },
    {
        "Id": 1349,
        "DisName": "遂平县",
        "CityID": 157,
        "DisSort": null,
        "CityNameEnglish": "Suiping",
        "district_code": 411728,
        "chinese_name": "遂平县"
    },
    {
        "Id": 1350,
        "DisName": "新蔡县",
        "CityID": 157,
        "DisSort": null,
        "CityNameEnglish": "Xincai",
        "district_code": 411729,
        "chinese_name": "新蔡县"
    },
    {
        "Id": 1351,
        "DisName": "湖滨区",
        "CityID": 158,
        "DisSort": null,
        "CityNameEnglish": "Lakeside",
        "district_code": 411202,
        "chinese_name": "湖滨区"
    },
    {
        "Id": 1352,
        "DisName": "渑池县",
        "CityID": 158,
        "DisSort": null,
        "CityNameEnglish": "Mianchi",
        "district_code": 411221,
        "chinese_name": "渑池县"
    },
    {
        "Id": 1353,
        "DisName": "陕县",
        "CityID": 158,
        "DisSort": null,
        "CityNameEnglish": "Shanxian",
        "district_code": 411222,
        "chinese_name": "陕县"
    },
    {
        "Id": 1354,
        "DisName": "卢氏县",
        "CityID": 158,
        "DisSort": null,
        "CityNameEnglish": "Lushi",
        "district_code": 411224,
        "chinese_name": "卢氏县"
    },
    {
        "Id": 1355,
        "DisName": "义马市",
        "CityID": 158,
        "DisSort": null,
        "CityNameEnglish": "Yima",
        "district_code": 411281,
        "chinese_name": "义马市"
    },
    {
        "Id": 1356,
        "DisName": "灵宝市",
        "CityID": 158,
        "DisSort": null,
        "CityNameEnglish": "Lingbao",
        "district_code": 411282,
        "chinese_name": "灵宝市"
    },
    {
        "Id": 1357,
        "DisName": "江岸区",
        "CityID": 159,
        "DisSort": null,
        "CityNameEnglish": "Jiang'an",
        "district_code": 420102,
        "chinese_name": "江岸区"
    },
    {
        "Id": 1358,
        "DisName": "江汉区",
        "CityID": 159,
        "DisSort": null,
        "CityNameEnglish": "Jianghan",
        "district_code": 420103,
        "chinese_name": "江汉区"
    },
    {
        "Id": 1359,
        "DisName": "硚口区",
        "CityID": 159,
        "DisSort": null,
        "CityNameEnglish": "Qiaokou",
        "district_code": 420104,
        "chinese_name": "硚口区"
    },
    {
        "Id": 1360,
        "DisName": "汉阳区",
        "CityID": 159,
        "DisSort": null,
        "CityNameEnglish": "Hanyang",
        "district_code": 420105,
        "chinese_name": "汉阳区"
    },
    {
        "Id": 1361,
        "DisName": "武昌区",
        "CityID": 159,
        "DisSort": null,
        "CityNameEnglish": "Wuchang",
        "district_code": 420106,
        "chinese_name": "武昌区"
    },
    {
        "Id": 1362,
        "DisName": "青山区",
        "CityID": 159,
        "DisSort": null,
        "CityNameEnglish": "Qingshan",
        "district_code": 420107,
        "chinese_name": "青山区"
    },
    {
        "Id": 1363,
        "DisName": "洪山区",
        "CityID": 159,
        "DisSort": null,
        "CityNameEnglish": "Hongshan",
        "district_code": 420111,
        "chinese_name": "洪山区"
    },
    {
        "Id": 1364,
        "DisName": "东西湖区",
        "CityID": 159,
        "DisSort": null,
        "CityNameEnglish": "Dongxihu",
        "district_code": 420112,
        "chinese_name": "东西湖区"
    },
    {
        "Id": 1365,
        "DisName": "汉南区",
        "CityID": 159,
        "DisSort": null,
        "CityNameEnglish": "Hannan",
        "district_code": 420113,
        "chinese_name": "汉南区"
    },
    {
        "Id": 1366,
        "DisName": "蔡甸区",
        "CityID": 159,
        "DisSort": null,
        "CityNameEnglish": "Caidian",
        "district_code": 420114,
        "chinese_name": "蔡甸区"
    },
    {
        "Id": 1367,
        "DisName": "江夏区",
        "CityID": 159,
        "DisSort": null,
        "CityNameEnglish": "Jiangxia",
        "district_code": 420115,
        "chinese_name": "江夏区"
    },
    {
        "Id": 1368,
        "DisName": "黄陂区",
        "CityID": 159,
        "DisSort": null,
        "CityNameEnglish": "Huangpi",
        "district_code": 420116,
        "chinese_name": "黄陂区"
    },
    {
        "Id": 1369,
        "DisName": "新洲区",
        "CityID": 159,
        "DisSort": null,
        "CityNameEnglish": "Xinzhou",
        "district_code": 420117,
        "chinese_name": "新洲区"
    },
    {
        "Id": 1370,
        "DisName": "襄城区",
        "CityID": 160,
        "DisSort": null,
        "CityNameEnglish": "Xiangcheng",
        "district_code": 420602,
        "chinese_name": "襄城区"
    },
    {
        "Id": 1371,
        "DisName": "樊城区",
        "CityID": 160,
        "DisSort": null,
        "CityNameEnglish": "Fancheng",
        "district_code": 420606,
        "chinese_name": "樊城区"
    },
    {
        "Id": 1372,
        "DisName": "襄阳区",
        "CityID": 160,
        "DisSort": null,
        "CityNameEnglish": "Xiangyang",
        "district_code": 420607,
        "chinese_name": "襄阳区"
    },
    {
        "Id": 1373,
        "DisName": "南漳县",
        "CityID": 160,
        "DisSort": null,
        "CityNameEnglish": "Nanzhang",
        "district_code": 420624,
        "chinese_name": "南漳县"
    },
    {
        "Id": 1374,
        "DisName": "谷城县",
        "CityID": 160,
        "DisSort": null,
        "CityNameEnglish": "Gucheng",
        "district_code": 420625,
        "chinese_name": "谷城县"
    },
    {
        "Id": 1375,
        "DisName": "保康县",
        "CityID": 160,
        "DisSort": null,
        "CityNameEnglish": "Baokang",
        "district_code": 420626,
        "chinese_name": "保康县"
    },
    {
        "Id": 1376,
        "DisName": "老河口市",
        "CityID": 160,
        "DisSort": null,
        "CityNameEnglish": "Laohekou",
        "district_code": 420682,
        "chinese_name": "老河口市"
    },
    {
        "Id": 1377,
        "DisName": "枣阳市",
        "CityID": 160,
        "DisSort": null,
        "CityNameEnglish": "Zaoyang",
        "district_code": 420683,
        "chinese_name": "枣阳市"
    },
    {
        "Id": 1378,
        "DisName": "宜城市",
        "CityID": 160,
        "DisSort": null,
        "CityNameEnglish": "Yicheng",
        "district_code": 420684,
        "chinese_name": "宜城市"
    },
    {
        "Id": 1379,
        "DisName": "梁子湖区",
        "CityID": 161,
        "DisSort": null,
        "CityNameEnglish": "Liangzihu",
        "district_code": 420702,
        "chinese_name": "梁子湖区"
    },
    {
        "Id": 1380,
        "DisName": "华容区",
        "CityID": 161,
        "DisSort": null,
        "CityNameEnglish": "Huarong",
        "district_code": 420703,
        "chinese_name": "华容区"
    },
    {
        "Id": 1381,
        "DisName": "鄂城区",
        "CityID": 161,
        "DisSort": null,
        "CityNameEnglish": "E'cheng",
        "district_code": 420704,
        "chinese_name": "鄂城区"
    },
    {
        "Id": 1382,
        "DisName": "孝南区",
        "CityID": 162,
        "DisSort": null,
        "CityNameEnglish": "Xiaonan",
        "district_code": 420902,
        "chinese_name": "孝南区"
    },
    {
        "Id": 1383,
        "DisName": "孝昌县",
        "CityID": 162,
        "DisSort": null,
        "CityNameEnglish": "Xiaochang",
        "district_code": 420921,
        "chinese_name": "孝昌县"
    },
    {
        "Id": 1384,
        "DisName": "大悟县",
        "CityID": 162,
        "DisSort": null,
        "CityNameEnglish": "Dawu",
        "district_code": 420922,
        "chinese_name": "大悟县"
    },
    {
        "Id": 1385,
        "DisName": "云梦县",
        "CityID": 162,
        "DisSort": null,
        "CityNameEnglish": "Yunmeng",
        "district_code": 420923,
        "chinese_name": "云梦县"
    },
    {
        "Id": 1386,
        "DisName": "应城市",
        "CityID": 162,
        "DisSort": null,
        "CityNameEnglish": "Yingcheng",
        "district_code": 420981,
        "chinese_name": "应城市"
    },
    {
        "Id": 1387,
        "DisName": "安陆市",
        "CityID": 162,
        "DisSort": null,
        "CityNameEnglish": "Anlu",
        "district_code": 420982,
        "chinese_name": "安陆市"
    },
    {
        "Id": 1388,
        "DisName": "汉川市",
        "CityID": 162,
        "DisSort": null,
        "CityNameEnglish": "Hanchuan",
        "district_code": 420984,
        "chinese_name": "汉川市"
    },
    {
        "Id": 1389,
        "DisName": "黄州区",
        "CityID": 163,
        "DisSort": null,
        "CityNameEnglish": "Huangzhou",
        "district_code": 421102,
        "chinese_name": "黄州区"
    },
    {
        "Id": 1390,
        "DisName": "团风县",
        "CityID": 163,
        "DisSort": null,
        "CityNameEnglish": "Tuanfeng",
        "district_code": 421121,
        "chinese_name": "团风县"
    },
    {
        "Id": 1391,
        "DisName": "红安县",
        "CityID": 163,
        "DisSort": null,
        "CityNameEnglish": "Hong'an",
        "district_code": 421122,
        "chinese_name": "红安县"
    },
    {
        "Id": 1392,
        "DisName": "罗田县",
        "CityID": 163,
        "DisSort": null,
        "CityNameEnglish": "Luotian",
        "district_code": 421123,
        "chinese_name": "罗田县"
    },
    {
        "Id": 1393,
        "DisName": "英山县",
        "CityID": 163,
        "DisSort": null,
        "CityNameEnglish": "Yingshan",
        "district_code": 421124,
        "chinese_name": "英山县"
    },
    {
        "Id": 1394,
        "DisName": "浠水县",
        "CityID": 163,
        "DisSort": null,
        "CityNameEnglish": "Xishui",
        "district_code": 421125,
        "chinese_name": "浠水县"
    },
    {
        "Id": 1395,
        "DisName": "蕲春县",
        "CityID": 163,
        "DisSort": null,
        "CityNameEnglish": "Qichun",
        "district_code": 421126,
        "chinese_name": "蕲春县"
    },
    {
        "Id": 1396,
        "DisName": "黄梅县",
        "CityID": 163,
        "DisSort": null,
        "CityNameEnglish": "Huangmei",
        "district_code": 421127,
        "chinese_name": "黄梅县"
    },
    {
        "Id": 1397,
        "DisName": "麻城市",
        "CityID": 163,
        "DisSort": null,
        "CityNameEnglish": "Hemp",
        "district_code": 421181,
        "chinese_name": "麻城市"
    },
    {
        "Id": 1398,
        "DisName": "武穴市",
        "CityID": 163,
        "DisSort": null,
        "CityNameEnglish": "Wuxue",
        "district_code": 421182,
        "chinese_name": "武穴市"
    },
    {
        "Id": 1399,
        "DisName": "黄石港区",
        "CityID": 164,
        "DisSort": null,
        "CityNameEnglish": "Huangshigang",
        "district_code": 420202,
        "chinese_name": "黄石港区"
    },
    {
        "Id": 1400,
        "DisName": "西塞山区",
        "CityID": 164,
        "DisSort": null,
        "CityNameEnglish": "Xisaishan",
        "district_code": 420203,
        "chinese_name": "西塞山区"
    },
    {
        "Id": 1401,
        "DisName": "下陆区",
        "CityID": 164,
        "DisSort": null,
        "CityNameEnglish": "Xialu",
        "district_code": 420204,
        "chinese_name": "下陆区"
    },
    {
        "Id": 1402,
        "DisName": "铁山区",
        "CityID": 164,
        "DisSort": null,
        "CityNameEnglish": "Tieshan",
        "district_code": 420205,
        "chinese_name": "铁山区"
    },
    {
        "Id": 1403,
        "DisName": "阳新县",
        "CityID": 164,
        "DisSort": null,
        "CityNameEnglish": "Yangxin",
        "district_code": 420222,
        "chinese_name": "阳新县"
    },
    {
        "Id": 1404,
        "DisName": "大冶市",
        "CityID": 164,
        "DisSort": null,
        "CityNameEnglish": "Daye",
        "district_code": 420281,
        "chinese_name": "大冶市"
    },
    {
        "Id": 1405,
        "DisName": "咸安区",
        "CityID": 165,
        "DisSort": null,
        "CityNameEnglish": "Xian'an",
        "district_code": 421202,
        "chinese_name": "咸安区"
    },
    {
        "Id": 1406,
        "DisName": "嘉鱼县",
        "CityID": 165,
        "DisSort": null,
        "CityNameEnglish": "Jiayu",
        "district_code": 421221,
        "chinese_name": "嘉鱼县"
    },
    {
        "Id": 1407,
        "DisName": "通城县",
        "CityID": 165,
        "DisSort": null,
        "CityNameEnglish": "Tongcheng",
        "district_code": 421222,
        "chinese_name": "通城县"
    },
    {
        "Id": 1408,
        "DisName": "崇阳县",
        "CityID": 165,
        "DisSort": null,
        "CityNameEnglish": "Chongyang",
        "district_code": 421223,
        "chinese_name": "崇阳县"
    },
    {
        "Id": 1409,
        "DisName": "通山县",
        "CityID": 165,
        "DisSort": null,
        "CityNameEnglish": "Tongshan",
        "district_code": 421224,
        "chinese_name": "通山县"
    },
    {
        "Id": 1410,
        "DisName": "赤壁市",
        "CityID": 165,
        "DisSort": null,
        "CityNameEnglish": "Chibi",
        "district_code": 421281,
        "chinese_name": "赤壁市"
    },
    {
        "Id": 1411,
        "DisName": "沙市区",
        "CityID": 166,
        "DisSort": null,
        "CityNameEnglish": "Shashi",
        "district_code": 421002,
        "chinese_name": "沙市区"
    },
    {
        "Id": 1412,
        "DisName": "荆州区",
        "CityID": 166,
        "DisSort": null,
        "CityNameEnglish": "Jingzhou",
        "district_code": 421003,
        "chinese_name": "荆州区"
    },
    {
        "Id": 1413,
        "DisName": "公安县",
        "CityID": 166,
        "DisSort": null,
        "CityNameEnglish": "Gongan",
        "district_code": 421022,
        "chinese_name": "公安县"
    },
    {
        "Id": 1414,
        "DisName": "监利县",
        "CityID": 166,
        "DisSort": null,
        "CityNameEnglish": "Jianli",
        "district_code": 421023,
        "chinese_name": "监利县"
    },
    {
        "Id": 1415,
        "DisName": "江陵县",
        "CityID": 166,
        "DisSort": null,
        "CityNameEnglish": "Jiangling",
        "district_code": 421024,
        "chinese_name": "江陵县"
    },
    {
        "Id": 1416,
        "DisName": "石首市",
        "CityID": 166,
        "DisSort": null,
        "CityNameEnglish": "Shishou",
        "district_code": 421081,
        "chinese_name": "石首市"
    },
    {
        "Id": 1417,
        "DisName": "洪湖市",
        "CityID": 166,
        "DisSort": null,
        "CityNameEnglish": "Honghu",
        "district_code": 421083,
        "chinese_name": "洪湖市"
    },
    {
        "Id": 1418,
        "DisName": "松滋市",
        "CityID": 166,
        "DisSort": null,
        "CityNameEnglish": "Songzi",
        "district_code": 421087,
        "chinese_name": "松滋市"
    },
    {
        "Id": 1419,
        "DisName": "西陵区",
        "CityID": 167,
        "DisSort": null,
        "CityNameEnglish": "Xiling",
        "district_code": 420502,
        "chinese_name": "西陵区"
    },
    {
        "Id": 1420,
        "DisName": "伍家岗区",
        "CityID": 167,
        "DisSort": null,
        "CityNameEnglish": "Wujiagang",
        "district_code": 420503,
        "chinese_name": "伍家岗区"
    },
    {
        "Id": 1421,
        "DisName": "点军区",
        "CityID": 167,
        "DisSort": null,
        "CityNameEnglish": "Dianjun",
        "district_code": 420504,
        "chinese_name": "点军区"
    },
    {
        "Id": 1422,
        "DisName": "猇亭区",
        "CityID": 167,
        "DisSort": null,
        "CityNameEnglish": "Xiaoting",
        "district_code": 420505,
        "chinese_name": "猇亭区"
    },
    {
        "Id": 1423,
        "DisName": "夷陵区",
        "CityID": 167,
        "DisSort": null,
        "CityNameEnglish": "Yiling",
        "district_code": 420506,
        "chinese_name": "夷陵区"
    },
    {
        "Id": 1424,
        "DisName": "远安县",
        "CityID": 167,
        "DisSort": null,
        "CityNameEnglish": "Yuan'an",
        "district_code": 420525,
        "chinese_name": "远安县"
    },
    {
        "Id": 1425,
        "DisName": "兴山县",
        "CityID": 167,
        "DisSort": null,
        "CityNameEnglish": "Xingshan",
        "district_code": 420526,
        "chinese_name": "兴山县"
    },
    {
        "Id": 1426,
        "DisName": "秭归县",
        "CityID": 167,
        "DisSort": null,
        "CityNameEnglish": "Zigui",
        "district_code": 420527,
        "chinese_name": "秭归县"
    },
    {
        "Id": 1427,
        "DisName": "长阳土家族自治县",
        "CityID": 167,
        "DisSort": null,
        "CityNameEnglish": "Changyang",
        "district_code": 420528,
        "chinese_name": "长阳土家族自治县"
    },
    {
        "Id": 1428,
        "DisName": "五峰土家族自治县",
        "CityID": 167,
        "DisSort": null,
        "CityNameEnglish": "Wufeng",
        "district_code": 420529,
        "chinese_name": "五峰土家族自治县"
    },
    {
        "Id": 1429,
        "DisName": "宜都市",
        "CityID": 167,
        "DisSort": null,
        "CityNameEnglish": "Yidu",
        "district_code": 420581,
        "chinese_name": "宜都市"
    },
    {
        "Id": 1430,
        "DisName": "当阳市",
        "CityID": 167,
        "DisSort": null,
        "CityNameEnglish": "Dangyang",
        "district_code": 420582,
        "chinese_name": "当阳市"
    },
    {
        "Id": 1431,
        "DisName": "枝江市",
        "CityID": 167,
        "DisSort": null,
        "CityNameEnglish": "Zhijiang",
        "district_code": 420583,
        "chinese_name": "枝江市"
    },
    {
        "Id": 1432,
        "DisName": "恩施市",
        "CityID": 168,
        "DisSort": null,
        "CityNameEnglish": "Enshi",
        "district_code": 422801,
        "chinese_name": "恩施市"
    },
    {
        "Id": 1433,
        "DisName": "利川市",
        "CityID": 168,
        "DisSort": null,
        "CityNameEnglish": "Lichuan",
        "district_code": 422802,
        "chinese_name": "利川市"
    },
    {
        "Id": 1434,
        "DisName": "建始县",
        "CityID": 168,
        "DisSort": null,
        "CityNameEnglish": "Jianshi",
        "district_code": 422822,
        "chinese_name": "建始县"
    },
    {
        "Id": 1435,
        "DisName": "巴东县",
        "CityID": 168,
        "DisSort": null,
        "CityNameEnglish": "Badong",
        "district_code": 422823,
        "chinese_name": "巴东县"
    },
    {
        "Id": 1436,
        "DisName": "宣恩县",
        "CityID": 168,
        "DisSort": null,
        "CityNameEnglish": "Xuanen",
        "district_code": 422825,
        "chinese_name": "宣恩县"
    },
    {
        "Id": 1437,
        "DisName": "咸丰县",
        "CityID": 168,
        "DisSort": null,
        "CityNameEnglish": "Xianfeng",
        "district_code": 422826,
        "chinese_name": "咸丰县"
    },
    {
        "Id": 1438,
        "DisName": "来凤县",
        "CityID": 168,
        "DisSort": null,
        "CityNameEnglish": "Laifeng",
        "district_code": 422827,
        "chinese_name": "来凤县"
    },
    {
        "Id": 1439,
        "DisName": "鹤峰县",
        "CityID": 168,
        "DisSort": null,
        "CityNameEnglish": "Hefeng",
        "district_code": 422828,
        "chinese_name": "鹤峰县"
    },
    {
        "Id": 1440,
        "DisName": "茅箭区",
        "CityID": 170,
        "DisSort": null,
        "CityNameEnglish": "Maojian",
        "district_code": 420302,
        "chinese_name": "茅箭区"
    },
    {
        "Id": 1441,
        "DisName": "张湾区",
        "CityID": 170,
        "DisSort": null,
        "CityNameEnglish": "Zhangwan",
        "district_code": 420303,
        "chinese_name": "张湾区"
    },
    {
        "Id": 1442,
        "DisName": "郧县",
        "CityID": 170,
        "DisSort": null,
        "CityNameEnglish": "Yunxian",
        "district_code": 420321,
        "chinese_name": "郧县"
    },
    {
        "Id": 1443,
        "DisName": "郧西县",
        "CityID": 170,
        "DisSort": null,
        "CityNameEnglish": "Yunxi",
        "district_code": 420322,
        "chinese_name": "郧西县"
    },
    {
        "Id": 1444,
        "DisName": "竹山县",
        "CityID": 170,
        "DisSort": null,
        "CityNameEnglish": "Zhushan",
        "district_code": 420323,
        "chinese_name": "竹山县"
    },
    {
        "Id": 1445,
        "DisName": "竹溪县",
        "CityID": 170,
        "DisSort": null,
        "CityNameEnglish": "Zhuxi",
        "district_code": 420324,
        "chinese_name": "竹溪县"
    },
    {
        "Id": 1446,
        "DisName": "房县",
        "CityID": 170,
        "DisSort": null,
        "CityNameEnglish": "Fangxian",
        "district_code": 420325,
        "chinese_name": "房县"
    },
    {
        "Id": 1447,
        "DisName": "丹江口市",
        "CityID": 170,
        "DisSort": null,
        "CityNameEnglish": "Danjiangkou",
        "district_code": 420381,
        "chinese_name": "丹江口市"
    },
    {
        "Id": 1448,
        "DisName": "曾都区",
        "CityID": 171,
        "DisSort": null,
        "CityNameEnglish": "Zengdu",
        "district_code": 421302,
        "chinese_name": "曾都区"
    },
    {
        "Id": 1449,
        "DisName": "广水市",
        "CityID": 171,
        "DisSort": null,
        "CityNameEnglish": "Guangshui",
        "district_code": 421381,
        "chinese_name": "广水市"
    },
    {
        "Id": 1450,
        "DisName": "东宝区",
        "CityID": 172,
        "DisSort": null,
        "CityNameEnglish": "Dongbao",
        "district_code": 420802,
        "chinese_name": "东宝区"
    },
    {
        "Id": 1451,
        "DisName": "掇刀区",
        "CityID": 172,
        "DisSort": null,
        "CityNameEnglish": "Duodao",
        "district_code": 420804,
        "chinese_name": "掇刀区"
    },
    {
        "Id": 1452,
        "DisName": "京山县",
        "CityID": 172,
        "DisSort": null,
        "CityNameEnglish": "Jingshan",
        "district_code": 420821,
        "chinese_name": "京山县"
    },
    {
        "Id": 1453,
        "DisName": "沙洋县",
        "CityID": 172,
        "DisSort": null,
        "CityNameEnglish": "Shayang",
        "district_code": 420822,
        "chinese_name": "沙洋县"
    },
    {
        "Id": 1454,
        "DisName": "钟祥市",
        "CityID": 172,
        "DisSort": null,
        "CityNameEnglish": "Zhongxiang",
        "district_code": 420881,
        "chinese_name": "钟祥市"
    },
    {
        "Id": 1455,
        "DisName": "岳阳楼区",
        "CityID": 176,
        "DisSort": null,
        "CityNameEnglish": "Yueyanglou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1456,
        "DisName": "云溪区",
        "CityID": 176,
        "DisSort": null,
        "CityNameEnglish": "Yunxi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1457,
        "DisName": "君山区",
        "CityID": 176,
        "DisSort": null,
        "CityNameEnglish": "Junshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1458,
        "DisName": "岳阳县",
        "CityID": 176,
        "DisSort": null,
        "CityNameEnglish": "Yueyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1459,
        "DisName": "华容县",
        "CityID": 176,
        "DisSort": null,
        "CityNameEnglish": "Huarong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1460,
        "DisName": "湘阴县",
        "CityID": 176,
        "DisSort": null,
        "CityNameEnglish": "Xiangyin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1461,
        "DisName": "平江县",
        "CityID": 176,
        "DisSort": null,
        "CityNameEnglish": "Pingjiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1462,
        "DisName": "汨罗市",
        "CityID": 176,
        "DisSort": null,
        "CityNameEnglish": "Miluo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1463,
        "DisName": "临湘市",
        "CityID": 176,
        "DisSort": null,
        "CityNameEnglish": "Linxiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1464,
        "DisName": "芙蓉区",
        "CityID": 177,
        "DisSort": null,
        "CityNameEnglish": "Furong",
        "district_code": 430102,
        "chinese_name": "芙蓉区"
    },
    {
        "Id": 1465,
        "DisName": "天心区",
        "CityID": 177,
        "DisSort": null,
        "CityNameEnglish": "Tianxin",
        "district_code": 430103,
        "chinese_name": "天心区"
    },
    {
        "Id": 1466,
        "DisName": "岳麓区",
        "CityID": 177,
        "DisSort": null,
        "CityNameEnglish": "Yuelu",
        "district_code": 430104,
        "chinese_name": "岳麓区"
    },
    {
        "Id": 1467,
        "DisName": "开福区",
        "CityID": 177,
        "DisSort": null,
        "CityNameEnglish": "Kaifu",
        "district_code": 430105,
        "chinese_name": "开福区"
    },
    {
        "Id": 1468,
        "DisName": "雨花区",
        "CityID": 177,
        "DisSort": null,
        "CityNameEnglish": "Yuhua",
        "district_code": 430111,
        "chinese_name": "雨花区"
    },
    {
        "Id": 1469,
        "DisName": "长沙县",
        "CityID": 177,
        "DisSort": null,
        "CityNameEnglish": "Changsha",
        "district_code": 430121,
        "chinese_name": "长沙县"
    },
    {
        "Id": 1470,
        "DisName": "望城县",
        "CityID": 177,
        "DisSort": null,
        "CityNameEnglish": "Wangcheng",
        "district_code": 430122,
        "chinese_name": "望城县"
    },
    {
        "Id": 1471,
        "DisName": "宁乡县",
        "CityID": 177,
        "DisSort": null,
        "CityNameEnglish": "Ningxiang",
        "district_code": 430124,
        "chinese_name": "宁乡县"
    },
    {
        "Id": 1472,
        "DisName": "浏阳市",
        "CityID": 177,
        "DisSort": null,
        "CityNameEnglish": "Liuyang",
        "district_code": 430181,
        "chinese_name": "浏阳市"
    },
    {
        "Id": 1473,
        "DisName": "雨湖区",
        "CityID": 178,
        "DisSort": null,
        "CityNameEnglish": "Yuhu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1474,
        "DisName": "岳塘区",
        "CityID": 178,
        "DisSort": null,
        "CityNameEnglish": "Yuetang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1475,
        "DisName": "湘潭县",
        "CityID": 178,
        "DisSort": null,
        "CityNameEnglish": "Xiangtan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1476,
        "DisName": "湘乡市",
        "CityID": 178,
        "DisSort": null,
        "CityNameEnglish": "Xiangxiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1477,
        "DisName": "韶山市",
        "CityID": 178,
        "DisSort": null,
        "CityNameEnglish": "Shaoshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1478,
        "DisName": "荷塘区",
        "CityID": 179,
        "DisSort": null,
        "CityNameEnglish": "Hetang",
        "district_code": 430202,
        "chinese_name": "荷塘区"
    },
    {
        "Id": 1479,
        "DisName": "芦淞区",
        "CityID": 179,
        "DisSort": null,
        "CityNameEnglish": "Lusong",
        "district_code": 430203,
        "chinese_name": "芦淞区"
    },
    {
        "Id": 1480,
        "DisName": "石峰区",
        "CityID": 179,
        "DisSort": null,
        "CityNameEnglish": "Shifeng",
        "district_code": 430204,
        "chinese_name": "石峰区"
    },
    {
        "Id": 1481,
        "DisName": "天元区",
        "CityID": 179,
        "DisSort": null,
        "CityNameEnglish": "Tianyuan",
        "district_code": 430211,
        "chinese_name": "天元区"
    },
    {
        "Id": 1482,
        "DisName": "株洲县",
        "CityID": 179,
        "DisSort": null,
        "CityNameEnglish": "Zhuzhou",
        "district_code": 430221,
        "chinese_name": "株洲县"
    },
    {
        "Id": 1483,
        "DisName": "攸县",
        "CityID": 179,
        "DisSort": null,
        "CityNameEnglish": "Youxian",
        "district_code": 430223,
        "chinese_name": "攸县"
    },
    {
        "Id": 1484,
        "DisName": "茶陵县",
        "CityID": 179,
        "DisSort": null,
        "CityNameEnglish": "Chaling",
        "district_code": 430224,
        "chinese_name": "茶陵县"
    },
    {
        "Id": 1485,
        "DisName": "炎陵县",
        "CityID": 179,
        "DisSort": null,
        "CityNameEnglish": "Yanling",
        "district_code": 430225,
        "chinese_name": "炎陵县"
    },
    {
        "Id": 1486,
        "DisName": "醴陵市",
        "CityID": 179,
        "DisSort": null,
        "CityNameEnglish": "Liling",
        "district_code": 430281,
        "chinese_name": "醴陵市"
    },
    {
        "Id": 1487,
        "DisName": "珠晖区",
        "CityID": 180,
        "DisSort": null,
        "CityNameEnglish": "Zhuhui",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1488,
        "DisName": "雁峰区",
        "CityID": 180,
        "DisSort": null,
        "CityNameEnglish": "Yanfeng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1489,
        "DisName": "石鼓区",
        "CityID": 180,
        "DisSort": null,
        "CityNameEnglish": "Shigu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1490,
        "DisName": "蒸湘区",
        "CityID": 180,
        "DisSort": null,
        "CityNameEnglish": "Zhengxiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1491,
        "DisName": "南岳区",
        "CityID": 180,
        "DisSort": null,
        "CityNameEnglish": "Nanyue",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1492,
        "DisName": "衡阳县",
        "CityID": 180,
        "DisSort": null,
        "CityNameEnglish": "Hengyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1493,
        "DisName": "衡南县",
        "CityID": 180,
        "DisSort": null,
        "CityNameEnglish": "Hengnan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1494,
        "DisName": "衡山县",
        "CityID": 180,
        "DisSort": null,
        "CityNameEnglish": "Hengshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1495,
        "DisName": "衡东县",
        "CityID": 180,
        "DisSort": null,
        "CityNameEnglish": "Hengdong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1496,
        "DisName": "祁东县",
        "CityID": 180,
        "DisSort": null,
        "CityNameEnglish": "Qidong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1497,
        "DisName": "耒阳市",
        "CityID": 180,
        "DisSort": null,
        "CityNameEnglish": "Leiyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1498,
        "DisName": "常宁市",
        "CityID": 180,
        "DisSort": null,
        "CityNameEnglish": "Changning",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1499,
        "DisName": "北湖区",
        "CityID": 181,
        "DisSort": null,
        "CityNameEnglish": "Beihu",
        "district_code": 431002,
        "chinese_name": "北湖区"
    },
    {
        "Id": 1500,
        "DisName": "苏仙区",
        "CityID": 181,
        "DisSort": null,
        "CityNameEnglish": "Suxian",
        "district_code": 431003,
        "chinese_name": "苏仙区"
    },
    {
        "Id": 1501,
        "DisName": "桂阳县",
        "CityID": 181,
        "DisSort": null,
        "CityNameEnglish": "Guiyang",
        "district_code": 431021,
        "chinese_name": "桂阳县"
    },
    {
        "Id": 1502,
        "DisName": "宜章县",
        "CityID": 181,
        "DisSort": null,
        "CityNameEnglish": "Yizhang",
        "district_code": 431022,
        "chinese_name": "宜章县"
    },
    {
        "Id": 1503,
        "DisName": "永兴县",
        "CityID": 181,
        "DisSort": null,
        "CityNameEnglish": "Yongxing",
        "district_code": 431023,
        "chinese_name": "永兴县"
    },
    {
        "Id": 1504,
        "DisName": "嘉禾县",
        "CityID": 181,
        "DisSort": null,
        "CityNameEnglish": "Jiahe",
        "district_code": 431024,
        "chinese_name": "嘉禾县"
    },
    {
        "Id": 1505,
        "DisName": "临武县",
        "CityID": 181,
        "DisSort": null,
        "CityNameEnglish": "Linwu",
        "district_code": 431025,
        "chinese_name": "临武县"
    },
    {
        "Id": 1506,
        "DisName": "汝城县",
        "CityID": 181,
        "DisSort": null,
        "CityNameEnglish": "Rucheng",
        "district_code": 431026,
        "chinese_name": "汝城县"
    },
    {
        "Id": 1507,
        "DisName": "桂东县",
        "CityID": 181,
        "DisSort": null,
        "CityNameEnglish": "Guidong",
        "district_code": 431027,
        "chinese_name": "桂东县"
    },
    {
        "Id": 1508,
        "DisName": "安仁县",
        "CityID": 181,
        "DisSort": null,
        "CityNameEnglish": "Anren",
        "district_code": 431028,
        "chinese_name": "安仁县"
    },
    {
        "Id": 1509,
        "DisName": "资兴市",
        "CityID": 181,
        "DisSort": null,
        "CityNameEnglish": "Zixing",
        "district_code": 431081,
        "chinese_name": "资兴市"
    },
    {
        "Id": 1510,
        "DisName": "武陵区",
        "CityID": 182,
        "DisSort": null,
        "CityNameEnglish": "Wuling",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1511,
        "DisName": "鼎城区",
        "CityID": 182,
        "DisSort": null,
        "CityNameEnglish": "Dingcheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1512,
        "DisName": "安乡县",
        "CityID": 182,
        "DisSort": null,
        "CityNameEnglish": "Anxiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1513,
        "DisName": "汉寿县",
        "CityID": 182,
        "DisSort": null,
        "CityNameEnglish": "Hanshou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1514,
        "DisName": "澧县",
        "CityID": 182,
        "DisSort": null,
        "CityNameEnglish": "Lixian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1515,
        "DisName": "临澧县",
        "CityID": 182,
        "DisSort": null,
        "CityNameEnglish": "Linli",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1516,
        "DisName": "桃源县",
        "CityID": 182,
        "DisSort": null,
        "CityNameEnglish": "Taoyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1517,
        "DisName": "石门县",
        "CityID": 182,
        "DisSort": null,
        "CityNameEnglish": "Shimenn",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1518,
        "DisName": "津市市",
        "CityID": 182,
        "DisSort": null,
        "CityNameEnglish": "Tianjin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1519,
        "DisName": "资阳区",
        "CityID": 183,
        "DisSort": null,
        "CityNameEnglish": "Ziyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1520,
        "DisName": "赫山区",
        "CityID": 183,
        "DisSort": null,
        "CityNameEnglish": "Heshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1521,
        "DisName": "南县",
        "CityID": 183,
        "DisSort": null,
        "CityNameEnglish": "Nanxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1522,
        "DisName": "桃江县",
        "CityID": 183,
        "DisSort": null,
        "CityNameEnglish": "Taojiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1523,
        "DisName": "安化县",
        "CityID": 183,
        "DisSort": null,
        "CityNameEnglish": "Anhua",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1524,
        "DisName": "沅江市",
        "CityID": 183,
        "DisSort": null,
        "CityNameEnglish": "Yuanjiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1525,
        "DisName": "娄星区",
        "CityID": 184,
        "DisSort": null,
        "CityNameEnglish": "Louxing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1526,
        "DisName": "双峰县",
        "CityID": 184,
        "DisSort": null,
        "CityNameEnglish": "Shuangfeng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1527,
        "DisName": "新化县",
        "CityID": 184,
        "DisSort": null,
        "CityNameEnglish": "Xinhua",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1528,
        "DisName": "冷水江市",
        "CityID": 184,
        "DisSort": null,
        "CityNameEnglish": "Lengshuijiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1529,
        "DisName": "涟源市",
        "CityID": 184,
        "DisSort": null,
        "CityNameEnglish": "Lianyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1530,
        "DisName": "双清区",
        "CityID": 185,
        "DisSort": null,
        "CityNameEnglish": "Shuangqing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1531,
        "DisName": "大祥区",
        "CityID": 185,
        "DisSort": null,
        "CityNameEnglish": "Daxiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1532,
        "DisName": "北塔区",
        "CityID": 185,
        "DisSort": null,
        "CityNameEnglish": "Beita",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1533,
        "DisName": "邵东县",
        "CityID": 185,
        "DisSort": null,
        "CityNameEnglish": "Shaodong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1534,
        "DisName": "新邵县",
        "CityID": 185,
        "DisSort": null,
        "CityNameEnglish": "Xinshao",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1535,
        "DisName": "邵阳县",
        "CityID": 185,
        "DisSort": null,
        "CityNameEnglish": "Shaoyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1536,
        "DisName": "隆回县",
        "CityID": 185,
        "DisSort": null,
        "CityNameEnglish": "Longhui",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1537,
        "DisName": "洞口县",
        "CityID": 185,
        "DisSort": null,
        "CityNameEnglish": "Dongkou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1538,
        "DisName": "绥宁县",
        "CityID": 185,
        "DisSort": null,
        "CityNameEnglish": "Suining",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1539,
        "DisName": "新宁县",
        "CityID": 185,
        "DisSort": null,
        "CityNameEnglish": "Xingning",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1540,
        "DisName": "城步苗族自治县",
        "CityID": 185,
        "DisSort": null,
        "CityNameEnglish": "Chengbu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1541,
        "DisName": "武冈市",
        "CityID": 185,
        "DisSort": null,
        "CityNameEnglish": "Wugang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1542,
        "DisName": "吉首市",
        "CityID": 186,
        "DisSort": null,
        "CityNameEnglish": "Jishou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1543,
        "DisName": "泸溪县",
        "CityID": 186,
        "DisSort": null,
        "CityNameEnglish": "Luxi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1544,
        "DisName": "凤凰县",
        "CityID": 186,
        "DisSort": null,
        "CityNameEnglish": "Fenghuang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1545,
        "DisName": "花垣县",
        "CityID": 186,
        "DisSort": null,
        "CityNameEnglish": "Huayuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1546,
        "DisName": "保靖县",
        "CityID": 186,
        "DisSort": null,
        "CityNameEnglish": "Baojing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1547,
        "DisName": "古丈县",
        "CityID": 186,
        "DisSort": null,
        "CityNameEnglish": "Guzhang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1548,
        "DisName": "永顺县",
        "CityID": 186,
        "DisSort": null,
        "CityNameEnglish": "Yongshun",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1549,
        "DisName": "龙山县",
        "CityID": 186,
        "DisSort": null,
        "CityNameEnglish": "Longshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1550,
        "DisName": "永定区",
        "CityID": 187,
        "DisSort": null,
        "CityNameEnglish": "Yongding",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1551,
        "DisName": "武陵源区",
        "CityID": 187,
        "DisSort": null,
        "CityNameEnglish": "Wulingyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1552,
        "DisName": "慈利县",
        "CityID": 187,
        "DisSort": null,
        "CityNameEnglish": "Cili",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1553,
        "DisName": "桑植县",
        "CityID": 187,
        "DisSort": null,
        "CityNameEnglish": "Sangzhi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1554,
        "DisName": "鹤城区",
        "CityID": 188,
        "DisSort": null,
        "CityNameEnglish": "Hecheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1555,
        "DisName": "中方县",
        "CityID": 188,
        "DisSort": null,
        "CityNameEnglish": "Chinese",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1556,
        "DisName": "沅陵县",
        "CityID": 188,
        "DisSort": null,
        "CityNameEnglish": "Yuanling",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1557,
        "DisName": "辰溪县",
        "CityID": 188,
        "DisSort": null,
        "CityNameEnglish": "Chenxi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1558,
        "DisName": "溆浦县",
        "CityID": 188,
        "DisSort": null,
        "CityNameEnglish": "Xupu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1559,
        "DisName": "会同县",
        "CityID": 188,
        "DisSort": null,
        "CityNameEnglish": "Huitong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1560,
        "DisName": "麻阳苗族自治县",
        "CityID": 188,
        "DisSort": null,
        "CityNameEnglish": "Mayang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1561,
        "DisName": "新晃侗族自治县",
        "CityID": 188,
        "DisSort": null,
        "CityNameEnglish": "Xinhuang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1562,
        "DisName": "芷江侗族自治县",
        "CityID": 188,
        "DisSort": null,
        "CityNameEnglish": "Zhijiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1563,
        "DisName": "靖州苗族侗族自治县",
        "CityID": 188,
        "DisSort": null,
        "CityNameEnglish": "Jingzhou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1564,
        "DisName": "通道侗族自治县",
        "CityID": 188,
        "DisSort": null,
        "CityNameEnglish": "Tongdao",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1565,
        "DisName": "洪江市",
        "CityID": 188,
        "DisSort": null,
        "CityNameEnglish": "Hongjiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1566,
        "DisName": "零陵区",
        "CityID": 189,
        "DisSort": null,
        "CityNameEnglish": "Lingling",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1567,
        "DisName": "冷水滩区",
        "CityID": 189,
        "DisSort": null,
        "CityNameEnglish": "Lengshuitan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1568,
        "DisName": "祁阳县",
        "CityID": 189,
        "DisSort": null,
        "CityNameEnglish": "Qiyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1569,
        "DisName": "东安县",
        "CityID": 189,
        "DisSort": null,
        "CityNameEnglish": "Dongan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1570,
        "DisName": "双牌县",
        "CityID": 189,
        "DisSort": null,
        "CityNameEnglish": "Shuangpai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1571,
        "DisName": "道县",
        "CityID": 189,
        "DisSort": null,
        "CityNameEnglish": "Daoxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1572,
        "DisName": "江永县",
        "CityID": 189,
        "DisSort": null,
        "CityNameEnglish": "Jiangyong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1573,
        "DisName": "宁远县",
        "CityID": 189,
        "DisSort": null,
        "CityNameEnglish": "Ningyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1574,
        "DisName": "蓝山县",
        "CityID": 189,
        "DisSort": null,
        "CityNameEnglish": "Lanshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1575,
        "DisName": "新田县",
        "CityID": 189,
        "DisSort": null,
        "CityNameEnglish": "Xintian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1576,
        "DisName": "江华瑶族自治县",
        "CityID": 189,
        "DisSort": null,
        "CityNameEnglish": "Jianghua",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1577,
        "DisName": "从化市",
        "CityID": 190,
        "DisSort": null,
        "CityNameEnglish": "Conghua",
        "district_code": 440184,
        "chinese_name": "从化市"
    },
    {
        "Id": 1578,
        "DisName": "荔湾区",
        "CityID": 190,
        "DisSort": null,
        "CityNameEnglish": "Liwan",
        "district_code": 440103,
        "chinese_name": "荔湾区"
    },
    {
        "Id": 1579,
        "DisName": "越秀区",
        "CityID": 190,
        "DisSort": null,
        "CityNameEnglish": "Yuexiu",
        "district_code": 440104,
        "chinese_name": "越秀区"
    },
    {
        "Id": 1580,
        "DisName": "海珠区",
        "CityID": 190,
        "DisSort": null,
        "CityNameEnglish": "Haizhuqu",
        "district_code": 440105,
        "chinese_name": "海珠区"
    },
    {
        "Id": 1581,
        "DisName": "天河区",
        "CityID": 190,
        "DisSort": null,
        "CityNameEnglish": "Tianhe",
        "district_code": 440106,
        "chinese_name": "天河区"
    },
    {
        "Id": 1582,
        "DisName": "白云区",
        "CityID": 190,
        "DisSort": null,
        "CityNameEnglish": "Baiyun",
        "district_code": 440111,
        "chinese_name": "白云区"
    },
    {
        "Id": 1583,
        "DisName": "花都区",
        "CityID": 190,
        "DisSort": null,
        "CityNameEnglish": "Huadu",
        "district_code": 440114,
        "chinese_name": "花都区"
    },
    {
        "Id": 1584,
        "DisName": "黄埔区",
        "CityID": 190,
        "DisSort": null,
        "CityNameEnglish": "Huangpu",
        "district_code": 440112,
        "chinese_name": "黄埔区"
    },
    {
        "Id": 1585,
        "DisName": "萝岗区",
        "CityID": 190,
        "DisSort": null,
        "CityNameEnglish": "Luogang",
        "district_code": 440116,
        "chinese_name": "萝岗区"
    },
    {
        "Id": 1586,
        "DisName": "南沙区",
        "CityID": 190,
        "DisSort": null,
        "CityNameEnglish": "Nansha",
        "district_code": 440115,
        "chinese_name": "南沙区"
    },
    {
        "Id": 1587,
        "DisName": "番禺区",
        "CityID": 190,
        "DisSort": null,
        "CityNameEnglish": "Panyu",
        "district_code": 440113,
        "chinese_name": "番禺区"
    },
    {
        "Id": 1588,
        "DisName": "增城市",
        "CityID": 190,
        "DisSort": null,
        "CityNameEnglish": "Zengcheng",
        "district_code": 440183,
        "chinese_name": "增城市"
    },
    {
        "Id": 1589,
        "DisName": "海丰县",
        "CityID": 191,
        "DisSort": null,
        "CityNameEnglish": "Haifeng",
        "district_code": 441521,
        "chinese_name": "海丰县"
    },
    {
        "Id": 1590,
        "DisName": "陆河县",
        "CityID": 191,
        "DisSort": null,
        "CityNameEnglish": "Luhe",
        "district_code": 441523,
        "chinese_name": "陆河县"
    },
    {
        "Id": 1591,
        "DisName": "陆丰市",
        "CityID": 191,
        "DisSort": null,
        "CityNameEnglish": "Lufeng",
        "district_code": 441581,
        "chinese_name": "陆丰市"
    },
    {
        "Id": 1592,
        "DisName": "江城区",
        "CityID": 192,
        "DisSort": null,
        "CityNameEnglish": "Jiangcheng",
        "district_code": 441702,
        "chinese_name": "江城区"
    },
    {
        "Id": 1593,
        "DisName": "阳西县",
        "CityID": 192,
        "DisSort": null,
        "CityNameEnglish": "Yangxi",
        "district_code": 441721,
        "chinese_name": "阳西县"
    },
    {
        "Id": 1594,
        "DisName": "阳东县",
        "CityID": 192,
        "DisSort": null,
        "CityNameEnglish": "Yangdong",
        "district_code": 441723,
        "chinese_name": "阳东县"
    },
    {
        "Id": 1595,
        "DisName": "阳春市",
        "CityID": 192,
        "DisSort": null,
        "CityNameEnglish": "Yangchun",
        "district_code": 441781,
        "chinese_name": "阳春市"
    },
    {
        "Id": 1596,
        "DisName": "榕城区",
        "CityID": 193,
        "DisSort": null,
        "CityNameEnglish": "Rongcheng",
        "district_code": 445202,
        "chinese_name": "榕城区"
    },
    {
        "Id": 1597,
        "DisName": "揭东县",
        "CityID": 193,
        "DisSort": null,
        "CityNameEnglish": "Jiedong",
        "district_code": 445221,
        "chinese_name": "揭东县"
    },
    {
        "Id": 1598,
        "DisName": "揭西县",
        "CityID": 193,
        "DisSort": null,
        "CityNameEnglish": "Jiexi",
        "district_code": 445222,
        "chinese_name": "揭西县"
    },
    {
        "Id": 1599,
        "DisName": "惠来县",
        "CityID": 193,
        "DisSort": null,
        "CityNameEnglish": "Huilai",
        "district_code": 445224,
        "chinese_name": "惠来县"
    },
    {
        "Id": 1600,
        "DisName": "普宁市",
        "CityID": 193,
        "DisSort": null,
        "CityNameEnglish": "Puning",
        "district_code": 445281,
        "chinese_name": "普宁市"
    },
    {
        "Id": 1601,
        "DisName": "茂南区",
        "CityID": 194,
        "DisSort": null,
        "CityNameEnglish": "Maonan",
        "district_code": 440902,
        "chinese_name": "茂南区"
    },
    {
        "Id": 1602,
        "DisName": "茂港区",
        "CityID": 194,
        "DisSort": null,
        "CityNameEnglish": "Maogang",
        "district_code": 440903,
        "chinese_name": "茂港区"
    },
    {
        "Id": 1603,
        "DisName": "电白县",
        "CityID": 194,
        "DisSort": null,
        "CityNameEnglish": "Dianbai",
        "district_code": 440923,
        "chinese_name": "电白县"
    },
    {
        "Id": 1604,
        "DisName": "高州市",
        "CityID": 194,
        "DisSort": null,
        "CityNameEnglish": "Gaozhou",
        "district_code": 440981,
        "chinese_name": "高州市"
    },
    {
        "Id": 1605,
        "DisName": "化州市",
        "CityID": 194,
        "DisSort": null,
        "CityNameEnglish": "Huazhou",
        "district_code": 440982,
        "chinese_name": "化州市"
    },
    {
        "Id": 1606,
        "DisName": "信宜市",
        "CityID": 194,
        "DisSort": null,
        "CityNameEnglish": "Xinyi",
        "district_code": 440983,
        "chinese_name": "信宜市"
    },
    {
        "Id": 1607,
        "DisName": "惠城区",
        "CityID": 195,
        "DisSort": null,
        "CityNameEnglish": "Huicheng",
        "district_code": 441302,
        "chinese_name": "惠城区"
    },
    {
        "Id": 1608,
        "DisName": "惠阳区",
        "CityID": 195,
        "DisSort": null,
        "CityNameEnglish": "Huiyang",
        "district_code": 441303,
        "chinese_name": "惠阳区"
    },
    {
        "Id": 1609,
        "DisName": "博罗县",
        "CityID": 195,
        "DisSort": null,
        "CityNameEnglish": "Boluo",
        "district_code": 441322,
        "chinese_name": "博罗县"
    },
    {
        "Id": 1610,
        "DisName": "惠东县",
        "CityID": 195,
        "DisSort": null,
        "CityNameEnglish": "Huidong",
        "district_code": 441323,
        "chinese_name": "惠东县"
    },
    {
        "Id": 1611,
        "DisName": "龙门县",
        "CityID": 195,
        "DisSort": null,
        "CityNameEnglish": "Longmen",
        "district_code": 441324,
        "chinese_name": "龙门县"
    },
    {
        "Id": 1612,
        "DisName": "蓬江区",
        "CityID": 196,
        "DisSort": null,
        "CityNameEnglish": "Pengjiang",
        "district_code": 440703,
        "chinese_name": "蓬江区"
    },
    {
        "Id": 1613,
        "DisName": "江海区",
        "CityID": 196,
        "DisSort": null,
        "CityNameEnglish": "Jianghai",
        "district_code": 440704,
        "chinese_name": "江海区"
    },
    {
        "Id": 1614,
        "DisName": "新会区",
        "CityID": 196,
        "DisSort": null,
        "CityNameEnglish": "Xinhui",
        "district_code": 440705,
        "chinese_name": "新会区"
    },
    {
        "Id": 1615,
        "DisName": "台山市",
        "CityID": 196,
        "DisSort": null,
        "CityNameEnglish": "Taishan",
        "district_code": 440781,
        "chinese_name": "台山市"
    },
    {
        "Id": 1616,
        "DisName": "开平市",
        "CityID": 196,
        "DisSort": null,
        "CityNameEnglish": "Kaiping",
        "district_code": 440783,
        "chinese_name": "开平市"
    },
    {
        "Id": 1617,
        "DisName": "鹤山市",
        "CityID": 196,
        "DisSort": null,
        "CityNameEnglish": "Heshan",
        "district_code": 440784,
        "chinese_name": "鹤山市"
    },
    {
        "Id": 1629,
        "DisName": "梅江区",
        "CityID": 198,
        "DisSort": null,
        "CityNameEnglish": "Meijiang",
        "district_code": 441402,
        "chinese_name": "梅江区"
    },
    {
        "Id": 1630,
        "DisName": "梅县",
        "CityID": 198,
        "DisSort": null,
        "CityNameEnglish": "Meixian",
        "district_code": 441421,
        "chinese_name": "梅县"
    },
    {
        "Id": 1631,
        "DisName": "大埔县",
        "CityID": 198,
        "DisSort": null,
        "CityNameEnglish": "Dapu",
        "district_code": 441422,
        "chinese_name": "大埔县"
    },
    {
        "Id": 1632,
        "DisName": "丰顺县",
        "CityID": 198,
        "DisSort": null,
        "CityNameEnglish": "Fengshun",
        "district_code": 441423,
        "chinese_name": "丰顺县"
    },
    {
        "Id": 1633,
        "DisName": "五华县",
        "CityID": 198,
        "DisSort": null,
        "CityNameEnglish": "Wuhua",
        "district_code": 441424,
        "chinese_name": "五华县"
    },
    {
        "Id": 1634,
        "DisName": "平远县",
        "CityID": 198,
        "DisSort": null,
        "CityNameEnglish": "Pingyuan",
        "district_code": 441426,
        "chinese_name": "平远县"
    },
    {
        "Id": 1635,
        "DisName": "蕉岭县",
        "CityID": 198,
        "DisSort": null,
        "CityNameEnglish": "Jiaoling",
        "district_code": 441427,
        "chinese_name": "蕉岭县"
    },
    {
        "Id": 1636,
        "DisName": "兴宁市",
        "CityID": 198,
        "DisSort": null,
        "CityNameEnglish": "Xingning",
        "district_code": 441481,
        "chinese_name": "兴宁市"
    },
    {
        "Id": 1637,
        "DisName": "龙湖区",
        "CityID": 199,
        "DisSort": null,
        "CityNameEnglish": "Longhu",
        "district_code": 440507,
        "chinese_name": "龙湖区"
    },
    {
        "Id": 1638,
        "DisName": "金平区",
        "CityID": 199,
        "DisSort": null,
        "CityNameEnglish": "Jinping",
        "district_code": 440511,
        "chinese_name": "金平区"
    },
    {
        "Id": 1639,
        "DisName": "濠江区",
        "CityID": 199,
        "DisSort": null,
        "CityNameEnglish": "Haojiang",
        "district_code": 440512,
        "chinese_name": "濠江区"
    },
    {
        "Id": 1640,
        "DisName": "潮阳区",
        "CityID": 199,
        "DisSort": null,
        "CityNameEnglish": "Chaoyang",
        "district_code": 440513,
        "chinese_name": "潮阳区"
    },
    {
        "Id": 1641,
        "DisName": "潮南区",
        "CityID": 199,
        "DisSort": null,
        "CityNameEnglish": "Chaonan",
        "district_code": 440514,
        "chinese_name": "潮南区"
    },
    {
        "Id": 1642,
        "DisName": "澄海区",
        "CityID": 199,
        "DisSort": null,
        "CityNameEnglish": "Chenghai",
        "district_code": 440515,
        "chinese_name": "澄海区"
    },
    {
        "Id": 1643,
        "DisName": "南澳县",
        "CityID": 199,
        "DisSort": null,
        "CityNameEnglish": "Nan'ao",
        "district_code": 440523,
        "chinese_name": "南澳县"
    },
    {
        "Id": 1644,
        "DisName": "罗湖区",
        "CityID": 200,
        "DisSort": null,
        "CityNameEnglish": "Luohu",
        "district_code": 440303,
        "chinese_name": "罗湖区"
    },
    {
        "Id": 1645,
        "DisName": "福田区",
        "CityID": 200,
        "DisSort": null,
        "CityNameEnglish": "Futian",
        "district_code": 440304,
        "chinese_name": "福田区"
    },
    {
        "Id": 1646,
        "DisName": "南山区",
        "CityID": 200,
        "DisSort": null,
        "CityNameEnglish": "Nanshan",
        "district_code": 440305,
        "chinese_name": "南山区"
    },
    {
        "Id": 1647,
        "DisName": "宝安区",
        "CityID": 200,
        "DisSort": null,
        "CityNameEnglish": "Baoan",
        "district_code": 440306,
        "chinese_name": "宝安区"
    },
    {
        "Id": 1648,
        "DisName": "龙岗区",
        "CityID": 200,
        "DisSort": null,
        "CityNameEnglish": "Longgang",
        "district_code": 440307,
        "chinese_name": "龙岗区"
    },
    {
        "Id": 1649,
        "DisName": "盐田区",
        "CityID": 200,
        "DisSort": null,
        "CityNameEnglish": "Yantian",
        "district_code": 440308,
        "chinese_name": "盐田区"
    },
    {
        "Id": 1650,
        "DisName": "香洲区",
        "CityID": 201,
        "DisSort": null,
        "CityNameEnglish": "Xiangzhou",
        "district_code": 440402,
        "chinese_name": "香洲区"
    },
    {
        "Id": 1651,
        "DisName": "斗门区",
        "CityID": 201,
        "DisSort": null,
        "CityNameEnglish": "Doumen",
        "district_code": 440403,
        "chinese_name": "斗门区"
    },
    {
        "Id": 1652,
        "DisName": "金湾区",
        "CityID": 201,
        "DisSort": null,
        "CityNameEnglish": "Jinwan",
        "district_code": 440404,
        "chinese_name": "金湾区"
    },
    {
        "Id": 1653,
        "DisName": "禅城区",
        "CityID": 202,
        "DisSort": null,
        "CityNameEnglish": "Chancheng",
        "district_code": 440604,
        "chinese_name": "禅城区"
    },
    {
        "Id": 1654,
        "DisName": "南海区",
        "CityID": 202,
        "DisSort": null,
        "CityNameEnglish": "Nanhai",
        "district_code": 440605,
        "chinese_name": "南海区"
    },
    {
        "Id": 1655,
        "DisName": "顺德区",
        "CityID": 202,
        "DisSort": null,
        "CityNameEnglish": "Shunde",
        "district_code": 440606,
        "chinese_name": "顺德区"
    },
    {
        "Id": 1656,
        "DisName": "三水区",
        "CityID": 202,
        "DisSort": null,
        "CityNameEnglish": "Sanshui",
        "district_code": 440607,
        "chinese_name": "三水区"
    },
    {
        "Id": 1657,
        "DisName": "高明区",
        "CityID": 202,
        "DisSort": null,
        "CityNameEnglish": "Gaoming",
        "district_code": 440608,
        "chinese_name": "高明区"
    },
    {
        "Id": 1658,
        "DisName": "端州区",
        "CityID": 203,
        "DisSort": null,
        "CityNameEnglish": "Duanzhou",
        "district_code": 441202,
        "chinese_name": "端州区"
    },
    {
        "Id": 1659,
        "DisName": "鼎湖区",
        "CityID": 203,
        "DisSort": null,
        "CityNameEnglish": "Dinghu",
        "district_code": 441203,
        "chinese_name": "鼎湖区"
    },
    {
        "Id": 1660,
        "DisName": "广宁县",
        "CityID": 203,
        "DisSort": null,
        "CityNameEnglish": "Guangning",
        "district_code": 441223,
        "chinese_name": "广宁县"
    },
    {
        "Id": 1661,
        "DisName": "怀集县",
        "CityID": 203,
        "DisSort": null,
        "CityNameEnglish": "Huaiji",
        "district_code": 441224,
        "chinese_name": "怀集县"
    },
    {
        "Id": 1662,
        "DisName": "封开县",
        "CityID": 203,
        "DisSort": null,
        "CityNameEnglish": "Fengkai",
        "district_code": 441225,
        "chinese_name": "封开县"
    },
    {
        "Id": 1663,
        "DisName": "德庆县",
        "CityID": 203,
        "DisSort": null,
        "CityNameEnglish": "Deqin",
        "district_code": 441226,
        "chinese_name": "德庆县"
    },
    {
        "Id": 1664,
        "DisName": "高要市",
        "CityID": 203,
        "DisSort": null,
        "CityNameEnglish": "Gaoyao",
        "district_code": 441283,
        "chinese_name": "高要市"
    },
    {
        "Id": 1665,
        "DisName": "四会市",
        "CityID": 203,
        "DisSort": null,
        "CityNameEnglish": "Sihui",
        "district_code": 441284,
        "chinese_name": "四会市"
    },
    {
        "Id": 1666,
        "DisName": "赤坎区",
        "CityID": 204,
        "DisSort": null,
        "CityNameEnglish": "Chikan",
        "district_code": 440802,
        "chinese_name": "赤坎区"
    },
    {
        "Id": 1667,
        "DisName": "霞山区",
        "CityID": 204,
        "DisSort": null,
        "CityNameEnglish": "Xiashan",
        "district_code": 440803,
        "chinese_name": "霞山区"
    },
    {
        "Id": 1668,
        "DisName": "坡头区",
        "CityID": 204,
        "DisSort": null,
        "CityNameEnglish": "Potou",
        "district_code": 440804,
        "chinese_name": "坡头区"
    },
    {
        "Id": 1669,
        "DisName": "麻章区",
        "CityID": 204,
        "DisSort": null,
        "CityNameEnglish": "Mazhang",
        "district_code": 440811,
        "chinese_name": "麻章区"
    },
    {
        "Id": 1670,
        "DisName": "遂溪县",
        "CityID": 204,
        "DisSort": null,
        "CityNameEnglish": "Suixi",
        "district_code": 440823,
        "chinese_name": "遂溪县"
    },
    {
        "Id": 1671,
        "DisName": "徐闻县",
        "CityID": 204,
        "DisSort": null,
        "CityNameEnglish": "Xuwen",
        "district_code": 440825,
        "chinese_name": "徐闻县"
    },
    {
        "Id": 1672,
        "DisName": "廉江市",
        "CityID": 204,
        "DisSort": null,
        "CityNameEnglish": "Lianjiang",
        "district_code": 440881,
        "chinese_name": "廉江市"
    },
    {
        "Id": 1673,
        "DisName": "雷州市",
        "CityID": 204,
        "DisSort": null,
        "CityNameEnglish": "Leizhou",
        "district_code": 440882,
        "chinese_name": "雷州市"
    },
    {
        "Id": 1674,
        "DisName": "吴川市",
        "CityID": 204,
        "DisSort": null,
        "CityNameEnglish": "Wuchuan",
        "district_code": 440883,
        "chinese_name": "吴川市"
    },
    {
        "Id": 1675,
        "DisName": "源城区",
        "CityID": 206,
        "DisSort": null,
        "CityNameEnglish": "Yuancheng",
        "district_code": 441602,
        "chinese_name": "源城区"
    },
    {
        "Id": 1676,
        "DisName": "紫金县",
        "CityID": 206,
        "DisSort": null,
        "CityNameEnglish": "Zijin",
        "district_code": 441621,
        "chinese_name": "紫金县"
    },
    {
        "Id": 1677,
        "DisName": "龙川县",
        "CityID": 206,
        "DisSort": null,
        "CityNameEnglish": "Longchuan",
        "district_code": 441622,
        "chinese_name": "龙川县"
    },
    {
        "Id": 1678,
        "DisName": "连平县",
        "CityID": 206,
        "DisSort": null,
        "CityNameEnglish": "Lianping",
        "district_code": 441623,
        "chinese_name": "连平县"
    },
    {
        "Id": 1679,
        "DisName": "和平县",
        "CityID": 206,
        "DisSort": null,
        "CityNameEnglish": "Heping",
        "district_code": 441624,
        "chinese_name": "和平县"
    },
    {
        "Id": 1680,
        "DisName": "东源县",
        "CityID": 206,
        "DisSort": null,
        "CityNameEnglish": "Dongyuan",
        "district_code": 441625,
        "chinese_name": "东源县"
    },
    {
        "Id": 1681,
        "DisName": "清城区",
        "CityID": 207,
        "DisSort": null,
        "CityNameEnglish": "Qingcheng",
        "district_code": 441802,
        "chinese_name": "清城区"
    },
    {
        "Id": 1682,
        "DisName": "佛冈县",
        "CityID": 207,
        "DisSort": null,
        "CityNameEnglish": "Fogang",
        "district_code": 441821,
        "chinese_name": "佛冈县"
    },
    {
        "Id": 1683,
        "DisName": "阳山县",
        "CityID": 207,
        "DisSort": null,
        "CityNameEnglish": "Yangshan",
        "district_code": 441823,
        "chinese_name": "阳山县"
    },
    {
        "Id": 1684,
        "DisName": "连山壮族瑶族自治县",
        "CityID": 207,
        "DisSort": null,
        "CityNameEnglish": "Lianshan",
        "district_code": 441825,
        "chinese_name": "连山壮族瑶族自治县"
    },
    {
        "Id": 1685,
        "DisName": "连南瑶族自治县",
        "CityID": 207,
        "DisSort": null,
        "CityNameEnglish": "Liannan",
        "district_code": 441826,
        "chinese_name": "连南瑶族自治县"
    },
    {
        "Id": 1686,
        "DisName": "清新县",
        "CityID": 207,
        "DisSort": null,
        "CityNameEnglish": "Qingxin",
        "district_code": 441827,
        "chinese_name": "清新县"
    },
    {
        "Id": 1687,
        "DisName": "英德市",
        "CityID": 207,
        "DisSort": null,
        "CityNameEnglish": "Yingde",
        "district_code": 441881,
        "chinese_name": "英德市"
    },
    {
        "Id": 1688,
        "DisName": "连州市",
        "CityID": 207,
        "DisSort": null,
        "CityNameEnglish": "Lianzhou",
        "district_code": 441882,
        "chinese_name": "连州市"
    },
    {
        "Id": 1689,
        "DisName": "云城区",
        "CityID": 208,
        "DisSort": null,
        "CityNameEnglish": "Yuncheng",
        "district_code": 445302,
        "chinese_name": "云城区"
    },
    {
        "Id": 1690,
        "DisName": "新兴县",
        "CityID": 208,
        "DisSort": null,
        "CityNameEnglish": "Xinxing",
        "district_code": 445321,
        "chinese_name": "新兴县"
    },
    {
        "Id": 1691,
        "DisName": "郁南县",
        "CityID": 208,
        "DisSort": null,
        "CityNameEnglish": "Yunan",
        "district_code": 445322,
        "chinese_name": "郁南县"
    },
    {
        "Id": 1692,
        "DisName": "云安县",
        "CityID": 208,
        "DisSort": null,
        "CityNameEnglish": "Yun'an",
        "district_code": 445323,
        "chinese_name": "云安县"
    },
    {
        "Id": 1693,
        "DisName": "罗定市",
        "CityID": 208,
        "DisSort": null,
        "CityNameEnglish": "Luoding",
        "district_code": 445381,
        "chinese_name": "罗定市"
    },
    {
        "Id": 1694,
        "DisName": "湘桥区",
        "CityID": 209,
        "DisSort": null,
        "CityNameEnglish": "Xiangqiao",
        "district_code": 445102,
        "chinese_name": "湘桥区"
    },
    {
        "Id": 1695,
        "DisName": "潮安县",
        "CityID": 209,
        "DisSort": null,
        "CityNameEnglish": "Chaoan",
        "district_code": 445121,
        "chinese_name": "潮安县"
    },
    {
        "Id": 1696,
        "DisName": "饶平县",
        "CityID": 209,
        "DisSort": null,
        "CityNameEnglish": "Raoping",
        "district_code": 445122,
        "chinese_name": "饶平县"
    },
    {
        "Id": 1697,
        "DisName": "城关区",
        "CityID": 211,
        "DisSort": null,
        "CityNameEnglish": "Chengguan",
        "district_code": 620102,
        "chinese_name": "城关区"
    },
    {
        "Id": 1698,
        "DisName": "七里河区",
        "CityID": 211,
        "DisSort": null,
        "CityNameEnglish": "Qilihe",
        "district_code": 620103,
        "chinese_name": "七里河区"
    },
    {
        "Id": 1699,
        "DisName": "西固区",
        "CityID": 211,
        "DisSort": null,
        "CityNameEnglish": "Xigu",
        "district_code": 620104,
        "chinese_name": "西固区"
    },
    {
        "Id": 1700,
        "DisName": "安宁区",
        "CityID": 211,
        "DisSort": null,
        "CityNameEnglish": "Anning",
        "district_code": 620105,
        "chinese_name": "安宁区"
    },
    {
        "Id": 1701,
        "DisName": "红古区",
        "CityID": 211,
        "DisSort": null,
        "CityNameEnglish": "Honggu",
        "district_code": 620111,
        "chinese_name": "红古区"
    },
    {
        "Id": 1702,
        "DisName": "永登县",
        "CityID": 211,
        "DisSort": null,
        "CityNameEnglish": "Yongdeng",
        "district_code": 620121,
        "chinese_name": "永登县"
    },
    {
        "Id": 1703,
        "DisName": "皋兰县",
        "CityID": 211,
        "DisSort": null,
        "CityNameEnglish": "Gaolan",
        "district_code": 620122,
        "chinese_name": "皋兰县"
    },
    {
        "Id": 1704,
        "DisName": "榆中县",
        "CityID": 211,
        "DisSort": null,
        "CityNameEnglish": "Yuzhong",
        "district_code": 620123,
        "chinese_name": "榆中县"
    },
    {
        "Id": 1705,
        "DisName": "金川区",
        "CityID": 212,
        "DisSort": null,
        "CityNameEnglish": "Jinchuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1706,
        "DisName": "永昌县",
        "CityID": 212,
        "DisSort": null,
        "CityNameEnglish": "Yongchang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1707,
        "DisName": "白银区",
        "CityID": 213,
        "DisSort": null,
        "CityNameEnglish": "Baiyin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1708,
        "DisName": "平川区",
        "CityID": 213,
        "DisSort": null,
        "CityNameEnglish": "Pingchuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1709,
        "DisName": "靖远县",
        "CityID": 213,
        "DisSort": null,
        "CityNameEnglish": "Jingyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1710,
        "DisName": "会宁县",
        "CityID": 213,
        "DisSort": null,
        "CityNameEnglish": "Huining",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1711,
        "DisName": "景泰县",
        "CityID": 213,
        "DisSort": null,
        "CityNameEnglish": "Jingtai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1712,
        "DisName": "秦州区",
        "CityID": 214,
        "DisSort": null,
        "CityNameEnglish": "Qinzhou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1713,
        "DisName": "麦积区",
        "CityID": 214,
        "DisSort": null,
        "CityNameEnglish": "Maiji",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1714,
        "DisName": "清水县",
        "CityID": 214,
        "DisSort": null,
        "CityNameEnglish": "Qingshui",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1715,
        "DisName": "秦安县",
        "CityID": 214,
        "DisSort": null,
        "CityNameEnglish": "Qinan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1716,
        "DisName": "甘谷县",
        "CityID": 214,
        "DisSort": null,
        "CityNameEnglish": "Gangu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1717,
        "DisName": "武山县",
        "CityID": 214,
        "DisSort": null,
        "CityNameEnglish": "Wushan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1718,
        "DisName": "张家川回族自治县",
        "CityID": 214,
        "DisSort": null,
        "CityNameEnglish": "Zhangjiachuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1719,
        "DisName": "凉州区",
        "CityID": 216,
        "DisSort": null,
        "CityNameEnglish": "Liangzhou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1720,
        "DisName": "民勤县",
        "CityID": 216,
        "DisSort": null,
        "CityNameEnglish": "Minqin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1721,
        "DisName": "古浪县",
        "CityID": 216,
        "DisSort": null,
        "CityNameEnglish": "Gulang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1722,
        "DisName": "天祝藏族自治县",
        "CityID": 216,
        "DisSort": null,
        "CityNameEnglish": "Tianzhu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1723,
        "DisName": "甘州区",
        "CityID": 217,
        "DisSort": null,
        "CityNameEnglish": "Ganzhou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1724,
        "DisName": "肃南裕固族自治县",
        "CityID": 217,
        "DisSort": null,
        "CityNameEnglish": "Sunan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1725,
        "DisName": "民乐县",
        "CityID": 217,
        "DisSort": null,
        "CityNameEnglish": "Minle",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1726,
        "DisName": "临泽县",
        "CityID": 217,
        "DisSort": null,
        "CityNameEnglish": "Linze",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1727,
        "DisName": "高台县",
        "CityID": 217,
        "DisSort": null,
        "CityNameEnglish": "Gaotai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1728,
        "DisName": "山丹县",
        "CityID": 217,
        "DisSort": null,
        "CityNameEnglish": "Shandan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1729,
        "DisName": "崆峒区",
        "CityID": 218,
        "DisSort": null,
        "CityNameEnglish": "Kongtong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1730,
        "DisName": "泾川县",
        "CityID": 218,
        "DisSort": null,
        "CityNameEnglish": "Jingchuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1731,
        "DisName": "灵台县",
        "CityID": 218,
        "DisSort": null,
        "CityNameEnglish": "Lingtai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1732,
        "DisName": "崇信县",
        "CityID": 218,
        "DisSort": null,
        "CityNameEnglish": "Chongxin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1733,
        "DisName": "华亭县",
        "CityID": 218,
        "DisSort": null,
        "CityNameEnglish": "Huating",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1734,
        "DisName": "庄浪县",
        "CityID": 218,
        "DisSort": null,
        "CityNameEnglish": "Zhuanglang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1735,
        "DisName": "静宁县",
        "CityID": 218,
        "DisSort": null,
        "CityNameEnglish": "Jingning",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1736,
        "DisName": "肃州区",
        "CityID": 219,
        "DisSort": null,
        "CityNameEnglish": "Suzhou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1737,
        "DisName": "金塔县",
        "CityID": 219,
        "DisSort": null,
        "CityNameEnglish": "Jinta",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1738,
        "DisName": "瓜州县",
        "CityID": 219,
        "DisSort": null,
        "CityNameEnglish": "Guazhou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1739,
        "DisName": "肃北蒙古族自治县",
        "CityID": 219,
        "DisSort": null,
        "CityNameEnglish": "Subei",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1740,
        "DisName": "阿克塞哈萨克族自治县",
        "CityID": 219,
        "DisSort": null,
        "CityNameEnglish": "Aksay",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1741,
        "DisName": "玉门市",
        "CityID": 219,
        "DisSort": null,
        "CityNameEnglish": "Yumen",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1742,
        "DisName": "敦煌市",
        "CityID": 219,
        "DisSort": null,
        "CityNameEnglish": "Dunhuang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1743,
        "DisName": "西峰区",
        "CityID": 220,
        "DisSort": null,
        "CityNameEnglish": "Xifeng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1744,
        "DisName": "庆城县",
        "CityID": 220,
        "DisSort": null,
        "CityNameEnglish": "Qingcheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1745,
        "DisName": "环县",
        "CityID": 220,
        "DisSort": null,
        "CityNameEnglish": "Huanxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1746,
        "DisName": "华池县",
        "CityID": 220,
        "DisSort": null,
        "CityNameEnglish": "Huachi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1747,
        "DisName": "合水县",
        "CityID": 220,
        "DisSort": null,
        "CityNameEnglish": "Heshui",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1748,
        "DisName": "正宁县",
        "CityID": 220,
        "DisSort": null,
        "CityNameEnglish": "Zhengning",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1749,
        "DisName": "宁县",
        "CityID": 220,
        "DisSort": null,
        "CityNameEnglish": "Ningxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1750,
        "DisName": "镇原县",
        "CityID": 220,
        "DisSort": null,
        "CityNameEnglish": "Zhenyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1751,
        "DisName": "安定区",
        "CityID": 221,
        "DisSort": null,
        "CityNameEnglish": "Anding",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1752,
        "DisName": "通渭县",
        "CityID": 221,
        "DisSort": null,
        "CityNameEnglish": "Tongwei",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1753,
        "DisName": "陇西县",
        "CityID": 221,
        "DisSort": null,
        "CityNameEnglish": "Longxi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1754,
        "DisName": "渭源县",
        "CityID": 221,
        "DisSort": null,
        "CityNameEnglish": "Weiyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1755,
        "DisName": "临洮县",
        "CityID": 221,
        "DisSort": null,
        "CityNameEnglish": "Lintao",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1756,
        "DisName": "漳县",
        "CityID": 221,
        "DisSort": null,
        "CityNameEnglish": "Zhangxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1757,
        "DisName": "岷县",
        "CityID": 221,
        "DisSort": null,
        "CityNameEnglish": "Minxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1758,
        "DisName": "武都区",
        "CityID": 222,
        "DisSort": null,
        "CityNameEnglish": "Wudu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1759,
        "DisName": "成县",
        "CityID": 222,
        "DisSort": null,
        "CityNameEnglish": "Chengxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1760,
        "DisName": "文县",
        "CityID": 222,
        "DisSort": null,
        "CityNameEnglish": "Wenxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1761,
        "DisName": "宕昌县",
        "CityID": 222,
        "DisSort": null,
        "CityNameEnglish": "Dangchang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1762,
        "DisName": "康县",
        "CityID": 222,
        "DisSort": null,
        "CityNameEnglish": "Kangxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1763,
        "DisName": "西和县",
        "CityID": 222,
        "DisSort": null,
        "CityNameEnglish": "Xihe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1764,
        "DisName": "礼县",
        "CityID": 222,
        "DisSort": null,
        "CityNameEnglish": "Lixian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1765,
        "DisName": "徽县",
        "CityID": 222,
        "DisSort": null,
        "CityNameEnglish": "Huixian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1766,
        "DisName": "两当县",
        "CityID": 222,
        "DisSort": null,
        "CityNameEnglish": "Liangdang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1767,
        "DisName": "临夏市",
        "CityID": 223,
        "DisSort": null,
        "CityNameEnglish": "Linxia",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1768,
        "DisName": "临夏县",
        "CityID": 223,
        "DisSort": null,
        "CityNameEnglish": "Linxia",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1769,
        "DisName": "康乐县",
        "CityID": 223,
        "DisSort": null,
        "CityNameEnglish": "Kangle",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1770,
        "DisName": "永靖县",
        "CityID": 223,
        "DisSort": null,
        "CityNameEnglish": "Yongjing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1771,
        "DisName": "广河县",
        "CityID": 223,
        "DisSort": null,
        "CityNameEnglish": "Guanghe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1772,
        "DisName": "和政县",
        "CityID": 223,
        "DisSort": null,
        "CityNameEnglish": "Hezheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1773,
        "DisName": "东乡族自治县",
        "CityID": 223,
        "DisSort": null,
        "CityNameEnglish": "Dongxiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1774,
        "DisName": "积石山保安族东乡族撒拉族自治县",
        "CityID": 223,
        "DisSort": null,
        "CityNameEnglish": "Jishishan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1775,
        "DisName": "合作市",
        "CityID": 224,
        "DisSort": null,
        "CityNameEnglish": "Hezuo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1776,
        "DisName": "临潭县",
        "CityID": 224,
        "DisSort": null,
        "CityNameEnglish": "Lintan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1777,
        "DisName": "卓尼县",
        "CityID": 224,
        "DisSort": null,
        "CityNameEnglish": "Zhuoni",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1778,
        "DisName": "舟曲县",
        "CityID": 224,
        "DisSort": null,
        "CityNameEnglish": "Zhouqu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1779,
        "DisName": "迭部县",
        "CityID": 224,
        "DisSort": null,
        "CityNameEnglish": "Diebu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1780,
        "DisName": "玛曲县",
        "CityID": 224,
        "DisSort": null,
        "CityNameEnglish": "Maqu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1781,
        "DisName": "碌曲县",
        "CityID": 224,
        "DisSort": null,
        "CityNameEnglish": "Luqu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1782,
        "DisName": "夏河县",
        "CityID": 224,
        "DisSort": null,
        "CityNameEnglish": "Xiahe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1783,
        "DisName": "锦江区",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Jinjiang",
        "district_code": 510104,
        "chinese_name": "锦江区"
    },
    {
        "Id": 1784,
        "DisName": "青羊区",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Qingyang",
        "district_code": 510105,
        "chinese_name": "青羊区"
    },
    {
        "Id": 1785,
        "DisName": "金牛区",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Jinniu",
        "district_code": 510106,
        "chinese_name": "金牛区"
    },
    {
        "Id": 1786,
        "DisName": "武侯区",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Wuhou",
        "district_code": 510107,
        "chinese_name": "武侯区"
    },
    {
        "Id": 1787,
        "DisName": "成华区",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Chenghua",
        "district_code": 510108,
        "chinese_name": "成华区"
    },
    {
        "Id": 1788,
        "DisName": "龙泉驿区",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Longquanyi",
        "district_code": 510112,
        "chinese_name": "龙泉驿区"
    },
    {
        "Id": 1789,
        "DisName": "青白江区",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Qingbaijiang",
        "district_code": 510113,
        "chinese_name": "青白江区"
    },
    {
        "Id": 1790,
        "DisName": "新都区",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Xindu",
        "district_code": 510114,
        "chinese_name": "新都区"
    },
    {
        "Id": 1791,
        "DisName": "温江区",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Wenjiang",
        "district_code": 510115,
        "chinese_name": "温江区"
    },
    {
        "Id": 1792,
        "DisName": "金堂县",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Jintang",
        "district_code": 510121,
        "chinese_name": "金堂县"
    },
    {
        "Id": 1793,
        "DisName": "双流县",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Shuangliu",
        "district_code": 510122,
        "chinese_name": "双流县"
    },
    {
        "Id": 1794,
        "DisName": "郫县",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Pixian",
        "district_code": 510124,
        "chinese_name": "郫县"
    },
    {
        "Id": 1795,
        "DisName": "大邑县",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Dayi",
        "district_code": 510129,
        "chinese_name": "大邑县"
    },
    {
        "Id": 1796,
        "DisName": "蒲江县",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Pujiang",
        "district_code": 510131,
        "chinese_name": "蒲江县"
    },
    {
        "Id": 1797,
        "DisName": "新津县",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Xinjin",
        "district_code": 510132,
        "chinese_name": "新津县"
    },
    {
        "Id": 1798,
        "DisName": "都江堰市",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Dujiangyan",
        "district_code": 510181,
        "chinese_name": "都江堰市"
    },
    {
        "Id": 1799,
        "DisName": "彭州市",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Pengzhou",
        "district_code": 510182,
        "chinese_name": "彭州市"
    },
    {
        "Id": 1800,
        "DisName": "邛崃市",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Qionglai",
        "district_code": 510183,
        "chinese_name": "邛崃市"
    },
    {
        "Id": 1801,
        "DisName": "崇州市",
        "CityID": 225,
        "DisSort": null,
        "CityNameEnglish": "Chongzhou",
        "district_code": 510184,
        "chinese_name": "崇州市"
    },
    {
        "Id": 1802,
        "DisName": "东区",
        "CityID": 226,
        "DisSort": null,
        "CityNameEnglish": "Dong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1803,
        "DisName": "西区",
        "CityID": 226,
        "DisSort": null,
        "CityNameEnglish": "Xi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1804,
        "DisName": "仁和区",
        "CityID": 226,
        "DisSort": null,
        "CityNameEnglish": "Renhe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1805,
        "DisName": "米易县",
        "CityID": 226,
        "DisSort": null,
        "CityNameEnglish": "Miyi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1806,
        "DisName": "盐边县",
        "CityID": 226,
        "DisSort": null,
        "CityNameEnglish": "Yanbian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1807,
        "DisName": "自流井区",
        "CityID": 227,
        "DisSort": null,
        "CityNameEnglish": "Ziliujing",
        "district_code": 510302,
        "chinese_name": "自流井区"
    },
    {
        "Id": 1808,
        "DisName": "贡井区",
        "CityID": 227,
        "DisSort": null,
        "CityNameEnglish": "Gongjing",
        "district_code": 510303,
        "chinese_name": "贡井区"
    },
    {
        "Id": 1809,
        "DisName": "大安区",
        "CityID": 227,
        "DisSort": null,
        "CityNameEnglish": "Daan",
        "district_code": 510304,
        "chinese_name": "大安区"
    },
    {
        "Id": 1810,
        "DisName": "沿滩区",
        "CityID": 227,
        "DisSort": null,
        "CityNameEnglish": "Yantan",
        "district_code": 510311,
        "chinese_name": "沿滩区"
    },
    {
        "Id": 1811,
        "DisName": "荣县",
        "CityID": 227,
        "DisSort": null,
        "CityNameEnglish": "Rongxian",
        "district_code": 510321,
        "chinese_name": "荣县"
    },
    {
        "Id": 1812,
        "DisName": "富顺县",
        "CityID": 227,
        "DisSort": null,
        "CityNameEnglish": "Fushun",
        "district_code": 510322,
        "chinese_name": "富顺县"
    },
    {
        "Id": 1813,
        "DisName": "涪城区",
        "CityID": 228,
        "DisSort": null,
        "CityNameEnglish": "Fucheng",
        "district_code": 510703,
        "chinese_name": "涪城区"
    },
    {
        "Id": 1814,
        "DisName": "游仙区",
        "CityID": 228,
        "DisSort": null,
        "CityNameEnglish": "Youxian",
        "district_code": 510704,
        "chinese_name": "游仙区"
    },
    {
        "Id": 1815,
        "DisName": "三台县",
        "CityID": 228,
        "DisSort": null,
        "CityNameEnglish": "Santai",
        "district_code": 510722,
        "chinese_name": "三台县"
    },
    {
        "Id": 1816,
        "DisName": "盐亭县",
        "CityID": 228,
        "DisSort": null,
        "CityNameEnglish": "Yanting",
        "district_code": 510723,
        "chinese_name": "盐亭县"
    },
    {
        "Id": 1817,
        "DisName": "安县",
        "CityID": 228,
        "DisSort": null,
        "CityNameEnglish": "Anxian",
        "district_code": 510724,
        "chinese_name": "安县"
    },
    {
        "Id": 1818,
        "DisName": "梓潼县",
        "CityID": 228,
        "DisSort": null,
        "CityNameEnglish": "Zitong",
        "district_code": 510725,
        "chinese_name": "梓潼县"
    },
    {
        "Id": 1819,
        "DisName": "北川羌族自治县",
        "CityID": 228,
        "DisSort": null,
        "CityNameEnglish": "Beichuan",
        "district_code": 510726,
        "chinese_name": "北川羌族自治县"
    },
    {
        "Id": 1820,
        "DisName": "平武县",
        "CityID": 228,
        "DisSort": null,
        "CityNameEnglish": "Pingwu",
        "district_code": 510727,
        "chinese_name": "平武县"
    },
    {
        "Id": 1821,
        "DisName": "江油市",
        "CityID": 228,
        "DisSort": null,
        "CityNameEnglish": "Jiangyou",
        "district_code": 510781,
        "chinese_name": "江油市"
    },
    {
        "Id": 1822,
        "DisName": "顺庆区",
        "CityID": 229,
        "DisSort": null,
        "CityNameEnglish": "Shunqing",
        "district_code": 511302,
        "chinese_name": "顺庆区"
    },
    {
        "Id": 1823,
        "DisName": "高坪区",
        "CityID": 229,
        "DisSort": null,
        "CityNameEnglish": "Gaoping",
        "district_code": 511303,
        "chinese_name": "高坪区"
    },
    {
        "Id": 1824,
        "DisName": "嘉陵区",
        "CityID": 229,
        "DisSort": null,
        "CityNameEnglish": "Jialing",
        "district_code": 511304,
        "chinese_name": "嘉陵区"
    },
    {
        "Id": 1825,
        "DisName": "南部县",
        "CityID": 229,
        "DisSort": null,
        "CityNameEnglish": "Nanbu",
        "district_code": 511321,
        "chinese_name": "南部县"
    },
    {
        "Id": 1826,
        "DisName": "营山县",
        "CityID": 229,
        "DisSort": null,
        "CityNameEnglish": "Yingshan",
        "district_code": 511322,
        "chinese_name": "营山县"
    },
    {
        "Id": 1827,
        "DisName": "蓬安县",
        "CityID": 229,
        "DisSort": null,
        "CityNameEnglish": "Peng'an",
        "district_code": 511323,
        "chinese_name": "蓬安县"
    },
    {
        "Id": 1828,
        "DisName": "仪陇县",
        "CityID": 229,
        "DisSort": null,
        "CityNameEnglish": "Yilong",
        "district_code": 511324,
        "chinese_name": "仪陇县"
    },
    {
        "Id": 1829,
        "DisName": "西充县",
        "CityID": 229,
        "DisSort": null,
        "CityNameEnglish": "Xichong",
        "district_code": 511325,
        "chinese_name": "西充县"
    },
    {
        "Id": 1830,
        "DisName": "阆中市",
        "CityID": 229,
        "DisSort": null,
        "CityNameEnglish": "Langzhong",
        "district_code": 511381,
        "chinese_name": "阆中市"
    },
    {
        "Id": 1831,
        "DisName": "通川区",
        "CityID": 230,
        "DisSort": null,
        "CityNameEnglish": "Tongchuan",
        "district_code": 511702,
        "chinese_name": "通川区"
    },
    {
        "Id": 1832,
        "DisName": "达县",
        "CityID": 230,
        "DisSort": null,
        "CityNameEnglish": "Daxian",
        "district_code": 511721,
        "chinese_name": "达县"
    },
    {
        "Id": 1833,
        "DisName": "宣汉县",
        "CityID": 230,
        "DisSort": null,
        "CityNameEnglish": "Xuanhan",
        "district_code": 511722,
        "chinese_name": "宣汉县"
    },
    {
        "Id": 1834,
        "DisName": "开江县",
        "CityID": 230,
        "DisSort": null,
        "CityNameEnglish": "Kaijiang",
        "district_code": 511723,
        "chinese_name": "开江县"
    },
    {
        "Id": 1835,
        "DisName": "大竹县",
        "CityID": 230,
        "DisSort": null,
        "CityNameEnglish": "Dazhu",
        "district_code": 511724,
        "chinese_name": "大竹县"
    },
    {
        "Id": 1836,
        "DisName": "渠县",
        "CityID": 230,
        "DisSort": null,
        "CityNameEnglish": "Quxian",
        "district_code": 511725,
        "chinese_name": "渠县"
    },
    {
        "Id": 1837,
        "DisName": "万源市",
        "CityID": 230,
        "DisSort": null,
        "CityNameEnglish": "Wanyuan",
        "district_code": 511781,
        "chinese_name": "万源市"
    },
    {
        "Id": 1838,
        "DisName": "船山区",
        "CityID": 231,
        "DisSort": null,
        "CityNameEnglish": "Chuanshan",
        "district_code": 510903,
        "chinese_name": "船山区"
    },
    {
        "Id": 1839,
        "DisName": "安居区",
        "CityID": 231,
        "DisSort": null,
        "CityNameEnglish": "Anju",
        "district_code": 510904,
        "chinese_name": "安居区"
    },
    {
        "Id": 1840,
        "DisName": "蓬溪县",
        "CityID": 231,
        "DisSort": null,
        "CityNameEnglish": "Pengxi",
        "district_code": 510921,
        "chinese_name": "蓬溪县"
    },
    {
        "Id": 1841,
        "DisName": "射洪县",
        "CityID": 231,
        "DisSort": null,
        "CityNameEnglish": "Shehong",
        "district_code": 510922,
        "chinese_name": "射洪县"
    },
    {
        "Id": 1842,
        "DisName": "大英县",
        "CityID": 231,
        "DisSort": null,
        "CityNameEnglish": "Daying",
        "district_code": 510923,
        "chinese_name": "大英县"
    },
    {
        "Id": 1843,
        "DisName": "广安区",
        "CityID": 232,
        "DisSort": null,
        "CityNameEnglish": "Guang'an",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1844,
        "DisName": "岳池县",
        "CityID": 232,
        "DisSort": null,
        "CityNameEnglish": "Yuechi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1845,
        "DisName": "武胜县",
        "CityID": 232,
        "DisSort": null,
        "CityNameEnglish": "Wusheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1846,
        "DisName": "邻水县",
        "CityID": 232,
        "DisSort": null,
        "CityNameEnglish": "Linshui",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1847,
        "DisName": "华蓥市",
        "CityID": 232,
        "DisSort": null,
        "CityNameEnglish": "Huaying",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1848,
        "DisName": "巴州区",
        "CityID": 233,
        "DisSort": null,
        "CityNameEnglish": "Bazhou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1849,
        "DisName": "通江县",
        "CityID": 233,
        "DisSort": null,
        "CityNameEnglish": "Tongjiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1850,
        "DisName": "南江县",
        "CityID": 233,
        "DisSort": null,
        "CityNameEnglish": "Nanjiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1851,
        "DisName": "平昌县",
        "CityID": 233,
        "DisSort": null,
        "CityNameEnglish": "Pingchang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1852,
        "DisName": "江阳区",
        "CityID": 234,
        "DisSort": null,
        "CityNameEnglish": "Jiangyang",
        "district_code": 510502,
        "chinese_name": "江阳区"
    },
    {
        "Id": 1853,
        "DisName": "纳溪区",
        "CityID": 234,
        "DisSort": null,
        "CityNameEnglish": "Naxi",
        "district_code": 510503,
        "chinese_name": "纳溪区"
    },
    {
        "Id": 1854,
        "DisName": "龙马潭区",
        "CityID": 234,
        "DisSort": null,
        "CityNameEnglish": "Longmatan",
        "district_code": 510504,
        "chinese_name": "龙马潭区"
    },
    {
        "Id": 1855,
        "DisName": "泸县",
        "CityID": 234,
        "DisSort": null,
        "CityNameEnglish": "Luxian",
        "district_code": 510521,
        "chinese_name": "泸县"
    },
    {
        "Id": 1856,
        "DisName": "合江县",
        "CityID": 234,
        "DisSort": null,
        "CityNameEnglish": "Hejiang",
        "district_code": 510522,
        "chinese_name": "合江县"
    },
    {
        "Id": 1857,
        "DisName": "叙永县",
        "CityID": 234,
        "DisSort": null,
        "CityNameEnglish": "Xuyong",
        "district_code": 510524,
        "chinese_name": "叙永县"
    },
    {
        "Id": 1858,
        "DisName": "古蔺县",
        "CityID": 234,
        "DisSort": null,
        "CityNameEnglish": "Gulin",
        "district_code": 510525,
        "chinese_name": "古蔺县"
    },
    {
        "Id": 1859,
        "DisName": "翠屏区",
        "CityID": 235,
        "DisSort": null,
        "CityNameEnglish": "Cuiping",
        "district_code": 511502,
        "chinese_name": "翠屏区"
    },
    {
        "Id": 1860,
        "DisName": "宜宾县",
        "CityID": 235,
        "DisSort": null,
        "CityNameEnglish": "Yibin",
        "district_code": 511521,
        "chinese_name": "宜宾县"
    },
    {
        "Id": 1861,
        "DisName": "南溪县",
        "CityID": 235,
        "DisSort": null,
        "CityNameEnglish": "Nanxi",
        "district_code": 511522,
        "chinese_name": "南溪县"
    },
    {
        "Id": 1862,
        "DisName": "江安县",
        "CityID": 235,
        "DisSort": null,
        "CityNameEnglish": "Jiangan",
        "district_code": 511523,
        "chinese_name": "江安县"
    },
    {
        "Id": 1863,
        "DisName": "长宁县",
        "CityID": 235,
        "DisSort": null,
        "CityNameEnglish": "Changning",
        "district_code": 511524,
        "chinese_name": "长宁县"
    },
    {
        "Id": 1864,
        "DisName": "高县",
        "CityID": 235,
        "DisSort": null,
        "CityNameEnglish": "Gaoxian",
        "district_code": 511525,
        "chinese_name": "高县"
    },
    {
        "Id": 1865,
        "DisName": "珙县",
        "CityID": 235,
        "DisSort": null,
        "CityNameEnglish": "Gongxian",
        "district_code": 511526,
        "chinese_name": "珙县"
    },
    {
        "Id": 1866,
        "DisName": "筠连县",
        "CityID": 235,
        "DisSort": null,
        "CityNameEnglish": "Junlian",
        "district_code": 511527,
        "chinese_name": "筠连县"
    },
    {
        "Id": 1867,
        "DisName": "兴文县",
        "CityID": 235,
        "DisSort": null,
        "CityNameEnglish": "Xingwen",
        "district_code": 511528,
        "chinese_name": "兴文县"
    },
    {
        "Id": 1868,
        "DisName": "屏山县",
        "CityID": 235,
        "DisSort": null,
        "CityNameEnglish": "Pingshan",
        "district_code": 511529,
        "chinese_name": "屏山县"
    },
    {
        "Id": 1869,
        "DisName": "雁江区",
        "CityID": 236,
        "DisSort": null,
        "CityNameEnglish": "Yanjiang",
        "district_code": 512002,
        "chinese_name": "雁江区"
    },
    {
        "Id": 1870,
        "DisName": "安岳县",
        "CityID": 236,
        "DisSort": null,
        "CityNameEnglish": "Anyue",
        "district_code": 512021,
        "chinese_name": "安岳县"
    },
    {
        "Id": 1871,
        "DisName": "乐至县",
        "CityID": 236,
        "DisSort": null,
        "CityNameEnglish": "Lezhi",
        "district_code": 512022,
        "chinese_name": "乐至县"
    },
    {
        "Id": 1872,
        "DisName": "简阳市",
        "CityID": 236,
        "DisSort": null,
        "CityNameEnglish": "Jianyang",
        "district_code": 512081,
        "chinese_name": "简阳市"
    },
    {
        "Id": 1873,
        "DisName": "市中区",
        "CityID": 237,
        "DisSort": null,
        "CityNameEnglish": "Xingzhong",
        "district_code": 511002,
        "chinese_name": "市中区"
    },
    {
        "Id": 1874,
        "DisName": "东兴区",
        "CityID": 237,
        "DisSort": null,
        "CityNameEnglish": "Dongxing",
        "district_code": 511011,
        "chinese_name": "东兴区"
    },
    {
        "Id": 1875,
        "DisName": "威远县",
        "CityID": 237,
        "DisSort": null,
        "CityNameEnglish": "Weiyuan",
        "district_code": 511024,
        "chinese_name": "威远县"
    },
    {
        "Id": 1876,
        "DisName": "资中县",
        "CityID": 237,
        "DisSort": null,
        "CityNameEnglish": "Zizhong",
        "district_code": 511025,
        "chinese_name": "资中县"
    },
    {
        "Id": 1877,
        "DisName": "隆昌县",
        "CityID": 237,
        "DisSort": null,
        "CityNameEnglish": "Longchang",
        "district_code": 511028,
        "chinese_name": "隆昌县"
    },
    {
        "Id": 1878,
        "DisName": "市中区",
        "CityID": 238,
        "DisSort": null,
        "CityNameEnglish": "Shizhong",
        "district_code": 511102,
        "chinese_name": "市中区"
    },
    {
        "Id": 1879,
        "DisName": "沙湾区",
        "CityID": 238,
        "DisSort": null,
        "CityNameEnglish": "Shawan",
        "district_code": 511111,
        "chinese_name": "沙湾区"
    },
    {
        "Id": 1880,
        "DisName": "五通桥区",
        "CityID": 238,
        "DisSort": null,
        "CityNameEnglish": "Wutongqiao",
        "district_code": 511112,
        "chinese_name": "五通桥区"
    },
    {
        "Id": 1881,
        "DisName": "金口河区",
        "CityID": 238,
        "DisSort": null,
        "CityNameEnglish": "Jinkouhe",
        "district_code": 511113,
        "chinese_name": "金口河区"
    },
    {
        "Id": 1882,
        "DisName": "犍为县",
        "CityID": 238,
        "DisSort": null,
        "CityNameEnglish": "Qianwei",
        "district_code": 511123,
        "chinese_name": "犍为县"
    },
    {
        "Id": 1883,
        "DisName": "井研县",
        "CityID": 238,
        "DisSort": null,
        "CityNameEnglish": "Jingyan",
        "district_code": 511124,
        "chinese_name": "井研县"
    },
    {
        "Id": 1884,
        "DisName": "夹江县",
        "CityID": 238,
        "DisSort": null,
        "CityNameEnglish": "Jiajiang",
        "district_code": 511126,
        "chinese_name": "夹江县"
    },
    {
        "Id": 1885,
        "DisName": "沐川县",
        "CityID": 238,
        "DisSort": null,
        "CityNameEnglish": "Muchuan",
        "district_code": 511129,
        "chinese_name": "沐川县"
    },
    {
        "Id": 1886,
        "DisName": "峨边彝族自治县",
        "CityID": 238,
        "DisSort": null,
        "CityNameEnglish": "Ebian",
        "district_code": 511132,
        "chinese_name": "峨边彝族自治县"
    },
    {
        "Id": 1887,
        "DisName": "马边彝族自治县",
        "CityID": 238,
        "DisSort": null,
        "CityNameEnglish": "Mabian",
        "district_code": 511133,
        "chinese_name": "马边彝族自治县"
    },
    {
        "Id": 1888,
        "DisName": "峨眉山市",
        "CityID": 238,
        "DisSort": null,
        "CityNameEnglish": "Emeishan",
        "district_code": 511181,
        "chinese_name": "峨眉山市"
    },
    {
        "Id": 1889,
        "DisName": "东坡区",
        "CityID": 239,
        "DisSort": null,
        "CityNameEnglish": "Dongpo",
        "district_code": 511402,
        "chinese_name": "东坡区"
    },
    {
        "Id": 1890,
        "DisName": "仁寿县",
        "CityID": 239,
        "DisSort": null,
        "CityNameEnglish": "Renshou",
        "district_code": 511421,
        "chinese_name": "仁寿县"
    },
    {
        "Id": 1891,
        "DisName": "彭山县",
        "CityID": 239,
        "DisSort": null,
        "CityNameEnglish": "Pengshan",
        "district_code": 511422,
        "chinese_name": "彭山县"
    },
    {
        "Id": 1892,
        "DisName": "洪雅县",
        "CityID": 239,
        "DisSort": null,
        "CityNameEnglish": "Hongya",
        "district_code": 511423,
        "chinese_name": "洪雅县"
    },
    {
        "Id": 1893,
        "DisName": "丹棱县",
        "CityID": 239,
        "DisSort": null,
        "CityNameEnglish": "Danleng",
        "district_code": 511424,
        "chinese_name": "丹棱县"
    },
    {
        "Id": 1894,
        "DisName": "青神县",
        "CityID": 239,
        "DisSort": null,
        "CityNameEnglish": "Qingshen",
        "district_code": 511425,
        "chinese_name": "青神县"
    },
    {
        "Id": 1895,
        "DisName": "西昌市",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Xichang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1896,
        "DisName": "木里藏族自治县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Muli",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1897,
        "DisName": "盐源县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Yanyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1898,
        "DisName": "德昌县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Dechang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1899,
        "DisName": "会理县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Huili",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1900,
        "DisName": "会东县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Huidong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1901,
        "DisName": "宁南县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Ningnan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1902,
        "DisName": "普格县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Puge",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1903,
        "DisName": "布拖县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Butuo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1904,
        "DisName": "金阳县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Jinyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1905,
        "DisName": "昭觉县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Zhaojue",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1906,
        "DisName": "喜德县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Xide",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1907,
        "DisName": "冕宁县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Mianning",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1908,
        "DisName": "越西县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Yuexi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1909,
        "DisName": "甘洛县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Ganluo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1910,
        "DisName": "美姑县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Meigu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1911,
        "DisName": "雷波县",
        "CityID": 240,
        "DisSort": null,
        "CityNameEnglish": "Leibo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1912,
        "DisName": "雨城区",
        "CityID": 241,
        "DisSort": null,
        "CityNameEnglish": "Yucheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1913,
        "DisName": "名山县",
        "CityID": 241,
        "DisSort": null,
        "CityNameEnglish": "Mingshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1914,
        "DisName": "荥经县",
        "CityID": 241,
        "DisSort": null,
        "CityNameEnglish": "Yingjing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1915,
        "DisName": "汉源县",
        "CityID": 241,
        "DisSort": null,
        "CityNameEnglish": "Hanyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1916,
        "DisName": "石棉县",
        "CityID": 241,
        "DisSort": null,
        "CityNameEnglish": "Shimian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1917,
        "DisName": "天全县",
        "CityID": 241,
        "DisSort": null,
        "CityNameEnglish": "Tianquan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1918,
        "DisName": "芦山县",
        "CityID": 241,
        "DisSort": null,
        "CityNameEnglish": "Lushan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1919,
        "DisName": "宝兴县",
        "CityID": 241,
        "DisSort": null,
        "CityNameEnglish": "Baoxing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1920,
        "DisName": "康定县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Kangding",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1921,
        "DisName": "泸定县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Luding",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1922,
        "DisName": "丹巴县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Danba",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1923,
        "DisName": "九龙县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Jiulong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1924,
        "DisName": "雅江县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Yajiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1925,
        "DisName": "道孚县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Daofu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1926,
        "DisName": "炉霍县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Luhuo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1927,
        "DisName": "甘孜县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Ganzi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1928,
        "DisName": "新龙县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Xinlong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1929,
        "DisName": "德格县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Dege",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1930,
        "DisName": "白玉县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Baiyu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1931,
        "DisName": "石渠县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Shiqu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1932,
        "DisName": "色达县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Seda",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1933,
        "DisName": "理塘县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Litang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1934,
        "DisName": "巴塘县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Batang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1935,
        "DisName": "乡城县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Xiangcheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1936,
        "DisName": "稻城县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Daocheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1937,
        "DisName": "得荣县",
        "CityID": 242,
        "DisSort": null,
        "CityNameEnglish": "Derong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1938,
        "DisName": "汶川县",
        "CityID": 243,
        "DisSort": null,
        "CityNameEnglish": "Wenchuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1939,
        "DisName": "理县",
        "CityID": 243,
        "DisSort": null,
        "CityNameEnglish": "Lixian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1940,
        "DisName": "茂县",
        "CityID": 243,
        "DisSort": null,
        "CityNameEnglish": "Maoxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1941,
        "DisName": "松潘县",
        "CityID": 243,
        "DisSort": null,
        "CityNameEnglish": "Songpan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1942,
        "DisName": "九寨沟县",
        "CityID": 243,
        "DisSort": null,
        "CityNameEnglish": "Jiuzhaigou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1943,
        "DisName": "金川县",
        "CityID": 243,
        "DisSort": null,
        "CityNameEnglish": "Jinchuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1944,
        "DisName": "小金县",
        "CityID": 243,
        "DisSort": null,
        "CityNameEnglish": "Xiaojin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1945,
        "DisName": "黑水县",
        "CityID": 243,
        "DisSort": null,
        "CityNameEnglish": "Heishui",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1946,
        "DisName": "马尔康县",
        "CityID": 243,
        "DisSort": null,
        "CityNameEnglish": "Barkam",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1947,
        "DisName": "壤塘县",
        "CityID": 243,
        "DisSort": null,
        "CityNameEnglish": "Rangtang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1948,
        "DisName": "阿坝县",
        "CityID": 243,
        "DisSort": null,
        "CityNameEnglish": "Aba",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1949,
        "DisName": "若尔盖县",
        "CityID": 243,
        "DisSort": null,
        "CityNameEnglish": "Ruoergai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1950,
        "DisName": "红原县",
        "CityID": 243,
        "DisSort": null,
        "CityNameEnglish": "Hongyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1951,
        "DisName": "旌阳区",
        "CityID": 244,
        "DisSort": null,
        "CityNameEnglish": "Jingyang",
        "district_code": 510603,
        "chinese_name": "旌阳区"
    },
    {
        "Id": 1952,
        "DisName": "中江县",
        "CityID": 244,
        "DisSort": null,
        "CityNameEnglish": "Zhongjiang",
        "district_code": 510623,
        "chinese_name": "中江县"
    },
    {
        "Id": 1953,
        "DisName": "罗江县",
        "CityID": 244,
        "DisSort": null,
        "CityNameEnglish": "Luojiang",
        "district_code": 510626,
        "chinese_name": "罗江县"
    },
    {
        "Id": 1954,
        "DisName": "广汉市",
        "CityID": 244,
        "DisSort": null,
        "CityNameEnglish": "Guanghan",
        "district_code": 510681,
        "chinese_name": "广汉市"
    },
    {
        "Id": 1955,
        "DisName": "什邡市",
        "CityID": 244,
        "DisSort": null,
        "CityNameEnglish": "Shifang",
        "district_code": 510682,
        "chinese_name": "什邡市"
    },
    {
        "Id": 1956,
        "DisName": "绵竹市",
        "CityID": 244,
        "DisSort": null,
        "CityNameEnglish": "Mianzhu",
        "district_code": 510683,
        "chinese_name": "绵竹市"
    },
    {
        "Id": 1957,
        "DisName": "市中区",
        "CityID": 245,
        "DisSort": null,
        "CityNameEnglish": "Shizhong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1958,
        "DisName": "元坝区",
        "CityID": 245,
        "DisSort": null,
        "CityNameEnglish": "Yuanba",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1959,
        "DisName": "朝天区",
        "CityID": 245,
        "DisSort": null,
        "CityNameEnglish": "Chaotian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1960,
        "DisName": "旺苍县",
        "CityID": 245,
        "DisSort": null,
        "CityNameEnglish": "Wangcang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1961,
        "DisName": "青川县",
        "CityID": 245,
        "DisSort": null,
        "CityNameEnglish": "Qingchuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1962,
        "DisName": "剑阁县",
        "CityID": 245,
        "DisSort": null,
        "CityNameEnglish": "Jiange",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1963,
        "DisName": "苍溪县",
        "CityID": 245,
        "DisSort": null,
        "CityNameEnglish": "Cangxi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 1964,
        "DisName": "南明区",
        "CityID": 246,
        "DisSort": null,
        "CityNameEnglish": "Nanming",
        "district_code": 520102,
        "chinese_name": "南明区"
    },
    {
        "Id": 1965,
        "DisName": "云岩区",
        "CityID": 246,
        "DisSort": null,
        "CityNameEnglish": "Yunyan",
        "district_code": 520103,
        "chinese_name": "云岩区"
    },
    {
        "Id": 1966,
        "DisName": "花溪区",
        "CityID": 246,
        "DisSort": null,
        "CityNameEnglish": "Huaxi",
        "district_code": 520111,
        "chinese_name": "花溪区"
    },
    {
        "Id": 1967,
        "DisName": "乌当区",
        "CityID": 246,
        "DisSort": null,
        "CityNameEnglish": "Wudang",
        "district_code": 520112,
        "chinese_name": "乌当区"
    },
    {
        "Id": 1968,
        "DisName": "白云区",
        "CityID": 246,
        "DisSort": null,
        "CityNameEnglish": "Baiyun",
        "district_code": 520113,
        "chinese_name": "白云区"
    },
    {
        "Id": 1969,
        "DisName": "小河区",
        "CityID": 246,
        "DisSort": null,
        "CityNameEnglish": "Xiaohe",
        "district_code": 520114,
        "chinese_name": "小河区"
    },
    {
        "Id": 1970,
        "DisName": "开阳县",
        "CityID": 246,
        "DisSort": null,
        "CityNameEnglish": "Kaiyang",
        "district_code": 520121,
        "chinese_name": "开阳县"
    },
    {
        "Id": 1971,
        "DisName": "息烽县",
        "CityID": 246,
        "DisSort": null,
        "CityNameEnglish": "Xifeng",
        "district_code": 520122,
        "chinese_name": "息烽县"
    },
    {
        "Id": 1972,
        "DisName": "修文县",
        "CityID": 246,
        "DisSort": null,
        "CityNameEnglish": "Xiuwen",
        "district_code": 520123,
        "chinese_name": "修文县"
    },
    {
        "Id": 1973,
        "DisName": "清镇市",
        "CityID": 246,
        "DisSort": null,
        "CityNameEnglish": "Qingzhen",
        "district_code": 520181,
        "chinese_name": "清镇市"
    },
    {
        "Id": 2052,
        "DisName": "秀英区",
        "CityID": 255,
        "DisSort": null,
        "CityNameEnglish": "Xiuying",
        "district_code": 460105,
        "chinese_name": "秀英区"
    },
    {
        "Id": 2053,
        "DisName": "龙华区",
        "CityID": 255,
        "DisSort": null,
        "CityNameEnglish": "Longhua",
        "district_code": 460106,
        "chinese_name": "龙华区"
    },
    {
        "Id": 2054,
        "DisName": "琼山区",
        "CityID": 255,
        "DisSort": null,
        "CityNameEnglish": "Qiongshan",
        "district_code": 460107,
        "chinese_name": "琼山区"
    },
    {
        "Id": 2055,
        "DisName": "美兰区",
        "CityID": 255,
        "DisSort": null,
        "CityNameEnglish": "Meilan",
        "district_code": 460108,
        "chinese_name": "美兰区"
    },
    {
        "Id": 2056,
        "DisName": "景洪市",
        "CityID": 273,
        "DisSort": null,
        "CityNameEnglish": "Jinghong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2057,
        "DisName": "勐海县",
        "CityID": 273,
        "DisSort": null,
        "CityNameEnglish": "Menghai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2058,
        "DisName": "勐腊县",
        "CityID": 273,
        "DisSort": null,
        "CityNameEnglish": "Mengla",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2059,
        "DisName": "瑞丽市",
        "CityID": 274,
        "DisSort": null,
        "CityNameEnglish": "Ruili",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2060,
        "DisName": "潞西市",
        "CityID": 274,
        "DisSort": null,
        "CityNameEnglish": "Luxi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2061,
        "DisName": "梁河县",
        "CityID": 274,
        "DisSort": null,
        "CityNameEnglish": "Lianghe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2062,
        "DisName": "盈江县",
        "CityID": 274,
        "DisSort": null,
        "CityNameEnglish": "Yingjiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2063,
        "DisName": "陇川县",
        "CityID": 274,
        "DisSort": null,
        "CityNameEnglish": "Longchuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2064,
        "DisName": "昭阳区",
        "CityID": 275,
        "DisSort": null,
        "CityNameEnglish": "Zhaoyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2065,
        "DisName": "鲁甸县",
        "CityID": 275,
        "DisSort": null,
        "CityNameEnglish": "Ludian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2066,
        "DisName": "巧家县",
        "CityID": 275,
        "DisSort": null,
        "CityNameEnglish": "Qiaojia",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2067,
        "DisName": "盐津县",
        "CityID": 275,
        "DisSort": null,
        "CityNameEnglish": "Yanjin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2068,
        "DisName": "大关县",
        "CityID": 275,
        "DisSort": null,
        "CityNameEnglish": "Daguan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2069,
        "DisName": "永善县",
        "CityID": 275,
        "DisSort": null,
        "CityNameEnglish": "Yongshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2070,
        "DisName": "绥江县",
        "CityID": 275,
        "DisSort": null,
        "CityNameEnglish": "Suijiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2071,
        "DisName": "镇雄县",
        "CityID": 275,
        "DisSort": null,
        "CityNameEnglish": "Zhenxiong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2072,
        "DisName": "彝良县",
        "CityID": 275,
        "DisSort": null,
        "CityNameEnglish": "Yiliang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2073,
        "DisName": "威信县",
        "CityID": 275,
        "DisSort": null,
        "CityNameEnglish": "Weixin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2074,
        "DisName": "水富县",
        "CityID": 275,
        "DisSort": null,
        "CityNameEnglish": "Shuifu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2075,
        "DisName": "五华区",
        "CityID": 276,
        "DisSort": null,
        "CityNameEnglish": "Wuhua",
        "district_code": 530102,
        "chinese_name": "五华区"
    },
    {
        "Id": 2076,
        "DisName": "盘龙区",
        "CityID": 276,
        "DisSort": null,
        "CityNameEnglish": "Panlong",
        "district_code": 530103,
        "chinese_name": "盘龙区"
    },
    {
        "Id": 2077,
        "DisName": "官渡区",
        "CityID": 276,
        "DisSort": null,
        "CityNameEnglish": "Guandu",
        "district_code": 530111,
        "chinese_name": "官渡区"
    },
    {
        "Id": 2078,
        "DisName": "西山区",
        "CityID": 276,
        "DisSort": null,
        "CityNameEnglish": "Xishan",
        "district_code": 530112,
        "chinese_name": "西山区"
    },
    {
        "Id": 2079,
        "DisName": "东川区",
        "CityID": 276,
        "DisSort": null,
        "CityNameEnglish": "Dongchuan",
        "district_code": 530113,
        "chinese_name": "东川区"
    },
    {
        "Id": 2080,
        "DisName": "呈贡县",
        "CityID": 276,
        "DisSort": null,
        "CityNameEnglish": "Chenggong",
        "district_code": 530121,
        "chinese_name": "呈贡县"
    },
    {
        "Id": 2081,
        "DisName": "晋宁县",
        "CityID": 276,
        "DisSort": null,
        "CityNameEnglish": "Jinning",
        "district_code": 530122,
        "chinese_name": "晋宁县"
    },
    {
        "Id": 2082,
        "DisName": "富民县",
        "CityID": 276,
        "DisSort": null,
        "CityNameEnglish": "Fumin",
        "district_code": 530124,
        "chinese_name": "富民县"
    },
    {
        "Id": 2083,
        "DisName": "宜良县",
        "CityID": 276,
        "DisSort": null,
        "CityNameEnglish": "Yiliang",
        "district_code": 530125,
        "chinese_name": "宜良县"
    },
    {
        "Id": 2084,
        "DisName": "石林彝族自治县",
        "CityID": 276,
        "DisSort": null,
        "CityNameEnglish": "Shilin",
        "district_code": 530126,
        "chinese_name": "石林彝族自治县"
    },
    {
        "Id": 2085,
        "DisName": "嵩明县",
        "CityID": 276,
        "DisSort": null,
        "CityNameEnglish": "Songming",
        "district_code": 530127,
        "chinese_name": "嵩明县"
    },
    {
        "Id": 2086,
        "DisName": "禄劝彝族苗族自治县",
        "CityID": 276,
        "DisSort": null,
        "CityNameEnglish": "Luquan",
        "district_code": 530128,
        "chinese_name": "禄劝彝族苗族自治县"
    },
    {
        "Id": 2087,
        "DisName": "寻甸回族彝族自治县",
        "CityID": 276,
        "DisSort": null,
        "CityNameEnglish": "Xundian",
        "district_code": 530129,
        "chinese_name": "寻甸回族彝族自治县"
    },
    {
        "Id": 2088,
        "DisName": "安宁市",
        "CityID": 276,
        "DisSort": null,
        "CityNameEnglish": "Anning",
        "district_code": 530181,
        "chinese_name": "安宁市"
    },
    {
        "Id": 2089,
        "DisName": "大理市",
        "CityID": 277,
        "DisSort": null,
        "CityNameEnglish": "Dali",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2090,
        "DisName": "漾濞彝族自治县",
        "CityID": 277,
        "DisSort": null,
        "CityNameEnglish": "Yangbi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2091,
        "DisName": "祥云县",
        "CityID": 277,
        "DisSort": null,
        "CityNameEnglish": "Xiangyun",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2092,
        "DisName": "宾川县",
        "CityID": 277,
        "DisSort": null,
        "CityNameEnglish": "Binchuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2093,
        "DisName": "弥渡县",
        "CityID": 277,
        "DisSort": null,
        "CityNameEnglish": "Midu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2094,
        "DisName": "南涧彝族自治县",
        "CityID": 277,
        "DisSort": null,
        "CityNameEnglish": "Nanjian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2095,
        "DisName": "巍山彝族回族自治县",
        "CityID": 277,
        "DisSort": null,
        "CityNameEnglish": "Weishan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2096,
        "DisName": "永平县",
        "CityID": 277,
        "DisSort": null,
        "CityNameEnglish": "Yongping",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2097,
        "DisName": "云龙县",
        "CityID": 277,
        "DisSort": null,
        "CityNameEnglish": "Yunlong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2098,
        "DisName": "洱源县",
        "CityID": 277,
        "DisSort": null,
        "CityNameEnglish": "Eryuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2099,
        "DisName": "剑川县",
        "CityID": 277,
        "DisSort": null,
        "CityNameEnglish": "Jianchuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2100,
        "DisName": "鹤庆县",
        "CityID": 277,
        "DisSort": null,
        "CityNameEnglish": "Heqing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2101,
        "DisName": "个旧市",
        "CityID": 278,
        "DisSort": null,
        "CityNameEnglish": "Gejiu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2102,
        "DisName": "开远市",
        "CityID": 278,
        "DisSort": null,
        "CityNameEnglish": "Kaiyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2103,
        "DisName": "蒙自县",
        "CityID": 278,
        "DisSort": null,
        "CityNameEnglish": "Mengzi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2104,
        "DisName": "屏边苗族自治县",
        "CityID": 278,
        "DisSort": null,
        "CityNameEnglish": "Pingbian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2105,
        "DisName": "建水县",
        "CityID": 278,
        "DisSort": null,
        "CityNameEnglish": "Jianshui",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2106,
        "DisName": "石屏县",
        "CityID": 278,
        "DisSort": null,
        "CityNameEnglish": "Shiping",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2107,
        "DisName": "弥勒县",
        "CityID": 278,
        "DisSort": null,
        "CityNameEnglish": "Mile",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2108,
        "DisName": "泸西县",
        "CityID": 278,
        "DisSort": null,
        "CityNameEnglish": "Luxi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2109,
        "DisName": "元阳县",
        "CityID": 278,
        "DisSort": null,
        "CityNameEnglish": "Yuanyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2110,
        "DisName": "红河县",
        "CityID": 278,
        "DisSort": null,
        "CityNameEnglish": "Honghe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2111,
        "DisName": "金平苗族瑶族傣族自治县",
        "CityID": 278,
        "DisSort": null,
        "CityNameEnglish": "Jinping",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2112,
        "DisName": "绿春县",
        "CityID": 278,
        "DisSort": null,
        "CityNameEnglish": "Lvchun",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2113,
        "DisName": "河口瑶族自治县",
        "CityID": 278,
        "DisSort": null,
        "CityNameEnglish": "Hekou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2114,
        "DisName": "麒麟区",
        "CityID": 279,
        "DisSort": null,
        "CityNameEnglish": "Qilin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2115,
        "DisName": "马龙县",
        "CityID": 279,
        "DisSort": null,
        "CityNameEnglish": "Malong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2116,
        "DisName": "陆良县",
        "CityID": 279,
        "DisSort": null,
        "CityNameEnglish": "Luliang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2117,
        "DisName": "师宗县",
        "CityID": 279,
        "DisSort": null,
        "CityNameEnglish": "Shizong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2118,
        "DisName": "罗平县",
        "CityID": 279,
        "DisSort": null,
        "CityNameEnglish": "Luoping",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2119,
        "DisName": "富源县",
        "CityID": 279,
        "DisSort": null,
        "CityNameEnglish": "Fuyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2120,
        "DisName": "会泽县",
        "CityID": 279,
        "DisSort": null,
        "CityNameEnglish": "Huize",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2121,
        "DisName": "沾益县",
        "CityID": 279,
        "DisSort": null,
        "CityNameEnglish": "Zhanyi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2122,
        "DisName": "宣威市",
        "CityID": 279,
        "DisSort": null,
        "CityNameEnglish": "Xuanwei",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2123,
        "DisName": "隆阳区",
        "CityID": 280,
        "DisSort": null,
        "CityNameEnglish": "Longyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2124,
        "DisName": "施甸县",
        "CityID": 280,
        "DisSort": null,
        "CityNameEnglish": "Shidian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2125,
        "DisName": "腾冲县",
        "CityID": 280,
        "DisSort": null,
        "CityNameEnglish": "Tengchong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2126,
        "DisName": "龙陵县",
        "CityID": 280,
        "DisSort": null,
        "CityNameEnglish": "Longling",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2127,
        "DisName": "昌宁县",
        "CityID": 280,
        "DisSort": null,
        "CityNameEnglish": "Changning",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2128,
        "DisName": "文山县",
        "CityID": 281,
        "DisSort": null,
        "CityNameEnglish": "Wenshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2129,
        "DisName": "砚山县",
        "CityID": 281,
        "DisSort": null,
        "CityNameEnglish": "Yanshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2130,
        "DisName": "西畴县",
        "CityID": 281,
        "DisSort": null,
        "CityNameEnglish": "Xichou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2131,
        "DisName": "麻栗坡县",
        "CityID": 281,
        "DisSort": null,
        "CityNameEnglish": "Malipo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2132,
        "DisName": "马关县",
        "CityID": 281,
        "DisSort": null,
        "CityNameEnglish": "Maguan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2133,
        "DisName": "丘北县",
        "CityID": 281,
        "DisSort": null,
        "CityNameEnglish": "Qiubei",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2134,
        "DisName": "广南县",
        "CityID": 281,
        "DisSort": null,
        "CityNameEnglish": "Guangnan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2135,
        "DisName": "富宁县",
        "CityID": 281,
        "DisSort": null,
        "CityNameEnglish": "Funing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2136,
        "DisName": "红塔区",
        "CityID": 282,
        "DisSort": null,
        "CityNameEnglish": "Hongta",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2137,
        "DisName": "江川县",
        "CityID": 282,
        "DisSort": null,
        "CityNameEnglish": "Jiangchuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2138,
        "DisName": "澄江县",
        "CityID": 282,
        "DisSort": null,
        "CityNameEnglish": "Chengjiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2139,
        "DisName": "通海县",
        "CityID": 282,
        "DisSort": null,
        "CityNameEnglish": "Tonghai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2140,
        "DisName": "华宁县",
        "CityID": 282,
        "DisSort": null,
        "CityNameEnglish": "Huaning",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2141,
        "DisName": "易门县",
        "CityID": 282,
        "DisSort": null,
        "CityNameEnglish": "Yimen",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2142,
        "DisName": "峨山彝族自治县",
        "CityID": 282,
        "DisSort": null,
        "CityNameEnglish": "Eshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2143,
        "DisName": "新平彝族傣族自治县",
        "CityID": 282,
        "DisSort": null,
        "CityNameEnglish": "Xinping",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2144,
        "DisName": "元江哈尼族彝族傣族自治县",
        "CityID": 282,
        "DisSort": null,
        "CityNameEnglish": "Yuanjiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2145,
        "DisName": "楚雄市",
        "CityID": 283,
        "DisSort": null,
        "CityNameEnglish": "Chuxiong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2146,
        "DisName": "双柏县",
        "CityID": 283,
        "DisSort": null,
        "CityNameEnglish": "Shuangbai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2147,
        "DisName": "牟定县",
        "CityID": 283,
        "DisSort": null,
        "CityNameEnglish": "Mouding",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2148,
        "DisName": "南华县",
        "CityID": 283,
        "DisSort": null,
        "CityNameEnglish": "Nanhua",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2149,
        "DisName": "姚安县",
        "CityID": 283,
        "DisSort": null,
        "CityNameEnglish": "Yaoan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2150,
        "DisName": "大姚县",
        "CityID": 283,
        "DisSort": null,
        "CityNameEnglish": "Dayao",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2151,
        "DisName": "永仁县",
        "CityID": 283,
        "DisSort": null,
        "CityNameEnglish": "Yongren",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2152,
        "DisName": "元谋县",
        "CityID": 283,
        "DisSort": null,
        "CityNameEnglish": "Yuanmou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2153,
        "DisName": "武定县",
        "CityID": 283,
        "DisSort": null,
        "CityNameEnglish": "Wuding",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2154,
        "DisName": "禄丰县",
        "CityID": 283,
        "DisSort": null,
        "CityNameEnglish": "Lufeng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2155,
        "DisName": "思茅区",
        "CityID": 284,
        "DisSort": null,
        "CityNameEnglish": "Simao",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2156,
        "DisName": "宁洱哈尼族彝族自治县",
        "CityID": 284,
        "DisSort": null,
        "CityNameEnglish": "Ning'er",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2157,
        "DisName": "墨江哈尼族自治县",
        "CityID": 284,
        "DisSort": null,
        "CityNameEnglish": "Mojiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2158,
        "DisName": "景东彝族自治县",
        "CityID": 284,
        "DisSort": null,
        "CityNameEnglish": "Jingdong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2159,
        "DisName": "景谷傣族彝族自治县",
        "CityID": 284,
        "DisSort": null,
        "CityNameEnglish": "Jinggu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2160,
        "DisName": "镇沅彝族哈尼族拉祜族自治县",
        "CityID": 284,
        "DisSort": null,
        "CityNameEnglish": "Zhenyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2161,
        "DisName": "江城哈尼族彝族自治县",
        "CityID": 284,
        "DisSort": null,
        "CityNameEnglish": "Jiangcheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2162,
        "DisName": "孟连傣族拉祜族佤族自治县",
        "CityID": 284,
        "DisSort": null,
        "CityNameEnglish": "Menglian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2163,
        "DisName": "澜沧拉祜族自治县",
        "CityID": 284,
        "DisSort": null,
        "CityNameEnglish": "Lancang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2164,
        "DisName": "西盟佤族自治县",
        "CityID": 284,
        "DisSort": null,
        "CityNameEnglish": "Ximeng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2165,
        "DisName": "临翔区",
        "CityID": 285,
        "DisSort": null,
        "CityNameEnglish": "Linxiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2166,
        "DisName": "凤庆县",
        "CityID": 285,
        "DisSort": null,
        "CityNameEnglish": "Fengqing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2167,
        "DisName": "云县",
        "CityID": 285,
        "DisSort": null,
        "CityNameEnglish": "Yunxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2168,
        "DisName": "永德县",
        "CityID": 285,
        "DisSort": null,
        "CityNameEnglish": "Yongde",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2169,
        "DisName": "镇康县",
        "CityID": 285,
        "DisSort": null,
        "CityNameEnglish": "Zhenkang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2170,
        "DisName": "双江拉祜族佤族布朗族傣族自治县",
        "CityID": 285,
        "DisSort": null,
        "CityNameEnglish": "Shuangjiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2171,
        "DisName": "耿马傣族佤族自治县",
        "CityID": 285,
        "DisSort": null,
        "CityNameEnglish": "Gengma",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2172,
        "DisName": "沧源佤族自治县",
        "CityID": 285,
        "DisSort": null,
        "CityNameEnglish": "Cangyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2173,
        "DisName": "泸水县",
        "CityID": 286,
        "DisSort": null,
        "CityNameEnglish": "Lushui",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2174,
        "DisName": "福贡县",
        "CityID": 286,
        "DisSort": null,
        "CityNameEnglish": "Fugong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2175,
        "DisName": "贡山独龙族怒族自治县",
        "CityID": 286,
        "DisSort": null,
        "CityNameEnglish": "Gongshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2176,
        "DisName": "兰坪白族普米族自治县",
        "CityID": 286,
        "DisSort": null,
        "CityNameEnglish": "Lanping",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2177,
        "DisName": "香格里拉县",
        "CityID": 287,
        "DisSort": null,
        "CityNameEnglish": "Shangri-La",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2178,
        "DisName": "德钦县",
        "CityID": 287,
        "DisSort": null,
        "CityNameEnglish": "Deqin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2179,
        "DisName": "维西傈僳族自治县",
        "CityID": 287,
        "DisSort": null,
        "CityNameEnglish": "Weixi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2180,
        "DisName": "古城区",
        "CityID": 288,
        "DisSort": null,
        "CityNameEnglish": "Gucheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2181,
        "DisName": "玉龙纳西族自治县",
        "CityID": 288,
        "DisSort": null,
        "CityNameEnglish": "Yulong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2182,
        "DisName": "永胜县",
        "CityID": 288,
        "DisSort": null,
        "CityNameEnglish": "Yongsheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2183,
        "DisName": "华坪县",
        "CityID": 288,
        "DisSort": null,
        "CityNameEnglish": "Huaping",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2184,
        "DisName": "宁蒗彝族自治县",
        "CityID": 288,
        "DisSort": null,
        "CityNameEnglish": "Ninglang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2185,
        "DisName": "门源回族自治县",
        "CityID": 289,
        "DisSort": null,
        "CityNameEnglish": "Menyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2186,
        "DisName": "祁连县",
        "CityID": 289,
        "DisSort": null,
        "CityNameEnglish": "Qilian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2187,
        "DisName": "海晏县",
        "CityID": 289,
        "DisSort": null,
        "CityNameEnglish": "Haiyan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2188,
        "DisName": "刚察县",
        "CityID": 289,
        "DisSort": null,
        "CityNameEnglish": "Gangcha",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2189,
        "DisName": "城东区",
        "CityID": 290,
        "DisSort": null,
        "CityNameEnglish": "Chengdong",
        "district_code": 630102,
        "chinese_name": "城东区"
    },
    {
        "Id": 2190,
        "DisName": "城中区",
        "CityID": 290,
        "DisSort": null,
        "CityNameEnglish": "Chengzhong",
        "district_code": 450202,
        "chinese_name": "城中区"
    },
    {
        "Id": 2191,
        "DisName": "城西区",
        "CityID": 290,
        "DisSort": null,
        "CityNameEnglish": "Chengxi",
        "district_code": 630104,
        "chinese_name": "城西区"
    },
    {
        "Id": 2192,
        "DisName": "城北区",
        "CityID": 290,
        "DisSort": null,
        "CityNameEnglish": "Chengbei",
        "district_code": 630105,
        "chinese_name": "城北区"
    },
    {
        "Id": 2193,
        "DisName": "大通回族土族自治县",
        "CityID": 290,
        "DisSort": null,
        "CityNameEnglish": "Datong",
        "district_code": 630121,
        "chinese_name": "大通回族土族自治县"
    },
    {
        "Id": 2194,
        "DisName": "湟中县",
        "CityID": 290,
        "DisSort": null,
        "CityNameEnglish": "Huangzhong",
        "district_code": 630122,
        "chinese_name": "湟中县"
    },
    {
        "Id": 2195,
        "DisName": "湟源县",
        "CityID": 290,
        "DisSort": null,
        "CityNameEnglish": "Huangyuan",
        "district_code": 630123,
        "chinese_name": "湟源县"
    },
    {
        "Id": 2196,
        "DisName": "平安县",
        "CityID": 291,
        "DisSort": null,
        "CityNameEnglish": "Ping'an",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2197,
        "DisName": "民和回族土族自治县",
        "CityID": 291,
        "DisSort": null,
        "CityNameEnglish": "Minhe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2198,
        "DisName": "乐都县",
        "CityID": 291,
        "DisSort": null,
        "CityNameEnglish": "Ledu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2199,
        "DisName": "互助土族自治县",
        "CityID": 291,
        "DisSort": null,
        "CityNameEnglish": "Huzhu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2200,
        "DisName": "化隆回族自治县",
        "CityID": 291,
        "DisSort": null,
        "CityNameEnglish": "hualong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2201,
        "DisName": "循化撒拉族自治县",
        "CityID": 291,
        "DisSort": null,
        "CityNameEnglish": "Xunhua",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2202,
        "DisName": "同仁县",
        "CityID": 292,
        "DisSort": null,
        "CityNameEnglish": "Tongren",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2203,
        "DisName": "尖扎县",
        "CityID": 292,
        "DisSort": null,
        "CityNameEnglish": "Jianzha",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2204,
        "DisName": "泽库县",
        "CityID": 292,
        "DisSort": null,
        "CityNameEnglish": "Zeku",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2205,
        "DisName": "河南蒙古族自治县",
        "CityID": 292,
        "DisSort": null,
        "CityNameEnglish": "Henan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2206,
        "DisName": "共和县",
        "CityID": 293,
        "DisSort": null,
        "CityNameEnglish": "Gonghe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2207,
        "DisName": "同德县",
        "CityID": 293,
        "DisSort": null,
        "CityNameEnglish": "Tongde",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2208,
        "DisName": "贵德县",
        "CityID": 293,
        "DisSort": null,
        "CityNameEnglish": "Guide",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2209,
        "DisName": "兴海县",
        "CityID": 293,
        "DisSort": null,
        "CityNameEnglish": "Xinghai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2210,
        "DisName": "贵南县",
        "CityID": 293,
        "DisSort": null,
        "CityNameEnglish": "Guinan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2211,
        "DisName": "玛沁县",
        "CityID": 294,
        "DisSort": null,
        "CityNameEnglish": "Maqin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2212,
        "DisName": "班玛县",
        "CityID": 294,
        "DisSort": null,
        "CityNameEnglish": "Banma",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2213,
        "DisName": "甘德县",
        "CityID": 294,
        "DisSort": null,
        "CityNameEnglish": "Gande",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2214,
        "DisName": "达日县",
        "CityID": 294,
        "DisSort": null,
        "CityNameEnglish": "Dari",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2215,
        "DisName": "久治县",
        "CityID": 294,
        "DisSort": null,
        "CityNameEnglish": "Jiuzhi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2216,
        "DisName": "玛多县",
        "CityID": 294,
        "DisSort": null,
        "CityNameEnglish": "Maduo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2217,
        "DisName": "玉树县",
        "CityID": 295,
        "DisSort": null,
        "CityNameEnglish": "Yushu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2218,
        "DisName": "杂多县",
        "CityID": 295,
        "DisSort": null,
        "CityNameEnglish": "Zaduo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2219,
        "DisName": "称多县",
        "CityID": 295,
        "DisSort": null,
        "CityNameEnglish": "Chengduo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2220,
        "DisName": "治多县",
        "CityID": 295,
        "DisSort": null,
        "CityNameEnglish": "Zhiduo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2221,
        "DisName": "囊谦县",
        "CityID": 295,
        "DisSort": null,
        "CityNameEnglish": "Nangqian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2222,
        "DisName": "曲麻莱县",
        "CityID": 295,
        "DisSort": null,
        "CityNameEnglish": "Qumalai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2223,
        "DisName": "格尔木市",
        "CityID": 296,
        "DisSort": null,
        "CityNameEnglish": "Golmud",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2224,
        "DisName": "德令哈市",
        "CityID": 296,
        "DisSort": null,
        "CityNameEnglish": "Delingha",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2225,
        "DisName": "乌兰县",
        "CityID": 296,
        "DisSort": null,
        "CityNameEnglish": "Wulan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2226,
        "DisName": "都兰县",
        "CityID": 296,
        "DisSort": null,
        "CityNameEnglish": "Dulan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2227,
        "DisName": "天峻县",
        "CityID": 296,
        "DisSort": null,
        "CityNameEnglish": "Tianjun",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2228,
        "DisName": "新城区",
        "CityID": 297,
        "DisSort": null,
        "CityNameEnglish": "Xincheng",
        "district_code": 610102,
        "chinese_name": "新城区"
    },
    {
        "Id": 2229,
        "DisName": "碑林区",
        "CityID": 297,
        "DisSort": null,
        "CityNameEnglish": "Beilin",
        "district_code": 610103,
        "chinese_name": "碑林区"
    },
    {
        "Id": 2230,
        "DisName": "莲湖区",
        "CityID": 297,
        "DisSort": null,
        "CityNameEnglish": "Lianhu",
        "district_code": 610104,
        "chinese_name": "莲湖区"
    },
    {
        "Id": 2231,
        "DisName": "灞桥区",
        "CityID": 297,
        "DisSort": null,
        "CityNameEnglish": "Baqiao",
        "district_code": 610111,
        "chinese_name": "灞桥区"
    },
    {
        "Id": 2232,
        "DisName": "未央区",
        "CityID": 297,
        "DisSort": null,
        "CityNameEnglish": "Weiyang",
        "district_code": 610112,
        "chinese_name": "未央区"
    },
    {
        "Id": 2233,
        "DisName": "雁塔区",
        "CityID": 297,
        "DisSort": null,
        "CityNameEnglish": "Yanta",
        "district_code": 610113,
        "chinese_name": "雁塔区"
    },
    {
        "Id": 2234,
        "DisName": "阎良区",
        "CityID": 297,
        "DisSort": null,
        "CityNameEnglish": "Yanliang",
        "district_code": 610114,
        "chinese_name": "阎良区"
    },
    {
        "Id": 2235,
        "DisName": "临潼区",
        "CityID": 297,
        "DisSort": null,
        "CityNameEnglish": "Lintong",
        "district_code": 610115,
        "chinese_name": "临潼区"
    },
    {
        "Id": 2236,
        "DisName": "长安区",
        "CityID": 297,
        "DisSort": null,
        "CityNameEnglish": "Chang'an",
        "district_code": 610116,
        "chinese_name": "长安区"
    },
    {
        "Id": 2237,
        "DisName": "蓝田县",
        "CityID": 297,
        "DisSort": null,
        "CityNameEnglish": "Lantian",
        "district_code": 610122,
        "chinese_name": "蓝田县"
    },
    {
        "Id": 2238,
        "DisName": "周至县",
        "CityID": 297,
        "DisSort": null,
        "CityNameEnglish": "Zhouzhi",
        "district_code": 610124,
        "chinese_name": "周至县"
    },
    {
        "Id": 2239,
        "DisName": "户县",
        "CityID": 297,
        "DisSort": null,
        "CityNameEnglish": "Huxian",
        "district_code": 610125,
        "chinese_name": "户县"
    },
    {
        "Id": 2240,
        "DisName": "高陵县",
        "CityID": 297,
        "DisSort": null,
        "CityNameEnglish": "Gaoling",
        "district_code": 610126,
        "chinese_name": "高陵县"
    },
    {
        "Id": 2241,
        "DisName": "秦都区",
        "CityID": 298,
        "DisSort": null,
        "CityNameEnglish": "Qindu",
        "district_code": 610402,
        "chinese_name": "秦都区"
    },
    {
        "Id": 2242,
        "DisName": "杨陵区",
        "CityID": 298,
        "DisSort": null,
        "CityNameEnglish": "Yangling",
        "district_code": 610403,
        "chinese_name": "杨凌区"
    },
    {
        "Id": 2243,
        "DisName": "渭城区",
        "CityID": 298,
        "DisSort": null,
        "CityNameEnglish": "Weicheng",
        "district_code": 610404,
        "chinese_name": "渭城区"
    },
    {
        "Id": 2244,
        "DisName": "三原县",
        "CityID": 298,
        "DisSort": null,
        "CityNameEnglish": "Sanyuan",
        "district_code": 610422,
        "chinese_name": "三原县"
    },
    {
        "Id": 2245,
        "DisName": "泾阳县",
        "CityID": 298,
        "DisSort": null,
        "CityNameEnglish": "Jingyang",
        "district_code": 610423,
        "chinese_name": "泾阳县"
    },
    {
        "Id": 2246,
        "DisName": "乾县",
        "CityID": 298,
        "DisSort": null,
        "CityNameEnglish": "Qianxian",
        "district_code": 610424,
        "chinese_name": "乾县"
    },
    {
        "Id": 2247,
        "DisName": "礼泉县",
        "CityID": 298,
        "DisSort": null,
        "CityNameEnglish": "Liquan",
        "district_code": 610425,
        "chinese_name": "礼泉县"
    },
    {
        "Id": 2248,
        "DisName": "永寿县",
        "CityID": 298,
        "DisSort": null,
        "CityNameEnglish": "Yongshou",
        "district_code": 610426,
        "chinese_name": "永寿县"
    },
    {
        "Id": 2249,
        "DisName": "彬县",
        "CityID": 298,
        "DisSort": null,
        "CityNameEnglish": "Binxian",
        "district_code": 610427,
        "chinese_name": "彬县"
    },
    {
        "Id": 2250,
        "DisName": "长武县",
        "CityID": 298,
        "DisSort": null,
        "CityNameEnglish": "Changwu",
        "district_code": 610428,
        "chinese_name": "长武县"
    },
    {
        "Id": 2251,
        "DisName": "旬邑县",
        "CityID": 298,
        "DisSort": null,
        "CityNameEnglish": "Xunyi",
        "district_code": 610429,
        "chinese_name": "旬邑县"
    },
    {
        "Id": 2252,
        "DisName": "淳化县",
        "CityID": 298,
        "DisSort": null,
        "CityNameEnglish": "Chunhua",
        "district_code": 610430,
        "chinese_name": "淳化县"
    },
    {
        "Id": 2253,
        "DisName": "武功县",
        "CityID": 298,
        "DisSort": null,
        "CityNameEnglish": "Wugong",
        "district_code": 610431,
        "chinese_name": "武功县"
    },
    {
        "Id": 2254,
        "DisName": "兴平市",
        "CityID": 298,
        "DisSort": null,
        "CityNameEnglish": "Xingping",
        "district_code": 610481,
        "chinese_name": "兴平市"
    },
    {
        "Id": 2255,
        "DisName": "宝塔区",
        "CityID": 299,
        "DisSort": null,
        "CityNameEnglish": "Baota",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2256,
        "DisName": "延长县",
        "CityID": 299,
        "DisSort": null,
        "CityNameEnglish": "Yanchang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2257,
        "DisName": "延川县",
        "CityID": 299,
        "DisSort": null,
        "CityNameEnglish": "Yanchuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2258,
        "DisName": "子长县",
        "CityID": 299,
        "DisSort": null,
        "CityNameEnglish": "Zichang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2259,
        "DisName": "安塞县",
        "CityID": 299,
        "DisSort": null,
        "CityNameEnglish": "Ansai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2260,
        "DisName": "志丹县",
        "CityID": 299,
        "DisSort": null,
        "CityNameEnglish": "Zhidan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2261,
        "DisName": "吴起县",
        "CityID": 299,
        "DisSort": null,
        "CityNameEnglish": "Wuqi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2262,
        "DisName": "甘泉县",
        "CityID": 299,
        "DisSort": null,
        "CityNameEnglish": "Ganquan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2263,
        "DisName": "富县",
        "CityID": 299,
        "DisSort": null,
        "CityNameEnglish": "Fuxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2264,
        "DisName": "洛川县",
        "CityID": 299,
        "DisSort": null,
        "CityNameEnglish": "Luochuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2265,
        "DisName": "宜川县",
        "CityID": 299,
        "DisSort": null,
        "CityNameEnglish": "Yichuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2266,
        "DisName": "黄龙县",
        "CityID": 299,
        "DisSort": null,
        "CityNameEnglish": "Huanglong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2267,
        "DisName": "黄陵县",
        "CityID": 299,
        "DisSort": null,
        "CityNameEnglish": "Huangling",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2268,
        "DisName": "榆阳区",
        "CityID": 300,
        "DisSort": null,
        "CityNameEnglish": "Yuyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2269,
        "DisName": "神木县",
        "CityID": 300,
        "DisSort": null,
        "CityNameEnglish": "Shenmu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2270,
        "DisName": "府谷县",
        "CityID": 300,
        "DisSort": null,
        "CityNameEnglish": "Fugu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2271,
        "DisName": "横山县",
        "CityID": 300,
        "DisSort": null,
        "CityNameEnglish": "Hengshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2272,
        "DisName": "靖边县",
        "CityID": 300,
        "DisSort": null,
        "CityNameEnglish": "Jingbian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2273,
        "DisName": "定边县",
        "CityID": 300,
        "DisSort": null,
        "CityNameEnglish": "Dingbian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2274,
        "DisName": "绥德县",
        "CityID": 300,
        "DisSort": null,
        "CityNameEnglish": "Suide",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2275,
        "DisName": "米脂县",
        "CityID": 300,
        "DisSort": null,
        "CityNameEnglish": "Mizhi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2276,
        "DisName": "佳县",
        "CityID": 300,
        "DisSort": null,
        "CityNameEnglish": "Jiaxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2277,
        "DisName": "吴堡县",
        "CityID": 300,
        "DisSort": null,
        "CityNameEnglish": "Wubao",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2278,
        "DisName": "清涧县",
        "CityID": 300,
        "DisSort": null,
        "CityNameEnglish": "Qingjian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2279,
        "DisName": "子洲县",
        "CityID": 300,
        "DisSort": null,
        "CityNameEnglish": "Zizhou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2280,
        "DisName": "临渭区",
        "CityID": 301,
        "DisSort": null,
        "CityNameEnglish": "Linwei",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2281,
        "DisName": "华县",
        "CityID": 301,
        "DisSort": null,
        "CityNameEnglish": "Huaxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2282,
        "DisName": "潼关县",
        "CityID": 301,
        "DisSort": null,
        "CityNameEnglish": "Tongguan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2283,
        "DisName": "大荔县",
        "CityID": 301,
        "DisSort": null,
        "CityNameEnglish": "Dali",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2284,
        "DisName": "合阳县",
        "CityID": 301,
        "DisSort": null,
        "CityNameEnglish": "Heyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2285,
        "DisName": "澄城县",
        "CityID": 301,
        "DisSort": null,
        "CityNameEnglish": "Chengcheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2286,
        "DisName": "蒲城县",
        "CityID": 301,
        "DisSort": null,
        "CityNameEnglish": "Pucheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2287,
        "DisName": "白水县",
        "CityID": 301,
        "DisSort": null,
        "CityNameEnglish": "Baishui",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2288,
        "DisName": "富平县",
        "CityID": 301,
        "DisSort": null,
        "CityNameEnglish": "Fuping",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2289,
        "DisName": "韩城市",
        "CityID": 301,
        "DisSort": null,
        "CityNameEnglish": "Hancheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2290,
        "DisName": "华阴市",
        "CityID": 301,
        "DisSort": null,
        "CityNameEnglish": "Huayin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2291,
        "DisName": "商州区",
        "CityID": 302,
        "DisSort": null,
        "CityNameEnglish": "Shangzhou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2292,
        "DisName": "洛南县",
        "CityID": 302,
        "DisSort": null,
        "CityNameEnglish": "Luonan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2293,
        "DisName": "丹凤县",
        "CityID": 302,
        "DisSort": null,
        "CityNameEnglish": "Danfeng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2294,
        "DisName": "商南县",
        "CityID": 302,
        "DisSort": null,
        "CityNameEnglish": "Shangnan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2295,
        "DisName": "山阳县",
        "CityID": 302,
        "DisSort": null,
        "CityNameEnglish": "Shanyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2296,
        "DisName": "镇安县",
        "CityID": 302,
        "DisSort": null,
        "CityNameEnglish": "Zhen'an",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2297,
        "DisName": "柞水县",
        "CityID": 302,
        "DisSort": null,
        "CityNameEnglish": "Zhashui",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2298,
        "DisName": "汉滨区",
        "CityID": 303,
        "DisSort": null,
        "CityNameEnglish": "Hanbin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2299,
        "DisName": "汉阴县",
        "CityID": 303,
        "DisSort": null,
        "CityNameEnglish": "Hanyin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2300,
        "DisName": "石泉县",
        "CityID": 303,
        "DisSort": null,
        "CityNameEnglish": "Shiquan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2301,
        "DisName": "宁陕县",
        "CityID": 303,
        "DisSort": null,
        "CityNameEnglish": "Ningshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2302,
        "DisName": "紫阳县",
        "CityID": 303,
        "DisSort": null,
        "CityNameEnglish": "Ziyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2303,
        "DisName": "岚皋县",
        "CityID": 303,
        "DisSort": null,
        "CityNameEnglish": "Langao",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2304,
        "DisName": "平利县",
        "CityID": 303,
        "DisSort": null,
        "CityNameEnglish": "Pingli",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2305,
        "DisName": "镇坪县",
        "CityID": 303,
        "DisSort": null,
        "CityNameEnglish": "Zhenping",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2306,
        "DisName": "旬阳县",
        "CityID": 303,
        "DisSort": null,
        "CityNameEnglish": "Xunyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2307,
        "DisName": "白河县",
        "CityID": 303,
        "DisSort": null,
        "CityNameEnglish": "Baihe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2308,
        "DisName": "汉台区",
        "CityID": 304,
        "DisSort": null,
        "CityNameEnglish": "Hantai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2309,
        "DisName": "南郑县",
        "CityID": 304,
        "DisSort": null,
        "CityNameEnglish": "Nanzheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2310,
        "DisName": "城固县",
        "CityID": 304,
        "DisSort": null,
        "CityNameEnglish": "Chenggu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2311,
        "DisName": "洋县",
        "CityID": 304,
        "DisSort": null,
        "CityNameEnglish": "Yangxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2312,
        "DisName": "西乡县",
        "CityID": 304,
        "DisSort": null,
        "CityNameEnglish": "Xixiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2313,
        "DisName": "勉县",
        "CityID": 304,
        "DisSort": null,
        "CityNameEnglish": "Mianxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2314,
        "DisName": "宁强县",
        "CityID": 304,
        "DisSort": null,
        "CityNameEnglish": "Ningqiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2315,
        "DisName": "略阳县",
        "CityID": 304,
        "DisSort": null,
        "CityNameEnglish": "Lueyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2316,
        "DisName": "镇巴县",
        "CityID": 304,
        "DisSort": null,
        "CityNameEnglish": "Zhenba",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2317,
        "DisName": "留坝县",
        "CityID": 304,
        "DisSort": null,
        "CityNameEnglish": "Liuba",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2318,
        "DisName": "佛坪县",
        "CityID": 304,
        "DisSort": null,
        "CityNameEnglish": "Foping",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2319,
        "DisName": "渭滨区",
        "CityID": 305,
        "DisSort": null,
        "CityNameEnglish": "Weibin",
        "district_code": 610302,
        "chinese_name": "渭滨区"
    },
    {
        "Id": 2320,
        "DisName": "金台区",
        "CityID": 305,
        "DisSort": null,
        "CityNameEnglish": "Jintai",
        "district_code": 610303,
        "chinese_name": "金台区"
    },
    {
        "Id": 2321,
        "DisName": "陈仓区",
        "CityID": 305,
        "DisSort": null,
        "CityNameEnglish": "Chencang",
        "district_code": 610304,
        "chinese_name": "陈仓区"
    },
    {
        "Id": 2322,
        "DisName": "凤翔县",
        "CityID": 305,
        "DisSort": null,
        "CityNameEnglish": "Fengxiang",
        "district_code": 610322,
        "chinese_name": "凤翔县"
    },
    {
        "Id": 2323,
        "DisName": "岐山县",
        "CityID": 305,
        "DisSort": null,
        "CityNameEnglish": "Qishan",
        "district_code": 610323,
        "chinese_name": "岐山县"
    },
    {
        "Id": 2324,
        "DisName": "扶风县",
        "CityID": 305,
        "DisSort": null,
        "CityNameEnglish": "Fufeng",
        "district_code": 610324,
        "chinese_name": "扶风县"
    },
    {
        "Id": 2325,
        "DisName": "眉县",
        "CityID": 305,
        "DisSort": null,
        "CityNameEnglish": "Meixian",
        "district_code": 610326,
        "chinese_name": "眉县"
    },
    {
        "Id": 2326,
        "DisName": "陇县",
        "CityID": 305,
        "DisSort": null,
        "CityNameEnglish": "Longxian",
        "district_code": 610327,
        "chinese_name": "陇县"
    },
    {
        "Id": 2327,
        "DisName": "千阳县",
        "CityID": 305,
        "DisSort": null,
        "CityNameEnglish": "Qianyang",
        "district_code": 610328,
        "chinese_name": "千阳县"
    },
    {
        "Id": 2328,
        "DisName": "麟游县",
        "CityID": 305,
        "DisSort": null,
        "CityNameEnglish": "Linyou",
        "district_code": 610329,
        "chinese_name": "麟游县"
    },
    {
        "Id": 2329,
        "DisName": "凤县",
        "CityID": 305,
        "DisSort": null,
        "CityNameEnglish": "Fengxian",
        "district_code": 610330,
        "chinese_name": "凤县"
    },
    {
        "Id": 2330,
        "DisName": "太白县",
        "CityID": 305,
        "DisSort": null,
        "CityNameEnglish": "Taibai",
        "district_code": 610331,
        "chinese_name": "太白县"
    },
    {
        "Id": 2331,
        "DisName": "王益区",
        "CityID": 306,
        "DisSort": null,
        "CityNameEnglish": "Wangyi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2332,
        "DisName": "印台区",
        "CityID": 306,
        "DisSort": null,
        "CityNameEnglish": "Yintai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2333,
        "DisName": "耀州区",
        "CityID": 306,
        "DisSort": null,
        "CityNameEnglish": "Yaozhou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2334,
        "DisName": "宜君县",
        "CityID": 306,
        "DisSort": null,
        "CityNameEnglish": "Yijun",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2335,
        "DisName": "港口区",
        "CityID": 307,
        "DisSort": null,
        "CityNameEnglish": "Gangkou ",
        "district_code": 450602,
        "chinese_name": "港口区"
    },
    {
        "Id": 2336,
        "DisName": "防城区",
        "CityID": 307,
        "DisSort": null,
        "CityNameEnglish": "Fangcheng",
        "district_code": 450603,
        "chinese_name": "防城区"
    },
    {
        "Id": 2337,
        "DisName": "上思县",
        "CityID": 307,
        "DisSort": null,
        "CityNameEnglish": "Shangsi",
        "district_code": 450621,
        "chinese_name": "上思县"
    },
    {
        "Id": 2338,
        "DisName": "东兴市",
        "CityID": 307,
        "DisSort": null,
        "CityNameEnglish": "Dongxing",
        "district_code": 450681,
        "chinese_name": "东兴市"
    },
    {
        "Id": 2339,
        "DisName": "兴宁区",
        "CityID": 308,
        "DisSort": null,
        "CityNameEnglish": "Xingning",
        "district_code": 450102,
        "chinese_name": "兴宁区"
    },
    {
        "Id": 2340,
        "DisName": "青秀区",
        "CityID": 308,
        "DisSort": null,
        "CityNameEnglish": "Qingxiu",
        "district_code": 450103,
        "chinese_name": "青秀区"
    },
    {
        "Id": 2341,
        "DisName": "江南区",
        "CityID": 308,
        "DisSort": null,
        "CityNameEnglish": "Jiangnan",
        "district_code": 450105,
        "chinese_name": "江南区"
    },
    {
        "Id": 2342,
        "DisName": "西乡塘区",
        "CityID": 308,
        "DisSort": null,
        "CityNameEnglish": "Xixiangtang",
        "district_code": 450107,
        "chinese_name": "西乡塘区"
    },
    {
        "Id": 2343,
        "DisName": "良庆区",
        "CityID": 308,
        "DisSort": null,
        "CityNameEnglish": "Liangqing",
        "district_code": 450108,
        "chinese_name": "良庆区"
    },
    {
        "Id": 2344,
        "DisName": "邕宁区",
        "CityID": 308,
        "DisSort": null,
        "CityNameEnglish": "Yongning",
        "district_code": 450109,
        "chinese_name": "邕宁区"
    },
    {
        "Id": 2345,
        "DisName": "武鸣县",
        "CityID": 308,
        "DisSort": null,
        "CityNameEnglish": "Wuming",
        "district_code": 450122,
        "chinese_name": "武鸣县"
    },
    {
        "Id": 2346,
        "DisName": "隆安县",
        "CityID": 308,
        "DisSort": null,
        "CityNameEnglish": "Long'an",
        "district_code": 450123,
        "chinese_name": "隆安县"
    },
    {
        "Id": 2347,
        "DisName": "马山县",
        "CityID": 308,
        "DisSort": null,
        "CityNameEnglish": "Mashan",
        "district_code": 450124,
        "chinese_name": "马山县"
    },
    {
        "Id": 2348,
        "DisName": "上林县",
        "CityID": 308,
        "DisSort": null,
        "CityNameEnglish": "Shanglin",
        "district_code": 450125,
        "chinese_name": "上林县"
    },
    {
        "Id": 2349,
        "DisName": "宾阳县",
        "CityID": 308,
        "DisSort": null,
        "CityNameEnglish": "Binyang",
        "district_code": 450126,
        "chinese_name": "宾阳县"
    },
    {
        "Id": 2350,
        "DisName": "横县",
        "CityID": 308,
        "DisSort": null,
        "CityNameEnglish": "Hengxian",
        "district_code": 450127,
        "chinese_name": "横县"
    },
    {
        "Id": 2351,
        "DisName": "江洲区",
        "CityID": 309,
        "DisSort": null,
        "CityNameEnglish": "Jiangzhou",
        "district_code": 451402,
        "chinese_name": "江州区"
    },
    {
        "Id": 2352,
        "DisName": "扶绥县",
        "CityID": 309,
        "DisSort": null,
        "CityNameEnglish": "Fusui",
        "district_code": 451421,
        "chinese_name": "扶绥县"
    },
    {
        "Id": 2353,
        "DisName": "宁明县",
        "CityID": 309,
        "DisSort": null,
        "CityNameEnglish": "Ningming",
        "district_code": 451422,
        "chinese_name": "宁明县"
    },
    {
        "Id": 2354,
        "DisName": "龙州县",
        "CityID": 309,
        "DisSort": null,
        "CityNameEnglish": "Longzhou",
        "district_code": 451423,
        "chinese_name": "龙州县"
    },
    {
        "Id": 2355,
        "DisName": "大新县",
        "CityID": 309,
        "DisSort": null,
        "CityNameEnglish": "Daxin",
        "district_code": 451424,
        "chinese_name": "大新县"
    },
    {
        "Id": 2356,
        "DisName": "天等县",
        "CityID": 309,
        "DisSort": null,
        "CityNameEnglish": "Tiandeng",
        "district_code": 451425,
        "chinese_name": "天等县"
    },
    {
        "Id": 2357,
        "DisName": "凭祥市",
        "CityID": 309,
        "DisSort": null,
        "CityNameEnglish": "Pingxiang",
        "district_code": 451481,
        "chinese_name": "凭祥市"
    },
    {
        "Id": 2358,
        "DisName": "兴宾区",
        "CityID": 310,
        "DisSort": null,
        "CityNameEnglish": "Xingbin",
        "district_code": 451302,
        "chinese_name": "兴宾区"
    },
    {
        "Id": 2359,
        "DisName": "忻城县",
        "CityID": 310,
        "DisSort": null,
        "CityNameEnglish": "Xincheng",
        "district_code": 451321,
        "chinese_name": "忻城县"
    },
    {
        "Id": 2360,
        "DisName": "象州县",
        "CityID": 310,
        "DisSort": null,
        "CityNameEnglish": "Xiangzhou",
        "district_code": 451322,
        "chinese_name": "象州县"
    },
    {
        "Id": 2361,
        "DisName": "武宣县",
        "CityID": 310,
        "DisSort": null,
        "CityNameEnglish": "Wuxuan",
        "district_code": 451323,
        "chinese_name": "武宣县"
    },
    {
        "Id": 2362,
        "DisName": "金秀瑶族自治县",
        "CityID": 310,
        "DisSort": null,
        "CityNameEnglish": "Jinxiu",
        "district_code": 451324,
        "chinese_name": "金秀瑶族自治县"
    },
    {
        "Id": 2363,
        "DisName": "合山市",
        "CityID": 310,
        "DisSort": null,
        "CityNameEnglish": "Heshan",
        "district_code": 451381,
        "chinese_name": "合山市"
    },
    {
        "Id": 2364,
        "DisName": "城中区",
        "CityID": 311,
        "DisSort": null,
        "CityNameEnglish": "Chengzhong",
        "district_code": 450202,
        "chinese_name": "城中区"
    },
    {
        "Id": 2365,
        "DisName": "鱼峰区",
        "CityID": 311,
        "DisSort": null,
        "CityNameEnglish": "Yufeng",
        "district_code": 450203,
        "chinese_name": "鱼峰区"
    },
    {
        "Id": 2366,
        "DisName": "柳南区",
        "CityID": 311,
        "DisSort": null,
        "CityNameEnglish": "Liunan",
        "district_code": 450204,
        "chinese_name": "柳南区"
    },
    {
        "Id": 2367,
        "DisName": "柳北区",
        "CityID": 311,
        "DisSort": null,
        "CityNameEnglish": "Liubei",
        "district_code": 450205,
        "chinese_name": "柳北区"
    },
    {
        "Id": 2368,
        "DisName": "柳江县",
        "CityID": 311,
        "DisSort": null,
        "CityNameEnglish": "Liujiang",
        "district_code": 450221,
        "chinese_name": "柳江县"
    },
    {
        "Id": 2369,
        "DisName": "柳城县",
        "CityID": 311,
        "DisSort": null,
        "CityNameEnglish": "Liucheng",
        "district_code": 450222,
        "chinese_name": "柳城县"
    },
    {
        "Id": 2370,
        "DisName": "鹿寨县",
        "CityID": 311,
        "DisSort": null,
        "CityNameEnglish": "Luzhai",
        "district_code": 450223,
        "chinese_name": "鹿寨县"
    },
    {
        "Id": 2371,
        "DisName": "融安县",
        "CityID": 311,
        "DisSort": null,
        "CityNameEnglish": "Rong'an",
        "district_code": 450224,
        "chinese_name": "融安县"
    },
    {
        "Id": 2372,
        "DisName": "融水苗族自治县",
        "CityID": 311,
        "DisSort": null,
        "CityNameEnglish": "Rongshui",
        "district_code": 450225,
        "chinese_name": "融水苗族自治县"
    },
    {
        "Id": 2373,
        "DisName": "三江侗族自治县",
        "CityID": 311,
        "DisSort": null,
        "CityNameEnglish": "Sanjiang",
        "district_code": 450226,
        "chinese_name": "三江侗族自治县"
    },
    {
        "Id": 2374,
        "DisName": "秀峰区",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Xiufeng",
        "district_code": 450302,
        "chinese_name": "秀峰区"
    },
    {
        "Id": 2375,
        "DisName": "叠彩区",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Diecai",
        "district_code": 450303,
        "chinese_name": "叠彩区"
    },
    {
        "Id": 2376,
        "DisName": "象山区",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Xiangshan",
        "district_code": 450304,
        "chinese_name": "象山区"
    },
    {
        "Id": 2377,
        "DisName": "七星区",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Qixing",
        "district_code": 450305,
        "chinese_name": "七星区"
    },
    {
        "Id": 2378,
        "DisName": "雁山区",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Yanshan",
        "district_code": 450311,
        "chinese_name": "雁山区"
    },
    {
        "Id": 2379,
        "DisName": "阳朔县",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Yangshuo",
        "district_code": 450321,
        "chinese_name": "阳朔县"
    },
    {
        "Id": 2380,
        "DisName": "临桂县",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Lingui",
        "district_code": 450322,
        "chinese_name": "临桂县"
    },
    {
        "Id": 2381,
        "DisName": "灵川县",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Lingchuan",
        "district_code": 450323,
        "chinese_name": "灵川县"
    },
    {
        "Id": 2382,
        "DisName": "全州县",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Quanzhou",
        "district_code": 450324,
        "chinese_name": "全州县"
    },
    {
        "Id": 2383,
        "DisName": "兴安县",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Xing'an",
        "district_code": 450325,
        "chinese_name": "兴安县"
    },
    {
        "Id": 2384,
        "DisName": "永福县",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Yongfu",
        "district_code": 450326,
        "chinese_name": "永福县"
    },
    {
        "Id": 2385,
        "DisName": "灌阳县",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Guanyang",
        "district_code": 450327,
        "chinese_name": "灌阳县"
    },
    {
        "Id": 2386,
        "DisName": "龙胜各族自治县",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Longsheng",
        "district_code": 450328,
        "chinese_name": "龙胜各族自治县"
    },
    {
        "Id": 2387,
        "DisName": "资源县",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Ziyuan",
        "district_code": 450329,
        "chinese_name": "资源县"
    },
    {
        "Id": 2388,
        "DisName": "平乐县",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Pingle",
        "district_code": 450330,
        "chinese_name": "平乐县"
    },
    {
        "Id": 2389,
        "DisName": "荔浦县",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Lipu",
        "district_code": 450331,
        "chinese_name": "荔浦县"
    },
    {
        "Id": 2390,
        "DisName": "恭城瑶族自治县",
        "CityID": 312,
        "DisSort": null,
        "CityNameEnglish": "Gongcheng",
        "district_code": 450332,
        "chinese_name": "恭城瑶族自治县"
    },
    {
        "Id": 2391,
        "DisName": "万秀区",
        "CityID": 313,
        "DisSort": null,
        "CityNameEnglish": "Wanxiu",
        "district_code": 450403,
        "chinese_name": "万秀区"
    },
    {
        "Id": 2392,
        "DisName": "碟山区",
        "CityID": 313,
        "DisSort": null,
        "CityNameEnglish": "Dieshan",
        "district_code": 450404,
        "chinese_name": "蝶山区"
    },
    {
        "Id": 2393,
        "DisName": "长洲区",
        "CityID": 313,
        "DisSort": null,
        "CityNameEnglish": "Changzhou",
        "district_code": 450405,
        "chinese_name": "长洲区"
    },
    {
        "Id": 2394,
        "DisName": "苍梧县",
        "CityID": 313,
        "DisSort": null,
        "CityNameEnglish": "Cangwu",
        "district_code": 450421,
        "chinese_name": "苍梧县"
    },
    {
        "Id": 2395,
        "DisName": "藤县",
        "CityID": 313,
        "DisSort": null,
        "CityNameEnglish": "Tengxian",
        "district_code": 450422,
        "chinese_name": "藤县"
    },
    {
        "Id": 2396,
        "DisName": "蒙山县",
        "CityID": 313,
        "DisSort": null,
        "CityNameEnglish": "Mengshan",
        "district_code": 450423,
        "chinese_name": "蒙山县"
    },
    {
        "Id": 2397,
        "DisName": "岑溪市",
        "CityID": 313,
        "DisSort": null,
        "CityNameEnglish": "Cenxi",
        "district_code": 450481,
        "chinese_name": "岑溪市"
    },
    {
        "Id": 2402,
        "DisName": "港北区",
        "CityID": 315,
        "DisSort": null,
        "CityNameEnglish": "Gangbei",
        "district_code": 450802,
        "chinese_name": "港北区"
    },
    {
        "Id": 2403,
        "DisName": "港南区",
        "CityID": 315,
        "DisSort": null,
        "CityNameEnglish": "Gangnan",
        "district_code": 450803,
        "chinese_name": "港南区"
    },
    {
        "Id": 2404,
        "DisName": "覃塘区",
        "CityID": 315,
        "DisSort": null,
        "CityNameEnglish": "Qintang",
        "district_code": 450804,
        "chinese_name": "覃塘区"
    },
    {
        "Id": 2405,
        "DisName": "平南县",
        "CityID": 315,
        "DisSort": null,
        "CityNameEnglish": "Pingnan",
        "district_code": 450821,
        "chinese_name": "平南县"
    },
    {
        "Id": 2406,
        "DisName": "桂平市",
        "CityID": 315,
        "DisSort": null,
        "CityNameEnglish": "Guiping",
        "district_code": 450881,
        "chinese_name": "桂平市"
    },
    {
        "Id": 2407,
        "DisName": "玉州区",
        "CityID": 316,
        "DisSort": null,
        "CityNameEnglish": "Yuzhou",
        "district_code": 450902,
        "chinese_name": "玉州区"
    },
    {
        "Id": 2408,
        "DisName": "容县",
        "CityID": 316,
        "DisSort": null,
        "CityNameEnglish": "Rongxian",
        "district_code": 450921,
        "chinese_name": "容县"
    },
    {
        "Id": 2409,
        "DisName": "陆川县",
        "CityID": 316,
        "DisSort": null,
        "CityNameEnglish": "Luchuan",
        "district_code": 450922,
        "chinese_name": "陆川县"
    },
    {
        "Id": 2410,
        "DisName": "博白县",
        "CityID": 316,
        "DisSort": null,
        "CityNameEnglish": "Bobai",
        "district_code": 450923,
        "chinese_name": "博白县"
    },
    {
        "Id": 2411,
        "DisName": "兴业县",
        "CityID": 316,
        "DisSort": null,
        "CityNameEnglish": "Xingye",
        "district_code": 450924,
        "chinese_name": "兴业县"
    },
    {
        "Id": 2412,
        "DisName": "北流市",
        "CityID": 316,
        "DisSort": null,
        "CityNameEnglish": "Beiliu",
        "district_code": 450981,
        "chinese_name": "北流市"
    },
    {
        "Id": 2413,
        "DisName": "右江区",
        "CityID": 317,
        "DisSort": null,
        "CityNameEnglish": "Youjiang",
        "district_code": 451002,
        "chinese_name": "右江区"
    },
    {
        "Id": 2414,
        "DisName": "田阳县",
        "CityID": 317,
        "DisSort": null,
        "CityNameEnglish": "Tianyang",
        "district_code": 451021,
        "chinese_name": "田阳县"
    },
    {
        "Id": 2415,
        "DisName": "田东县",
        "CityID": 317,
        "DisSort": null,
        "CityNameEnglish": "Tiandong",
        "district_code": 451022,
        "chinese_name": "田东县"
    },
    {
        "Id": 2416,
        "DisName": "平果县",
        "CityID": 317,
        "DisSort": null,
        "CityNameEnglish": "Pingguo",
        "district_code": 451023,
        "chinese_name": "平果县"
    },
    {
        "Id": 2417,
        "DisName": "德保县",
        "CityID": 317,
        "DisSort": null,
        "CityNameEnglish": "Debao",
        "district_code": 451024,
        "chinese_name": "德保县"
    },
    {
        "Id": 2418,
        "DisName": "靖西县",
        "CityID": 317,
        "DisSort": null,
        "CityNameEnglish": "Jingxi",
        "district_code": 451025,
        "chinese_name": "靖西县"
    },
    {
        "Id": 2419,
        "DisName": "那坡县",
        "CityID": 317,
        "DisSort": null,
        "CityNameEnglish": "Napo",
        "district_code": 451026,
        "chinese_name": "那坡县"
    },
    {
        "Id": 2420,
        "DisName": "凌云县",
        "CityID": 317,
        "DisSort": null,
        "CityNameEnglish": "Lingyun",
        "district_code": 451027,
        "chinese_name": "凌云县"
    },
    {
        "Id": 2421,
        "DisName": "乐业县",
        "CityID": 317,
        "DisSort": null,
        "CityNameEnglish": "Leye",
        "district_code": 451028,
        "chinese_name": "乐业县"
    },
    {
        "Id": 2422,
        "DisName": "田林县",
        "CityID": 317,
        "DisSort": null,
        "CityNameEnglish": "Tianlin",
        "district_code": 451029,
        "chinese_name": "田林县"
    },
    {
        "Id": 2423,
        "DisName": "西林县",
        "CityID": 317,
        "DisSort": null,
        "CityNameEnglish": "Xilin",
        "district_code": 451030,
        "chinese_name": "西林县"
    },
    {
        "Id": 2424,
        "DisName": "隆林各族自治县",
        "CityID": 317,
        "DisSort": null,
        "CityNameEnglish": "Longlin",
        "district_code": 451031,
        "chinese_name": "隆林各族自治县"
    },
    {
        "Id": 2425,
        "DisName": "钦南区",
        "CityID": 318,
        "DisSort": null,
        "CityNameEnglish": "Qinnan",
        "district_code": 450702,
        "chinese_name": "钦南区"
    },
    {
        "Id": 2426,
        "DisName": "钦北区",
        "CityID": 318,
        "DisSort": null,
        "CityNameEnglish": "Qinbei",
        "district_code": 450703,
        "chinese_name": "钦北区"
    },
    {
        "Id": 2427,
        "DisName": "灵山县",
        "CityID": 318,
        "DisSort": null,
        "CityNameEnglish": "Lingshan",
        "district_code": 450721,
        "chinese_name": "灵山县"
    },
    {
        "Id": 2428,
        "DisName": "浦北县",
        "CityID": 318,
        "DisSort": null,
        "CityNameEnglish": "Pubei",
        "district_code": 450722,
        "chinese_name": "浦北县"
    },
    {
        "Id": 2429,
        "DisName": "金城江区",
        "CityID": 319,
        "DisSort": null,
        "CityNameEnglish": "Jinchengjiang",
        "district_code": 451202,
        "chinese_name": "金城江区"
    },
    {
        "Id": 2430,
        "DisName": "南丹县",
        "CityID": 319,
        "DisSort": null,
        "CityNameEnglish": "Nandan",
        "district_code": 451221,
        "chinese_name": "南丹县"
    },
    {
        "Id": 2431,
        "DisName": "天峨县",
        "CityID": 319,
        "DisSort": null,
        "CityNameEnglish": "Tian'e",
        "district_code": 451222,
        "chinese_name": "天峨县"
    },
    {
        "Id": 2432,
        "DisName": "凤山县",
        "CityID": 319,
        "DisSort": null,
        "CityNameEnglish": "Fengshan",
        "district_code": 451223,
        "chinese_name": "凤山县"
    },
    {
        "Id": 2433,
        "DisName": "东兰县",
        "CityID": 319,
        "DisSort": null,
        "CityNameEnglish": "Donglan",
        "district_code": 451224,
        "chinese_name": "东兰县"
    },
    {
        "Id": 2434,
        "DisName": "罗城仫佬族自治县",
        "CityID": 319,
        "DisSort": null,
        "CityNameEnglish": "Luocheng",
        "district_code": 451225,
        "chinese_name": "罗城仫佬族自治县"
    },
    {
        "Id": 2435,
        "DisName": "环江毛南族自治县",
        "CityID": 319,
        "DisSort": null,
        "CityNameEnglish": "Huanjiang",
        "district_code": 451226,
        "chinese_name": "环江毛南族自治县"
    },
    {
        "Id": 2436,
        "DisName": "巴马瑶族自治县",
        "CityID": 319,
        "DisSort": null,
        "CityNameEnglish": "Bama",
        "district_code": 451227,
        "chinese_name": "巴马瑶族自治县"
    },
    {
        "Id": 2437,
        "DisName": "都安瑶族自治县",
        "CityID": 319,
        "DisSort": null,
        "CityNameEnglish": "Du'an",
        "district_code": 451228,
        "chinese_name": "都安瑶族自治县"
    },
    {
        "Id": 2438,
        "DisName": "大化瑶族自治县",
        "CityID": 319,
        "DisSort": null,
        "CityNameEnglish": "Dahua",
        "district_code": 451229,
        "chinese_name": "大化瑶族自治县"
    },
    {
        "Id": 2439,
        "DisName": "宜州市",
        "CityID": 319,
        "DisSort": null,
        "CityNameEnglish": "Yizhou",
        "district_code": 451281,
        "chinese_name": "宜州市"
    },
    {
        "Id": 2440,
        "DisName": "海城区",
        "CityID": 320,
        "DisSort": null,
        "CityNameEnglish": "Haicheng",
        "district_code": 450502,
        "chinese_name": "海城区"
    },
    {
        "Id": 2441,
        "DisName": "银海区",
        "CityID": 320,
        "DisSort": null,
        "CityNameEnglish": "Yinhai",
        "district_code": 450503,
        "chinese_name": "银海区"
    },
    {
        "Id": 2442,
        "DisName": "铁山港区",
        "CityID": 320,
        "DisSort": null,
        "CityNameEnglish": "Tieshangang",
        "district_code": 450512,
        "chinese_name": "铁山港区"
    },
    {
        "Id": 2443,
        "DisName": "合浦县",
        "CityID": 320,
        "DisSort": null,
        "CityNameEnglish": "Hepu",
        "district_code": 450521,
        "chinese_name": "合浦县"
    },
    {
        "Id": 2444,
        "DisName": "城关区",
        "CityID": 321,
        "DisSort": null,
        "CityNameEnglish": "Chengguan",
        "district_code": 540102,
        "chinese_name": "城关区"
    },
    {
        "Id": 2445,
        "DisName": "林周县",
        "CityID": 321,
        "DisSort": null,
        "CityNameEnglish": "Linzhou",
        "district_code": 540121,
        "chinese_name": "林周县"
    },
    {
        "Id": 2446,
        "DisName": "当雄县",
        "CityID": 321,
        "DisSort": null,
        "CityNameEnglish": "Dangxiong",
        "district_code": 540122,
        "chinese_name": "当雄县"
    },
    {
        "Id": 2447,
        "DisName": "尼木县",
        "CityID": 321,
        "DisSort": null,
        "CityNameEnglish": "Nimu",
        "district_code": 540123,
        "chinese_name": "尼木县"
    },
    {
        "Id": 2448,
        "DisName": "曲水县",
        "CityID": 321,
        "DisSort": null,
        "CityNameEnglish": "Qushui",
        "district_code": 540124,
        "chinese_name": "曲水县"
    },
    {
        "Id": 2449,
        "DisName": "堆龙德庆县",
        "CityID": 321,
        "DisSort": null,
        "CityNameEnglish": "Doilungdegen",
        "district_code": 540125,
        "chinese_name": "堆龙德庆县"
    },
    {
        "Id": 2450,
        "DisName": "达孜县",
        "CityID": 321,
        "DisSort": null,
        "CityNameEnglish": "Dazi",
        "district_code": 540126,
        "chinese_name": "达孜县"
    },
    {
        "Id": 2451,
        "DisName": "墨竹工卡县",
        "CityID": 321,
        "DisSort": null,
        "CityNameEnglish": "Mozhugongka",
        "district_code": 540127,
        "chinese_name": "墨竹工卡县"
    },
    {
        "Id": 2452,
        "DisName": "日喀则市",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Shigatse",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2453,
        "DisName": "南木林县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Nanmulin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2454,
        "DisName": "江孜县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Jiangzi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2455,
        "DisName": "定日县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Dingri",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2456,
        "DisName": "萨迦县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Sakya",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2457,
        "DisName": "拉孜县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Lazi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2458,
        "DisName": "昂仁县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Ngamring",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2459,
        "DisName": "谢通门县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Xietongmen",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2460,
        "DisName": "白朗县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Bainang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2461,
        "DisName": "仁布县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Renbu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2462,
        "DisName": "康马县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Kangma",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2463,
        "DisName": "定结县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Dingjie",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2464,
        "DisName": "仲巴县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Zhongba",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2465,
        "DisName": "亚东县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Yadong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2466,
        "DisName": "吉隆县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Gyirong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2467,
        "DisName": "聂拉木县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Nielamu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2468,
        "DisName": "萨嘎县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Saga",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2469,
        "DisName": "岗巴县",
        "CityID": 322,
        "DisSort": null,
        "CityNameEnglish": "Gangba",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2470,
        "DisName": "乃东县",
        "CityID": 323,
        "DisSort": null,
        "CityNameEnglish": "Naidong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2471,
        "DisName": "扎囊县",
        "CityID": 323,
        "DisSort": null,
        "CityNameEnglish": "Zhanang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2472,
        "DisName": "贡嘎县",
        "CityID": 323,
        "DisSort": null,
        "CityNameEnglish": "Gongga",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2473,
        "DisName": "桑日县",
        "CityID": 323,
        "DisSort": null,
        "CityNameEnglish": "Sangri",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2474,
        "DisName": "琼结县",
        "CityID": 323,
        "DisSort": null,
        "CityNameEnglish": "Qiongjie",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2475,
        "DisName": "曲松县",
        "CityID": 323,
        "DisSort": null,
        "CityNameEnglish": "Qusum",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2476,
        "DisName": "措美县",
        "CityID": 323,
        "DisSort": null,
        "CityNameEnglish": "Comai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2477,
        "DisName": "洛扎县",
        "CityID": 323,
        "DisSort": null,
        "CityNameEnglish": "Luozha.",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2478,
        "DisName": "加查县",
        "CityID": 323,
        "DisSort": null,
        "CityNameEnglish": "Jiacha",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2479,
        "DisName": "隆子县",
        "CityID": 323,
        "DisSort": null,
        "CityNameEnglish": "Longzi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2480,
        "DisName": "错那县",
        "CityID": 323,
        "DisSort": null,
        "CityNameEnglish": "Cuona",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2481,
        "DisName": "浪卡子县",
        "CityID": 323,
        "DisSort": null,
        "CityNameEnglish": "Langkazi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2482,
        "DisName": "林芝县",
        "CityID": 324,
        "DisSort": null,
        "CityNameEnglish": "Linzhi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2483,
        "DisName": "工布江达县",
        "CityID": 324,
        "DisSort": null,
        "CityNameEnglish": "Gongbujiangda",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2484,
        "DisName": "米林县",
        "CityID": 324,
        "DisSort": null,
        "CityNameEnglish": "Milin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2485,
        "DisName": "墨脱县",
        "CityID": 324,
        "DisSort": null,
        "CityNameEnglish": "Medog",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2486,
        "DisName": "波密县",
        "CityID": 324,
        "DisSort": null,
        "CityNameEnglish": "Bomi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2487,
        "DisName": "察隅县",
        "CityID": 324,
        "DisSort": null,
        "CityNameEnglish": "Chayu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2488,
        "DisName": "朗县",
        "CityID": 324,
        "DisSort": null,
        "CityNameEnglish": "Langxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2489,
        "DisName": "昌都县",
        "CityID": 325,
        "DisSort": null,
        "CityNameEnglish": "Changdu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2490,
        "DisName": "江达县",
        "CityID": 325,
        "DisSort": null,
        "CityNameEnglish": "Jiangda",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2491,
        "DisName": "贡觉县",
        "CityID": 325,
        "DisSort": null,
        "CityNameEnglish": "Gongjue",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2492,
        "DisName": "类乌齐县",
        "CityID": 325,
        "DisSort": null,
        "CityNameEnglish": "Riwoqe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2493,
        "DisName": "丁青县",
        "CityID": 325,
        "DisSort": null,
        "CityNameEnglish": "Dingqing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2494,
        "DisName": "察雅县",
        "CityID": 325,
        "DisSort": null,
        "CityNameEnglish": "Chaya",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2495,
        "DisName": "八宿县",
        "CityID": 325,
        "DisSort": null,
        "CityNameEnglish": "Basu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2496,
        "DisName": "左贡县",
        "CityID": 325,
        "DisSort": null,
        "CityNameEnglish": "Zogang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2497,
        "DisName": "芒康县",
        "CityID": 325,
        "DisSort": null,
        "CityNameEnglish": "Mangkam",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2498,
        "DisName": "洛隆县",
        "CityID": 325,
        "DisSort": null,
        "CityNameEnglish": "Luolong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2499,
        "DisName": "边坝县",
        "CityID": 325,
        "DisSort": null,
        "CityNameEnglish": "Banbar",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2500,
        "DisName": "那曲县",
        "CityID": 326,
        "DisSort": null,
        "CityNameEnglish": "Nagqu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2501,
        "DisName": "嘉黎县",
        "CityID": 326,
        "DisSort": null,
        "CityNameEnglish": "Lhari",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2502,
        "DisName": "比如县",
        "CityID": 326,
        "DisSort": null,
        "CityNameEnglish": "Biru",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2503,
        "DisName": "聂荣县",
        "CityID": 326,
        "DisSort": null,
        "CityNameEnglish": "Nierong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2504,
        "DisName": "安多县",
        "CityID": 326,
        "DisSort": null,
        "CityNameEnglish": "Amdo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2505,
        "DisName": "申扎县",
        "CityID": 326,
        "DisSort": null,
        "CityNameEnglish": "Xainza",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2506,
        "DisName": "索县",
        "CityID": 326,
        "DisSort": null,
        "CityNameEnglish": "Suoxian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2507,
        "DisName": "班戈县",
        "CityID": 326,
        "DisSort": null,
        "CityNameEnglish": "Bangor",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2508,
        "DisName": "巴青县",
        "CityID": 326,
        "DisSort": null,
        "CityNameEnglish": "Baqen",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2509,
        "DisName": "尼玛县",
        "CityID": 326,
        "DisSort": null,
        "CityNameEnglish": "Nyima",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2510,
        "DisName": "普兰县",
        "CityID": 327,
        "DisSort": null,
        "CityNameEnglish": "Purang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2511,
        "DisName": "札达县",
        "CityID": 327,
        "DisSort": null,
        "CityNameEnglish": "Zanda",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2512,
        "DisName": "噶尔县",
        "CityID": 327,
        "DisSort": null,
        "CityNameEnglish": "Gar",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2513,
        "DisName": "日土县",
        "CityID": 327,
        "DisSort": null,
        "CityNameEnglish": "Rutog",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2514,
        "DisName": "革吉县",
        "CityID": 327,
        "DisSort": null,
        "CityNameEnglish": "Gyai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2515,
        "DisName": "改则县",
        "CityID": 327,
        "DisSort": null,
        "CityNameEnglish": "Gerze",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2516,
        "DisName": "措勤县",
        "CityID": 327,
        "DisSort": null,
        "CityNameEnglish": "Cuoqin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2517,
        "DisName": "兴庆区",
        "CityID": 328,
        "DisSort": null,
        "CityNameEnglish": "Xingqing",
        "district_code": 640104,
        "chinese_name": "兴庆区"
    },
    {
        "Id": 2518,
        "DisName": "西夏区",
        "CityID": 328,
        "DisSort": null,
        "CityNameEnglish": "Xixia",
        "district_code": 640105,
        "chinese_name": "西夏区"
    },
    {
        "Id": 2519,
        "DisName": "金凤区",
        "CityID": 328,
        "DisSort": null,
        "CityNameEnglish": "Jinfeng",
        "district_code": 640106,
        "chinese_name": "金凤区"
    },
    {
        "Id": 2520,
        "DisName": "永宁县",
        "CityID": 328,
        "DisSort": null,
        "CityNameEnglish": "Yongning",
        "district_code": 640121,
        "chinese_name": "永宁县"
    },
    {
        "Id": 2521,
        "DisName": "贺兰县",
        "CityID": 328,
        "DisSort": null,
        "CityNameEnglish": "Helan",
        "district_code": 640122,
        "chinese_name": "贺兰县"
    },
    {
        "Id": 2522,
        "DisName": "灵武市",
        "CityID": 328,
        "DisSort": null,
        "CityNameEnglish": "Lingwu",
        "district_code": 640181,
        "chinese_name": "灵武市"
    },
    {
        "Id": 2523,
        "DisName": "大武口区",
        "CityID": 329,
        "DisSort": null,
        "CityNameEnglish": "Dawukou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2524,
        "DisName": "惠农区",
        "CityID": 329,
        "DisSort": null,
        "CityNameEnglish": "Huinong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2525,
        "DisName": "平罗县",
        "CityID": 329,
        "DisSort": null,
        "CityNameEnglish": "Pingluo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2526,
        "DisName": "利通区",
        "CityID": 330,
        "DisSort": null,
        "CityNameEnglish": "Litong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2527,
        "DisName": "盐池县",
        "CityID": 330,
        "DisSort": null,
        "CityNameEnglish": "Yanchi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2528,
        "DisName": "同心县",
        "CityID": 330,
        "DisSort": null,
        "CityNameEnglish": "Tongxin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2529,
        "DisName": "青铜峡市",
        "CityID": 330,
        "DisSort": null,
        "CityNameEnglish": "Qingtongxia",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2530,
        "DisName": "原州区",
        "CityID": 331,
        "DisSort": null,
        "CityNameEnglish": "Yuanzhou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2531,
        "DisName": "西吉县",
        "CityID": 331,
        "DisSort": null,
        "CityNameEnglish": "Xiji",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2532,
        "DisName": "隆德县",
        "CityID": 331,
        "DisSort": null,
        "CityNameEnglish": "Longde",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2533,
        "DisName": "泾源县",
        "CityID": 331,
        "DisSort": null,
        "CityNameEnglish": "Jingyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2534,
        "DisName": "彭阳县",
        "CityID": 331,
        "DisSort": null,
        "CityNameEnglish": "Pengyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2535,
        "DisName": "沙坡头区",
        "CityID": 332,
        "DisSort": null,
        "CityNameEnglish": "Shapotou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2536,
        "DisName": "中宁县",
        "CityID": 332,
        "DisSort": null,
        "CityNameEnglish": "Zhongning",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2537,
        "DisName": "海原县",
        "CityID": 332,
        "DisSort": null,
        "CityNameEnglish": "Haiyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2538,
        "DisName": "塔城市",
        "CityID": 333,
        "DisSort": null,
        "CityNameEnglish": "Tacheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2539,
        "DisName": "乌苏市",
        "CityID": 333,
        "DisSort": null,
        "CityNameEnglish": "Wusu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2540,
        "DisName": "额敏县",
        "CityID": 333,
        "DisSort": null,
        "CityNameEnglish": "Emin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2541,
        "DisName": "沙湾县",
        "CityID": 333,
        "DisSort": null,
        "CityNameEnglish": "Shawan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2542,
        "DisName": "托里县",
        "CityID": 333,
        "DisSort": null,
        "CityNameEnglish": "Toli",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2543,
        "DisName": "裕民县",
        "CityID": 333,
        "DisSort": null,
        "CityNameEnglish": "Yumin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2544,
        "DisName": "和布克赛尔蒙古自治县",
        "CityID": 333,
        "DisSort": null,
        "CityNameEnglish": "Hoboksar",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2545,
        "DisName": "哈密市",
        "CityID": 334,
        "DisSort": null,
        "CityNameEnglish": "Hami",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2546,
        "DisName": "巴里坤哈萨克自治县",
        "CityID": 334,
        "DisSort": null,
        "CityNameEnglish": "Barkol",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2547,
        "DisName": "伊吾县",
        "CityID": 334,
        "DisSort": null,
        "CityNameEnglish": "Yiwu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2548,
        "DisName": "和田市",
        "CityID": 335,
        "DisSort": null,
        "CityNameEnglish": "Hetian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2549,
        "DisName": "和田县",
        "CityID": 335,
        "DisSort": null,
        "CityNameEnglish": "Hetian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2550,
        "DisName": "墨玉县",
        "CityID": 335,
        "DisSort": null,
        "CityNameEnglish": "Moyu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2551,
        "DisName": "皮山县",
        "CityID": 335,
        "DisSort": null,
        "CityNameEnglish": "Pishan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2552,
        "DisName": "洛浦县",
        "CityID": 335,
        "DisSort": null,
        "CityNameEnglish": "Luopu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2553,
        "DisName": "策勒县",
        "CityID": 335,
        "DisSort": null,
        "CityNameEnglish": "Qira",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2554,
        "DisName": "于田县",
        "CityID": 335,
        "DisSort": null,
        "CityNameEnglish": "Yutian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2555,
        "DisName": "民丰县",
        "CityID": 335,
        "DisSort": null,
        "CityNameEnglish": "Minfeng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2556,
        "DisName": "阿勒泰市",
        "CityID": 336,
        "DisSort": null,
        "CityNameEnglish": "Aletai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2557,
        "DisName": "布尔津县",
        "CityID": 336,
        "DisSort": null,
        "CityNameEnglish": "Buerjin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2558,
        "DisName": "富蕴县",
        "CityID": 336,
        "DisSort": null,
        "CityNameEnglish": "Fuyun",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2559,
        "DisName": "福海县",
        "CityID": 336,
        "DisSort": null,
        "CityNameEnglish": "Fuhai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2560,
        "DisName": "哈巴河县",
        "CityID": 336,
        "DisSort": null,
        "CityNameEnglish": "Habahe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2561,
        "DisName": "青河县",
        "CityID": 336,
        "DisSort": null,
        "CityNameEnglish": "Qinggil",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2562,
        "DisName": "吉木乃县",
        "CityID": 336,
        "DisSort": null,
        "CityNameEnglish": "Jimunai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2563,
        "DisName": "阿图什市",
        "CityID": 337,
        "DisSort": null,
        "CityNameEnglish": "Atux",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2564,
        "DisName": "阿克陶县",
        "CityID": 337,
        "DisSort": null,
        "CityNameEnglish": "Akto",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2565,
        "DisName": "阿合奇县",
        "CityID": 337,
        "DisSort": null,
        "CityNameEnglish": "Akeqi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2566,
        "DisName": "乌恰县",
        "CityID": 337,
        "DisSort": null,
        "CityNameEnglish": "Wuqia",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2567,
        "DisName": "博乐市",
        "CityID": 338,
        "DisSort": null,
        "CityNameEnglish": "Bole",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2568,
        "DisName": "精河县",
        "CityID": 338,
        "DisSort": null,
        "CityNameEnglish": "Jinghe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2569,
        "DisName": "温泉县",
        "CityID": 338,
        "DisSort": null,
        "CityNameEnglish": "Wenquan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2570,
        "DisName": "独山子区",
        "CityID": 339,
        "DisSort": null,
        "CityNameEnglish": "Dushanzi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2571,
        "DisName": "克拉玛依区",
        "CityID": 339,
        "DisSort": null,
        "CityNameEnglish": "Karamay",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2572,
        "DisName": "白碱滩区",
        "CityID": 339,
        "DisSort": null,
        "CityNameEnglish": "Baijiantan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2573,
        "DisName": "乌尔禾区",
        "CityID": 339,
        "DisSort": null,
        "CityNameEnglish": "Urho",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2574,
        "DisName": "天山区",
        "CityID": 340,
        "DisSort": null,
        "CityNameEnglish": "Tianshan",
        "district_code": 650102,
        "chinese_name": "天山区"
    },
    {
        "Id": 2575,
        "DisName": "沙依巴克区",
        "CityID": 340,
        "DisSort": null,
        "CityNameEnglish": "Shayibake",
        "district_code": 650103,
        "chinese_name": "沙依巴克区"
    },
    {
        "Id": 2576,
        "DisName": "新市区",
        "CityID": 340,
        "DisSort": null,
        "CityNameEnglish": "Xinshiqu",
        "district_code": 650104,
        "chinese_name": "新市区"
    },
    {
        "Id": 2577,
        "DisName": "水磨沟区",
        "CityID": 340,
        "DisSort": null,
        "CityNameEnglish": "Shuimogou",
        "district_code": 650105,
        "chinese_name": "水磨沟区"
    },
    {
        "Id": 2578,
        "DisName": "头屯河区",
        "CityID": 340,
        "DisSort": null,
        "CityNameEnglish": "Toutunhe",
        "district_code": 650106,
        "chinese_name": "头屯河区"
    },
    {
        "Id": 2579,
        "DisName": "达坂城区",
        "CityID": 340,
        "DisSort": null,
        "CityNameEnglish": "Dabancheng",
        "district_code": 650107,
        "chinese_name": "达坂城区"
    },
    {
        "Id": 2580,
        "DisName": "米东区",
        "CityID": 340,
        "DisSort": null,
        "CityNameEnglish": "Midong",
        "district_code": 650109,
        "chinese_name": "米东区"
    },
    {
        "Id": 2581,
        "DisName": "乌鲁木齐县",
        "CityID": 340,
        "DisSort": null,
        "CityNameEnglish": "Urumqi",
        "district_code": 650121,
        "chinese_name": "乌鲁木齐县"
    },
    {
        "Id": 2582,
        "DisName": "昌吉市",
        "CityID": 342,
        "DisSort": null,
        "CityNameEnglish": "Changji",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2583,
        "DisName": "阜康市",
        "CityID": 342,
        "DisSort": null,
        "CityNameEnglish": "Fukang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2584,
        "DisName": "呼图壁县",
        "CityID": 342,
        "DisSort": null,
        "CityNameEnglish": "Hutubi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2585,
        "DisName": "玛纳斯县",
        "CityID": 342,
        "DisSort": null,
        "CityNameEnglish": "Manasi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2586,
        "DisName": "奇台县",
        "CityID": 342,
        "DisSort": null,
        "CityNameEnglish": "Qitai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2587,
        "DisName": "吉木萨尔县",
        "CityID": 342,
        "DisSort": null,
        "CityNameEnglish": "Jimsar",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2588,
        "DisName": "木垒哈萨克自治县",
        "CityID": 342,
        "DisSort": null,
        "CityNameEnglish": "Mori",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2589,
        "DisName": "吐鲁番市",
        "CityID": 344,
        "DisSort": null,
        "CityNameEnglish": "Turpan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2590,
        "DisName": "鄯善县",
        "CityID": 344,
        "DisSort": null,
        "CityNameEnglish": "Shanshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2591,
        "DisName": "托克逊县",
        "CityID": 344,
        "DisSort": null,
        "CityNameEnglish": "Toksun",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2592,
        "DisName": "库尔勒市",
        "CityID": 345,
        "DisSort": null,
        "CityNameEnglish": "Korla",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2593,
        "DisName": "轮台县",
        "CityID": 345,
        "DisSort": null,
        "CityNameEnglish": "Luntai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2594,
        "DisName": "尉犁县",
        "CityID": 345,
        "DisSort": null,
        "CityNameEnglish": "Yuli",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2595,
        "DisName": "若羌县",
        "CityID": 345,
        "DisSort": null,
        "CityNameEnglish": "Ruoqiang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2596,
        "DisName": "且末县",
        "CityID": 345,
        "DisSort": null,
        "CityNameEnglish": "Qiemo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2597,
        "DisName": "焉耆回族自治县",
        "CityID": 345,
        "DisSort": null,
        "CityNameEnglish": "Yanqi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2598,
        "DisName": "和静县",
        "CityID": 345,
        "DisSort": null,
        "CityNameEnglish": "Hejing",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2599,
        "DisName": "和硕县",
        "CityID": 345,
        "DisSort": null,
        "CityNameEnglish": "Heshuo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2600,
        "DisName": "博湖县",
        "CityID": 345,
        "DisSort": null,
        "CityNameEnglish": "Bohu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2601,
        "DisName": "阿克苏市",
        "CityID": 346,
        "DisSort": null,
        "CityNameEnglish": "Akesu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2602,
        "DisName": "温宿县",
        "CityID": 346,
        "DisSort": null,
        "CityNameEnglish": "Wensu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2603,
        "DisName": "库车县",
        "CityID": 346,
        "DisSort": null,
        "CityNameEnglish": "Kuche",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2604,
        "DisName": "沙雅县",
        "CityID": 346,
        "DisSort": null,
        "CityNameEnglish": "Shaya",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2605,
        "DisName": "新和县",
        "CityID": 346,
        "DisSort": null,
        "CityNameEnglish": "Xinhe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2606,
        "DisName": "拜城县",
        "CityID": 346,
        "DisSort": null,
        "CityNameEnglish": "Baicheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2607,
        "DisName": "乌什县",
        "CityID": 346,
        "DisSort": null,
        "CityNameEnglish": "Wushi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2608,
        "DisName": "阿瓦提县",
        "CityID": 346,
        "DisSort": null,
        "CityNameEnglish": "Awati",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2609,
        "DisName": "柯坪县",
        "CityID": 346,
        "DisSort": null,
        "CityNameEnglish": "Keping",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2610,
        "DisName": "喀什市",
        "CityID": 348,
        "DisSort": null,
        "CityNameEnglish": "Kashi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2611,
        "DisName": "疏附县",
        "CityID": 348,
        "DisSort": null,
        "CityNameEnglish": "Shufu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2612,
        "DisName": "疏勒县",
        "CityID": 348,
        "DisSort": null,
        "CityNameEnglish": "Shule",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2613,
        "DisName": "英吉沙县",
        "CityID": 348,
        "DisSort": null,
        "CityNameEnglish": "Yingjisha ",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2614,
        "DisName": "泽普县",
        "CityID": 348,
        "DisSort": null,
        "CityNameEnglish": "Zepu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2615,
        "DisName": "莎车县",
        "CityID": 348,
        "DisSort": null,
        "CityNameEnglish": "Shache",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2616,
        "DisName": "叶城县",
        "CityID": 348,
        "DisSort": null,
        "CityNameEnglish": "Yecheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2617,
        "DisName": "麦盖提县",
        "CityID": 348,
        "DisSort": null,
        "CityNameEnglish": "Mengaiti",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2618,
        "DisName": "岳普湖县",
        "CityID": 348,
        "DisSort": null,
        "CityNameEnglish": "Yuepuhu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2619,
        "DisName": "伽师县",
        "CityID": 348,
        "DisSort": null,
        "CityNameEnglish": "Jiashi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2620,
        "DisName": "巴楚县",
        "CityID": 348,
        "DisSort": null,
        "CityNameEnglish": "Bachu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2621,
        "DisName": "塔什库尔干塔吉克自治县",
        "CityID": 348,
        "DisSort": null,
        "CityNameEnglish": "Taxkorgan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2622,
        "DisName": "伊宁市",
        "CityID": 350,
        "DisSort": null,
        "CityNameEnglish": "Yining",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2623,
        "DisName": "奎屯市",
        "CityID": 350,
        "DisSort": null,
        "CityNameEnglish": "Kuitun",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2624,
        "DisName": "伊宁县",
        "CityID": 350,
        "DisSort": null,
        "CityNameEnglish": "Yining",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2625,
        "DisName": "察布查尔锡伯自治县",
        "CityID": 350,
        "DisSort": null,
        "CityNameEnglish": "Qapqal",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2626,
        "DisName": "霍城县",
        "CityID": 350,
        "DisSort": null,
        "CityNameEnglish": "Huocheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2627,
        "DisName": "巩留县",
        "CityID": 350,
        "DisSort": null,
        "CityNameEnglish": "Gongliu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2628,
        "DisName": "新源县",
        "CityID": 350,
        "DisSort": null,
        "CityNameEnglish": "Xinyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2629,
        "DisName": "昭苏县",
        "CityID": 350,
        "DisSort": null,
        "CityNameEnglish": "Zhaosu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2630,
        "DisName": "特克斯县",
        "CityID": 350,
        "DisSort": null,
        "CityNameEnglish": "Turks",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2631,
        "DisName": "尼勒克县",
        "CityID": 350,
        "DisSort": null,
        "CityNameEnglish": "Nilka",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2632,
        "DisName": "海拉尔区",
        "CityID": 351,
        "DisSort": null,
        "CityNameEnglish": "Hailar",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2633,
        "DisName": "阿荣旗",
        "CityID": 351,
        "DisSort": null,
        "CityNameEnglish": "Arong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2634,
        "DisName": "莫力达瓦达斡尔族自治旗",
        "CityID": 351,
        "DisSort": null,
        "CityNameEnglish": "Molidawa",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2635,
        "DisName": "鄂伦春自治旗",
        "CityID": 351,
        "DisSort": null,
        "CityNameEnglish": "Oroqen",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2636,
        "DisName": "鄂温克族自治旗",
        "CityID": 351,
        "DisSort": null,
        "CityNameEnglish": "Ewenki",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2637,
        "DisName": "陈巴尔虎旗",
        "CityID": 351,
        "DisSort": null,
        "CityNameEnglish": "Chenbarhu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2638,
        "DisName": "新巴尔虎左旗",
        "CityID": 351,
        "DisSort": null,
        "CityNameEnglish": "Chenbarhuzuo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2639,
        "DisName": "新巴尔虎右旗",
        "CityID": 351,
        "DisSort": null,
        "CityNameEnglish": "Chenbarhuyou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2640,
        "DisName": "满洲里市",
        "CityID": 351,
        "DisSort": null,
        "CityNameEnglish": "Manchuria",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2641,
        "DisName": "牙克石市",
        "CityID": 351,
        "DisSort": null,
        "CityNameEnglish": "Yakeshi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2642,
        "DisName": "扎兰屯市",
        "CityID": 351,
        "DisSort": null,
        "CityNameEnglish": "Zhalantun",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2643,
        "DisName": "额尔古纳市",
        "CityID": 351,
        "DisSort": null,
        "CityNameEnglish": "Eergu'Na",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2644,
        "DisName": "根河市",
        "CityID": 351,
        "DisSort": null,
        "CityNameEnglish": "Genhe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2645,
        "DisName": "新城区",
        "CityID": 352,
        "DisSort": null,
        "CityNameEnglish": "Xincheng",
        "district_code": 150102,
        "chinese_name": "新城区"
    },
    {
        "Id": 2646,
        "DisName": "回民区",
        "CityID": 352,
        "DisSort": null,
        "CityNameEnglish": "Huimin",
        "district_code": 150103,
        "chinese_name": "回民区"
    },
    {
        "Id": 2647,
        "DisName": "玉泉区",
        "CityID": 352,
        "DisSort": null,
        "CityNameEnglish": "Yuquan",
        "district_code": 150104,
        "chinese_name": "玉泉区"
    },
    {
        "Id": 2648,
        "DisName": "赛罕区",
        "CityID": 352,
        "DisSort": null,
        "CityNameEnglish": "Saihan",
        "district_code": 150105,
        "chinese_name": "赛罕区"
    },
    {
        "Id": 2649,
        "DisName": "土默特左旗",
        "CityID": 352,
        "DisSort": null,
        "CityNameEnglish": "Tumotezuo",
        "district_code": 150121,
        "chinese_name": "土默特左旗"
    },
    {
        "Id": 2650,
        "DisName": "托克托县",
        "CityID": 352,
        "DisSort": null,
        "CityNameEnglish": "Togtoh",
        "district_code": 150122,
        "chinese_name": "托克托县"
    },
    {
        "Id": 2651,
        "DisName": "和林格尔县",
        "CityID": 352,
        "DisSort": null,
        "CityNameEnglish": "Helingeer",
        "district_code": 150123,
        "chinese_name": "和林格尔县"
    },
    {
        "Id": 2652,
        "DisName": "清水河县",
        "CityID": 352,
        "DisSort": null,
        "CityNameEnglish": "Qingshuihe",
        "district_code": 150124,
        "chinese_name": "清水河县"
    },
    {
        "Id": 2653,
        "DisName": "武川县",
        "CityID": 352,
        "DisSort": null,
        "CityNameEnglish": "Wuchuan",
        "district_code": 150125,
        "chinese_name": "武川县"
    },
    {
        "Id": 2654,
        "DisName": "东河区",
        "CityID": 353,
        "DisSort": null,
        "CityNameEnglish": "Donghe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2655,
        "DisName": "昆都仑区",
        "CityID": 353,
        "DisSort": null,
        "CityNameEnglish": "Kundulun",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2656,
        "DisName": "青山区",
        "CityID": 353,
        "DisSort": null,
        "CityNameEnglish": "Qingshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2657,
        "DisName": "石拐区",
        "CityID": 353,
        "DisSort": null,
        "CityNameEnglish": "Shiguai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2658,
        "DisName": "白云鄂博矿区",
        "CityID": 353,
        "DisSort": null,
        "CityNameEnglish": "Baiyunebo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2659,
        "DisName": "九原区",
        "CityID": 353,
        "DisSort": null,
        "CityNameEnglish": "Jiuyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2660,
        "DisName": "土默特右旗",
        "CityID": 353,
        "DisSort": null,
        "CityNameEnglish": "Tumoteyou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2661,
        "DisName": "固阳县",
        "CityID": 353,
        "DisSort": null,
        "CityNameEnglish": "Guyang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2662,
        "DisName": "达尔罕茂明安联合旗",
        "CityID": 353,
        "DisSort": null,
        "CityNameEnglish": "Darhan Muminggan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2663,
        "DisName": "海勃湾区",
        "CityID": 354,
        "DisSort": null,
        "CityNameEnglish": "Haibowan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2664,
        "DisName": "海南区",
        "CityID": 354,
        "DisSort": null,
        "CityNameEnglish": "Hainan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2665,
        "DisName": "乌达区",
        "CityID": 354,
        "DisSort": null,
        "CityNameEnglish": "Wuda",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2666,
        "DisName": "集宁区",
        "CityID": 355,
        "DisSort": null,
        "CityNameEnglish": "Jining",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2667,
        "DisName": "卓资县",
        "CityID": 355,
        "DisSort": null,
        "CityNameEnglish": "Zhuozi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2668,
        "DisName": "化德县",
        "CityID": 355,
        "DisSort": null,
        "CityNameEnglish": "Huade",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2669,
        "DisName": "商都县",
        "CityID": 355,
        "DisSort": null,
        "CityNameEnglish": "Shangdu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2670,
        "DisName": "兴和县",
        "CityID": 355,
        "DisSort": null,
        "CityNameEnglish": "Xinghe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2671,
        "DisName": "凉城县",
        "CityID": 355,
        "DisSort": null,
        "CityNameEnglish": "Liangcheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2672,
        "DisName": "察哈尔右翼前旗",
        "CityID": 355,
        "DisSort": null,
        "CityNameEnglish": "Chahar Youyiqian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2673,
        "DisName": "察哈尔右翼中旗",
        "CityID": 355,
        "DisSort": null,
        "CityNameEnglish": "Chahar Youyizhong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2674,
        "DisName": "察哈尔右翼后旗",
        "CityID": 355,
        "DisSort": null,
        "CityNameEnglish": "Chahar Youyihou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2675,
        "DisName": "四子王旗",
        "CityID": 355,
        "DisSort": null,
        "CityNameEnglish": "Siziwang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2676,
        "DisName": "丰镇市",
        "CityID": 355,
        "DisSort": null,
        "CityNameEnglish": "Fengzhen",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2677,
        "DisName": "科尔沁区",
        "CityID": 356,
        "DisSort": null,
        "CityNameEnglish": "Horqin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2678,
        "DisName": "科尔沁左翼中旗",
        "CityID": 356,
        "DisSort": null,
        "CityNameEnglish": "Horqin Zuoyizhong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2679,
        "DisName": "科尔沁左翼后旗",
        "CityID": 356,
        "DisSort": null,
        "CityNameEnglish": "Horqin Zuoyihou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2680,
        "DisName": "开鲁县",
        "CityID": 356,
        "DisSort": null,
        "CityNameEnglish": "Kailu",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2681,
        "DisName": "库伦旗",
        "CityID": 356,
        "DisSort": null,
        "CityNameEnglish": "Kulun",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2682,
        "DisName": "奈曼旗",
        "CityID": 356,
        "DisSort": null,
        "CityNameEnglish": "Nai Man",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2683,
        "DisName": "扎鲁特旗",
        "CityID": 356,
        "DisSort": null,
        "CityNameEnglish": "Zhalute",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2684,
        "DisName": "霍林郭勒市",
        "CityID": 356,
        "DisSort": null,
        "CityNameEnglish": "Huolinguole",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2685,
        "DisName": "红山区",
        "CityID": 357,
        "DisSort": null,
        "CityNameEnglish": "Hongshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2686,
        "DisName": "元宝山区",
        "CityID": 357,
        "DisSort": null,
        "CityNameEnglish": "Yuanbaoshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2687,
        "DisName": "松山区",
        "CityID": 357,
        "DisSort": null,
        "CityNameEnglish": "Songshan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2688,
        "DisName": "阿鲁科尔沁旗",
        "CityID": 357,
        "DisSort": null,
        "CityNameEnglish": "Alukerqin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2689,
        "DisName": "巴林左旗",
        "CityID": 357,
        "DisSort": null,
        "CityNameEnglish": "Balinzuo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2690,
        "DisName": "巴林右旗",
        "CityID": 357,
        "DisSort": null,
        "CityNameEnglish": "Balinyou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2691,
        "DisName": "林西县",
        "CityID": 357,
        "DisSort": null,
        "CityNameEnglish": "Linxi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2692,
        "DisName": "克什克腾旗",
        "CityID": 357,
        "DisSort": null,
        "CityNameEnglish": "Hexigten",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2693,
        "DisName": "翁牛特旗",
        "CityID": 357,
        "DisSort": null,
        "CityNameEnglish": "Wengniute",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2694,
        "DisName": "喀喇沁旗",
        "CityID": 357,
        "DisSort": null,
        "CityNameEnglish": "Kelaqin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2695,
        "DisName": "宁城县",
        "CityID": 357,
        "DisSort": null,
        "CityNameEnglish": "Ningcheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2696,
        "DisName": "敖汉旗",
        "CityID": 357,
        "DisSort": null,
        "CityNameEnglish": "Aohan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2697,
        "DisName": "东胜区",
        "CityID": 358,
        "DisSort": null,
        "CityNameEnglish": "Dongsheng",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2698,
        "DisName": "达拉特旗",
        "CityID": 358,
        "DisSort": null,
        "CityNameEnglish": "Dalate",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2699,
        "DisName": "准格尔旗",
        "CityID": 358,
        "DisSort": null,
        "CityNameEnglish": "Zhungeer",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2700,
        "DisName": "鄂托克前旗",
        "CityID": 358,
        "DisSort": null,
        "CityNameEnglish": "Etuokeqian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2701,
        "DisName": "鄂托克旗",
        "CityID": 358,
        "DisSort": null,
        "CityNameEnglish": "Etuoke",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2702,
        "DisName": "杭锦旗",
        "CityID": 358,
        "DisSort": null,
        "CityNameEnglish": "Hangjin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2703,
        "DisName": "乌审旗",
        "CityID": 358,
        "DisSort": null,
        "CityNameEnglish": "Wushen",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2704,
        "DisName": "伊金霍洛旗",
        "CityID": 358,
        "DisSort": null,
        "CityNameEnglish": "Yijinhuoluo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2705,
        "DisName": "临河区",
        "CityID": 359,
        "DisSort": null,
        "CityNameEnglish": "Linhe",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2706,
        "DisName": "五原县",
        "CityID": 359,
        "DisSort": null,
        "CityNameEnglish": "Wuyuan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2707,
        "DisName": "磴口县",
        "CityID": 359,
        "DisSort": null,
        "CityNameEnglish": "Dengkou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2708,
        "DisName": "乌拉特前旗",
        "CityID": 359,
        "DisSort": null,
        "CityNameEnglish": "Urad Qian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2709,
        "DisName": "乌拉特中旗",
        "CityID": 359,
        "DisSort": null,
        "CityNameEnglish": "Urad Zhong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2710,
        "DisName": "乌拉特后旗",
        "CityID": 359,
        "DisSort": null,
        "CityNameEnglish": "Urad Hou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2711,
        "DisName": "杭锦后旗",
        "CityID": 359,
        "DisSort": null,
        "CityNameEnglish": "Hangjinhou",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2712,
        "DisName": "二连浩特市",
        "CityID": 360,
        "DisSort": null,
        "CityNameEnglish": "Erenhot",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2713,
        "DisName": "锡林浩特市",
        "CityID": 360,
        "DisSort": null,
        "CityNameEnglish": "Xilinhaote",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2714,
        "DisName": "阿巴嘎旗",
        "CityID": 360,
        "DisSort": null,
        "CityNameEnglish": "Abaga",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2715,
        "DisName": "苏尼特左旗",
        "CityID": 360,
        "DisSort": null,
        "CityNameEnglish": "Sunite Zuo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2716,
        "DisName": "苏尼特右旗",
        "CityID": 360,
        "DisSort": null,
        "CityNameEnglish": "Sunite You",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2717,
        "DisName": "东乌珠穆沁旗",
        "CityID": 360,
        "DisSort": null,
        "CityNameEnglish": "East Ujimqin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2718,
        "DisName": "西乌珠穆沁旗",
        "CityID": 360,
        "DisSort": null,
        "CityNameEnglish": "West Ujimqin",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2719,
        "DisName": "太仆寺旗",
        "CityID": 360,
        "DisSort": null,
        "CityNameEnglish": "Taipusi",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2720,
        "DisName": "镶黄旗",
        "CityID": 360,
        "DisSort": null,
        "CityNameEnglish": "Xianghuang",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2721,
        "DisName": "正镶白旗",
        "CityID": 360,
        "DisSort": null,
        "CityNameEnglish": "Zhengxiangbai",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2722,
        "DisName": "正蓝旗",
        "CityID": 360,
        "DisSort": null,
        "CityNameEnglish": "Zhenglan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2723,
        "DisName": "多伦县",
        "CityID": 360,
        "DisSort": null,
        "CityNameEnglish": "Duolun",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2724,
        "DisName": "乌兰浩特市",
        "CityID": 361,
        "DisSort": null,
        "CityNameEnglish": "Ulanhot",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2725,
        "DisName": "阿尔山市",
        "CityID": 361,
        "DisSort": null,
        "CityNameEnglish": "Arxan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2726,
        "DisName": "科尔沁右翼前旗",
        "CityID": 361,
        "DisSort": null,
        "CityNameEnglish": "Horqin Youyiqian",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2727,
        "DisName": "科尔沁右翼中旗",
        "CityID": 361,
        "DisSort": null,
        "CityNameEnglish": "Horqin Youyizhong",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2728,
        "DisName": "扎赉特旗",
        "CityID": 361,
        "DisSort": null,
        "CityNameEnglish": "Zhalaite",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2729,
        "DisName": "突泉县",
        "CityID": 361,
        "DisSort": null,
        "CityNameEnglish": "Tuquan",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2730,
        "DisName": "阿拉善左旗",
        "CityID": 362,
        "DisSort": null,
        "CityNameEnglish": "Alashan Zuo",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2731,
        "DisName": "阿拉善右旗",
        "CityID": 362,
        "DisSort": null,
        "CityNameEnglish": "Alashan You",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2732,
        "DisName": "额济纳旗",
        "CityID": 362,
        "DisSort": null,
        "CityNameEnglish": "Ejina",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2733,
        "DisName": "东城区",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Dongcheng",
        "district_code": 110101,
        "chinese_name": "东城区"
    },
    {
        "Id": 2734,
        "DisName": "西城区",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Xicheng",
        "district_code": 110102,
        "chinese_name": "西城区"
    },
    {
        "Id": 2735,
        "DisName": "朝阳区",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Chaoyang",
        "district_code": 110105,
        "chinese_name": "朝阳区"
    },
    {
        "Id": 2736,
        "DisName": "丰台区",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Fengtai",
        "district_code": 110106,
        "chinese_name": "丰台区"
    },
    {
        "Id": 2737,
        "DisName": "石景山区",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Shijingshan",
        "district_code": 110107,
        "chinese_name": "石景山区"
    },
    {
        "Id": 2738,
        "DisName": "海淀区",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Haidian,",
        "district_code": 110108,
        "chinese_name": "海淀区"
    },
    {
        "Id": 2739,
        "DisName": "门头沟区",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Mentougou",
        "district_code": 110109,
        "chinese_name": "门头沟区"
    },
    {
        "Id": 2740,
        "DisName": "房山区",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Fangshan",
        "district_code": 110111,
        "chinese_name": "房山区"
    },
    {
        "Id": 2741,
        "DisName": "通州区",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Tongzhou",
        "district_code": 110112,
        "chinese_name": "通州区"
    },
    {
        "Id": 2742,
        "DisName": "顺义区",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Shunyi",
        "district_code": 110113,
        "chinese_name": "顺义区"
    },
    {
        "Id": 2743,
        "DisName": "昌平区",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Changping",
        "district_code": 110114,
        "chinese_name": "昌平区"
    },
    {
        "Id": 2744,
        "DisName": "大兴区",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Daxing",
        "district_code": 110115,
        "chinese_name": "大兴区"
    },
    {
        "Id": 2745,
        "DisName": "怀柔区",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Huairou",
        "district_code": 110116,
        "chinese_name": "怀柔区"
    },
    {
        "Id": 2746,
        "DisName": "平谷区",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Pinggu",
        "district_code": 110117,
        "chinese_name": "平谷区"
    },
    {
        "Id": 2747,
        "DisName": "密云县",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Miyun",
        "district_code": 110228,
        "chinese_name": "密云县"
    },
    {
        "Id": 2748,
        "DisName": "延庆县",
        "CityID": 110100,
        "DisSort": null,
        "CityNameEnglish": "Yanqing",
        "district_code": 110229,
        "chinese_name": "延庆县"
    },
    {
        "Id": 2749,
        "DisName": "和平区",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Heping",
        "district_code": 120101,
        "chinese_name": "和平区"
    },
    {
        "Id": 2750,
        "DisName": "河东区",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Hedong",
        "district_code": 120102,
        "chinese_name": "河东区"
    },
    {
        "Id": 2751,
        "DisName": "河西区",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Hexi",
        "district_code": 120103,
        "chinese_name": "河西区"
    },
    {
        "Id": 2752,
        "DisName": "南开区",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Nankai",
        "district_code": 120104,
        "chinese_name": "南开区"
    },
    {
        "Id": 2753,
        "DisName": "河北区",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Hebei",
        "district_code": 120105,
        "chinese_name": "河北区"
    },
    {
        "Id": 2754,
        "DisName": "红桥区",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Hongqiao",
        "district_code": 120106,
        "chinese_name": "红桥区"
    },
    {
        "Id": 2755,
        "DisName": "滨海新区",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Binhai New",
        "district_code": 120226,
        "chinese_name": "其它区"
    },
    {
        "Id": 2756,
        "DisName": "东丽区",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Dongli",
        "district_code": 120110,
        "chinese_name": "东丽区"
    },
    {
        "Id": 2757,
        "DisName": "西青区",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Xiqing",
        "district_code": 120111,
        "chinese_name": "西青区"
    },
    {
        "Id": 2758,
        "DisName": "津南区",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Jinnan",
        "district_code": 120112,
        "chinese_name": "津南区"
    },
    {
        "Id": 2759,
        "DisName": "北辰区",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Beichen",
        "district_code": 120113,
        "chinese_name": "北辰区"
    },
    {
        "Id": 2760,
        "DisName": "武清区",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Wuqing",
        "district_code": 120114,
        "chinese_name": "武清区"
    },
    {
        "Id": 2761,
        "DisName": "宝坻区",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Baodi",
        "district_code": 120115,
        "chinese_name": "宝坻区"
    },
    {
        "Id": 2762,
        "DisName": "宁河县",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Ninghe",
        "district_code": 120221,
        "chinese_name": "宁河县"
    },
    {
        "Id": 2763,
        "DisName": "静海县",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Jinghai",
        "district_code": 120223,
        "chinese_name": "静海县"
    },
    {
        "Id": 2764,
        "DisName": "蓟县",
        "CityID": 120100,
        "DisSort": null,
        "CityNameEnglish": "Jixian",
        "district_code": 120225,
        "chinese_name": "蓟县"
    },
    {
        "Id": 2765,
        "DisName": "黄浦区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Huangpu",
        "district_code": 310101,
        "chinese_name": "黄浦区"
    },
    {
        "Id": 2766,
        "DisName": "徐汇区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Xuhui",
        "district_code": 310104,
        "chinese_name": "徐汇区"
    },
    {
        "Id": 2767,
        "DisName": "长宁区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Changning",
        "district_code": 310105,
        "chinese_name": "长宁区"
    },
    {
        "Id": 2768,
        "DisName": "静安区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Jing'an",
        "district_code": 310106,
        "chinese_name": "静安区"
    },
    {
        "Id": 2769,
        "DisName": "普陀区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Putuo",
        "district_code": 310107,
        "chinese_name": "普陀区"
    },
    {
        "Id": 2770,
        "DisName": "闸北区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Zhabei",
        "district_code": 310108,
        "chinese_name": "闸北区"
    },
    {
        "Id": 2771,
        "DisName": "虹口区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Hongkou",
        "district_code": 310109,
        "chinese_name": "虹口区"
    },
    {
        "Id": 2772,
        "DisName": "杨浦区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Yangpu",
        "district_code": 310110,
        "chinese_name": "杨浦区"
    },
    {
        "Id": 2773,
        "DisName": "闵行区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Minhang",
        "district_code": 310112,
        "chinese_name": "闵行区"
    },
    {
        "Id": 2774,
        "DisName": "宝山区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Baoshan",
        "district_code": 310113,
        "chinese_name": "宝山区"
    },
    {
        "Id": 2775,
        "DisName": "嘉定区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Jiading",
        "district_code": 310114,
        "chinese_name": "嘉定区"
    },
    {
        "Id": 2776,
        "DisName": "浦东新区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Pudong New",
        "district_code": 310115,
        "chinese_name": "浦东新区"
    },
    {
        "Id": 2777,
        "DisName": "金山区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Jinshan",
        "district_code": 310116,
        "chinese_name": "金山区"
    },
    {
        "Id": 2778,
        "DisName": "松江区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Songjiang",
        "district_code": 310117,
        "chinese_name": "松江区"
    },
    {
        "Id": 2779,
        "DisName": "青浦区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Qingpu",
        "district_code": 310118,
        "chinese_name": "青浦区"
    },
    {
        "Id": 2780,
        "DisName": "奉贤区",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Fengxian",
        "district_code": 310120,
        "chinese_name": "奉贤区"
    },
    {
        "Id": 2781,
        "DisName": "崇明县",
        "CityID": 310100,
        "DisSort": null,
        "CityNameEnglish": "Chongming",
        "district_code": 310230,
        "chinese_name": "崇明县"
    },
    {
        "Id": 2782,
        "DisName": "万州区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Wanzhou",
        "district_code": 500101,
        "chinese_name": "万州区"
    },
    {
        "Id": 2783,
        "DisName": "涪陵区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Fuling",
        "district_code": 500102,
        "chinese_name": "涪陵区"
    },
    {
        "Id": 2784,
        "DisName": "渝中区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Yuzhong",
        "district_code": 500103,
        "chinese_name": "渝中区"
    },
    {
        "Id": 2785,
        "DisName": "大渡口区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Dadukou",
        "district_code": 500104,
        "chinese_name": "大渡口区"
    },
    {
        "Id": 2786,
        "DisName": "江北区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Jiangbei",
        "district_code": 500105,
        "chinese_name": "江北区"
    },
    {
        "Id": 2787,
        "DisName": "沙坪坝区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Shapingba",
        "district_code": 500106,
        "chinese_name": "沙坪坝区"
    },
    {
        "Id": 2788,
        "DisName": "九龙坡区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Jiulongpo",
        "district_code": 500107,
        "chinese_name": "九龙坡区"
    },
    {
        "Id": 2789,
        "DisName": "南岸区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Nan'an",
        "district_code": 500108,
        "chinese_name": "南岸区"
    },
    {
        "Id": 2790,
        "DisName": "北碚区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Beibei",
        "district_code": 500109,
        "chinese_name": "北碚区"
    },
    {
        "Id": 2791,
        "DisName": "万盛区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Wansheng",
        "district_code": 500110,
        "chinese_name": "万盛区"
    },
    {
        "Id": 2792,
        "DisName": "双桥区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Shuangqiao",
        "district_code": 500111,
        "chinese_name": "双桥区"
    },
    {
        "Id": 2793,
        "DisName": "渝北区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Yubei",
        "district_code": 500112,
        "chinese_name": "渝北区"
    },
    {
        "Id": 2794,
        "DisName": "巴南区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Banan",
        "district_code": 500113,
        "chinese_name": "巴南区"
    },
    {
        "Id": 2795,
        "DisName": "黔江区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Qianjiang",
        "district_code": 500114,
        "chinese_name": "黔江区"
    },
    {
        "Id": 2796,
        "DisName": "长寿区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Changshou",
        "district_code": 500115,
        "chinese_name": "长寿区"
    },
    {
        "Id": 2797,
        "DisName": "江津区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Jiangjin",
        "district_code": 500381,
        "chinese_name": "江津区"
    },
    {
        "Id": 2798,
        "DisName": "合川区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Hechuan",
        "district_code": 500382,
        "chinese_name": "合川区"
    },
    {
        "Id": 2799,
        "DisName": "永川区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Yongchuan",
        "district_code": 500383,
        "chinese_name": "永川区"
    },
    {
        "Id": 2800,
        "DisName": "南川区",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Nanchuan",
        "district_code": 500384,
        "chinese_name": "南川区"
    },
    {
        "Id": 2801,
        "DisName": "綦江县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Qijiang",
        "district_code": 500222,
        "chinese_name": "綦江县"
    },
    {
        "Id": 2802,
        "DisName": "潼南县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Tongnan",
        "district_code": 500223,
        "chinese_name": "潼南县"
    },
    {
        "Id": 2803,
        "DisName": "铜梁县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Tongliang",
        "district_code": 500224,
        "chinese_name": "铜梁县"
    },
    {
        "Id": 2804,
        "DisName": "大足县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Dazu",
        "district_code": 500225,
        "chinese_name": "大足县"
    },
    {
        "Id": 2805,
        "DisName": "荣昌县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Rongchang",
        "district_code": 500226,
        "chinese_name": "荣昌县"
    },
    {
        "Id": 2806,
        "DisName": "璧山县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Bishan",
        "district_code": 500227,
        "chinese_name": "璧山县"
    },
    {
        "Id": 2807,
        "DisName": "梁平县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Liangping",
        "district_code": 500228,
        "chinese_name": "梁平县"
    },
    {
        "Id": 2808,
        "DisName": "城口县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Chengkou",
        "district_code": 500229,
        "chinese_name": "城口县"
    },
    {
        "Id": 2809,
        "DisName": "丰都县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Fengdu",
        "district_code": 500230,
        "chinese_name": "丰都县"
    },
    {
        "Id": 2810,
        "DisName": "垫江县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Dianjiang",
        "district_code": 500231,
        "chinese_name": "垫江县"
    },
    {
        "Id": 2811,
        "DisName": "武隆县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Wulong",
        "district_code": 500232,
        "chinese_name": "武隆县"
    },
    {
        "Id": 2812,
        "DisName": "忠县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Zhongxian",
        "district_code": 500233,
        "chinese_name": "忠县"
    },
    {
        "Id": 2813,
        "DisName": "开县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Kaixian",
        "district_code": 500234,
        "chinese_name": "开县"
    },
    {
        "Id": 2814,
        "DisName": "云阳县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Yunyang",
        "district_code": 500235,
        "chinese_name": "云阳县"
    },
    {
        "Id": 2815,
        "DisName": "奉节县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Fengjie",
        "district_code": 500236,
        "chinese_name": "奉节县"
    },
    {
        "Id": 2816,
        "DisName": "巫山县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Wushan",
        "district_code": 500237,
        "chinese_name": "巫山县"
    },
    {
        "Id": 2817,
        "DisName": "巫溪县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Wuxi",
        "district_code": 500238,
        "chinese_name": "巫溪县"
    },
    {
        "Id": 2818,
        "DisName": "石柱土家族自治县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Shizhu",
        "district_code": 500240,
        "chinese_name": "石柱土家族自治县"
    },
    {
        "Id": 2819,
        "DisName": "秀山土家族苗族自治县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Xiushan",
        "district_code": 500241,
        "chinese_name": "秀山土家族苗族自治县"
    },
    {
        "Id": 2820,
        "DisName": "酉阳土家族苗族自治县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Youyang",
        "district_code": 500242,
        "chinese_name": "酉阳土家族苗族自治县"
    },
    {
        "Id": 2821,
        "DisName": "彭水苗族土家族自治县",
        "CityID": 500100,
        "DisSort": null,
        "CityNameEnglish": "Pengshui",
        "district_code": 500243,
        "chinese_name": "彭水苗族土家族自治县"
    },
    {
        "Id": 2822,
        "DisName": "长安镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Changan Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2823,
        "DisName": "莞城区",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Guancheng District",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2824,
        "DisName": "南城区",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Nancheng Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2825,
        "DisName": "寮步镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Liaobu Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2826,
        "DisName": "大岭山镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Da Lingshan Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2827,
        "DisName": "横沥镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Hengli Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2828,
        "DisName": "常平镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Changping Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2829,
        "DisName": "厚街镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Houjie Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2830,
        "DisName": "万江区",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Wanjiang District",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2831,
        "DisName": "樟木头镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Zhang Mutou Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2832,
        "DisName": "塘厦镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Tangxia Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2833,
        "DisName": "凤岗镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Fenggang Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2834,
        "DisName": "大朗镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Dalang Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2835,
        "DisName": "东坑镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Dongkeng Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2836,
        "DisName": "清溪镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Qingxi Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2837,
        "DisName": "企石镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Qishi Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2838,
        "DisName": "茶山镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Chashan Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2839,
        "DisName": "东城区",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Dongcheng District",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2840,
        "DisName": "虎门镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Humen Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2841,
        "DisName": "黄江镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Huangjiang Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2842,
        "DisName": "石排镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Shipai Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2843,
        "DisName": "道滘镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Daojiao Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2844,
        "DisName": "沙田镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Shatian Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2845,
        "DisName": "高埗镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Gaobu Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2846,
        "DisName": "石龙镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Shilong Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2847,
        "DisName": "石碣镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Shijie Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2848,
        "DisName": "洪梅镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Hongmei Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2849,
        "DisName": "麻涌镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Mayong Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2850,
        "DisName": "松山湖",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Songshan Lake",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2851,
        "DisName": "桥头镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Qiaotou Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2852,
        "DisName": "望牛墩镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Wang Niudun Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2853,
        "DisName": "中堂镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Zhongtang  Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2854,
        "DisName": "谢岗镇",
        "CityID": 210,
        "DisSort": null,
        "CityNameEnglish": "Xiegang Town",
        "district_code": 441901,
        "chinese_name": "东莞市"
    },
    {
        "Id": 2855,
        "DisName": "五龙口镇",
        "CityID": 151,
        "DisSort": null,
        "CityNameEnglish": "Wu Longkou Town",
        "district_code": 410880,
        "chinese_name": "济源市"
    },
    {
        "Id": 2856,
        "DisName": "城区",
        "CityID": 151,
        "DisSort": null,
        "CityNameEnglish": "urban area",
        "district_code": 410880,
        "chinese_name": "济源市"
    },
    {
        "Id": 2857,
        "DisName": "下冶镇",
        "CityID": 151,
        "DisSort": null,
        "CityNameEnglish": "Xiaye Town",
        "district_code": 410880,
        "chinese_name": "济源市"
    },
    {
        "Id": 2858,
        "DisName": "轵城镇",
        "CityID": 151,
        "DisSort": null,
        "CityNameEnglish": "Zhicheng Town",
        "district_code": 410880,
        "chinese_name": "济源市"
    },
    {
        "Id": 2859,
        "DisName": "王屋镇",
        "CityID": 151,
        "DisSort": null,
        "CityNameEnglish": "Wangwu Town",
        "district_code": 410880,
        "chinese_name": "济源市"
    },
    {
        "Id": 2860,
        "DisName": "思礼镇",
        "CityID": 151,
        "DisSort": null,
        "CityNameEnglish": "Sili Town",
        "district_code": 410880,
        "chinese_name": "济源市"
    },
    {
        "Id": 2861,
        "DisName": "邵原镇",
        "CityID": 151,
        "DisSort": null,
        "CityNameEnglish": "Shaoyuan Town",
        "district_code": 410880,
        "chinese_name": "济源市"
    },
    {
        "Id": 2862,
        "DisName": "坡头镇",
        "CityID": 151,
        "DisSort": null,
        "CityNameEnglish": "Potou Town",
        "district_code": 410880,
        "chinese_name": "济源市"
    },
    {
        "Id": 2863,
        "DisName": "梨林镇",
        "CityID": 151,
        "DisSort": null,
        "CityNameEnglish": "Lilin Town",
        "district_code": 410880,
        "chinese_name": "济源市"
    },
    {
        "Id": 2864,
        "DisName": "克井镇",
        "CityID": 151,
        "DisSort": null,
        "CityNameEnglish": "Kejing Town",
        "district_code": 410880,
        "chinese_name": "济源市"
    },
    {
        "Id": 2865,
        "DisName": "大峪镇",
        "CityID": 151,
        "DisSort": null,
        "CityNameEnglish": "Dayu Town",
        "district_code": 410880,
        "chinese_name": "济源市"
    },
    {
        "Id": 2866,
        "DisName": "承留镇",
        "CityID": 151,
        "DisSort": null,
        "CityNameEnglish": "Chengliu Town",
        "district_code": 410880,
        "chinese_name": "济源市"
    },
    {
        "Id": 2867,
        "DisName": "松柏镇",
        "CityID": 169,
        "DisSort": null,
        "CityNameEnglish": "Songbai Town",
        "district_code": 429921,
        "chinese_name": "神农架林区"
    },
    {
        "Id": 2868,
        "DisName": "阳日镇",
        "CityID": 169,
        "DisSort": null,
        "CityNameEnglish": "Yangri Town",
        "district_code": 429921,
        "chinese_name": "神农架林区"
    },
    {
        "Id": 2869,
        "DisName": "木鱼镇",
        "CityID": 169,
        "DisSort": null,
        "CityNameEnglish": "Muyu Town",
        "district_code": 429921,
        "chinese_name": "神农架林区"
    },
    {
        "Id": 2870,
        "DisName": "红坪镇",
        "CityID": 169,
        "DisSort": null,
        "CityNameEnglish": "Hongping Town",
        "district_code": 429921,
        "chinese_name": "神农架林区"
    },
    {
        "Id": 2871,
        "DisName": "新华镇",
        "CityID": 169,
        "DisSort": null,
        "CityNameEnglish": "Xinhua Town",
        "district_code": 429921,
        "chinese_name": "神农架林区"
    },
    {
        "Id": 2872,
        "DisName": "宋洛乡",
        "CityID": 169,
        "DisSort": null,
        "CityNameEnglish": "Songluo Village",
        "district_code": 429921,
        "chinese_name": "神农架林区"
    },
    {
        "Id": 2873,
        "DisName": "九湖乡",
        "CityID": 169,
        "DisSort": null,
        "CityNameEnglish": "Jiuhu Village",
        "district_code": 429921,
        "chinese_name": "神农架林区"
    },
    {
        "Id": 2874,
        "DisName": "下谷坪乡",
        "CityID": 169,
        "DisSort": null,
        "CityNameEnglish": "Xia Guping Village",
        "district_code": 429921,
        "chinese_name": "神农架林区"
    },
    {
        "Id": 2875,
        "DisName": "城区",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "urban area",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2876,
        "DisName": "郑场镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Zhenchang Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2877,
        "DisName": "毛嘴镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Maozui Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2878,
        "DisName": "豆河镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Douhe Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2879,
        "DisName": "三伏潭镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "San Futan Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2880,
        "DisName": "胡场镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Huchang Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2881,
        "DisName": "长埫口镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Chang Shangkou Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2882,
        "DisName": "西流河镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Xi Liuhe Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2883,
        "DisName": "沙湖镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Shahu Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2884,
        "DisName": "杨林尾镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Yang Linwei Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2885,
        "DisName": "彭场镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Pengchang Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2886,
        "DisName": "张沟镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Zhanggou Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2887,
        "DisName": "郭河镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Guohe Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2888,
        "DisName": "沔城镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Miancheng Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2889,
        "DisName": "通海口镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Tong Haikou Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2890,
        "DisName": "陈场镇",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Chenchang Town",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2891,
        "DisName": "工业园区",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Industrial Park",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2892,
        "DisName": "沙湖原种场",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Shahu original seed farm",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2893,
        "DisName": "排湖渔场",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Paihu Fishery",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2894,
        "DisName": "五湖渔场",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Wuhu Fishery",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2895,
        "DisName": "赵西垸林场",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Zhao Xiyuan Forest Farm",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2896,
        "DisName": "刘家垸林场",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Liu Jiayuan Forest Farm",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2897,
        "DisName": "畜禽良种场",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Livestock and poultry Seed multiplication farm ",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2898,
        "DisName": "九合垸原种场",
        "CityID": 173,
        "DisSort": null,
        "CityNameEnglish": "Jiu Heyuan original seed farm",
        "district_code": 429994,
        "chinese_name": "仙桃市"
    },
    {
        "Id": 2899,
        "DisName": "竟陵街道",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Jingling Street",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2900,
        "DisName": "杨林街道",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Yanglin Street",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2901,
        "DisName": "佛子山镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Fo Zishan Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2902,
        "DisName": "多宝镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Duobao Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2903,
        "DisName": "拖市镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Tuoshi Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2904,
        "DisName": "张港镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Zhanggang Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2905,
        "DisName": "蒋场镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Jiangchang Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2906,
        "DisName": "汪场镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Wangchang Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2907,
        "DisName": "渔薪镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Yuxin Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2908,
        "DisName": "黄潭镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Huangtan Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2909,
        "DisName": "岳口镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Yuekou Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2910,
        "DisName": "横林镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Henglin Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2911,
        "DisName": "彭市镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Pengshi Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2912,
        "DisName": "麻洋镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Mayang Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2913,
        "DisName": "多祥镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Duoxiang Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2914,
        "DisName": "干驿镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Ganyi Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2915,
        "DisName": "马湾镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Mawan Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2916,
        "DisName": "卢市镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Lushi Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2917,
        "DisName": "小板镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Xiaoban Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2918,
        "DisName": "九真镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Jiuzhen Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2919,
        "DisName": "皂市镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Zaoshi Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2920,
        "DisName": "胡市镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Hushi Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2921,
        "DisName": "石河镇",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Shihe Town",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2922,
        "DisName": "净潭乡",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Jingtan Village",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2923,
        "DisName": "蒋湖农场",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Jianghu Farm",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2924,
        "DisName": "白茅湖农场",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Bai Maohu Farm",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2925,
        "DisName": "沉湖管委会",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Chenhu Management Committee",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2926,
        "DisName": "桥乡街道开发区",
        "CityID": 174,
        "DisSort": null,
        "CityNameEnglish": "Qiaoxiang street development area",
        "district_code": 429007,
        "chinese_name": "天门市"
    },
    {
        "Id": 2927,
        "DisName": "园林",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Yuanlin",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2928,
        "DisName": "杨市",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Yangshi",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2929,
        "DisName": "周矶",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "zhouji",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2930,
        "DisName": "光华",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "guanghua",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2931,
        "DisName": "泰丰",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "taifeng",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2932,
        "DisName": "竹根滩镇",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Zhu Gentan Town",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2933,
        "DisName": "高石碑镇",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Gao Shibei Town",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2934,
        "DisName": "积玉口镇",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Ji Yukou Town",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2935,
        "DisName": "渔阳镇",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Yuyang Town",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2936,
        "DisName": "王场镇",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Wangchang Town",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2937,
        "DisName": "熊口镇",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Xiongkou Town",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2938,
        "DisName": "老新镇",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Laoxin Town",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2939,
        "DisName": "浩口镇",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Haokou Town",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2940,
        "DisName": "张金镇",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Zhangjin Town",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2941,
        "DisName": "龙湾镇",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Longwan Town",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2942,
        "DisName": "周矶管理区",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Zhouji Management District",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2943,
        "DisName": "后湖管理区",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Houhu Management District",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2944,
        "DisName": "熊口管理区",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Xiongkou Management District",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2945,
        "DisName": "总口管理区",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Zongkou Management District",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2946,
        "DisName": "高场原种场",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Gaochang original seed farm",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2947,
        "DisName": "浩口原种场",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Haokou original seed farm",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2948,
        "DisName": "江汉石油管理局",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Jianghan Petroleum Administration",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2949,
        "DisName": "潜江经济开发区",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Qianjiang Economic Development Area",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2950,
        "DisName": "西大垸管理区",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Xi Dayuan Management District",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2951,
        "DisName": "运粮湖管理区",
        "CityID": 175,
        "DisSort": null,
        "CityNameEnglish": "Yun Lianghu Management District",
        "district_code": 429995,
        "chinese_name": "潜江市"
    },
    {
        "Id": 2952,
        "DisName": "城区",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "urban area",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2953,
        "DisName": "火炬开发区",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Huoju Development Area",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2954,
        "DisName": "小榄镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Xiaolan Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2955,
        "DisName": "古镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Guzhen town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2956,
        "DisName": "三乡镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Sanxiang town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2957,
        "DisName": "民众镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Minzhong Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2958,
        "DisName": "东凤镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Dongfeng Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2959,
        "DisName": "板芙镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Banfu Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2960,
        "DisName": "神湾镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Shenwan Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2961,
        "DisName": "横栏镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Henglan Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2962,
        "DisName": "港口镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Gangkou Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2963,
        "DisName": "三角镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Sanjiao Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2964,
        "DisName": "大涌镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Dayong Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2965,
        "DisName": "南头镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Nantou Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2966,
        "DisName": "沙溪镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Shaxi Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2967,
        "DisName": "坦洲镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Tanzhou Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2968,
        "DisName": "黄圃镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Huangpu Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2969,
        "DisName": "五桂山镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Wu Guishan Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2970,
        "DisName": "南朗镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Nanlang Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2971,
        "DisName": "莎朗镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Langsha Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2972,
        "DisName": "阜沙镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Fusha Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2973,
        "DisName": "东升镇",
        "CityID": 205,
        "DisSort": null,
        "CityNameEnglish": "Dongsheng Town",
        "district_code": 442001,
        "chinese_name": "中山市"
    },
    {
        "Id": 2974,
        "DisName": "长城区",
        "CityID": 215,
        "DisSort": null,
        "CityNameEnglish": "Changcheng District",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2975,
        "DisName": "镜铁区",
        "CityID": 215,
        "DisSort": null,
        "CityNameEnglish": "Jingtie District",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2976,
        "DisName": "雄关区",
        "CityID": 215,
        "DisSort": null,
        "CityNameEnglish": "Xiongguan District",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2977,
        "DisName": "崖城镇",
        "CityID": 256,
        "DisSort": null,
        "CityNameEnglish": "Yacheng Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2978,
        "DisName": "海棠湾镇",
        "CityID": 256,
        "DisSort": null,
        "CityNameEnglish": "Hai Tangwan Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2979,
        "DisName": "吉阳镇",
        "CityID": 256,
        "DisSort": null,
        "CityNameEnglish": "Jiyang Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2980,
        "DisName": "凤凰镇",
        "CityID": 256,
        "DisSort": null,
        "CityNameEnglish": "Fenghuang Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2981,
        "DisName": "天涯镇",
        "CityID": 256,
        "DisSort": null,
        "CityNameEnglish": "Tianya Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2982,
        "DisName": "育才镇",
        "CityID": 256,
        "DisSort": null,
        "CityNameEnglish": "Yucai Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2983,
        "DisName": "河西区",
        "CityID": 256,
        "DisSort": null,
        "CityNameEnglish": "Hexi District",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2984,
        "DisName": "河东区",
        "CityID": 256,
        "DisSort": null,
        "CityNameEnglish": "Hedong District",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2985,
        "DisName": "南田农场",
        "CityID": 256,
        "DisSort": null,
        "CityNameEnglish": "Nantian Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2986,
        "DisName": "南新农场",
        "CityID": 256,
        "DisSort": null,
        "CityNameEnglish": "Nanxin Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2987,
        "DisName": "立才农场",
        "CityID": 256,
        "DisSort": null,
        "CityNameEnglish": "Licai Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2988,
        "DisName": "南滨农场",
        "CityID": 256,
        "DisSort": null,
        "CityNameEnglish": "Nanbin Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2989,
        "DisName": "通什镇",
        "CityID": 257,
        "DisSort": null,
        "CityNameEnglish": "Tongshi Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2990,
        "DisName": "南圣镇",
        "CityID": 257,
        "DisSort": null,
        "CityNameEnglish": "Nansheng Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2991,
        "DisName": "毛阳镇",
        "CityID": 257,
        "DisSort": null,
        "CityNameEnglish": "Maoyang Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2992,
        "DisName": "番阳镇",
        "CityID": 257,
        "DisSort": null,
        "CityNameEnglish": "Fanyang Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2993,
        "DisName": "畅好乡",
        "CityID": 257,
        "DisSort": null,
        "CityNameEnglish": "Changhao Village ",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2994,
        "DisName": "毛道乡",
        "CityID": 257,
        "DisSort": null,
        "CityNameEnglish": "Maodao Village",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2995,
        "DisName": "水满乡",
        "CityID": 257,
        "DisSort": null,
        "CityNameEnglish": "Shuiman Village",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2996,
        "DisName": "畅好农场",
        "CityID": 257,
        "DisSort": null,
        "CityNameEnglish": "Changhao Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2997,
        "DisName": "嘉积镇",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Jiaji Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2998,
        "DisName": "万泉镇",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Wanquan Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 2999,
        "DisName": "石壁镇",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Shibi Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3000,
        "DisName": "中原镇",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Zhongyuan Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3001,
        "DisName": "博鳌镇",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Boao Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3002,
        "DisName": "阳江镇",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Yangjiang Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3003,
        "DisName": "龙江镇",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Longjiang Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3004,
        "DisName": "潭门镇",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Tanmen Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3005,
        "DisName": "塔洋镇",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Tayang Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3006,
        "DisName": "长坡镇",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Changpo Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3007,
        "DisName": "大路镇",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Dalu Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3008,
        "DisName": "会山镇",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Huishan Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3009,
        "DisName": "东太农场",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Dongtai Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3010,
        "DisName": "东红农场",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Donghong Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3011,
        "DisName": "东升农场",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Dongsheng Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3012,
        "DisName": "南俸农场",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Nanfeng Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3013,
        "DisName": "彬村山华侨农场",
        "CityID": 258,
        "DisSort": null,
        "CityNameEnglish": "Bincun mountain Overseas Chinese Farm ",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3014,
        "DisName": "热作学院",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Rezuo Institute",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3015,
        "DisName": "那大镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Nada Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3016,
        "DisName": "富克镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Fuke Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3017,
        "DisName": "和庆镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Heqing Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3018,
        "DisName": "南丰镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Nanfeng Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3019,
        "DisName": "大城镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Dacheng Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3020,
        "DisName": "雅星镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Yaxing Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3021,
        "DisName": "兰洋镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Lanyang Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3022,
        "DisName": "光村镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Guangcun Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3023,
        "DisName": "木棠镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Mutang Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3024,
        "DisName": "海头镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Haitou Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3025,
        "DisName": "峨蔓镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Eman Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3026,
        "DisName": "三都镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Sandu Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3027,
        "DisName": "王五镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Wangwu Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3028,
        "DisName": "白马井镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Bai Majing Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3029,
        "DisName": "中和镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Zhonghe Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3030,
        "DisName": "排浦镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Paipu Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3031,
        "DisName": "东城镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Dongcheng Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3032,
        "DisName": "新州镇",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Xinzhou Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3033,
        "DisName": "西培农场",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Xipei Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3034,
        "DisName": "西联农场",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Xilian Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3035,
        "DisName": "蓝洋农场",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Lanyang Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3036,
        "DisName": "八一农场",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Bayi Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3037,
        "DisName": "西华农场",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Xihua Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3038,
        "DisName": "西庆农场",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Xiqing Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3039,
        "DisName": "西流农场",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Xiliu Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3040,
        "DisName": "新盈农场",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Xinying Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3041,
        "DisName": "龙山农场",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Longshan Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3042,
        "DisName": "红岭农场",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Hongling Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3043,
        "DisName": "洋浦经济开发区",
        "CityID": 259,
        "DisSort": null,
        "CityNameEnglish": "Yangpu economic development area",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3044,
        "DisName": "文城镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Wencheng Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3045,
        "DisName": "重兴镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Zhongxing Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3046,
        "DisName": "蓬莱镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Penglai Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3047,
        "DisName": "会文镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Huiwen Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3048,
        "DisName": "东路镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Donglu Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3049,
        "DisName": "潭牛镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Tanniu Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3050,
        "DisName": "东阁镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Dongge Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3051,
        "DisName": "文教镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Wenjiao Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3052,
        "DisName": "东郊镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Dongjiao Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3053,
        "DisName": "龙楼镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Longlou Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3054,
        "DisName": "昌洒镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Changsa Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3055,
        "DisName": "翁田镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Wengtian Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3056,
        "DisName": "抱罗镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Baoluo Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3057,
        "DisName": "冯坡镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Fengpo Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3058,
        "DisName": "锦山镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Jinshan Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3059,
        "DisName": "铺前镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Putian Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3060,
        "DisName": "公坡镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Gongpo Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3061,
        "DisName": "迈号镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Maihao Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3062,
        "DisName": "清澜镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Qinglan Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3063,
        "DisName": "南阳镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Nanyang Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3064,
        "DisName": "新桥镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Xinqiao Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3065,
        "DisName": "头苑镇",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Touyuan Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3066,
        "DisName": "宝芳乡",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Baofang Village ",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3067,
        "DisName": "龙马乡",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Longma Village ",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3068,
        "DisName": "湖山乡",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Hushan Village ",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3069,
        "DisName": "东路农场",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Donglu Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3070,
        "DisName": "南阳农场",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Nanyang Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3071,
        "DisName": "罗豆农场",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Douluo Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3072,
        "DisName": "橡胶研究所",
        "CityID": 260,
        "DisSort": null,
        "CityNameEnglish": "Rubber Research Institute",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3073,
        "DisName": "万城镇",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Wancheng Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3074,
        "DisName": "龙滚镇",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Longgun Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3075,
        "DisName": "和乐镇",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Hele Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3076,
        "DisName": "后安镇",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Houan Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3077,
        "DisName": "大茂镇",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Damao Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3078,
        "DisName": "东澳镇",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Dongao Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3079,
        "DisName": "礼记镇",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Liji Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3080,
        "DisName": "长丰镇",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Changfeng Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3081,
        "DisName": "山根镇",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Shangen Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3082,
        "DisName": "北大镇",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Beida Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3083,
        "DisName": "南桥镇",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Nanqiao Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3084,
        "DisName": "三更罗镇",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "San Gengluo Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3085,
        "DisName": "六连农场",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Liulian Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3086,
        "DisName": "东兴农场",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Dongxing farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3087,
        "DisName": "东和农场",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Donghe Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3088,
        "DisName": "新中农场",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Xinzhong Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3089,
        "DisName": "兴隆华侨农场",
        "CityID": 261,
        "DisSort": null,
        "CityNameEnglish": "Xinglong Overseas Chinese Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3090,
        "DisName": "八所镇",
        "CityID": 262,
        "DisSort": null,
        "CityNameEnglish": "Basuo Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3091,
        "DisName": "东河镇",
        "CityID": 262,
        "DisSort": null,
        "CityNameEnglish": "Donghe Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3092,
        "DisName": "大田镇",
        "CityID": 262,
        "DisSort": null,
        "CityNameEnglish": "Datian Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3093,
        "DisName": "感城镇",
        "CityID": 262,
        "DisSort": null,
        "CityNameEnglish": "Gancheng town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3094,
        "DisName": "板桥镇",
        "CityID": 262,
        "DisSort": null,
        "CityNameEnglish": "Banqiao Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3095,
        "DisName": "三家镇",
        "CityID": 262,
        "DisSort": null,
        "CityNameEnglish": "Sanjia town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3096,
        "DisName": "四更镇",
        "CityID": 262,
        "DisSort": null,
        "CityNameEnglish": "Sigeng town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3097,
        "DisName": "新龙镇",
        "CityID": 262,
        "DisSort": null,
        "CityNameEnglish": "Xinlong Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3098,
        "DisName": "天安乡",
        "CityID": 262,
        "DisSort": null,
        "CityNameEnglish": "Tian Village ",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3099,
        "DisName": "江边乡",
        "CityID": 262,
        "DisSort": null,
        "CityNameEnglish": "Jiangbian Village ",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3100,
        "DisName": "广坝农场",
        "CityID": 262,
        "DisSort": null,
        "CityNameEnglish": "Guangba Village ",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3101,
        "DisName": "东方华侨农场",
        "CityID": 262,
        "DisSort": null,
        "CityNameEnglish": "East Overseas Chinese Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3102,
        "DisName": "城区",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "urban area",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3103,
        "DisName": "金江镇",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "JInjiang town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3104,
        "DisName": "老城镇",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "Laocheng town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3105,
        "DisName": "瑞溪镇",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "Ruixi town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3106,
        "DisName": "永发镇",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "Yongfa town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3107,
        "DisName": "加乐镇",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "Jiale town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3108,
        "DisName": "文儒镇",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "Wenru town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3109,
        "DisName": "众兴镇",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "Zhongxing town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3110,
        "DisName": "仁兴镇",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "Renxing town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3111,
        "DisName": "福山镇",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "Fushan town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3112,
        "DisName": "桥头镇",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "Qiaotou town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3113,
        "DisName": "大丰镇",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "Dafeng town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3114,
        "DisName": "红光农场",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "Hongguang Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3115,
        "DisName": "西达农场",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "Xida Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3116,
        "DisName": "金安农场",
        "CityID": 263,
        "DisSort": null,
        "CityNameEnglish": "Jinan Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3117,
        "DisName": "城区",
        "CityID": 264,
        "DisSort": null,
        "CityNameEnglish": "urban area",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3118,
        "DisName": "黄竹镇",
        "CityID": 264,
        "DisSort": null,
        "CityNameEnglish": "Huangzhu town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3119,
        "DisName": "定城镇",
        "CityID": 264,
        "DisSort": null,
        "CityNameEnglish": "dingcheng town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3120,
        "DisName": "新竹镇",
        "CityID": 264,
        "DisSort": null,
        "CityNameEnglish": "xinzhu town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3121,
        "DisName": "龙湖镇",
        "CityID": 264,
        "DisSort": null,
        "CityNameEnglish": "longhu town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3122,
        "DisName": "雷鸣镇",
        "CityID": 264,
        "DisSort": null,
        "CityNameEnglish": "leiming town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3123,
        "DisName": "龙门镇",
        "CityID": 264,
        "DisSort": null,
        "CityNameEnglish": "longmen town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3124,
        "DisName": "龙河镇",
        "CityID": 264,
        "DisSort": null,
        "CityNameEnglish": "longhe town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3125,
        "DisName": "岭口镇",
        "CityID": 264,
        "DisSort": null,
        "CityNameEnglish": "lingkou town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3126,
        "DisName": "翰林镇",
        "CityID": 264,
        "DisSort": null,
        "CityNameEnglish": "hanlin town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3127,
        "DisName": "富文镇",
        "CityID": 264,
        "DisSort": null,
        "CityNameEnglish": "fuwen town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3128,
        "DisName": "金鸡岭农场",
        "CityID": 264,
        "DisSort": null,
        "CityNameEnglish": "Jin Jiling Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3129,
        "DisName": "中瑞农场",
        "CityID": 264,
        "DisSort": null,
        "CityNameEnglish": "Zhongrui Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3130,
        "DisName": "南海农场",
        "CityID": 264,
        "DisSort": null,
        "CityNameEnglish": "Nanhai Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3131,
        "DisName": "屯城镇",
        "CityID": 265,
        "DisSort": null,
        "CityNameEnglish": "Tuncheng town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3132,
        "DisName": "新兴镇",
        "CityID": 265,
        "DisSort": null,
        "CityNameEnglish": "Xinxing town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3133,
        "DisName": "枫木镇",
        "CityID": 265,
        "DisSort": null,
        "CityNameEnglish": "Fengmu town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3134,
        "DisName": "乌坡镇",
        "CityID": 265,
        "DisSort": null,
        "CityNameEnglish": "Wupo town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3135,
        "DisName": "南吕镇",
        "CityID": 265,
        "DisSort": null,
        "CityNameEnglish": "Nanlv town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3136,
        "DisName": "南坤镇",
        "CityID": 265,
        "DisSort": null,
        "CityNameEnglish": "Nankun town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3137,
        "DisName": "中建农场",
        "CityID": 265,
        "DisSort": null,
        "CityNameEnglish": "Zhongjian Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3138,
        "DisName": "坡心镇",
        "CityID": 265,
        "DisSort": null,
        "CityNameEnglish": "Poxin town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3139,
        "DisName": "中坤农场",
        "CityID": 265,
        "DisSort": null,
        "CityNameEnglish": "Zhongkun Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3140,
        "DisName": "西昌镇",
        "CityID": 265,
        "DisSort": null,
        "CityNameEnglish": "xichang town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3141,
        "DisName": "城区",
        "CityID": 266,
        "DisSort": null,
        "CityNameEnglish": "urban area",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3142,
        "DisName": "临城镇",
        "CityID": 266,
        "DisSort": null,
        "CityNameEnglish": "lincheng town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3143,
        "DisName": "波莲镇",
        "CityID": 266,
        "DisSort": null,
        "CityNameEnglish": "bolian town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3144,
        "DisName": "东英镇",
        "CityID": 266,
        "DisSort": null,
        "CityNameEnglish": "dongying town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3145,
        "DisName": "博厚镇",
        "CityID": 266,
        "DisSort": null,
        "CityNameEnglish": "bohou town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3146,
        "DisName": "皇桐镇",
        "CityID": 266,
        "DisSort": null,
        "CityNameEnglish": "huangtong town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3147,
        "DisName": "多文镇",
        "CityID": 266,
        "DisSort": null,
        "CityNameEnglish": "duowen town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3148,
        "DisName": "和舍镇",
        "CityID": 266,
        "DisSort": null,
        "CityNameEnglish": "heshe town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3149,
        "DisName": "南宝镇",
        "CityID": 266,
        "DisSort": null,
        "CityNameEnglish": "nanbao town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3150,
        "DisName": "新盈镇",
        "CityID": 266,
        "DisSort": null,
        "CityNameEnglish": "xinying town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3151,
        "DisName": "调楼镇",
        "CityID": 266,
        "DisSort": null,
        "CityNameEnglish": "diaolou town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3152,
        "DisName": "加来镇",
        "CityID": 266,
        "DisSort": null,
        "CityNameEnglish": "jialai town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3153,
        "DisName": "红华农场",
        "CityID": 266,
        "DisSort": null,
        "CityNameEnglish": "Honghua Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3154,
        "DisName": "加来农场",
        "CityID": 266,
        "DisSort": null,
        "CityNameEnglish": "Jialai Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3155,
        "DisName": "城区",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "urban area",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3156,
        "DisName": "南开乡",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "nankai Village ",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3157,
        "DisName": "阜龙乡",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "fulong Village",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3158,
        "DisName": "青松乡",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "qingsong Village",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3159,
        "DisName": "金波乡",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "jinbo Village",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3160,
        "DisName": "荣邦乡",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "rongbang Village",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3161,
        "DisName": "白沙农场",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "Baisha Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3162,
        "DisName": "牙叉镇",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "yacha town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3163,
        "DisName": "龙江农场",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "Longjiang Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3164,
        "DisName": "七坊镇",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "Qifang farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3165,
        "DisName": "邦溪农场",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "Bangxi Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3166,
        "DisName": "邦溪镇",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "Bangxi town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3167,
        "DisName": "打安镇",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "daan town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3168,
        "DisName": "细水乡",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "xishui town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3169,
        "DisName": "远门乡",
        "CityID": 267,
        "DisSort": null,
        "CityNameEnglish": "yuanmen town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3170,
        "DisName": "城区",
        "CityID": 268,
        "DisSort": null,
        "CityNameEnglish": "urban area",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3171,
        "DisName": "红林农场",
        "CityID": 268,
        "DisSort": null,
        "CityNameEnglish": "honglin farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3172,
        "DisName": "石碌镇",
        "CityID": 268,
        "DisSort": null,
        "CityNameEnglish": "shilu town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3173,
        "DisName": "叉河镇",
        "CityID": 268,
        "DisSort": null,
        "CityNameEnglish": "chahe town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3174,
        "DisName": "十月田镇",
        "CityID": 268,
        "DisSort": null,
        "CityNameEnglish": "Shi Yuetian town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3175,
        "DisName": "乌烈镇",
        "CityID": 268,
        "DisSort": null,
        "CityNameEnglish": "wulie town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3176,
        "DisName": "昌化镇",
        "CityID": 268,
        "DisSort": null,
        "CityNameEnglish": "changhua town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3177,
        "DisName": "海尾镇",
        "CityID": 268,
        "DisSort": null,
        "CityNameEnglish": "haiwei town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3178,
        "DisName": "七叉镇",
        "CityID": 268,
        "DisSort": null,
        "CityNameEnglish": "qicha town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3179,
        "DisName": "王下乡",
        "CityID": 268,
        "DisSort": null,
        "CityNameEnglish": "wangxia Village",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3180,
        "DisName": "霸王岭林场",
        "CityID": 268,
        "DisSort": null,
        "CityNameEnglish": "Ba Wangling Forestry",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3181,
        "DisName": "海南矿业公司",
        "CityID": 268,
        "DisSort": null,
        "CityNameEnglish": "Hainan Mineral Corporation",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3182,
        "DisName": "城区",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "urban area",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3183,
        "DisName": "莺歌海盐场",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "Ying Gehai Saltworks",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3184,
        "DisName": "山荣农场",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "Shanrong Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3185,
        "DisName": "乐光农场",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "Leguang Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3186,
        "DisName": "抱由镇",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "Baoyou Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3187,
        "DisName": "保国农场",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "Boaguo Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3188,
        "DisName": "万冲镇",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "wanchong Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3189,
        "DisName": "大安镇",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "daan Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3190,
        "DisName": "志仲镇",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "zhongbo Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3191,
        "DisName": "千家镇",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "qianjia Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3192,
        "DisName": "九所镇",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "jiusuo Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3193,
        "DisName": "利国镇",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "liguo Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3194,
        "DisName": "黄流镇",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "huangliu Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3195,
        "DisName": "佛罗镇",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "foluo Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3196,
        "DisName": "尖峰镇",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "jianfeng Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3197,
        "DisName": "莺歌海镇",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "ying Gehai Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3198,
        "DisName": "尖峰岭林业公司",
        "CityID": 269,
        "DisSort": null,
        "CityNameEnglish": "Jinafeng Forestry company",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3199,
        "DisName": "城区",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "urban area",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3200,
        "DisName": "岭门农场",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "Lingmen Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3201,
        "DisName": "南平农场",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "Nanping Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3202,
        "DisName": "椰林镇",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "Yeguang Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3203,
        "DisName": "光坡镇",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "guangpo Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3204,
        "DisName": "三才镇",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "sancai Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3205,
        "DisName": "英州镇",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "yingzhou Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3206,
        "DisName": "隆广镇",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "longguang Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3207,
        "DisName": "文罗镇",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "wenluo Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3208,
        "DisName": "本号镇",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "benhao Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3209,
        "DisName": "新村镇",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "xincun Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3210,
        "DisName": "黎安镇",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "lian Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3211,
        "DisName": "提蒙镇",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "timeng Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3212,
        "DisName": "群英乡",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "qunying Village",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3213,
        "DisName": "吊罗山林业公司",
        "CityID": 270,
        "DisSort": null,
        "CityNameEnglish": "Diao Luoshan Forestry company",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3214,
        "DisName": "保亭研究所",
        "CityID": 271,
        "DisSort": null,
        "CityNameEnglish": "Baoting research institute",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3215,
        "DisName": "新星农场",
        "CityID": 271,
        "DisSort": null,
        "CityNameEnglish": "xinxing Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3216,
        "DisName": "金江农场",
        "CityID": 271,
        "DisSort": null,
        "CityNameEnglish": "jinjiang Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3217,
        "DisName": "三道农场",
        "CityID": 271,
        "DisSort": null,
        "CityNameEnglish": "sandao Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3218,
        "DisName": "保城镇",
        "CityID": 271,
        "DisSort": null,
        "CityNameEnglish": "Baocheng Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3219,
        "DisName": "什玲镇",
        "CityID": 271,
        "DisSort": null,
        "CityNameEnglish": "Shiling Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3220,
        "DisName": "加茂镇",
        "CityID": 271,
        "DisSort": null,
        "CityNameEnglish": "Jiamao Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3221,
        "DisName": "响水镇",
        "CityID": 271,
        "DisSort": null,
        "CityNameEnglish": "Xiangshui Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3222,
        "DisName": "新政镇",
        "CityID": 271,
        "DisSort": null,
        "CityNameEnglish": "Xinzheng Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3223,
        "DisName": "三道镇",
        "CityID": 271,
        "DisSort": null,
        "CityNameEnglish": "Sandao Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3224,
        "DisName": "六弓乡",
        "CityID": 271,
        "DisSort": null,
        "CityNameEnglish": "Liugong Village",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3225,
        "DisName": "南林乡",
        "CityID": 271,
        "DisSort": null,
        "CityNameEnglish": "Nanlin Village",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3226,
        "DisName": "毛感乡",
        "CityID": 271,
        "DisSort": null,
        "CityNameEnglish": "Maogan Village",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3227,
        "DisName": "城区",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "urban area",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3228,
        "DisName": "吊罗山乡",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "Diaoluoshan Village",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3229,
        "DisName": "阳江农场",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "Yangjiang Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3230,
        "DisName": "乌石农场",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "Wushi Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3231,
        "DisName": "加钗农场",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "Jiachai Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3232,
        "DisName": "长征农场",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "Changzheng Farm",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3233,
        "DisName": "营根镇",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "Yinggen Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3234,
        "DisName": "湾岭镇",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "Wanling Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3235,
        "DisName": "黎母山镇",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "Li Mushan Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3236,
        "DisName": "和平镇",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "Heping Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3237,
        "DisName": "长征镇",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "Changzheng Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3238,
        "DisName": "红毛镇",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "Hongmao Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3239,
        "DisName": "中平镇",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "zhongping Town",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3240,
        "DisName": "上安乡",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "Shangan Village",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3241,
        "DisName": "什运乡",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "Shiyun Village",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3242,
        "DisName": "黎母山林业公司",
        "CityID": 272,
        "DisSort": null,
        "CityNameEnglish": "Li Mushan Forestry company",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3243,
        "DisName": "石河子市",
        "CityID": 341,
        "DisSort": null,
        "CityNameEnglish": "Shi Hezi city",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3244,
        "DisName": "五家渠市",
        "CityID": 343,
        "DisSort": null,
        "CityNameEnglish": "Wu Jiaqu city",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3245,
        "DisName": "阿拉尔市",
        "CityID": 347,
        "DisSort": null,
        "CityNameEnglish": "A Laer city",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3246,
        "DisName": "图木舒克市",
        "CityID": 349,
        "DisSort": null,
        "CityNameEnglish": "Tu Mushuke city",
        "district_code": null,
        "chinese_name": ""
    },
    {
        "Id": 3247,
        "DisName": "卢龙县",
        "CityID": 363,
        "DisSort": null,
        "CityNameEnglish": "Lulong",
        "district_code": "130324",
        "chinese_name": "卢龙县 "
    },
    {
        "Id": 3248,
        "DisName": "青龙县",
        "CityID": 363,
        "DisSort": null,
        "CityNameEnglish": "Qinglong",
        "district_code": "130321",
        "chinese_name": "青龙满族自治县 "
    },
    {
        "Id": 3249,
        "DisName": "昌黎县",
        "CityID": 363,
        "DisSort": null,
        "CityNameEnglish": "Changli",
        "district_code": "130322",
        "chinese_name": "昌黎县 "
    },
    {
        "Id": 3250,
        "DisName": "北戴河区",
        "CityID": 363,
        "DisSort": null,
        "CityNameEnglish": "Beidaihe",
        "district_code": "130304",
        "chinese_name": "北戴河区 "
    },
    {
        "Id": 3251,
        "DisName": "海港区",
        "CityID": 363,
        "DisSort": null,
        "CityNameEnglish": "Haigang",
        "district_code": "130302",
        "chinese_name": "海港区 "
    },
    {
        "Id": 3252,
        "DisName": "山海关区",
        "CityID": 363,
        "DisSort": null,
        "CityNameEnglish": "Shanhaiguan",
        "district_code": "130303",
        "chinese_name": "山海关区"
    },
    {
        "Id": 3253,
        "DisName": "抚宁县",
        "CityID": 363,
        "DisSort": null,
        "CityNameEnglish": "Funing",
        "district_code": "130323",
        "chinese_name": "抚宁县 "
    },
    {
        "Id": 399,
        "DisName": "昌邑区",
        "CityID": 42,
        "DisSort": null,
        "CityNameEnglish": "Changyi",
        "district_code": 220202,
        "chinese_name": "昌邑区"
    },
    {
        "Id": 400,
        "DisName": "龙潭区",
        "CityID": 42,
        "DisSort": null,
        "CityNameEnglish": "Longtan",
        "district_code": 220203,
        "chinese_name": "龙潭区"
    },
    {
        "Id": 401,
        "DisName": "船营区",
        "CityID": 42,
        "DisSort": null,
        "CityNameEnglish": "Chuanying",
        "district_code": 220204,
        "chinese_name": "船营区"
    },
    {
        "Id": 402,
        "DisName": "丰满区",
        "CityID": 42,
        "DisSort": null,
        "CityNameEnglish": "Fengman",
        "district_code": 220211,
        "chinese_name": "丰满区"
    },
    {
        "Id": 403,
        "DisName": "永吉县",
        "CityID": 42,
        "DisSort": null,
        "CityNameEnglish": "Yongji",
        "district_code": 220221,
        "chinese_name": "永吉县"
    },
    {
        "Id": 404,
        "DisName": "蛟河市",
        "CityID": 42,
        "DisSort": null,
        "CityNameEnglish": "Jiaohe",
        "district_code": 220281,
        "chinese_name": "蛟河市"
    },
    {
        "Id": 405,
        "DisName": "桦甸市",
        "CityID": 42,
        "DisSort": null,
        "CityNameEnglish": "Huadian",
        "district_code": 220282,
        "chinese_name": "桦甸市"
    },
    {
        "Id": 406,
        "DisName": "舒兰市",
        "CityID": 42,
        "DisSort": null,
        "CityNameEnglish": "Shulan",
        "district_code": 220283,
        "chinese_name": "舒兰市"
    },
    {
        "Id": 407,
        "DisName": "磐石市",
        "CityID": 42,
        "DisSort": null,
        "CityNameEnglish": "Panshi",
        "district_code": 220284,
        "chinese_name": "磐石市"
    },
    {
        "Id": 408,
        "DisName": "延吉市",
        "CityID": 43,
        "DisSort": null,
        "CityNameEnglish": "Yanji",
        "district_code": 222401,
        "chinese_name": "延吉市"
    },
    {
        "Id": 409,
        "DisName": "图们市",
        "CityID": 43,
        "DisSort": null,
        "CityNameEnglish": "Tumen",
        "district_code": 222402,
        "chinese_name": "图们市"
    },
    {
        "Id": 410,
        "DisName": "敦化市",
        "CityID": 43,
        "DisSort": null,
        "CityNameEnglish": "Dunhua",
        "district_code": 222403,
        "chinese_name": "敦化市"
    },
    {
        "Id": 411,
        "DisName": "珲春市",
        "CityID": 43,
        "DisSort": null,
        "CityNameEnglish": "Hunchun",
        "district_code": 222404,
        "chinese_name": "珲春市"
    },
    {
        "Id": 412,
        "DisName": "龙井市",
        "CityID": 43,
        "DisSort": null,
        "CityNameEnglish": "Longjing",
        "district_code": 222405,
        "chinese_name": "龙井市"
    },
    {
        "Id": 413,
        "DisName": "和龙市",
        "CityID": 43,
        "DisSort": null,
        "CityNameEnglish": "Helong",
        "district_code": 222406,
        "chinese_name": "和龙市"
    },
    {
        "Id": 414,
        "DisName": "汪清县",
        "CityID": 43,
        "DisSort": null,
        "CityNameEnglish": "Wangqing",
        "district_code": 222424,
        "chinese_name": "汪清县"
    },
    {
        "Id": 415,
        "DisName": "安图县",
        "CityID": 43,
        "DisSort": null,
        "CityNameEnglish": "Antu",
        "district_code": 222426,
        "chinese_name": "安图县"
    },
    {
        "Id": 416,
        "DisName": "铁西区",
        "CityID": 44,
        "DisSort": null,
        "CityNameEnglish": "Tiexi",
        "district_code": 220302,
        "chinese_name": "铁西区"
    },
    {
        "Id": 417,
        "DisName": "铁东区",
        "CityID": 44,
        "DisSort": null,
        "CityNameEnglish": "Tiedong",
        "district_code": 220303,
        "chinese_name": "铁东区"
    },
    {
        "Id": 418,
        "DisName": "梨树县",
        "CityID": 44,
        "DisSort": null,
        "CityNameEnglish": "Lishu",
        "district_code": 220322,
        "chinese_name": "梨树县"
    },
    {
        "Id": 419,
        "DisName": "伊通满族自治县",
        "CityID": 44,
        "DisSort": null,
        "CityNameEnglish": "Yitong",
        "district_code": 220323,
        "chinese_name": "伊通满族自治县"
    },
    {
        "Id": 420,
        "DisName": "公主岭市",
        "CityID": 44,
        "DisSort": null,
        "CityNameEnglish": "Gongzhuling",
        "district_code": 220381,
        "chinese_name": "公主岭市"
    },
    {
        "Id": 421,
        "DisName": "双辽市",
        "CityID": 44,
        "DisSort": null,
        "CityNameEnglish": "Shuangliao",
        "district_code": 220382,
        "chinese_name": "双辽市"
    },
    {
        "Id": 422,
        "DisName": "东昌区",
        "CityID": 45,
        "DisSort": null,
        "CityNameEnglish": "Dongchang",
        "district_code": 220502,
        "chinese_name": "东昌区"
    },
    {
        "Id": 423,
        "DisName": "二道江区",
        "CityID": 45,
        "DisSort": null,
        "CityNameEnglish": "Erdaojiang",
        "district_code": 220503,
        "chinese_name": "二道江区"
    },
    {
        "Id": 424,
        "DisName": "通化县",
        "CityID": 45,
        "DisSort": null,
        "CityNameEnglish": "Tonghua",
        "district_code": 220521,
        "chinese_name": "通化县"
    },
    {
        "Id": 425,
        "DisName": "辉南县",
        "CityID": 45,
        "DisSort": null,
        "CityNameEnglish": "Huinan",
        "district_code": 220523,
        "chinese_name": "辉南县"
    },
    {
        "Id": 426,
        "DisName": "柳河县",
        "CityID": 45,
        "DisSort": null,
        "CityNameEnglish": "Liuhe",
        "district_code": 220524,
        "chinese_name": "柳河县"
    },
    {
        "Id": 427,
        "DisName": "梅河口市",
        "CityID": 45,
        "DisSort": null,
        "CityNameEnglish": "Meihekou",
        "district_code": 220581,
        "chinese_name": "梅河口市"
    },
    {
        "Id": 428,
        "DisName": "集安市",
        "CityID": 45,
        "DisSort": null,
        "CityNameEnglish": "Ji'an",
        "district_code": 220582,
        "chinese_name": "集安市"
    },
    {
        "Id": 429,
        "DisName": "洮北区",
        "CityID": 46,
        "DisSort": null,
        "CityNameEnglish": "Taobei",
        "district_code": 220802,
        "chinese_name": "洮北区"
    },
    {
        "Id": 430,
        "DisName": "镇赉县",
        "CityID": 46,
        "DisSort": null,
        "CityNameEnglish": "Zhenlai",
        "district_code": 220821,
        "chinese_name": "镇赉县"
    },
    {
        "Id": 431,
        "DisName": "通榆县",
        "CityID": 46,
        "DisSort": null,
        "CityNameEnglish": "Tongyu",
        "district_code": 220822,
        "chinese_name": "通榆县"
    },
    {
        "Id": 432,
        "DisName": "洮南市",
        "CityID": 46,
        "DisSort": null,
        "CityNameEnglish": "Taonan",
        "district_code": 220881,
        "chinese_name": "洮南市"
    },
    {
        "Id": 433,
        "DisName": "大安市",
        "CityID": 46,
        "DisSort": null,
        "CityNameEnglish": "Da'an",
        "district_code": 220882,
        "chinese_name": "大安市"
    },
    {
        "Id": 434,
        "DisName": "龙山区",
        "CityID": 47,
        "DisSort": null,
        "CityNameEnglish": "Longshan",
        "district_code": 220402,
        "chinese_name": "龙山区"
    },
    {
        "Id": 435,
        "DisName": "西安区",
        "CityID": 47,
        "DisSort": null,
        "CityNameEnglish": "Xi'an",
        "district_code": 220403,
        "chinese_name": "西安区"
    },
    {
        "Id": 436,
        "DisName": "东丰县",
        "CityID": 47,
        "DisSort": null,
        "CityNameEnglish": "Dongfeng",
        "district_code": 220421,
        "chinese_name": "东丰县"
    },
    {
        "Id": 437,
        "DisName": "东辽县",
        "CityID": 47,
        "DisSort": null,
        "CityNameEnglish": "Dongliao",
        "district_code": 220422,
        "chinese_name": "东辽县"
    },
    {
        "Id": 438,
        "DisName": "宁江区",
        "CityID": 48,
        "DisSort": null,
        "CityNameEnglish": "Ningjiang",
        "district_code": 220702,
        "chinese_name": "宁江区"
    },
    {
        "Id": 439,
        "DisName": "前郭尔罗斯蒙古族自治县",
        "CityID": 48,
        "DisSort": null,
        "CityNameEnglish": "Qian Gorlo",
        "district_code": 220721,
        "chinese_name": "前郭尔罗斯蒙古族自治县"
    },
    {
        "Id": 440,
        "DisName": "长岭县",
        "CityID": 48,
        "DisSort": null,
        "CityNameEnglish": "Changling",
        "district_code": 220722,
        "chinese_name": "长岭县"
    },
    {
        "Id": 441,
        "DisName": "乾安县",
        "CityID": 48,
        "DisSort": null,
        "CityNameEnglish": "Qian'an",
        "district_code": 220723,
        "chinese_name": "乾安县"
    },
    {
        "Id": 442,
        "DisName": "扶余县",
        "CityID": 48,
        "DisSort": null,
        "CityNameEnglish": "Fuyu",
        "district_code": 220724,
        "chinese_name": "扶余县"
    },
    {
        "Id": 443,
        "DisName": "八道江区",
        "CityID": 49,
        "DisSort": null,
        "CityNameEnglish": "Badaojiang",
        "district_code": 220602,
        "chinese_name": "八道江区"
    },
    {
        "Id": 444,
        "DisName": "江源区",
        "CityID": 49,
        "DisSort": null,
        "CityNameEnglish": "Jiangyuan",
        "district_code": 220621,
        "chinese_name": "江源区"
    },
    {
        "Id": 445,
        "DisName": "抚松县",
        "CityID": 49,
        "DisSort": null,
        "CityNameEnglish": "Fusong",
        "district_code": 220622,
        "chinese_name": "抚松县"
    },
    {
        "Id": 446,
        "DisName": "靖宇县",
        "CityID": 49,
        "DisSort": null,
        "CityNameEnglish": "Jingyu",
        "district_code": 220623,
        "chinese_name": "靖宇县"
    },
    {
        "Id": 447,
        "DisName": "长白朝鲜族自治县",
        "CityID": 49,
        "DisSort": null,
        "CityNameEnglish": "Changbai",
        "district_code": 220625,
        "chinese_name": "长白朝鲜族自治县"
    },
    {
        "Id": 448,
        "DisName": "临江市",
        "CityID": 49,
        "DisSort": null,
        "CityNameEnglish": "Linjiang",
        "district_code": 220681,
        "chinese_name": "临江市"
    },
    {
        "Id": 467,
        "DisName": "龙沙区",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Longsha",
        "district_code": 230202,
        "chinese_name": "龙沙区"
    },
    {
        "Id": 468,
        "DisName": "建华区",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Jianhua",
        "district_code": 230203,
        "chinese_name": "建华区"
    },
    {
        "Id": 469,
        "DisName": "铁锋区",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Tiefeng",
        "district_code": 230204,
        "chinese_name": "铁锋区"
    },
    {
        "Id": 470,
        "DisName": "昂昂溪区",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Angangxi",
        "district_code": 230205,
        "chinese_name": "昂昂溪区"
    },
    {
        "Id": 471,
        "DisName": "富拉尔基区",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Fulaerji",
        "district_code": 230206,
        "chinese_name": "富拉尔基区"
    },
    {
        "Id": 472,
        "DisName": "碾子山区",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Nianzishan",
        "district_code": 230207,
        "chinese_name": "碾子山区"
    },
    {
        "Id": 473,
        "DisName": "梅里斯达翰尔族区",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Meilisidahaner",
        "district_code": 230208,
        "chinese_name": "梅里斯达斡尔族区"
    },
    {
        "Id": 474,
        "DisName": "龙江县",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Longjiang",
        "district_code": 230221,
        "chinese_name": "龙江县"
    },
    {
        "Id": 475,
        "DisName": "依安县",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Yi'an",
        "district_code": 230223,
        "chinese_name": "依安县"
    },
    {
        "Id": 476,
        "DisName": "泰来县",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Tailai",
        "district_code": 230224,
        "chinese_name": "泰来县"
    },
    {
        "Id": 477,
        "DisName": "甘南县",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Gannan",
        "district_code": 230225,
        "chinese_name": "甘南县"
    },
    {
        "Id": 478,
        "DisName": "富裕县",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Fuyu",
        "district_code": 230227,
        "chinese_name": "富裕县"
    },
    {
        "Id": 479,
        "DisName": "克山县",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Keshan",
        "district_code": 230229,
        "chinese_name": "克山县"
    },
    {
        "Id": 480,
        "DisName": "克东县",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Kedong",
        "district_code": 230230,
        "chinese_name": "克东县"
    },
    {
        "Id": 481,
        "DisName": "拜泉县",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Baiquan",
        "district_code": 230231,
        "chinese_name": "拜泉县"
    },
    {
        "Id": 482,
        "DisName": "讷河市",
        "CityID": 51,
        "DisSort": null,
        "CityNameEnglish": "Nehe",
        "district_code": 230281,
        "chinese_name": "讷河市"
    },
    {
        "Id": 483,
        "DisName": "鸡冠区",
        "CityID": 52,
        "DisSort": null,
        "CityNameEnglish": "Jiguan",
        "district_code": 230302,
        "chinese_name": "鸡冠区"
    },
    {
        "Id": 484,
        "DisName": "恒山区",
        "CityID": 52,
        "DisSort": null,
        "CityNameEnglish": "Hengshan",
        "district_code": 230303,
        "chinese_name": "恒山区"
    },
    {
        "Id": 485,
        "DisName": "滴道区",
        "CityID": 52,
        "DisSort": null,
        "CityNameEnglish": "Didao",
        "district_code": 230304,
        "chinese_name": "滴道区"
    },
    {
        "Id": 486,
        "DisName": "梨树区",
        "CityID": 52,
        "DisSort": null,
        "CityNameEnglish": "Lishu",
        "district_code": 230305,
        "chinese_name": "梨树区"
    },
    {
        "Id": 487,
        "DisName": "城子河区",
        "CityID": 52,
        "DisSort": null,
        "CityNameEnglish": "Chengzihe",
        "district_code": 230306,
        "chinese_name": "城子河区"
    },
    {
        "Id": 488,
        "DisName": "麻山区",
        "CityID": 52,
        "DisSort": null,
        "CityNameEnglish": "Mashan",
        "district_code": 230307,
        "chinese_name": "麻山区"
    },
    {
        "Id": 489,
        "DisName": "鸡东县",
        "CityID": 52,
        "DisSort": null,
        "CityNameEnglish": "Jidong",
        "district_code": 230321,
        "chinese_name": "鸡东县"
    },
    {
        "Id": 490,
        "DisName": "虎林市",
        "CityID": 52,
        "DisSort": null,
        "CityNameEnglish": "Hulin",
        "district_code": 230381,
        "chinese_name": "虎林市"
    },
    {
        "Id": 491,
        "DisName": "密山市",
        "CityID": 52,
        "DisSort": null,
        "CityNameEnglish": "Mishan",
        "district_code": 230382,
        "chinese_name": "密山市"
    },
    {
        "Id": 492,
        "DisName": "东安区",
        "CityID": 53,
        "DisSort": null,
        "CityNameEnglish": "Dong'an",
        "district_code": 231002,
        "chinese_name": "东安区"
    },
    {
        "Id": 493,
        "DisName": "阳明区",
        "CityID": 53,
        "DisSort": null,
        "CityNameEnglish": "Yangming",
        "district_code": 231003,
        "chinese_name": "阳明区"
    },
    {
        "Id": 494,
        "DisName": "爱民区",
        "CityID": 53,
        "DisSort": null,
        "CityNameEnglish": "Aimin",
        "district_code": 231004,
        "chinese_name": "爱民区"
    },
    {
        "Id": 495,
        "DisName": "西安区",
        "CityID": 53,
        "DisSort": null,
        "CityNameEnglish": "Xi'an",
        "district_code": 231005,
        "chinese_name": "西安区"
    },
    {
        "Id": 496,
        "DisName": "东宁县",
        "CityID": 53,
        "DisSort": null,
        "CityNameEnglish": "Dongning",
        "district_code": 231024,
        "chinese_name": "东宁县"
    },
    {
        "Id": 497,
        "DisName": "林口县",
        "CityID": 53,
        "DisSort": null,
        "CityNameEnglish": "Linkou",
        "district_code": 231025,
        "chinese_name": "林口县"
    },
    {
        "Id": 498,
        "DisName": "绥芬河市",
        "CityID": 53,
        "DisSort": null,
        "CityNameEnglish": "Suifenhe",
        "district_code": 231081,
        "chinese_name": "绥芬河市"
    },
    {
        "Id": 499,
        "DisName": "海林市",
        "CityID": 53,
        "DisSort": null,
        "CityNameEnglish": "Hailin",
        "district_code": 231083,
        "chinese_name": "海林市"
    },
    {
        "Id": 500,
        "DisName": "宁安市",
        "CityID": 53,
        "DisSort": null,
        "CityNameEnglish": "Ning'an",
        "district_code": 231084,
        "chinese_name": "宁安市"
    },
    {
        "Id": 501,
        "DisName": "穆棱市",
        "CityID": 53,
        "DisSort": null,
        "CityNameEnglish": "Muling",
        "district_code": 231085,
        "chinese_name": "穆棱市"
    },
    {
        "Id": 506,
        "DisName": "向阳区",
        "CityID": 55,
        "DisSort": null,
        "CityNameEnglish": "Xiangyang",
        "district_code": 230803,
        "chinese_name": "向阳区"
    },
    {
        "Id": 507,
        "DisName": "前进区",
        "CityID": 55,
        "DisSort": null,
        "CityNameEnglish": "Qianjin",
        "district_code": 230804,
        "chinese_name": "前进区"
    },
    {
        "Id": 508,
        "DisName": "东风区",
        "CityID": 55,
        "DisSort": null,
        "CityNameEnglish": "Dongfeng",
        "district_code": 230805,
        "chinese_name": "东风区"
    },
    {
        "Id": 509,
        "DisName": "桦南县",
        "CityID": 55,
        "DisSort": null,
        "CityNameEnglish": "Huanan",
        "district_code": 230822,
        "chinese_name": "桦南县"
    },
    {
        "Id": 510,
        "DisName": "桦川县",
        "CityID": 55,
        "DisSort": null,
        "CityNameEnglish": "Huachuan",
        "district_code": 230826,
        "chinese_name": "桦川县"
    },
    {
        "Id": 511,
        "DisName": "汤原县",
        "CityID": 55,
        "DisSort": null,
        "CityNameEnglish": "Tangyuan",
        "district_code": 230828,
        "chinese_name": "汤原县"
    },
    {
        "Id": 512,
        "DisName": "抚远县",
        "CityID": 55,
        "DisSort": null,
        "CityNameEnglish": "Fuyuan",
        "district_code": 230833,
        "chinese_name": "抚远县"
    },
    {
        "Id": 513,
        "DisName": "同江市",
        "CityID": 55,
        "DisSort": null,
        "CityNameEnglish": "Tongjiang",
        "district_code": 230881,
        "chinese_name": "同江市"
    },
    {
        "Id": 514,
        "DisName": "富锦市",
        "CityID": 55,
        "DisSort": null,
        "CityNameEnglish": "Fujin",
        "district_code": 230882,
        "chinese_name": "富锦市"
    },
    {
        "Id": 531,
        "DisName": "北林区",
        "CityID": 58,
        "DisSort": null,
        "CityNameEnglish": "Beilin",
        "district_code": 231202,
        "chinese_name": "北林区"
    },
    {
        "Id": 532,
        "DisName": "望奎县",
        "CityID": 58,
        "DisSort": null,
        "CityNameEnglish": "Wangkui",
        "district_code": 231221,
        "chinese_name": "望奎县"
    },
    {
        "Id": 533,
        "DisName": "兰西县",
        "CityID": 58,
        "DisSort": null,
        "CityNameEnglish": "Lanxi",
        "district_code": 231222,
        "chinese_name": "兰西县"
    },
    {
        "Id": 534,
        "DisName": "青冈县",
        "CityID": 58,
        "DisSort": null,
        "CityNameEnglish": "Qinggang",
        "district_code": 231223,
        "chinese_name": "青冈县"
    },
    {
        "Id": 535,
        "DisName": "庆安县",
        "CityID": 58,
        "DisSort": null,
        "CityNameEnglish": "Qing'an",
        "district_code": 231224,
        "chinese_name": "庆安县"
    },
    {
        "Id": 536,
        "DisName": "明水县",
        "CityID": 58,
        "DisSort": null,
        "CityNameEnglish": "Mingshui",
        "district_code": 231225,
        "chinese_name": "明水县"
    },
    {
        "Id": 537,
        "DisName": "绥棱县",
        "CityID": 58,
        "DisSort": null,
        "CityNameEnglish": "Suileng",
        "district_code": 231226,
        "chinese_name": "绥棱县"
    },
    {
        "Id": 538,
        "DisName": "安达市",
        "CityID": 58,
        "DisSort": null,
        "CityNameEnglish": "Anda",
        "district_code": 231281,
        "chinese_name": "安达市"
    },
    {
        "Id": 539,
        "DisName": "肇东市",
        "CityID": 58,
        "DisSort": null,
        "CityNameEnglish": "Zhaodong",
        "district_code": 231282,
        "chinese_name": "肇东市"
    },
    {
        "Id": 540,
        "DisName": "海伦市",
        "CityID": 58,
        "DisSort": null,
        "CityNameEnglish": "Helen",
        "district_code": 231283,
        "chinese_name": "海伦市"
    },
    {
        "Id": 567,
        "DisName": "萨尔图区",
        "CityID": 62,
        "DisSort": null,
        "CityNameEnglish": "Saertu",
        "district_code": 230602,
        "chinese_name": "萨尔图区"
    },
    {
        "Id": 568,
        "DisName": "龙凤区",
        "CityID": 62,
        "DisSort": null,
        "CityNameEnglish": "Longfeng",
        "district_code": 230603,
        "chinese_name": "龙凤区"
    },
    {
        "Id": 569,
        "DisName": "让胡路区",
        "CityID": 62,
        "DisSort": null,
        "CityNameEnglish": "Ranghulu",
        "district_code": 230604,
        "chinese_name": "让胡路区"
    },
    {
        "Id": 570,
        "DisName": "红岗区",
        "CityID": 62,
        "DisSort": null,
        "CityNameEnglish": "Honggang",
        "district_code": 230605,
        "chinese_name": "红岗区"
    },
    {
        "Id": 571,
        "DisName": "大同区",
        "CityID": 62,
        "DisSort": null,
        "CityNameEnglish": "Datong",
        "district_code": 230606,
        "chinese_name": "大同区"
    },
    {
        "Id": 572,
        "DisName": "肇州县",
        "CityID": 62,
        "DisSort": null,
        "CityNameEnglish": "Zhaozhou",
        "district_code": 230621,
        "chinese_name": "肇州县"
    },
    {
        "Id": 573,
        "DisName": "肇源县",
        "CityID": 62,
        "DisSort": null,
        "CityNameEnglish": "Zhaoyuan",
        "district_code": 230622,
        "chinese_name": "肇源县"
    },
    {
        "Id": 574,
        "DisName": "林甸县",
        "CityID": 62,
        "DisSort": null,
        "CityNameEnglish": "Lindian",
        "district_code": 230623,
        "chinese_name": "林甸县"
    },
    {
        "Id": 575,
        "DisName": "杜尔伯特蒙古族自治县",
        "CityID": 62,
        "DisSort": null,
        "CityNameEnglish": "Dorbod",
        "district_code": 230624,
        "chinese_name": "杜尔伯特蒙古族自治县"
    },
    {
        "Id": 793,
        "DisName": "大通区",
        "CityID": 90,
        "DisSort": null,
        "CityNameEnglish": "Datong",
        "district_code": 340402,
        "chinese_name": "大通区"
    },
    {
        "Id": 794,
        "DisName": "田家庵区",
        "CityID": 90,
        "DisSort": null,
        "CityNameEnglish": "Tianjia'an",
        "district_code": 340403,
        "chinese_name": "田家庵区"
    },
    {
        "Id": 795,
        "DisName": "谢家集区",
        "CityID": 90,
        "DisSort": null,
        "CityNameEnglish": "Xiejiaji",
        "district_code": 340404,
        "chinese_name": "谢家集区"
    },
    {
        "Id": 796,
        "DisName": "八公山区",
        "CityID": 90,
        "DisSort": null,
        "CityNameEnglish": "Bagongshan",
        "district_code": 340405,
        "chinese_name": "八公山区"
    },
    {
        "Id": 797,
        "DisName": "潘集区",
        "CityID": 90,
        "DisSort": null,
        "CityNameEnglish": "Panji",
        "district_code": 340406,
        "chinese_name": "潘集区"
    },
    {
        "Id": 798,
        "DisName": "凤台县",
        "CityID": 90,
        "DisSort": null,
        "CityNameEnglish": "Fengtai",
        "district_code": 340421,
        "chinese_name": "凤台县"
    },
    {
        "Id": 799,
        "DisName": "金家庄区",
        "CityID": 91,
        "DisSort": null,
        "CityNameEnglish": "Jinjiazhuang",
        "district_code": 340502,
        "chinese_name": "金家庄区"
    },
    {
        "Id": 800,
        "DisName": "花山区",
        "CityID": 91,
        "DisSort": null,
        "CityNameEnglish": "Huashan",
        "district_code": 340503,
        "chinese_name": "花山区"
    },
    {
        "Id": 801,
        "DisName": "雨山区",
        "CityID": 91,
        "DisSort": null,
        "CityNameEnglish": "Yushan",
        "district_code": 340504,
        "chinese_name": "雨山区"
    },
    {
        "Id": 802,
        "DisName": "当涂县",
        "CityID": 91,
        "DisSort": null,
        "CityNameEnglish": "Dangtu",
        "district_code": 340521,
        "chinese_name": "当涂县"
    },
    {
        "Id": 803,
        "DisName": "杜集区",
        "CityID": 92,
        "DisSort": null,
        "CityNameEnglish": "Duji",
        "district_code": 340602,
        "chinese_name": "杜集区"
    },
    {
        "Id": 804,
        "DisName": "相山区",
        "CityID": 92,
        "DisSort": null,
        "CityNameEnglish": "Xiangshan",
        "district_code": 340603,
        "chinese_name": "相山区"
    },
    {
        "Id": 805,
        "DisName": "烈山区",
        "CityID": 92,
        "DisSort": null,
        "CityNameEnglish": "Lieshan",
        "district_code": 340604,
        "chinese_name": "烈山区"
    },
    {
        "Id": 806,
        "DisName": "濉溪县",
        "CityID": 92,
        "DisSort": null,
        "CityNameEnglish": "Suixi",
        "district_code": 340621,
        "chinese_name": "濉溪县"
    },
    {
        "Id": 807,
        "DisName": "铜官山区",
        "CityID": 93,
        "DisSort": null,
        "CityNameEnglish": "Tongguanshan",
        "district_code": 340702,
        "chinese_name": "铜官山区"
    },
    {
        "Id": 808,
        "DisName": "狮子山区",
        "CityID": 93,
        "DisSort": null,
        "CityNameEnglish": "Shizishan",
        "district_code": 340711,
        "chinese_name": "狮子山区"
    },
    {
        "Id": 809,
        "DisName": "铜陵县",
        "CityID": 93,
        "DisSort": null,
        "CityNameEnglish": "Tongling",
        "district_code": 340721,
        "chinese_name": "铜陵县"
    },
    {
        "Id": 849,
        "DisName": "居巢区",
        "CityID": 99,
        "DisSort": null,
        "CityNameEnglish": "Juchao",
        "district_code": 341402,
        "chinese_name": "居巢区"
    },
    {
        "Id": 850,
        "DisName": "庐江县",
        "CityID": 99,
        "DisSort": null,
        "CityNameEnglish": "Lujiang",
        "district_code": 341421,
        "chinese_name": "庐江县"
    },
    {
        "Id": 851,
        "DisName": "无为县",
        "CityID": 99,
        "DisSort": null,
        "CityNameEnglish": "Wuwei",
        "district_code": 341422,
        "chinese_name": "无为县"
    },
    {
        "Id": 852,
        "DisName": "含山县",
        "CityID": 99,
        "DisSort": null,
        "CityNameEnglish": "Hanshan",
        "district_code": 341423,
        "chinese_name": "含山县"
    },
    {
        "Id": 853,
        "DisName": "和县",
        "CityID": 99,
        "DisSort": null,
        "CityNameEnglish": "Hexian",
        "district_code": 341424,
        "chinese_name": "和县"
    },
    {
        "Id": 861,
        "DisName": "谯城区",
        "CityID": 101,
        "DisSort": null,
        "CityNameEnglish": "Qiaocheng",
        "district_code": 341602,
        "chinese_name": "谯城区"
    },
    {
        "Id": 862,
        "DisName": "涡阳县",
        "CityID": 101,
        "DisSort": null,
        "CityNameEnglish": "Guoyang",
        "district_code": 341621,
        "chinese_name": "涡阳县"
    },
    {
        "Id": 863,
        "DisName": "蒙城县",
        "CityID": 101,
        "DisSort": null,
        "CityNameEnglish": "Mengcheng",
        "district_code": 341622,
        "chinese_name": "蒙城县"
    },
    {
        "Id": 864,
        "DisName": "利辛县",
        "CityID": 101,
        "DisSort": null,
        "CityNameEnglish": "Lixin",
        "district_code": 341623,
        "chinese_name": "利辛县"
    },
    {
        "Id": 865,
        "DisName": "贵池区",
        "CityID": 102,
        "DisSort": null,
        "CityNameEnglish": "Guichi",
        "district_code": 341702,
        "chinese_name": "贵池区"
    },
    {
        "Id": 866,
        "DisName": "东至县",
        "CityID": 102,
        "DisSort": null,
        "CityNameEnglish": "Dongzhi",
        "district_code": 341721,
        "chinese_name": "东至县"
    },
    {
        "Id": 867,
        "DisName": "石台县",
        "CityID": 102,
        "DisSort": null,
        "CityNameEnglish": "Shitai",
        "district_code": 341722,
        "chinese_name": "石台县"
    },
    {
        "Id": 868,
        "DisName": "青阳县",
        "CityID": 102,
        "DisSort": null,
        "CityNameEnglish": "Qingyang",
        "district_code": 341723,
        "chinese_name": "青阳县"
    },
    {
        "Id": 869,
        "DisName": "宣州区",
        "CityID": 103,
        "DisSort": null,
        "CityNameEnglish": "Xuanzhou",
        "district_code": 341802,
        "chinese_name": "宣州区"
    },
    {
        "Id": 870,
        "DisName": "郎溪县",
        "CityID": 103,
        "DisSort": null,
        "CityNameEnglish": "Langxi",
        "district_code": 341821,
        "chinese_name": "郎溪县"
    },
    {
        "Id": 871,
        "DisName": "广德县",
        "CityID": 103,
        "DisSort": null,
        "CityNameEnglish": "Guangde",
        "district_code": 341822,
        "chinese_name": "广德县"
    },
    {
        "Id": 872,
        "DisName": "泾县",
        "CityID": 103,
        "DisSort": null,
        "CityNameEnglish": "Jingxian",
        "district_code": 341823,
        "chinese_name": "泾县"
    },
    {
        "Id": 873,
        "DisName": "绩溪县",
        "CityID": 103,
        "DisSort": null,
        "CityNameEnglish": "Jixi",
        "district_code": 341824,
        "chinese_name": "绩溪县"
    },
    {
        "Id": 874,
        "DisName": "旌德县",
        "CityID": 103,
        "DisSort": null,
        "CityNameEnglish": "Jingde",
        "district_code": 341825,
        "chinese_name": "旌德县"
    },
    {
        "Id": 875,
        "DisName": "宁国市",
        "CityID": 103,
        "DisSort": null,
        "CityNameEnglish": "Ningguo",
        "district_code": 341881,
        "chinese_name": "宁国市"
    },
    {
        "Id": 960,
        "DisName": "月湖区",
        "CityID": 113,
        "DisSort": null,
        "CityNameEnglish": "Yuehu",
        "district_code": 360602,
        "chinese_name": "月湖区"
    },
    {
        "Id": 961,
        "DisName": "余江县",
        "CityID": 113,
        "DisSort": null,
        "CityNameEnglish": "Yujiang",
        "district_code": 360622,
        "chinese_name": "余江县"
    },
    {
        "Id": 962,
        "DisName": "贵溪市",
        "CityID": 113,
        "DisSort": null,
        "CityNameEnglish": "Guixi",
        "district_code": 360681,
        "chinese_name": "贵溪市"
    },
    {
        "Id": 963,
        "DisName": "渝水区",
        "CityID": 114,
        "DisSort": null,
        "CityNameEnglish": "Yushui",
        "district_code": 360502,
        "chinese_name": "渝水区"
    },
    {
        "Id": 964,
        "DisName": "分宜县",
        "CityID": 114,
        "DisSort": null,
        "CityNameEnglish": "Fenyi",
        "district_code": 360521,
        "chinese_name": "分宜县"
    },
    {
        "Id": 974,
        "DisName": "庐山区",
        "CityID": 116,
        "DisSort": null,
        "CityNameEnglish": "Lushan",
        "district_code": 360402,
        "chinese_name": "庐山区"
    },
    {
        "Id": 975,
        "DisName": "浔阳区",
        "CityID": 116,
        "DisSort": null,
        "CityNameEnglish": "Xunyang",
        "district_code": 360403,
        "chinese_name": "浔阳区"
    },
    {
        "Id": 976,
        "DisName": "九江县",
        "CityID": 116,
        "DisSort": null,
        "CityNameEnglish": "Jiujiang",
        "district_code": 360421,
        "chinese_name": "九江县"
    },
    {
        "Id": 977,
        "DisName": "武宁县",
        "CityID": 116,
        "DisSort": null,
        "CityNameEnglish": "Wuning",
        "district_code": 360423,
        "chinese_name": "武宁县"
    },
    {
        "Id": 978,
        "DisName": "修水县",
        "CityID": 116,
        "DisSort": null,
        "CityNameEnglish": "Xiushui",
        "district_code": 360424,
        "chinese_name": "修水县"
    },
    {
        "Id": 979,
        "DisName": "永修县",
        "CityID": 116,
        "DisSort": null,
        "CityNameEnglish": "Yongxiu",
        "district_code": 360425,
        "chinese_name": "永修县"
    },
    {
        "Id": 980,
        "DisName": "德安县",
        "CityID": 116,
        "DisSort": null,
        "CityNameEnglish": "De'an",
        "district_code": 360426,
        "chinese_name": "德安县"
    },
    {
        "Id": 981,
        "DisName": "星子县",
        "CityID": 116,
        "DisSort": null,
        "CityNameEnglish": "Xingzi",
        "district_code": 360427,
        "chinese_name": "星子县"
    },
    {
        "Id": 982,
        "DisName": "都昌县",
        "CityID": 116,
        "DisSort": null,
        "CityNameEnglish": "Duchang",
        "district_code": 360428,
        "chinese_name": "都昌县"
    },
    {
        "Id": 983,
        "DisName": "湖口县",
        "CityID": 116,
        "DisSort": null,
        "CityNameEnglish": "Hukou",
        "district_code": 360429,
        "chinese_name": "湖口县"
    },
    {
        "Id": 984,
        "DisName": "彭泽县",
        "CityID": 116,
        "DisSort": null,
        "CityNameEnglish": "Pengze",
        "district_code": 360430,
        "chinese_name": "彭泽县"
    },
    {
        "Id": 985,
        "DisName": "瑞昌市",
        "CityID": 116,
        "DisSort": null,
        "CityNameEnglish": "Ruichang",
        "district_code": 360481,
        "chinese_name": "瑞昌市"
    },
    {
        "Id": 986,
        "DisName": "信州区",
        "CityID": 117,
        "DisSort": null,
        "CityNameEnglish": "Xinzhou",
        "district_code": 361102,
        "chinese_name": "信州区"
    },
    {
        "Id": 987,
        "DisName": "上饶县",
        "CityID": 117,
        "DisSort": null,
        "CityNameEnglish": "Shangrao",
        "district_code": 361121,
        "chinese_name": "上饶县"
    },
    {
        "Id": 988,
        "DisName": "广丰县",
        "CityID": 117,
        "DisSort": null,
        "CityNameEnglish": "Guangfeng",
        "district_code": 361122,
        "chinese_name": "广丰县"
    },
    {
        "Id": 989,
        "DisName": "玉山县",
        "CityID": 117,
        "DisSort": null,
        "CityNameEnglish": "Yushan",
        "district_code": 361123,
        "chinese_name": "玉山县"
    },
    {
        "Id": 990,
        "DisName": "铅山县",
        "CityID": 117,
        "DisSort": null,
        "CityNameEnglish": "Qianshan",
        "district_code": 361124,
        "chinese_name": "铅山县"
    },
    {
        "Id": 991,
        "DisName": "横峰县",
        "CityID": 117,
        "DisSort": null,
        "CityNameEnglish": "Hengfeng",
        "district_code": 361125,
        "chinese_name": "横峰县"
    },
    {
        "Id": 992,
        "DisName": "弋阳县",
        "CityID": 117,
        "DisSort": null,
        "CityNameEnglish": "Yiyang",
        "district_code": 361126,
        "chinese_name": "弋阳县"
    },
    {
        "Id": 993,
        "DisName": "余干县",
        "CityID": 117,
        "DisSort": null,
        "CityNameEnglish": "Yugan",
        "district_code": 361127,
        "chinese_name": "余干县"
    },
    {
        "Id": 994,
        "DisName": "鄱阳县",
        "CityID": 117,
        "DisSort": null,
        "CityNameEnglish": "Poyang",
        "district_code": 361128,
        "chinese_name": "鄱阳县"
    },
    {
        "Id": 995,
        "DisName": "万年县",
        "CityID": 117,
        "DisSort": null,
        "CityNameEnglish": "Wannian",
        "district_code": 361129,
        "chinese_name": "万年县"
    },
    {
        "Id": 996,
        "DisName": "婺源县",
        "CityID": 117,
        "DisSort": null,
        "CityNameEnglish": "Wuyuan",
        "district_code": 361130,
        "chinese_name": "婺源县"
    },
    {
        "Id": 997,
        "DisName": "德兴市",
        "CityID": 117,
        "DisSort": null,
        "CityNameEnglish": "Dexing",
        "district_code": 361181,
        "chinese_name": "德兴市"
    },
    {
        "Id": 998,
        "DisName": "临川区",
        "CityID": 118,
        "DisSort": null,
        "CityNameEnglish": "Linchuan",
        "district_code": 361002,
        "chinese_name": "临川区"
    },
    {
        "Id": 999,
        "DisName": "南城县",
        "CityID": 118,
        "DisSort": null,
        "CityNameEnglish": "Nancheng",
        "district_code": 361021,
        "chinese_name": "南城县"
    },
    {
        "Id": 1000,
        "DisName": "黎川县",
        "CityID": 118,
        "DisSort": null,
        "CityNameEnglish": "Lichuan",
        "district_code": 361022,
        "chinese_name": "黎川县"
    },
    {
        "Id": 1001,
        "DisName": "南丰县",
        "CityID": 118,
        "DisSort": null,
        "CityNameEnglish": "Nanfeng",
        "district_code": 361023,
        "chinese_name": "南丰县"
    },
    {
        "Id": 1002,
        "DisName": "崇仁县",
        "CityID": 118,
        "DisSort": null,
        "CityNameEnglish": "Chongren",
        "district_code": 361024,
        "chinese_name": "崇仁县"
    },
    {
        "Id": 1003,
        "DisName": "乐安县",
        "CityID": 118,
        "DisSort": null,
        "CityNameEnglish": "Lean",
        "district_code": 361025,
        "chinese_name": "乐安县"
    },
    {
        "Id": 1004,
        "DisName": "宜黄县",
        "CityID": 118,
        "DisSort": null,
        "CityNameEnglish": "Yihuang",
        "district_code": 361026,
        "chinese_name": "宜黄县"
    },
    {
        "Id": 1005,
        "DisName": "金溪县",
        "CityID": 118,
        "DisSort": null,
        "CityNameEnglish": "Jinxi",
        "district_code": 361027,
        "chinese_name": "金溪县"
    },
    {
        "Id": 1006,
        "DisName": "资溪县",
        "CityID": 118,
        "DisSort": null,
        "CityNameEnglish": "Zixi",
        "district_code": 361028,
        "chinese_name": "资溪县"
    },
    {
        "Id": 1007,
        "DisName": "东乡县",
        "CityID": 118,
        "DisSort": null,
        "CityNameEnglish": "Dongxiang",
        "district_code": 361029,
        "chinese_name": "东乡县"
    },
    {
        "Id": 1008,
        "DisName": "广昌县",
        "CityID": 118,
        "DisSort": null,
        "CityNameEnglish": "Guangchang",
        "district_code": 361030,
        "chinese_name": "广昌县"
    },
    {
        "Id": 1009,
        "DisName": "袁州区",
        "CityID": 119,
        "DisSort": null,
        "CityNameEnglish": "Yuanzhou",
        "district_code": 360902,
        "chinese_name": "袁州区"
    },
    {
        "Id": 1010,
        "DisName": "奉新县",
        "CityID": 119,
        "DisSort": null,
        "CityNameEnglish": "Fengxin",
        "district_code": 360921,
        "chinese_name": "奉新县"
    },
    {
        "Id": 1011,
        "DisName": "万载县",
        "CityID": 119,
        "DisSort": null,
        "CityNameEnglish": "Wanzai",
        "district_code": 360922,
        "chinese_name": "万载县"
    },
    {
        "Id": 1012,
        "DisName": "上高县",
        "CityID": 119,
        "DisSort": null,
        "CityNameEnglish": "Shanggao",
        "district_code": 360923,
        "chinese_name": "上高县"
    },
    {
        "Id": 1013,
        "DisName": "宜丰县",
        "CityID": 119,
        "DisSort": null,
        "CityNameEnglish": "Yifeng",
        "district_code": 360924,
        "chinese_name": "宜丰县"
    },
    {
        "Id": 1014,
        "DisName": "靖安县",
        "CityID": 119,
        "DisSort": null,
        "CityNameEnglish": "Jingan",
        "district_code": 360925,
        "chinese_name": "靖安县"
    },
    {
        "Id": 1015,
        "DisName": "铜鼓县",
        "CityID": 119,
        "DisSort": null,
        "CityNameEnglish": "Tonggu",
        "district_code": 360926,
        "chinese_name": "铜鼓县"
    },
    {
        "Id": 1016,
        "DisName": "丰城市",
        "CityID": 119,
        "DisSort": null,
        "CityNameEnglish": "Fengcheng",
        "district_code": 360981,
        "chinese_name": "丰城市"
    },
    {
        "Id": 1017,
        "DisName": "樟树市",
        "CityID": 119,
        "DisSort": null,
        "CityNameEnglish": "Zhangshu",
        "district_code": 360982,
        "chinese_name": "樟树市"
    },
    {
        "Id": 1018,
        "DisName": "高安市",
        "CityID": 119,
        "DisSort": null,
        "CityNameEnglish": "Gao'an",
        "district_code": 360983,
        "chinese_name": "高安市"
    },
    {
        "Id": 1019,
        "DisName": "吉州区",
        "CityID": 120,
        "DisSort": null,
        "CityNameEnglish": "Jizhou",
        "district_code": 360802,
        "chinese_name": "吉州区"
    },
    {
        "Id": 1020,
        "DisName": "青原区",
        "CityID": 120,
        "DisSort": null,
        "CityNameEnglish": "Qingyuan",
        "district_code": 360803,
        "chinese_name": "青原区"
    },
    {
        "Id": 1021,
        "DisName": "吉安县",
        "CityID": 120,
        "DisSort": null,
        "CityNameEnglish": "Ji'an",
        "district_code": 360821,
        "chinese_name": "吉安县"
    },
    {
        "Id": 1022,
        "DisName": "吉水县",
        "CityID": 120,
        "DisSort": null,
        "CityNameEnglish": "Jishui",
        "district_code": 360822,
        "chinese_name": "吉水县"
    },
    {
        "Id": 1023,
        "DisName": "峡江县",
        "CityID": 120,
        "DisSort": null,
        "CityNameEnglish": "Xiajiang",
        "district_code": 360823,
        "chinese_name": "峡江县"
    },
    {
        "Id": 1024,
        "DisName": "新干县",
        "CityID": 120,
        "DisSort": null,
        "CityNameEnglish": "Xingan",
        "district_code": 360824,
        "chinese_name": "新干县"
    },
    {
        "Id": 1025,
        "DisName": "永丰县",
        "CityID": 120,
        "DisSort": null,
        "CityNameEnglish": "Yongfeng",
        "district_code": 360825,
        "chinese_name": "永丰县"
    },
    {
        "Id": 1026,
        "DisName": "泰和县",
        "CityID": 120,
        "DisSort": null,
        "CityNameEnglish": "Taihe",
        "district_code": 360826,
        "chinese_name": "泰和县"
    },
    {
        "Id": 1027,
        "DisName": "遂川县",
        "CityID": 120,
        "DisSort": null,
        "CityNameEnglish": "Suichuan",
        "district_code": 360827,
        "chinese_name": "遂川县"
    },
    {
        "Id": 1028,
        "DisName": "万安县",
        "CityID": 120,
        "DisSort": null,
        "CityNameEnglish": "Wanan",
        "district_code": 360828,
        "chinese_name": "万安县"
    },
    {
        "Id": 1029,
        "DisName": "安福县",
        "CityID": 120,
        "DisSort": null,
        "CityNameEnglish": "Anfu",
        "district_code": 360829,
        "chinese_name": "安福县"
    },
    {
        "Id": 1030,
        "DisName": "永新县",
        "CityID": 120,
        "DisSort": null,
        "CityNameEnglish": "Yongxin",
        "district_code": 360830,
        "chinese_name": "永新县"
    },
    {
        "Id": 1031,
        "DisName": "井冈山市",
        "CityID": 120,
        "DisSort": null,
        "CityNameEnglish": "Jinggangshan",
        "district_code": 360881,
        "chinese_name": "井冈山市"
    },
    {
        "Id": 1032,
        "DisName": "章贡区",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Zhanggong",
        "district_code": 360702,
        "chinese_name": "章贡区"
    },
    {
        "Id": 1033,
        "DisName": "赣县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Ganxian",
        "district_code": 360721,
        "chinese_name": "赣县"
    },
    {
        "Id": 1034,
        "DisName": "信丰县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Xinfeng",
        "district_code": 360722,
        "chinese_name": "信丰县"
    },
    {
        "Id": 1035,
        "DisName": "大余县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Dayu",
        "district_code": 360723,
        "chinese_name": "大余县"
    },
    {
        "Id": 1036,
        "DisName": "上犹县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Shangyou",
        "district_code": 360724,
        "chinese_name": "上犹县"
    },
    {
        "Id": 1037,
        "DisName": "崇义县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Chongyi",
        "district_code": 360725,
        "chinese_name": "崇义县"
    },
    {
        "Id": 1038,
        "DisName": "安远县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Anyuan",
        "district_code": 360726,
        "chinese_name": "安远县"
    },
    {
        "Id": 1039,
        "DisName": "龙南县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Longnan",
        "district_code": 360727,
        "chinese_name": "龙南县"
    },
    {
        "Id": 1040,
        "DisName": "定南县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Dingnan",
        "district_code": 360728,
        "chinese_name": "定南县"
    },
    {
        "Id": 1041,
        "DisName": "全南县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Quanan",
        "district_code": 360729,
        "chinese_name": "全南县"
    },
    {
        "Id": 1042,
        "DisName": "宁都县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Ningdu",
        "district_code": 360730,
        "chinese_name": "宁都县"
    },
    {
        "Id": 1043,
        "DisName": "于都县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Yudu",
        "district_code": 360731,
        "chinese_name": "于都县"
    },
    {
        "Id": 1044,
        "DisName": "兴国县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Xingguo",
        "district_code": 360732,
        "chinese_name": "兴国县"
    },
    {
        "Id": 1045,
        "DisName": "会昌县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Huichang",
        "district_code": 360733,
        "chinese_name": "会昌县"
    },
    {
        "Id": 1046,
        "DisName": "寻乌县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Xunwu",
        "district_code": 360734,
        "chinese_name": "寻乌县"
    },
    {
        "Id": 1047,
        "DisName": "石城县",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Shicheng",
        "district_code": 360735,
        "chinese_name": "石城县"
    },
    {
        "Id": 1048,
        "DisName": "瑞金市",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Ruijin",
        "district_code": 360781,
        "chinese_name": "瑞金市"
    },
    {
        "Id": 1049,
        "DisName": "南康市",
        "CityID": 121,
        "DisSort": null,
        "CityNameEnglish": "Nankang",
        "district_code": 360782,
        "chinese_name": "南康市"
    },
    {
        "Id": 1050,
        "DisName": "昌江区",
        "CityID": 122,
        "DisSort": null,
        "CityNameEnglish": "Changjiang",
        "district_code": 360202,
        "chinese_name": "昌江区"
    },
    {
        "Id": 1051,
        "DisName": "珠山区",
        "CityID": 122,
        "DisSort": null,
        "CityNameEnglish": "Zhushan",
        "district_code": 360203,
        "chinese_name": "珠山区"
    },
    {
        "Id": 1052,
        "DisName": "浮梁县",
        "CityID": 122,
        "DisSort": null,
        "CityNameEnglish": "Fuliang",
        "district_code": 360222,
        "chinese_name": "浮梁县"
    },
    {
        "Id": 1053,
        "DisName": "乐平市",
        "CityID": 122,
        "DisSort": null,
        "CityNameEnglish": "Leping",
        "district_code": 360281,
        "chinese_name": "乐平市"
    },
    {
        "Id": 1054,
        "DisName": "安源区",
        "CityID": 123,
        "DisSort": null,
        "CityNameEnglish": "Anyuan",
        "district_code": 360302,
        "chinese_name": "安源区"
    },
    {
        "Id": 1055,
        "DisName": "湘东区",
        "CityID": 123,
        "DisSort": null,
        "CityNameEnglish": "Xiangdong",
        "district_code": 360313,
        "chinese_name": "湘东区"
    },
    {
        "Id": 1056,
        "DisName": "莲花县",
        "CityID": 123,
        "DisSort": null,
        "CityNameEnglish": "Lianhua",
        "district_code": 360321,
        "chinese_name": "莲花县"
    },
    {
        "Id": 1057,
        "DisName": "上栗县",
        "CityID": 123,
        "DisSort": null,
        "CityNameEnglish": "Shangli",
        "district_code": 360322,
        "chinese_name": "上栗县"
    },
    {
        "Id": 1058,
        "DisName": "芦溪县",
        "CityID": 123,
        "DisSort": null,
        "CityNameEnglish": "Luxi",
        "district_code": 360323,
        "chinese_name": "芦溪县"
    },
    {
        "Id": 1619,
        "DisName": "武江区",
        "CityID": 197,
        "DisSort": null,
        "CityNameEnglish": "Wujiang",
        "district_code": 440203,
        "chinese_name": "武江区"
    },
    {
        "Id": 1620,
        "DisName": "浈江区",
        "CityID": 197,
        "DisSort": null,
        "CityNameEnglish": "Zhenjiang",
        "district_code": 440204,
        "chinese_name": "浈江区"
    },
    {
        "Id": 1621,
        "DisName": "曲江区",
        "CityID": 197,
        "DisSort": null,
        "CityNameEnglish": "Qujiang",
        "district_code": 440205,
        "chinese_name": "曲江区"
    },
    {
        "Id": 1622,
        "DisName": "始兴县",
        "CityID": 197,
        "DisSort": null,
        "CityNameEnglish": "Shixing",
        "district_code": 440222,
        "chinese_name": "始兴县"
    },
    {
        "Id": 1623,
        "DisName": "仁化县",
        "CityID": 197,
        "DisSort": null,
        "CityNameEnglish": "Renhua",
        "district_code": 440224,
        "chinese_name": "仁化县"
    },
    {
        "Id": 1624,
        "DisName": "翁源县",
        "CityID": 197,
        "DisSort": null,
        "CityNameEnglish": "Wengyuan",
        "district_code": 440229,
        "chinese_name": "翁源县"
    },
    {
        "Id": 1625,
        "DisName": "乳源瑶族自治县",
        "CityID": 197,
        "DisSort": null,
        "CityNameEnglish": "Ruyuan",
        "district_code": 440232,
        "chinese_name": "乳源瑶族自治县"
    },
    {
        "Id": 1626,
        "DisName": "新丰县",
        "CityID": 197,
        "DisSort": null,
        "CityNameEnglish": "Xingfeng",
        "district_code": 440233,
        "chinese_name": "新丰县"
    },
    {
        "Id": 1627,
        "DisName": "乐昌市",
        "CityID": 197,
        "DisSort": null,
        "CityNameEnglish": "Lechang",
        "district_code": 440281,
        "chinese_name": "乐昌市"
    },
    {
        "Id": 1628,
        "DisName": "南雄市",
        "CityID": 197,
        "DisSort": null,
        "CityNameEnglish": "Nanxiong",
        "district_code": 440282,
        "chinese_name": "南雄市"
    },
    {
        "Id": 1974,
        "DisName": "红花岗区",
        "CityID": 247,
        "DisSort": null,
        "CityNameEnglish": "Honghuagang",
        "district_code": 520302,
        "chinese_name": "红花岗区"
    },
    {
        "Id": 1975,
        "DisName": "汇川区",
        "CityID": 247,
        "DisSort": null,
        "CityNameEnglish": "Huichuan",
        "district_code": 520303,
        "chinese_name": "汇川区"
    },
    {
        "Id": 1976,
        "DisName": "遵义县",
        "CityID": 247,
        "DisSort": null,
        "CityNameEnglish": "Zunyi",
        "district_code": 520321,
        "chinese_name": "遵义县"
    },
    {
        "Id": 1977,
        "DisName": "桐梓县",
        "CityID": 247,
        "DisSort": null,
        "CityNameEnglish": "Tongzi",
        "district_code": 520322,
        "chinese_name": "桐梓县"
    },
    {
        "Id": 1978,
        "DisName": "绥阳县",
        "CityID": 247,
        "DisSort": null,
        "CityNameEnglish": "Suiyang",
        "district_code": 520323,
        "chinese_name": "绥阳县"
    },
    {
        "Id": 1979,
        "DisName": "正安县",
        "CityID": 247,
        "DisSort": null,
        "CityNameEnglish": "Zhengan",
        "district_code": 520324,
        "chinese_name": "正安县"
    },
    {
        "Id": 1980,
        "DisName": "道真仡佬族苗族自治县",
        "CityID": 247,
        "DisSort": null,
        "CityNameEnglish": "Daozhen",
        "district_code": 520325,
        "chinese_name": "道真仡佬族苗族自治县"
    },
    {
        "Id": 1981,
        "DisName": "务川仡佬族苗族自治县",
        "CityID": 247,
        "DisSort": null,
        "CityNameEnglish": "Wuchuan",
        "district_code": 520326,
        "chinese_name": "务川仡佬族苗族自治县"
    },
    {
        "Id": 1982,
        "DisName": "凤冈县",
        "CityID": 247,
        "DisSort": null,
        "CityNameEnglish": "Fenggang",
        "district_code": 520327,
        "chinese_name": "凤冈县"
    },
    {
        "Id": 1983,
        "DisName": "湄潭县",
        "CityID": 247,
        "DisSort": null,
        "CityNameEnglish": "Meitan",
        "district_code": 520328,
        "chinese_name": "湄潭县"
    },
    {
        "Id": 1984,
        "DisName": "余庆县",
        "CityID": 247,
        "DisSort": null,
        "CityNameEnglish": "Yuqing",
        "district_code": 520329,
        "chinese_name": "余庆县"
    },
    {
        "Id": 1985,
        "DisName": "习水县",
        "CityID": 247,
        "DisSort": null,
        "CityNameEnglish": "Xishui",
        "district_code": 520330,
        "chinese_name": "习水县"
    },
    {
        "Id": 1986,
        "DisName": "赤水市",
        "CityID": 247,
        "DisSort": null,
        "CityNameEnglish": "Chishui",
        "district_code": 520381,
        "chinese_name": "赤水市"
    },
    {
        "Id": 1987,
        "DisName": "仁怀市",
        "CityID": 247,
        "DisSort": null,
        "CityNameEnglish": "Renhuai",
        "district_code": 520382,
        "chinese_name": "仁怀市"
    },
    {
        "Id": 1988,
        "DisName": "西秀区",
        "CityID": 248,
        "DisSort": null,
        "CityNameEnglish": "Xixiu",
        "district_code": 520402,
        "chinese_name": "西秀区"
    },
    {
        "Id": 1989,
        "DisName": "平坝县",
        "CityID": 248,
        "DisSort": null,
        "CityNameEnglish": "Pingba",
        "district_code": 520421,
        "chinese_name": "平坝县"
    },
    {
        "Id": 1990,
        "DisName": "普定县",
        "CityID": 248,
        "DisSort": null,
        "CityNameEnglish": "Puding",
        "district_code": 520422,
        "chinese_name": "普定县"
    },
    {
        "Id": 1991,
        "DisName": "镇宁布依族苗族自治县",
        "CityID": 248,
        "DisSort": null,
        "CityNameEnglish": "Zhenning",
        "district_code": 520423,
        "chinese_name": "镇宁布依族苗族自治县"
    },
    {
        "Id": 1992,
        "DisName": "关岭布依族苗族自治县",
        "CityID": 248,
        "DisSort": null,
        "CityNameEnglish": "Guanling",
        "district_code": 520424,
        "chinese_name": "关岭布依族苗族自治县"
    },
    {
        "Id": 1993,
        "DisName": "紫云苗族布依族自治县",
        "CityID": 248,
        "DisSort": null,
        "CityNameEnglish": "Ziyun",
        "district_code": 520425,
        "chinese_name": "紫云苗族布依族自治县"
    },
    {
        "Id": 1994,
        "DisName": "都匀市",
        "CityID": 249,
        "DisSort": null,
        "CityNameEnglish": "Duyun",
        "district_code": 522701,
        "chinese_name": "都匀市"
    },
    {
        "Id": 1995,
        "DisName": "福泉市",
        "CityID": 249,
        "DisSort": null,
        "CityNameEnglish": "Fuquan",
        "district_code": 522702,
        "chinese_name": "福泉市"
    },
    {
        "Id": 1996,
        "DisName": "荔波县",
        "CityID": 249,
        "DisSort": null,
        "CityNameEnglish": "Libo",
        "district_code": 522722,
        "chinese_name": "荔波县"
    },
    {
        "Id": 1997,
        "DisName": "贵定县",
        "CityID": 249,
        "DisSort": null,
        "CityNameEnglish": "Guiding",
        "district_code": 522723,
        "chinese_name": "贵定县"
    },
    {
        "Id": 1998,
        "DisName": "瓮安县",
        "CityID": 249,
        "DisSort": null,
        "CityNameEnglish": "Weng'an",
        "district_code": 522725,
        "chinese_name": "瓮安县"
    },
    {
        "Id": 1999,
        "DisName": "独山县",
        "CityID": 249,
        "DisSort": null,
        "CityNameEnglish": "Dushan",
        "district_code": 522726,
        "chinese_name": "独山县"
    },
    {
        "Id": 2000,
        "DisName": "平塘县",
        "CityID": 249,
        "DisSort": null,
        "CityNameEnglish": "Pingtang",
        "district_code": 522727,
        "chinese_name": "平塘县"
    },
    {
        "Id": 2001,
        "DisName": "罗甸县",
        "CityID": 249,
        "DisSort": null,
        "CityNameEnglish": "Luodian",
        "district_code": 522728,
        "chinese_name": "罗甸县"
    },
    {
        "Id": 2002,
        "DisName": "长顺县",
        "CityID": 249,
        "DisSort": null,
        "CityNameEnglish": "Changshun",
        "district_code": 522729,
        "chinese_name": "长顺县"
    },
    {
        "Id": 2003,
        "DisName": "龙里县",
        "CityID": 249,
        "DisSort": null,
        "CityNameEnglish": "Longli",
        "district_code": 522730,
        "chinese_name": "龙里县"
    },
    {
        "Id": 2004,
        "DisName": "惠水县",
        "CityID": 249,
        "DisSort": null,
        "CityNameEnglish": "Huishui",
        "district_code": 522731,
        "chinese_name": "惠水县"
    },
    {
        "Id": 2005,
        "DisName": "三都水族自治县",
        "CityID": 249,
        "DisSort": null,
        "CityNameEnglish": "Sandu",
        "district_code": 522732,
        "chinese_name": "三都水族自治县"
    },
    {
        "Id": 2006,
        "DisName": "凯里市",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Kaili",
        "district_code": 522601,
        "chinese_name": "凯里市"
    },
    {
        "Id": 2007,
        "DisName": "黄平县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Huangping",
        "district_code": 522622,
        "chinese_name": "黄平县"
    },
    {
        "Id": 2008,
        "DisName": "施秉县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Shibing",
        "district_code": 522623,
        "chinese_name": "施秉县"
    },
    {
        "Id": 2009,
        "DisName": "三穗县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Sansui",
        "district_code": 522624,
        "chinese_name": "三穗县"
    },
    {
        "Id": 2010,
        "DisName": "镇远县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Zhenyuan",
        "district_code": 522625,
        "chinese_name": "镇远县"
    },
    {
        "Id": 2011,
        "DisName": "岑巩县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Cengong",
        "district_code": 522626,
        "chinese_name": "岑巩县"
    },
    {
        "Id": 2012,
        "DisName": "天柱县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Tianzhu",
        "district_code": 522627,
        "chinese_name": "天柱县"
    },
    {
        "Id": 2013,
        "DisName": "锦屏县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Jinping",
        "district_code": 522628,
        "chinese_name": "锦屏县"
    },
    {
        "Id": 2014,
        "DisName": "剑河县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Jianhe",
        "district_code": 522629,
        "chinese_name": "剑河县"
    },
    {
        "Id": 2015,
        "DisName": "台江县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Taijiang",
        "district_code": 522630,
        "chinese_name": "台江县"
    },
    {
        "Id": 2016,
        "DisName": "黎平县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Liping",
        "district_code": 522631,
        "chinese_name": "黎平县"
    },
    {
        "Id": 2017,
        "DisName": "榕江县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Rongjiang",
        "district_code": 522632,
        "chinese_name": "榕江县"
    },
    {
        "Id": 2018,
        "DisName": "从江县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Congjiang",
        "district_code": 522633,
        "chinese_name": "从江县"
    },
    {
        "Id": 2019,
        "DisName": "雷山县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Leishan",
        "district_code": 522634,
        "chinese_name": "雷山县"
    },
    {
        "Id": 2020,
        "DisName": "麻江县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Majiang",
        "district_code": 522635,
        "chinese_name": "麻江县"
    },
    {
        "Id": 2021,
        "DisName": "丹寨县",
        "CityID": 250,
        "DisSort": null,
        "CityNameEnglish": "Danzhai",
        "district_code": 522636,
        "chinese_name": "丹寨县"
    },
    {
        "Id": 2022,
        "DisName": "铜仁市",
        "CityID": 251,
        "DisSort": null,
        "CityNameEnglish": "Tongren",
        "district_code": 522201,
        "chinese_name": "铜仁市"
    },
    {
        "Id": 2023,
        "DisName": "江口县",
        "CityID": 251,
        "DisSort": null,
        "CityNameEnglish": "Jiangkou",
        "district_code": 522222,
        "chinese_name": "江口县"
    },
    {
        "Id": 2024,
        "DisName": "玉屏侗族自治县",
        "CityID": 251,
        "DisSort": null,
        "CityNameEnglish": "Yuping",
        "district_code": 522223,
        "chinese_name": "玉屏侗族自治县"
    },
    {
        "Id": 2025,
        "DisName": "石阡县",
        "CityID": 251,
        "DisSort": null,
        "CityNameEnglish": "Shiqian",
        "district_code": 522224,
        "chinese_name": "石阡县"
    },
    {
        "Id": 2026,
        "DisName": "思南县",
        "CityID": 251,
        "DisSort": null,
        "CityNameEnglish": "Sinan",
        "district_code": 522225,
        "chinese_name": "思南县"
    },
    {
        "Id": 2027,
        "DisName": "印江土家族苗族自治县",
        "CityID": 251,
        "DisSort": null,
        "CityNameEnglish": "Yinjiang",
        "district_code": 522226,
        "chinese_name": "印江土家族苗族自治县"
    },
    {
        "Id": 2028,
        "DisName": "德江县",
        "CityID": 251,
        "DisSort": null,
        "CityNameEnglish": "Dejiang",
        "district_code": 522227,
        "chinese_name": "德江县"
    },
    {
        "Id": 2029,
        "DisName": "沿河土家族自治县",
        "CityID": 251,
        "DisSort": null,
        "CityNameEnglish": "Yanhe",
        "district_code": 522228,
        "chinese_name": "沿河土家族自治县"
    },
    {
        "Id": 2030,
        "DisName": "松桃苗族自治县",
        "CityID": 251,
        "DisSort": null,
        "CityNameEnglish": "Songtao",
        "district_code": 522229,
        "chinese_name": "松桃苗族自治县"
    },
    {
        "Id": 2031,
        "DisName": "万山特区",
        "CityID": 251,
        "DisSort": null,
        "CityNameEnglish": "Wanshan",
        "district_code": 522230,
        "chinese_name": "万山特区"
    },
    {
        "Id": 2032,
        "DisName": "毕节市",
        "CityID": 252,
        "DisSort": null,
        "CityNameEnglish": "Bijie",
        "district_code": 522401,
        "chinese_name": "毕节市"
    },
    {
        "Id": 2033,
        "DisName": "大方县",
        "CityID": 252,
        "DisSort": null,
        "CityNameEnglish": "Dafang",
        "district_code": 522422,
        "chinese_name": "大方县"
    },
    {
        "Id": 2034,
        "DisName": "黔西县",
        "CityID": 252,
        "DisSort": null,
        "CityNameEnglish": "Qianxi",
        "district_code": 522423,
        "chinese_name": "黔西县"
    },
    {
        "Id": 2035,
        "DisName": "金沙县",
        "CityID": 252,
        "DisSort": null,
        "CityNameEnglish": "Jinsha",
        "district_code": 522424,
        "chinese_name": "金沙县"
    },
    {
        "Id": 2036,
        "DisName": "织金县",
        "CityID": 252,
        "DisSort": null,
        "CityNameEnglish": "Zhijin",
        "district_code": 522425,
        "chinese_name": "织金县"
    },
    {
        "Id": 2037,
        "DisName": "纳雍县",
        "CityID": 252,
        "DisSort": null,
        "CityNameEnglish": "Nayong",
        "district_code": 522426,
        "chinese_name": "纳雍县"
    },
    {
        "Id": 2038,
        "DisName": "威宁彝族回族苗族自治县",
        "CityID": 252,
        "DisSort": null,
        "CityNameEnglish": "Weining",
        "district_code": 522427,
        "chinese_name": "威宁彝族回族苗族自治县"
    },
    {
        "Id": 2039,
        "DisName": "赫章县",
        "CityID": 252,
        "DisSort": null,
        "CityNameEnglish": "Hezhang",
        "district_code": 522428,
        "chinese_name": "赫章县"
    },
    {
        "Id": 2040,
        "DisName": "钟山区",
        "CityID": 253,
        "DisSort": null,
        "CityNameEnglish": "Zhongshan",
        "district_code": 520201,
        "chinese_name": "钟山区"
    },
    {
        "Id": 2041,
        "DisName": "六枝特区",
        "CityID": 253,
        "DisSort": null,
        "CityNameEnglish": "Liuzhi",
        "district_code": 520203,
        "chinese_name": "六枝特区"
    },
    {
        "Id": 2042,
        "DisName": "水城县",
        "CityID": 253,
        "DisSort": null,
        "CityNameEnglish": "Shuicheng",
        "district_code": 520221,
        "chinese_name": "水城县"
    },
    {
        "Id": 2043,
        "DisName": "盘县",
        "CityID": 253,
        "DisSort": null,
        "CityNameEnglish": "Panxian",
        "district_code": 520222,
        "chinese_name": "盘县"
    },
    {
        "Id": 2044,
        "DisName": "兴义市",
        "CityID": 254,
        "DisSort": null,
        "CityNameEnglish": "Xingyi",
        "district_code": 522301,
        "chinese_name": "兴义市"
    },
    {
        "Id": 2045,
        "DisName": "兴仁县",
        "CityID": 254,
        "DisSort": null,
        "CityNameEnglish": "Xingren",
        "district_code": 522322,
        "chinese_name": "兴仁县"
    },
    {
        "Id": 2046,
        "DisName": "普安县",
        "CityID": 254,
        "DisSort": null,
        "CityNameEnglish": "Puan",
        "district_code": 522323,
        "chinese_name": "普安县"
    },
    {
        "Id": 2047,
        "DisName": "晴隆县",
        "CityID": 254,
        "DisSort": null,
        "CityNameEnglish": "Qinglong",
        "district_code": 522324,
        "chinese_name": "晴隆县"
    },
    {
        "Id": 2048,
        "DisName": "贞丰县",
        "CityID": 254,
        "DisSort": null,
        "CityNameEnglish": "Zhenfeng",
        "district_code": 522325,
        "chinese_name": "贞丰县"
    },
    {
        "Id": 2049,
        "DisName": "望谟县",
        "CityID": 254,
        "DisSort": null,
        "CityNameEnglish": "Wangmo",
        "district_code": 522326,
        "chinese_name": "望谟县"
    },
    {
        "Id": 2050,
        "DisName": "册亨县",
        "CityID": 254,
        "DisSort": null,
        "CityNameEnglish": "Ceheng",
        "district_code": 522327,
        "chinese_name": "册亨县"
    },
    {
        "Id": 2051,
        "DisName": "安龙县",
        "CityID": 254,
        "DisSort": null,
        "CityNameEnglish": "Anlong",
        "district_code": 522328,
        "chinese_name": "安龙县"
    },
    {
        "Id": 2398,
        "DisName": "八步区",
        "CityID": 314,
        "DisSort": null,
        "CityNameEnglish": "Babu",
        "district_code": 451102,
        "chinese_name": "八步区"
    },
    {
        "Id": 2399,
        "DisName": "昭平县",
        "CityID": 314,
        "DisSort": null,
        "CityNameEnglish": "Zhaoping",
        "district_code": 451121,
        "chinese_name": "昭平县"
    },
    {
        "Id": 2400,
        "DisName": "钟山县",
        "CityID": 314,
        "DisSort": null,
        "CityNameEnglish": "Zhongshan",
        "district_code": 451122,
        "chinese_name": "钟山县"
    },
    {
        "Id": 2401,
        "DisName": "富川瑶族自治县",
        "CityID": 314,
        "DisSort": null,
        "CityNameEnglish": "Fuchuan",
        "district_code": 451123,
        "chinese_name": "富川瑶族自治县"
    }]
    };


}(jQuery);
