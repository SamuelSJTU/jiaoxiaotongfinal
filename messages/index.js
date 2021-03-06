﻿/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://aka.ms/abs-node-waterfall
-----------------------------------------------------------------------------*/
"use strict";


var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var fs = require('fs');
var myutils = require('./myutils.js');
var luis = require('./luis_api.js');
var read = require('./read.js');
var fileoptions = {flag:'a'};
var dataset = read.readNewData();
var QBA = require("./QB_api.js");
var relationSet = ['职位','其他关系','学科','院长','校长','主任','党委职位','生活关系'];
var ParelationSet = ['书记'];
var useEmulator = (process.env.NODE_ENV == 'development');
console.log(useEmulator);
// var useEmulator = false
var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});
//var connector = new builder.ConsoleConnector().listen();  // 使用控制台进行测试
var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));
var lastentity = '';  //
var lastquestionentity = '';
var lastquestionrelation = '';
bot.dialog('/', [
    function (session) {
        var question = session.message.text;
        if(!question) question = '一个输入错误';  // 设置非空
        else SetAnswer(session,question);
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


function getClassRoom(question){
    if((question.indexOf('课')!=-1 && question.indexOf('教室')!=-1) 
        || (question.indexOf('课')!=-1 && question.indexOf('哪')!=-1)
        || (question.indexOf('哪里上')!=-1)){
        return '在东上院1'+parseInt(Math.random()*10+10);
    }
    else return false;
}

function SetAnswer(session,question){
    luis.askLuisType(question,function(data){
        var qintent = data.topScoringIntent==undefined  ? '' : data.topScoringIntent.intent;
        luis.askLuis(question,function(data){  // 自己定义回调处理json，类似这种方式
            //console.log(JSON.stringify(data));
            // lastentity = '林忠钦';
            fs.writeFileSync(path.join(__dirname, './log.txt'),question+'\r\n',fileoptions);
            // if(!getClassRoom(question){
            //     session.send(getClassRoom(question));
            //     return;
            // }
            var entities = data.entities;
            console.log('All Entities',entities);
            //其中的内容应包含两个 entity的值与前后index用于唯一标示
            var QuestionTriples = getQuestionTriples(entities);
            
            var qrelations = QuestionTriples[1];
            var qentities = QuestionTriples[0];
            var qdescriptions = QuestionTriples[2];

            qentities = myutils.unique(qentities); 
            qentities = deleteSJTU(qentities,qintent);
            // console.log('qe',qentities);
            if(qentities!=undefined && qentities[0]!=undefined &&　qentities[0][0]!=undefined) lastquestionentity = qentities;
            if(qrelations!=undefined && qrelations[0]!=undefined && qrelations[0][0]!=undefined) lastquestionrelation = qrelations[0][0];
            qrelations = myutils.unique(qrelations);
            qdescriptions = myutils.unique(qdescriptions);

            var qall = qentities.concat(qrelations).concat(qdescriptions);
            qentities = myutils.removeSmallEntity(qentities,qall);
            qrelations = myutils.removeSmallEntity(qrelations,qall);
            qdescriptions = myutils.removeSmallEntity(qdescriptions,qall);

            console.log('关系=',qrelations,'实体=',qentities,'描述=',qdescriptions,'意图=',qintent)
            console.log('All Entities',entities);
            QBA.askQnAMaker(question,function(argument) {
                // body...
                if(argument!="No good match found in the KB"){
                    session.send(argument);
                }
                else{
                    var answer = myutils.process('','',qrelations,qentities,qdescriptions,qintent,dataset,question);
                    if(answer == 'i dont know') answer = myutils.process(lastentity,'',qrelations,qentities,qdescriptions,qintent,dataset); //最开始的问法
                    if(answer == 'i dont know'){
                        qentities = qentities.concat(lastquestionentity);
                        qentities = deleteSJTU(qentities);
                        answer = myutils.process('',lastquestionrelation,qrelations,qentities,qdescriptions,qintent,dataset); //若把上次的实体全部加入
                    } 
                    if(answer == 'i dont know') answer = myutils.process('上海交通大学','',qrelations,qentities,qdescriptions,qintent,dataset);
                    var prelation = getParentRelation(entities);
                    if(answer == 'i dont know' && prelation!="") answer = myutils.process('',prelation,qrelations,qentities,qdescriptions,qintent,dataset);
                    
                    session.send(answer);
                    if(answer == '是' || answer == '不是'){
                        lastentity = qentities[0][0];
                    }else if(answer == ''){
                        lastentity = '';
                    }else{
                        lastentity = answer;
                    }
                    console.log('answer= '+ answer);
                }
                });
            // fs.writeFileSync(respath,no+'\t'+answer+'\t'+question+'\t'+trueanswer+'\t'+'\r\n',fileoptions);
            // fs.writeFileSync('./entities.txt',no+'\t'+qdescriptions.toString()+'\r\n',fileoptions);
            // session.send(answer);
        });
    });
    
}
function deleteSJTU(entities,intent){
    if(intent == 'AskIf'){
        if(entities.length>=3) return myutils.removeSJTU(entities);
        else return entities;
    }else{
        if(entities.length>=2)  return myutils.removeSJTU(entities);
        else return entities;
    }

}

function getQuestionTriples(entities){
		var qrelations = new Array();
		var qentities = new Array();
		var qdescriptions = new Array();
		for(var i in entities){
			var entity = entities[i];
			var val = entity['resolution']['values']==undefined ? entity['resolution']['value'] : entity['resolution']['values'][0];
			var si = entity.startIndex;
			var ei = entity.endIndex;
			if(relationSet.indexOf(entity['type'])!=-1){
				qrelations.push([val,si,ei]);
			}else if(entity['type']=='其他定语' || entity['type']=='builtin.number'){
				qdescriptions.push([val,si,ei]);
			}else{
				qentities.push([val,si,ei]);
			}
		}
		qentities = myutils.unique(qentities); 
		qrelations = myutils.unique(qrelations);
		qdescriptions = myutils.unique(qdescriptions);
		return [qentities,qrelations,qdescriptions];
	}

function getParentRelation(entities){
    var res = [];
    for(var i in entities){
        var entity = entities[i];
		var val = entity['resolution']['values']==undefined ? entity['resolution']['value'] : entity['resolution']['values'][0];
        var prelation = entity.type;
        if(ParelationSet.indexOf(prelation)!=-1) return prelation;
    }
    return "";

}