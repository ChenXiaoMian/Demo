/**
 * 判断图片是否1:1比例
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
function imgEqual(file){
    if(file.files && file.files[0]){
        // 读取图片数据
        var reader = new FileReader();
        reader.onload = function(e){
            var data = e.target.result;
            // 加载图片获取图片真实宽度和高度
            var image = new Image();
            image.onload = function(){
                var width = image.width;
                var height = image.height;
                (width === height) ? imgUpload(data) : imgJcrop(data);
            }
            image.src= data;
        }
        reader.readAsDataURL(file.files[0]);
    }
}
/**
 * 上传图片
 */
function imgUpload(file, obj){
    alert('上传成功!');
}
//	定义裁剪图片所需变量
var jcropApi,
    imgCoord,
    boundx,
    boundy,
    $pcnt = $('#preview'),
    $pimg = $('#preview img'),
    xsize = $pcnt.width(),
    ysize = $pcnt.height();
// 初始化图片裁剪插件
function initJcrop(){
    $('#cropTarget').Jcrop({}, function(){
        jcropApi = this;
    });
}
// 更换裁剪图片
function imgJcrop(data){
    $(".image-crop-upload").show();
    $("#cropTarget").prop("src", data);
    $(".jcrop-preview").prop("src", data);
    initJcrop();
    jcropApi.setImage(data);
    jcropApi.setOptions({
        setSelect: [0, 0, 260, 260],
        bgFade: true,
        aspectRatio: 1,
        bgOpacity: 0.5,
        onChange: showPreview,
        onSelect: showPreview
    });
}
// 图片裁剪插件预览图
function showPreview(c){
    var bounds = jcropApi.getBounds();
    boundx = bounds[0];
    boundy = bounds[1];
    if(parseInt(c.w) > 0){
        var rx = xsize / c.w;
        var ry = ysize / c.h;
        $pimg.css({
          width: Math.round(rx * boundx) + 'px',
          height: Math.round(ry * boundy) + 'px',
          marginLeft: '-' + Math.round(rx * c.x) + 'px',
          marginTop: '-' + Math.round(ry * c.y) + 'px'
        });
        imgCoord = c;
    }
}
// 销毁裁剪插件参数
function destroyJcrop(){
    $("#cropTarget,.jcrop-preview").prop("src", '').css({"width":"auto","height":"auto"});
    jcropApi.destroy();
    jcropApi = null;
    imgCoord = null;
    $(".openFi").val('');
}
// 保存上传图片
$(".icp-operate-save").on('click',function(){
    // 上传裁剪图片参数
    var cropObj = {
        x: imgCoord.x,
        y: imgCoord.y,
        w: imgCoord.w,
        h: imgCoord.h,
        pw: boundx,
        ph: boundy
    };
    console.log('获取图片实际尺寸'+jcropApi.getBounds());
    console.log('获取图片显示尺寸'+jcropApi.getWidgetSize());
    console.log('获取图片缩放的比例'+jcropApi.getScaleFactor());
    console.log(imgCoord);
    console.log(cropObj);
    // imgUpload(data, cropObj);
});
// 关闭面板
$(".icp-close,.icp-operate-cancel").on("click", function(){
    $(".image-crop-upload").hide();
    destroyJcrop();
});
$(function(){
    $(document).on('change','.openFi',function(e){
	    if($(this)[0].files.length===0) return false;
	    var size = $(this)[0].files[0].size;
        var type = $(this)[0].files[0].type;
        if(size > 2*1024*1024){
	    	alert("图片大小不能超过2M!");
	    	return false;
	    }
	    if(type != 'image/jpeg' && type != 'image/bmp' && type != 'image/png' && type != 'image/jpg' && type != 'image/gif'){
	    	alert("图片格式错误！");
	    	return false;
        }
        // 判断文件是否1:1比例，进行裁剪操作
	    imgEqual(this);
    });
});

//**********************以下暂时没用到****************************//

/**
 * 默认图片居中显示
 * @param  {[String]} obj [图片DOM]
 * @return {[type]}     [description]
 */
function cutImage(obj){
    var w = 600,
        h = 400,
        iw = obj.width(),
        ih = obj.height();
    if(iw > w || ih > h){
        if(iw / ih > w / h){
            obj.css({
                width: w,
                height: w * ih / iw,
                top: (h - (w * ih / iw)) / 2,
                left: 0
            });
        }else{
            obj.css({
                height: h,
                width: h * iw / ih,
                top: 0,
                left: (w - (h * iw / ih)) / 2
            });
        }
    }else{
        obj.css({
            left: (w - iw) / 2,
            top: (h - ih ) / 2
        });
    }
}

function imgRotate(deg){
    var img = $("#cropTarget>img"),
        _data = parseInt($("#cropTarget").attr("data"));
    var _deg = deg + _data;
    var _val =  "rotate("+ _deg + "deg)";
    img.css({
        "-webkit-transform": _val,
           "-moz-transform": _val,
            "-ms-transform": _val,
             "-o-transform": _val,
                "transform": _val
    });
    $('#preview img').css({
        "-webkit-transform": _val,
           "-moz-transform": _val,
            "-ms-transform": _val,
             "-o-transform": _val,
                "transform": _val
    });
    if(deg > 0){
        _data = (_data === 270) ? 0 : (_data + 90);
    }else{
        _data = (_data === 0) ? 270 : (_data - 90);
    }
    $("#cropTarget").attr("data", _data);
}

function imgToSize(size){
    var iw = $("#cropTarget>img").width(),
        ih = $("#cropTarget>img").height(),
        _data = parseInt($("#cropTarget").attr("data")),
        _w = Math.round(iw + size),
        _h = Math.round(((iw + size) * ih) / iw);
        if(_data == 90 || _data == 270){
            $('#cropTarget>img').width(_h).height(_w);
        }else{
            $('#cropTarget>img').width(_w).height(_h);
        }
}