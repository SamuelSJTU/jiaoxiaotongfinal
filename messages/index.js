/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://aka.ms/abs-node-waterfall
-----------------------------------------------------------------------------*/
"use strict";


var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');
var TypeApi = 'https://southeastasia.api.cognitive.microsoft.com/luis/v2.0/apps/0b51b9e7-2200-40c5-9a7d-d644b430364e?subscription-key=fc7f3816353045959d517198742e11e3&timezoneOffset=0&verbose=true&q=';
var fs = require('fs');
var myutils = require('./myutils.js');
var myutils2 = require('./myutils2.js');
var luis = require('./luis_api.js');
var fileoptions = {flag:'a'};
var cards = require('./cards.js');
var myio = require('./myIO.js');
var GAS = require('./getAnswerSync');
var QBH = require('./QB_api.js');
var useEmulator = (process.env.NODE_ENV == 'development');
// var useEmulator = true;
var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});
//var connector = new builder.ConsoleConnector().listen();  // 使用控制台进行测试
var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));
// 将上一个问题的结果保存下来，对不同的conversionid进行存储
// 设置定时器，对每个conversionid加一个活跃度，每个一个小时加一，设置一个检查其活跃度的定时器，若10个小时不活跃，清除该用户上下午信息
// 可以对id进行处理，比如添加一些头，从而设置不同活跃度权重，默认以socketid作为conversionid

//var sl = require("./syncLuis.js");
var dataset = myio.readNewData();
var userInfo = new Array();
var ga = require("./getAnswer.js");
bot.dialog('/', [
    function (session) {
        var question = session.message.text;
        var userId = session.message.user.id;
        if(userInfo[userId]==undefined) userInfo[userId] = new Array();
        var question_temp = question.split("#");
        userInfo[userId]['speakerName']='未知';
        if(question_temp.length>1){
            if(question_temp[1]!='未知'){
                userInfo[userId]['speakerName'] = question_temp[1];
            }
        }
        question = question_temp[0];
        var q_type = question.substring(0,4);
        if(q_type=='card'){
            for(var i=0;i<cards.cardsName.length;i++){
                 if(cards.cardsName[i]=='cardBing') continue;
                 var msg = cards.createCards[cards.cardsName[i]](session); 
                 session.send(msg);
            }
            return;
        }
        if(q_type=='demo'){
            QBH.askQnAMakerDemo(question,function(answers){
                var answer = answers[0].answer;
                if(answer=='No good match found in the KB')
                {
                     QBH.askBing(question,function(webPages){
                        var msg = cards.createCards["cardBing"](session,webPages); 
                        session.send(msg);
                     });
                    return
                }
                console.log(answer)
                 if(cards.isCard(answer)){
                        var msg = cards.createCards[answer](session); 
                        session.send(msg);
                 }else if(answer=='From:上海交通大学闵行校区李政道图书馆;To:上海交通大学闵行校区软件学院'){
                    session.send(answer);
                    session.send('软件学院与李政道图书馆距离较远，建议乘坐校车！');
                 }else if(answer=='我不知道'){
                     session.send(answer);
                     QBH.askBing(question,function(webPages){
                        var msg = cards.createCards["cardBing"](session,webPages); 
                        session.send(msg);
                     });
                 }else{
                     session.send(answer);
                 }
            });
            return;
        }
        if(ga.isHalfPhase(userInfo[userId]['PromptStatus'])){    //如果当前处于一半处问答
            var qentitiesold = userInfo[userId]['LastEntities'];
            var qrelation = userInfo[userId]['LastRelation'];
            var PromptStatus = userInfo[userId]['PromptStatus'];
            ga.getHalfAnswer(question,qentitiesold,qrelation,PromptStatus,
            function(answer){
                //问课程的回掉
                session.send(answer)
            },
            function(answer){
                //问路程的回掉
                session.send(answer)
            });

            userInfo[userId]['PromptStatus'] = 'Complete';
            userInfo[userId]['LastRelation'] = '';
            userInfo[userId]['LastEntities'] = '';

        }else{
             ga.getAnswer(question,dataset,
                function(answer,qentities){
                    if(answer == 'LackInfoPath'){

                        userInfo[userId]['PromptStatus'] = 'PathHalf';
                        userInfo[userId]['LastEntities'] = qentities;
                        session.send('please complete your Path info~');
                    }else{
                         session.send(answer);
                    }
                },
                function(answer,qentities){
                    // var answer = "cardShuttle";
                    if(cards.isCard(answer)){
                        var msg = cards.createCards[answer](session);  // 返回card生成的msg
                        session.send(msg);
                    }else if(answer == 'i dont know'){
                        QBH.askBing(question,function(webPages){
                            var msg = cards.createCards["cardBing"](session,webPages); 
                            session.send(msg);
                        });                  
                    }else{
                        session.send(answer);
                    }
                    // userInfo[userId]['LastAnswer'] = answer;
                    // userInfo[userId]['PromptStatus'] = 'LessonHalf';
                    // userInfo[userId]['LastEntities'] = qentities;
                },
                function(answer,qentities,qrelation){
                    //AskLessonCallBack
                    console.log(answer,qentities,qrelation);
                    if(answer == 'LackInfoLesson'){
                        userInfo[userId]['PromptStatus'] = 'LessonHalf';
                        userInfo[userId]['LastEntities'] = qentities;
                        userInfo[userId]['LastRelation'] = qrelation;
                        session.send('please complete your lesson info~');
                    }else{
                        session.send(answer);
                    }
                },
                function(answer){
                    session.send(answer);
                }
            );
        }
       
    }
]);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}





// function deleteSJTU(entities,intent){
//     if(intent == 'AskIf'){
//         if(entities.length>=3) return myutils.removeSJTU(entities);
//         else return entities;
//     }else{
//         if(entities.length>=2)  return myutils.removeSJTU(entities);
//         else return entities;
//     }
// }

// function saveUserInfo(userId,question){
//     userInfo[userId]['question'] = question;
// }



