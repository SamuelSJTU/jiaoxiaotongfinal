/**
 * luis 调用实例
 */

var https = require("https");  

//var iconv = require("iconv-lite");  // 解决中文乱码显示问题,这里未安装 
var querystring = require('querystring');  

var TypeApi = 'https://southeastasia.api.cognitive.microsoft.com/luis/v2.0/apps/0b51b9e7-2200-40c5-9a7d-d644b430364e?subscription-key=fc7f3816353045959d517198742e11e3&timezoneOffset=0&verbose=true&q='
var IntentApi = 'https://southeastasia.api.cognitive.microsoft.com/luis/v2.0/apps/50e3e9d8-ab3c-4438-b27c-c88b4949ecef?subscription-key=fc7f3816353045959d517198742e11e3&timezoneOffset=0&verbose=true&q='

module.exports = {
    askLuisType: function(query,callback){
        this.loadData(TypeApi
         + querystring.escape(query),callback);
    },
    askLuisIntent: function(query,callback){
        this.loadData(IntentApi
         + querystring.escape(query),callback);
    },
    loadData: function(path,callback){
        // console.log(path);
        var options = {
            host: 'southeastasia.api.cognitive.microsoft.com',
            port: 443,
            path: path,  // 查询路径
            method: 'GET',  // 请求方法
            headers: {'user-agent':'node.js'}  // headers 原来少了个s，类似浏览器请求头文件
        };
        var request = https.request(options,function(response){
            var data = '';  // 定义函数局部变量
            response.on('data',function(chunk){ data += chunk;});  // 获取request得到的数据
            response.on('end',function(){
                // console.log('打印接收到的json文本\n',data);
                callback(JSON.parse(data));  // 响应结束调用callback函数,为自己输入的函数句柄
            });
        });
        request.end(); // 关闭请求
    },
}