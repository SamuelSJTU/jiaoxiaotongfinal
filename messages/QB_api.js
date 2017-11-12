/**
 * 测试认知服务api
 * qnamker and bing search test
 * Author： Zhe Wang
 * Date: 2017-08-11
 * 
 */
var https = require("https");  
var querystring = require('querystring');
var fs = require('fs');
var request = require('request'); 
/**
 * bing search
 */
function askBing(query,callback)
{   // 5.0 版本， 7.0版本需购买
    var path = '/bing/v7.0/search?q='
        + querystring.escape(query);
    var request_timer =null, request = null; 
    // 设置请求定时器，请求10秒超时
    var request_timer = setTimeout(function() {
        request.abort();
        console.log('Request Timeout.');
    }, 20000);

    var options = {
        host: 'api.cognitive.microsoft.com',
        port: 443,
        path: path,  // 查询路径
        method: 'GET',  // 请求方法
        headers: {'user-agent':'node.js',
                'Content-Type':'application/json',
                'Ocp-Apim-Subscription-Key':'22b4fea76ed74567b1a0ee348bfb89d4'}
          
    };
    var request = https.request(options,function(response){
        // 接受到请求，清除请求定时器，nodejs默认自带两分钟请求延时
        clearTimeout(request_timer);
        var data = '';  // 定义函数局部变量
        response.on('data',function(chunk){ data += chunk;});  // 获取request得到的数据
        response.on('end',function(){
            //console.log('打印接收到的json文本\n',data);is

            // callback(JSON.parse(data));  // 响应结束调用callback函数,为自己输入的函数句柄
             var jdata = JSON.parse(data);
             var webPages = jdata.webPages.value;
             var ans = webPages[0].snippet;
             callback(ans);


        });
    }).on('error', function(e) {  // 捕捉请求错误
            console.log('problem with request: ' + e.message); 
    });
    request.end(); // 关闭请求
}

var query = "交大校长是谁？";
// askBing(query,function(data){
//     //console.log(data.webPages.value);  // 网页搜索
//     var webPages = data.webPages.value;
//     //for(var i=0;i<webPages.length;i++){
//     for(var i=0;i<3;i++){
//         console.log(webPages[i].displayUrl);
//         console.log(webPages[i].name);
//         console.log(webPages[i].snippet);
//     }
//     // 得到一个数组，顺序表示rank
//     // 每个对象 从displayUrl开始搜索，snippet为匹配到的片段，name 为网页名字
//    // 相关搜索

// })

// askBing(query,function(data){
//   console.log(data);  
// })

/** qnamaker  */
askQnAMaker=function(question,callback){
    var requestBody = {
        'question': question,
        'top':1  // 返回的长度
    };    
    var requestData = {
        url: "https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/f73202ac-2453-4062-8ae0-8f8d1c625025/generateAnswer",
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Ocp-Apim-Subscription-Key": "bdd9ab5fb7194f9dbf39803385ac58b0" 
        },
        body: JSON.stringify(requestBody)
    };
    request.post(requestData, function (error, response, body) {
            if (error) {
                console.log(error);
            } else if (response.statusCode !== 200) {
                console.log(body);
            } else {
               callback(JSON.parse(body).answers[0].answer);
                // console.log(body);
            }
        }
    );
}

// askQnAMakerDemo=function(question,callback){
//     var requestBody = {
//         'question': question,
//         'top':1  // 返回的长度
//     };    
//     var requestData = {
//         url: "https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/b6f8e022-fbf8-487f-8763-685ff6963911/generateAnswer",
//         method: "POST",
//         headers: {
//             "content-type": "application/json",
//             "Ocp-Apim-Subscription-Key": "84ba2e0f445747d6baa1b1cc3c6118fc" 
//         },
//         body: JSON.stringify(requestBody)
//     };
//     request.post(requestData, function (error, response, body) {
//             if (error) {
//                 console.log(error);
//             } else if (response.statusCode !== 200) {
//                 console.log(body);
//             } else {
//                callback(JSON.parse(body).answers);
//                 // console.log(body);
//             }
//         }
//     );
// }




module.exports.askQnAMaker = askQnAMaker;
module.exports.askBing = askBing;

var question = "你好困";

