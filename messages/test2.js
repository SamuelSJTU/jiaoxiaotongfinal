// var question = session.message.text;
// var useId = session.message.user.id;
var ga = require("./getAnswer.js");
var myio = require("./myIO.js");
var question = "机器学习的老师是谁";
var userId = '123';
var userInfo = new Array();
var dataset = myio.readNewData();
if(userInfo[userId]!=undefined){
    console.log('last answer'+userInfo[userId]['answer']);
}
else{
    console.log('last answer undefined');
}
ga.getAnswer(question,dataset,function(intent,start,end){

        },function(answer){
            console.log(answer);
            userInfo[userId] = new Array();
            userInfo[userId]['answer'] = answer;
        },function(answer){
        	console.log('LessonAnswer',answer);
        	userInfo[userId] = new Array();
        	userInfo[userId]['answer'] = answer;
		});

// setTimeout(function(){console.log('byInterval',userInfo[userId]['answer'])},5000);