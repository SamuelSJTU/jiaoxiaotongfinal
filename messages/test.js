var relationSet = ['职位','其他关系','学科','院长','校长','主任','党委职位','生活关系'];
var ParelationSet = ['书记'];
var read = require('./read.js');
var luis = require('./luis_api.js');
var question = '交大有多少留学生';
var fs = require('fs');
var path = require('path');
var myutils = require('./myutils.js');
var dataset = read.readNewData();
var QBA = require('./QB_api.js');

var lastentity = '';  //
var lastquestionentity = '';
var lastquestionrelation = '';

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


var questions = ['总务处电话'];
for(var i in questions){
	read.write(questions[i]);
	read.write(": ");
	luis.askLuisType(questions[i],function(data){
        var qintent = data.topScoringIntent==undefined  ? '' : data.topScoringIntent.intent;
        luis.askLuis(questions[i],function(data){  // 自己定义回调处理json，类似这种方式
            //console.log(JSON.stringify(data));
            // lastentity = '林忠钦';
            // fs.writeFileSync(path.join(__dirname, './log.txt'),question+'\r\n',fileoptions);
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
            if(answer == 'i dont know'){
                QBA.askQnAMaker(question,function(argument) {
                // body...
                console.log('ans by QA:',argument);
                read.write('ans by QA:',argument);
                });
            }else{
                console.log('ans:',answer);
                read.write(answer);
            }
            if(answer == '是' || answer == '不是'){
                lastentity = qentities[0][0];
            }else if(answer == ''){
                lastentity = '';
            }else{
                lastentity = answer;
            }
            // console.log('answer= '+ answer);
            // fs.writeFileSync(respath,no+'\t'+answer+'\t'+question+'\t'+trueanswer+'\t'+'\r\n',fileoptions);
            // fs.writeFileSync('./entities.txt',no+'\t'+qdescriptions.toString()+'\r\n',fileoptions);
            // session.send(answer);

        });
    });
}
