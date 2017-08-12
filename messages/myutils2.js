var myio = require('./myIO.js');
var lessondata = myio.readLessonData();
var mapdata = myio.readPlace();
function isLessonEntity2(data,entities,relation){
	datarelation = data[1];
	datae1 = data[0][0];
	datae2 = data[0][1];
	if((entities[0]==datae1 && entities[1]==datae2 && relation==datarelation) || (entities[0]==datae2 && entities[1]==datae1 && relation==datarelation)) return true;
	else return false;
}


module.exports = {
	getAnswerLesson:function(entities,relation){
		if(relation == '教师' || relation == '开课院系'){
			for(var i in lessondata){
				if(lessondata[i][0] == entities[0] && lessondata[i][1] == entities[1]) return lessondata[i][2];
			}
		}else{
			if(entities.length<2) return 'LackInfoLesson';
			else{
				for(var i in lessondata){
					data = lessondata[i];
					if(isLessonEntity2(data,entities,relation)==true) return data[2];
				}
			}
		}
		return 'i dont know';
	}


}