// var QBA = require("./QB_api.js");
// QBA.askQnAMaker('讲个笑话',function(argument) {
// 	// body...
// 	console.log(argument);
// })
function getClassRoom(question){
	if((question.indexOf('课')!=-1 && question.indexOf('教室')!=-1) 
		|| (question.indexOf('课')!=-1 && question.indexOf('哪')!=-1)
		|| (question.indexOf('哪里上')!=-1)){
		console.log('在东上院1'+parseInt(Math.random()*10+10));
	}
}

getClassRoom('交大校长是谁');

