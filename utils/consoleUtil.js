/**
 * 日志简单封装类
 */

//日志开关，上线发布时是改为false
const debug = true;

function log(content){
  if(debug){
    console.log(content);
  }
}

module.exports = {
  log: log,
}
