export function time_formatter(time, fmt) {
  if (!fmt) {
    fmt = "yyyy-MM-dd hh:mm:ss"
  }
  if (!time) {
    return "";
  }
  let date = new Date(time);
  return date.format(fmt);
}

export function getDayStartEnd(now, isLastTime) {
  now = new Date(now);
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth();//得到月份
  var date = now.getDate();//得到日期
  if (isLastTime === "last") {
    return new Date(year, month, date, 23, 59, 59);
  } else {
    return new Date(year, month, date);
  }
}

Date.prototype.format = function (fmt) { //author: meizz

  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
