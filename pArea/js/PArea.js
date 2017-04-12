var PArea = function(options){
    var self = this;
    self.options = {
        dataUrl : 'data.json',
        data : {},
        selected : null
    };
    // 定义模板html
    var addrBox = $('<div class="addrBox"></div>'),
        addrAux = $('<b class="addrbox-close"></b><i class="addrbox-triup"></i>'),
        addrtitle = $('<div class="addrbox-title"></div>'),
        addrtitleUl = $('<ul class="addrbox-titlew"></ul>'),
        addrList = $('<div class="addrList clearfix"></div>'),
        addrParent = $(".postArea");
    // 定义常用变量
    var domSelect = $(".areaWrapper .to"),
        domPost = $(".areaFreight");
    // 初始化
    var init = function(){
        self.options = $.extend(self.options,options);
        $.ajax({
            type : "GET",
            url : self.options.dataUrl,
            dataType : "json",
            success : function(data){
              if(data){
                processData(data);
                self.options.data = data;
              }else{
                console.log('地区数据加载异常,请检查网络。');
              }
            }
        });
        // var childId = domSelect.attr('areaId');
        // // 取得邮费
        // $.get("check_postal.html",{item_id : self.options.itemId , area_id : childId},function(data){               
        //     domPost.find("b").text("￥"+data);
        // });
    };
    // 载入数据
    var processData = function(data){
        var tempTitle = '',
            tempList = '';
        // 存在默认选项
        if(domSelect){
            var provId = $(".to").attr('provId'),
                cityId = $(".to").attr('cityId'),
                areaId = $(".to").attr('areaId'),
                citytemp = {},
                areatemp = {},
                str = '';
            $.each(data,function(i){
                if(data[i].id==provId){
                    str = data[i].value;
                    tempTitle = "<li class='tli' data-id="+data[i].id+">"+data[i].value+"</li>";
                    citytemp = data[i].children;
                }
            });
            $.each(citytemp,function(j){
                if(citytemp[j].id==cityId){
                    str += citytemp[j].value;
                    tempTitle += "<li class='tli' data-id="+citytemp[j].id+" data-pid="+provId+">"+citytemp[j].value+"</li>";
                    areatemp = citytemp[j].children;
                }
            });
            if(areatemp&&areatemp.length>0){
                $.each(areatemp,function(k){
                    if(areatemp[k].id==areaId){
                        str += areatemp[k].value;
                        tempTitle += "<li class='tli act' data-id="+areatemp[k].id+">"+areatemp[k].value+"</li>";
                    }
                    tempList += "<span class='area'><a href='javascript:;' provId="+provId+" cityId="+cityId+" data-id="+areatemp[k].id+">"+areatemp[k].value+"</a></span>";
                });
            }else{
                $.each(citytemp,function(j){
                    tempList += "<span class='city'><a href='javascript:;' provId="+provId+" data-id="+citytemp[j].id+">"+citytemp[j].value+"</a></span>";
                });
            }
            $(".areaWrapper .to").text(str);
            console.log(tempTitle);
            console.log(tempList);
            renderData(tempTitle,tempList);
        }
    };
    // 渲染数据
    var renderData = function(tempTitle,tempList){
        addrBox.empty();
        addrtitleUl.empty();
        addrList.empty();
        $(tempTitle).appendTo(addrtitleUl);
        $(tempList).appendTo(addrList);
        addrAux.appendTo(addrBox);
        addrtitleUl.appendTo(addrtitle);
        addrtitle.appendTo(addrBox);
        addrList.appendTo(addrBox);
        $(".postArea").append(addrBox);
        domPost.show();
        
    };
    // 根据id重新获取数据
    var renderList = function(id,pid,type){
        var tempTitle = '',
            data = self.options.data,
            getId = id,
            getpId = pid,
            temp = {},
            tempList = '',
            areaname = '',
            citytemp = {},
            areatemp = {};
        if(type=='city'){
            tempTitle = "<li class='tli act'>选择地区</li>";
            $.each(data,function(i){
                if(data[i].id==getpId){
                    citytemp = data[i].children;
                }
            });
            $.each(citytemp,function(j){
                if(citytemp[j].id==getId){
                    areatemp = citytemp[j].children;
                    areaname = citytemp[j].value;
                }
            });
            if(areatemp&&areatemp.length>0){
                $.each(areatemp,function(k){
                    tempList += "<span class='area'><a href='javascript:;' provId="+getpId+" cityId="+getId+" data-id="+areatemp[k].id+">"+areatemp[k].value+"</a></span>";
                });
            }
        }else if(type=='prov'){
            tempTitle = "<li class='tli act'>选择城市</li>";
            $.each(data,function(i){
                if(data[i].id==getId){
                    citytemp = data[i].children;
                }
            });
            $.each(citytemp,function(j){
                tempList += "<span class='city'><a href='javascript:;' provId="+getId+" data-id="+citytemp[j].id+">"+citytemp[j].value+"</a></span>";
            });
        }

        if(tempList!=''){
            $(tempTitle).appendTo(addrtitleUl);
            addrList.empty();
            $(tempList).appendTo(addrList);
        }else{
            var titlew = $(".addrbox-titlew").find("li");
            $(".to").text(titlew.eq(0).text()+areaname);
            $(".to").attr('provId',getpId);
            $(".to").attr('cityId',getId);
            addrBox.hide();
            // var childId = domSelect.attr('cityId');
            // // 取得邮费
            // $.get("check_postal.html",{item_id : self.options.itemId , area_id : childId},function(data){               
            //     domPost.find("b").text("￥"+data);
            // });
        }
        
    };

    init();


    $(document).ready(function(){
        var domProv = $(".addrbox-titlew").find("li").eq(0),
            domArea = $(".addrbox-titlew").find("li").eq(1);

        $(".postArea .areaWrapper").on('click',function(e){
            e.stopPropagation();
            addrBox.show();
            processData(self.options.data);
            if($(".addrbox-titlew").find("li").length<3) $(".addrbox-titlew").find("li").last().addClass('act');
            $(".addrList span").removeClass('selected');
        });
        $(document).click(function(e){
          var _con = $(".postArea .areaWrapper");   // 设置目标区域
          if(!_con.is(e.target) && _con.has(e.target).length === 0){
            addrBox.hide();
          }else{
            addrBox.show();
          }
        });
        $(".addrbox-close").on('click',function(){
            addrBox.hide();
        });

        // 列表点击
        $(document).on('click','.addrList span',function(e){
            e.stopPropagation();
            var ele = $(this),
                dataId = ele.find("a").data("id"),
                provId = ele.find("a").attr("provId"),
                cityId = ele.find("a").attr("cityId"),
                titlew = $(".addrbox-titlew").find("li");
            ele.addClass('selected').siblings().removeClass('selected');
            if(ele.hasClass('area')){
                $(".to").text(titlew.eq(0).text()+titlew.eq(1).text()+ele.text());
                $(".to").attr('provId',provId);
                $(".to").attr('cityId',cityId);
                $(".to").attr('areaId',dataId);
                addrBox.hide();
                // var childId = domSelect.attr('areaId');
                // // 取得邮费
                // $.get("check_postal.html",{item_id : self.options.itemId , area_id : childId},function(data){               
                //     domPost.find("b").text("￥"+data);
                // });
            }else if(ele.hasClass('city')){
                titlew.eq(1).text(ele.text()).removeClass('act');
                renderList(dataId,provId,'city');
            }else{
                titlew.eq(0).text(ele.text()).removeClass('act');
                renderList(dataId,0,'prov');
            }
            
            return false;
        });

        // 标题点击
        $(document).on('click','.addrbox-titlew li',function(e){
            e.stopPropagation();
            var ele = $(this),
                eleIndex = ele.index(),
                tempData = {},
                tempList = '',
                data = self.options.data,
                dataId = ele.data("id"),
                datapId = ele.data("pid");
            ele.addClass('act').siblings().removeClass('act');
            if(eleIndex==0){
                addrtitleUl.empty();
                addrList.empty();
                var tempTitle = "<li class='tli act'>"+ele.text()+"</li>";
                $(tempTitle).appendTo(addrtitleUl);
                $.each(data,function(i){
                    tempList += "<span class='prov'><a href='javascript:;' data-id="+data[i].id+">"+data[i].value+"</a></span>";
                });
                $(tempList).appendTo(addrList);
            }else if(eleIndex==1){
                ele.next().remove();
                addrList.empty();
                $.each(data,function(i){
                    if(data[i].id==datapId){
                        tempData = data[i].children;
                    }
                });
                $.each(tempData,function(j){
                    tempList += "<span class='city'><a href='javascript:;' provId="+datapId+" data-id="+tempData[j].id+">"+tempData[j].value+"</a></span>";
                });
                $(tempList).appendTo(addrList);
            }
        });

    });
};



