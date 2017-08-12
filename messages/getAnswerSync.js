var lessonEntities = ['课程课程名','课程教师'];
//var myio = require('./myIO.js');
var myu2 = require('./myutils2.js');
var myu = require('./myutils.js');
//sy = require("./syncLuis.js");
//var question  = "人与室内环境连之伟教室在哪";
var relationSet = ['职位','其他关系','学科','院长','校长','主任','党委职位'];
//var dataset = myio.readNewData();
// console.log('answer',answer);

module.exports = {
	getMapFormat:function(start,end){
		var res = '';
		res+='From:';
		res+=start;
		res+=';';
		res+='To:';
		res+=end;
		return res;
	},
	getPlaceAnswer:function(entities){
		if(entities.length<2) return 'LackInfoPath';
		else return this.getMapFormat(entities[0],entities[1]);
	},
	getLessonFromQuestion:function(entities){
		qentities = new Array();
		qrelations = new Array();
		for(var i in entities){
			var entity = entities[i];
			// console.log(entity);
			var val = entity['resolution']['values'][0];
			if(entities[i].type == '课程关系') qrelations.push(val);
			else if(lessonEntities.indexOf(entity.type)!=-1){
				// console.log(entity.type)
				qentities.push(val);
			} 
		}
		return [qentities,qrelations];
	},
	getMapFromQuestion:function(entities){
		placeentities = new Array();
		for(var i in entities){
			var entity = entities[i];
			var val = entity['resolution']['values'][0];
			// placeentities.push(val);
			if(entities[i].type == '寻路地址') placeentities.push(val);
		}
		return placeentities;
	},
	getLessonAnswer:function(entities){
		// var res = sy.getIntentLuis(question);
		// var entities = res[0].entities;
		// console.log('status: '+res[1]);
		var qentities = this.getLessonFromQuestion(entities)[0];
		var qrelations = this.getLessonFromQuestion(entities)[1][0];
		console.log(qentities);console.log(qrelations);
		var answer = myu2.getAnswerLesson(qentities,qrelations);
		return answer;
	},
	getPathAnswer:function(entities){
		// var res = sy.getIntentLuis(question);
		// var entities = res[0].entities;
		var placeentities = this.getMapFromQuestion(entities);
		console.log(placeentities);
		var ans = this.getPlaceAnswer(placeentities);
		return ans;
	},
	getIntentAndEntities:function(question){
		var res = sy.getIntentLuis(question);
		var entities = res[0].entities;
		var intent = res[0].topScoringIntent==undefined  ? '' : res[0].topScoringIntent.intent;
		return [intent,entities];
	},
	getQuestionTriples:function(entities){
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
			}else if(entity['type']=='定语' || entity['type']=='builtin.number'){
				qdescriptions.push([val,si,ei]);
			}else{
				qentities.push([val,si,ei]);
			}
		}
		qentities = myu.unique(qentities); 
		qrelations = myu.unique(qrelations);
		qdescriptions = myu.unique(qdescriptions);
		return [qentities,qrelations,qdescriptions];
	},
	getInfoAnswer:function(intentType,entities,originalQues,lastentity,lastrelation){
		var questionTriple = this.getQuestionTriples(entities);
		var qentities = questionTriple[0];
		var qrelations = questionTriple[1];
		var qdescriptions = questionTriple[2];
		var answer = myu.process(lastentity,lastrelation,qrelations,qentities,qdescriptions,intentType,dataset,originalQues);
		return answer;
	}
}
