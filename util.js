// 判断一个对象是否为空
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isEmpty(obj){
  // 本身为空直接返回true
  if (obj == null)  return true;
  // 然后可以根据长度判断，在低版本的ie浏览器中无法这样判断。
  if (obj.length > 0)  return false;
  if (obj.length === 0)  return true;
  //最后通过属性长度判断。
  for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}

// 阻止冒泡
function stopBubble(e){
  if(e && e.stopPropagation){
    e.stopPropagation();
  }else{
    window.event.cancelBubble = true;
  }
}

// 对象拷贝
function cloneObj(obj) {
  var newObj = {};
  for(var prop in obj) {
    newObj[prop] = obj[prop];
  }
  return newObj;
}

// 将对象元素转换成字符串以作比较
function obj2key(obj, keys){
    var n = keys.length,
        key = [];
    while(n--){
        key.push(obj[keys[n]]);
    }
    return key.join('|');
}
// 含对象数组去重操作
function uniqueByKeys(array,keys){
    var arr = [];
    var hash = {};
    for (var i = 0, j = array.length; i < j; i++) {
        var k = obj2key(array[i], keys);
        if (!(k in hash)) {
            hash[k] = true;
            arr.push(array[i]);
        }
    }
    return arr;
}


// 去除空格(type 1-所有空格 2-前后空格 3-前空格 4-后空格)
function trim(str,type){
    switch(type){
        case 1: return str.replace(/\s+/g,"");
        case 2: return str.replace(/(^\s*)|(\s*$)/g,"");
        case 3: return str.replace(/(^\s*)/g,"");
        case 4: return str.replace(/(\s*$)/g,"");
        default: return str;
    }
}

// 简单数组去重
function unique(array){
    var temp = [];
    for(var i=0;i<array.length;i++){
        if(temp.indexOf(array[i]) == -1){
            temp.push(array[i]);
        }
    }
    return temp;
}

// 对象键值法去重
function uniq(array){
    var temp = {}, r = [], len = array.length, val, type;
    for(var i=0;i<len;i++){
        val = array[i];
        type = typeof val;
        if(!temp[val]){
            temp[val] = [type];
            r.push(val);
        }else if(temp[val].indexOf(type)<0){
            temp[val].push(type);
            r.push(val);
        }
    }
    return r;
}