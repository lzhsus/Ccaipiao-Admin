import moment from 'moment';

// 深度拷贝
export const depthCopy = function (data){
    return JSON.parse(JSON.stringify(data));
}

export const getTimeFun = function(time){
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}