/**
 * luis 调用实例
 */

var https = require("https");  
//var iconv = require("iconv-lite");  // 解决中文乱码显示问题,这里未安装 
var querystring = require('querystring');  
var IntentApi = '/luis/v2.0/apps/50e3e9d8-ab3c-4438-b27c-c88b4949ecef?subscription-key=942cda48c103493883d488ed9dafe234&verbose=true&timezoneOffset=0&q='
var TypeApi = '/luis/v2.0/apps/0b51b9e7-2200-40c5-9a7d-d644b430364e?subscription-key=942cda48c103493883d488ed9dafe234&verbose=true&timezoneOffset=0&q='
module.exports = {
    askLuis: function(query,callback){
        this.loadData(IntentApi
         + querystring.escape(query),callback);
    },
    askLuisType: function(query,callback){
        this.loadData(TypeApi
         + querystring.escape(query),callback);
    },
    loadData: function(path,callback){
        var request_timer =null, request = null; 
        // 设置请求定时器，请求10秒超时
        var request_timer = setTimeout(function() {
            request.abort();
            console.log('Request Timeout.');
        }, 20000);
        var options = {
            host: 'westus.api.cognitive.microsoft.com',
            port: 443,
            path: path,  // 查询路径
            method: 'GET',  // 请求方法
            headers: {'user-agent':'node.js'}  
        };
        var request = https.request(options,function(response){
            // 接受到请求，清除请求定时器，nodejs默认自带两分钟请求延时
            clearTimeout(request_timer);
            var data = '';  // 定义函数局部变量
            response.on('data',function(chunk){ data += chunk;});  // 获取request得到的数据
            response.on('end',function(){
                //console.log('打印接收到的json文本\n',data);
                callback(JSON.parse(data));  // 响应结束调用callback函数,为自己输入的函数句柄
            });
        }).on('error', function(e) {  // 捕捉请求错误
                console.log('problem with request: ' + e.message); 
        });
        request.end(); // 关闭请求
    },
}