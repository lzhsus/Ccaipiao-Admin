import moment from 'moment';
import {azureFileUpload} from 'src/common/api'
import {request} from 'src/common/utils/request'
import { loadImage } from 'src/common/plugins/load-image'
export const getTimeFun = function(time){
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

// 图片压缩
export const fileAdd = function (file){
    return new Promise((resolve, reject)=>{
        loadImage(file, (canvas)=>{      
            let res = {
                file:file,
                img_url: convertCanvasToImage(canvas),
                img_url2: "",
                width: canvas.width,
                height: canvas.height,
            }
            resolve(res);
        },{
            maxWidth: 750, 
            canvas: true,
        });
    });            
}

// oss地址
export const getOssPath = function (url){
    return url;    
}

// 获取当月
export const getMonthStartAndEnd = function(month){
    return {
        start_at:moment(month).startOf('month').format("YYYY-MM-DD HH:mm:ss"),
        end_at:moment(month).endOf('month').format("YYYY-MM-DD HH:mm:ss"),
    }
}

// 深度拷贝
export const depthCopy = function (data){
    return JSON.parse(JSON.stringify(data));
}
export const getWindowWidth = function(){
    
}
/* 
    str: 原始字符串
    len: 分段截取字节长度
*/
export const splitStringByBytes = function(str, byteLimit) {
    const result = [];
    let startIndex = 0;
    let byteCount = 0;
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        // 如果字符是ASCII字符（0-127），则占用1个字节
        // 否则，对于UTF-8编码，我们需要检查它是多字节字符并计算字节数
        if (charCode < 128) {
            byteCount++;
        } else if ((charCode > 127) && (charCode < 2048)) {
            byteCount += 2;
        } else {
            byteCount += 3; // 大多数中文字符占用3个字节，但有些可能占用4个
        }
        // 如果当前字节数超过限制，则分割字符串
        if (byteCount > byteLimit) {
            result.push(str.slice(startIndex, i));
            startIndex = i;
            byteCount = 0;
        }
    }
    // 添加最后一个分段（如果有的话）
    if (startIndex < str.length) {
      result.push(str.slice(startIndex));
    }
    return result;
}
// 文件转图片
export const getVideoInfo = function (file, call){
    if (file && file.type.indexOf('video/') == 0) {
        var video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.addEventListener('loadeddata', function() {
          this.currentTime = 1
        })
        video.addEventListener('seeked', function () {
            this.width = this.videoWidth;
            this.height = this.videoHeight;
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = this.width;
            canvas.height = this.height;
            ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
            var image = {
                url: canvas.toDataURL('image/jpeg', 1),
                width: this.width,
                height: this.height,
                currentTime: this.currentTime,
                duration: this.duration
            };
            canvas.toBlob(function(blob) {
                image.blob = blob;
                image.file = file;
                image.fileUrl = getVideoFileURL(file);
                typeof call == 'function' ? call.call(file, image) : console.log(image);
            }, 'image/jpeg');
        });
    }
}

// 获取视频url
export const getVideoFileURL = function (file){
    var getUrl = null;
    if(window.createObjectURL != undefined) { // basic
        getUrl = window.createObjectURL(file);
    } else if(window.URL != undefined) { // mozilla(firefox)
        getUrl = window.URL.createObjectURL(file);
    } else if(window.webkitURL != undefined) { // webkit or chrome
        getUrl = window.webkitURL.createObjectURL(file);
    }
    return getUrl;
}

// 从 canvas 提取图片 image  
export const convertCanvasToImage = function(canvas) {
    return canvas.toDataURL("image/jpeg", 1);  
}

// base64 转 blob
export const dataURLtoBlob = function(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    console.log(1,new Blob([u8arr], { type: mime }))
    let formData = new FormData();
    formData.append("file", new Blob([u8arr], { type: mime }), '.'+mime.split('/')[1]);
    return formData;
}

let filedata;
// 上传图片
export const uploadImageFile = function (file){
    console.log('file',file);
    filedata = file;
    return new Promise(function (resolve, reject) {
        let promiseAll = []
        filedata.forEach((obj, index)=>{            
            promiseAll.push(uploadFileFun(index));
        })
        Promise.all(promiseAll).then((res)=> {
            resolve(filedata)
        }).catch(error=>{
            console.log(error)
            resolve(error)
        })
    })
}

let uploadFileFun = async (index)=> {
    return new Promise(function (resolve, reject) {
        request.post(azureFileUpload, dataURLtoBlob(filedata[index].pic)).then(res=>{
            console.log(2,res)
            if( res.file_url ){
                filedata[index] = {
                    img_url: filedata[index].pic,
                    img_url2: res.file_url,
                    index: filedata[index].index,
                };
                resolve(res);
            }else{
                reject({
                    error: true,
                    errordata: res,
                    index: index,
                });
            }
        });
    });
}

// 上传视频
export const uploadVideoFile = function (file){
    console.log('file',file)
    return new Promise(function (resolve, reject) {
        let formData = new FormData();
        formData.append("file", file, file.name);
        request.post(azureFileUpload, formData).then(res=>{
            if( res.file_url ){
                resolve(res);
            }else{
                reject({
                    error: true,
                });
            }
        });
    });
}

export const autoTextarea = (elem, extra, maxHeight)=> {
    extra = extra || 0;
    var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
    isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
    addEvent = function (type, callback) {
        elem.addEventListener ?
        elem.addEventListener(type, callback, false) :
        elem.attachEvent('on' + type, callback);
    },
    getStyle = elem.currentStyle ? function (name) {
        var val = elem.currentStyle[name];
        if (name === 'height' && val.search(/px/i) !== 1) {
            var rect = elem.getBoundingClientRect();
            return rect.bottom - rect.top -
            parseFloat(getStyle('paddingTop')) -
            parseFloat(getStyle('paddingBottom')) + 'px';        
        };
        return val;
    } : function (name) {
        return getComputedStyle(elem, null)[name];
    },
    minHeight = parseFloat(getStyle('height'));
    elem.style.resize = 'none';
    var change = function () {
        var scrollTop, height,
            padding = 0,
            style = elem.style;
        if (elem._length === elem.value.length) return;
        elem._length = elem.value.length;
        if (!isFirefox && !isOpera) {
            padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
        };
        scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        elem.style.height = minHeight + 'px';
        if (elem.scrollHeight > minHeight) {
            if (maxHeight && elem.scrollHeight > maxHeight) {
                height = maxHeight - padding;
                style.overflowY = 'auto';
            } else {
                height = elem.scrollHeight - padding;
                style.overflowY = 'hidden';
            };
            style.height = height + extra + 'px';
            scrollTop += parseInt(style.height) - elem.currHeight;
            document.body.scrollTop = scrollTop;
            document.documentElement.scrollTop = scrollTop;
            elem.currHeight = parseInt(style.height);
        };
    };
    addEvent('propertychange', change);
    addEvent('input', change);
    addEvent('focus', change);
    change();
}

export const find = function(str,cha,num) {
    let x = str.indexOf(cha);
    for( var i=0;i<num;i++ ){
        x = str.indexOf(cha,x+1);
    }
    return x;
}

export const windowOpenReportPage = function(url){
    let origin = window.location.origin;
    if( origin.indexOf("http://localhost")!=-1 ){
        origin = "https://bdb.intonecc.com";
    }
    if( url.indexOf("http")==-1 ){
        url = origin + url;
    }

    window.open(url);
}