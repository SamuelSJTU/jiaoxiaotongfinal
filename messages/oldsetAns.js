// //此函数不需要了
// function SetAnswer(session,question,clientName){
//     luis.askLuis(question,function(data){  // 自己定义回调处理json，类似这种方式
//             //console.log(JSON.stringify(data));
//             // lastentity = '林忠钦';
//             fs.writeFileSync(path.join(__dirname, './log.txt'),question+'\r\n',fileoptions);
//             var entities = data.entities;
//             var qrelations = new Array();
//             var qentities = new Array();
//             var qdescriptions = new Array();
//             var qintent = data.topScoringIntent==undefined  ? '' : data.topScoringIntent.intent;
//             //其中的内容应包含两个 entity的值与前后index用于唯一标示
//             for(var i in entities){
//                 var entity = entities[i];
//                 var val = entity['resolution']['values']==undefined ? entity['resolution']['value'] : entity['resolution']['values'][0];
//                 var si = entity.startIndex;
//                 var ei = entity.endIndex;
//                 if(entity['type']=='关系'){
//                     qrelations.push([val,si,ei]);
//                 }else if(entity['type']=='定语' || entity['type']=='builtin.number'){
//                     qdescriptions.push([val,si,ei]);
//                 }else{
//                     qentities.push([val,si,ei]);
//                 }
//             }
//             qentities = myutils.unique(qentities); 
//             qentities = deleteSJTU(qentities,qintent);
//             console.log('qe',qentities);
//             if(qentities!=undefined && qentities[0]!=undefined &&　qentities[0][0]!=undefined) lastquestionentity = qentities;
//             if(qrelations!=undefined && qrelations[0]!=undefined && qrelations[0][0]!=undefined) lastquestionrelation = qrelations[0][0];
//             qrelations = myutils.unique(qrelations);
//             qdescriptions = myutils.unique(qdescriptions);

//             var qall = qentities.concat(qrelations).concat(qdescriptions);
//             qentities = myutils.removeSmallEntity(qentities,qall);
//             qrelations = myutils.removeSmallEntity(qrelations,qall);
//             qdescriptions = myutils.removeSmallEntity(qdescriptions,qall);

//             //console.log('关系=',qrelations,'实体=',qentities,'描述=',qdescriptions,'意图=',qintent,'last=',lastentity,'lastquestionentity=',lastquestionentity);
//             // console.log('实体=',qentities);
//             // console.log('描述=',qdescriptions);
//             // console.log('意图=',qintent);

//             var answer = myutils.process('','',qrelations,qentities,qdescriptions,qintent,dataset,question);
//             if(answer == 'i dont know') answer = myutils.process(lastentity,'',qrelations,qentities,qdescriptions,qintent,dataset); //最开始的问法
//             if(answer == 'i dont know'){
//                 qentities = qentities.concat(lastquestionentity);
//                 qentities = deleteSJTU(qentities);
//                 answer = myutils.process('',lastquestionrelation,qrelations,qentities,qdescriptions,qintent,dataset); //若把上次的实体全部加入
//             } 
//             if(answer == 'i dont know') answer = myutils.process('上海交通大学','',qrelations,qentities,qdescriptions,qintent,dataset);
//             if(answer == '是' || answer == '不是'){
//                 if(qentities.length>0)
//                     lastentity = qentities[0][0];
//             }else if(answer == ''){
//                 lastentity = '';
//             }else{
//                 lastentity = answer;
//             }
//             console.log('answer= '+ answer);
//             // fs.writeFileSync(respath,no+'\t'+answer+'\t'+question+'\t'+trueanswer+'\t'+'\r\n',fileoptions);
//             // fs.writeFileSync('./entities.txt',no+'\t'+qdescriptions.toString()+'\r\n',fileoptions);

//             var lastObj = {
//                 'lastentity':lastentity,
//                 'lastquestionentity':lastquestionentity,
//                 'lastquestionrelation':lastquestionrelation
//             };

//             lastDict[clientName] = lastObj;

//             session.send(answer);
//         });
// }

// bot.dialog('/', [
//     function (session) {
//         // for(var i=0;i<cards.cardsName.length;i++){
//         //     var msg = cards.createCards[cards.cardsName[i]](session);  // 返回card生成的msg
//         //     session.send(msg);
//         // }
//         var question = session.message.text;
//         // console.log(question);
//         // if(question=='test'){
//         //     session.send('带我去');
//         //     return;
//         // }
//         // // session.send(session.message.user.id + " " + session.message.user.name);
//         // var name = session.message.user.name;
//         // // 将conversionid传入，从而得到上一个人的上下文,刷新用户活跃度
//         // if(lastDict.hasOwnProperty(name)){
//         //     lastentity = lastDict[name].lastentity;
//         //     lastquestionentity = lastDict[name].lastquestionentity;
//         //     lastquestionrelation = lastDict[name].lastquestionrelation;
//         //     dictActivity[name] = 0;
//         // } else{
//         //     lastentity = '';  
//         //     lastquestionentity = '';
//         //     lastquestionrelation = '';
//         //     dictActivity[name] = 0;
//         // }
//         if(!question) question = '一个输入错误';  // 设置非空
//         else{
//             getAnswer(question,dataset,session);
//             //SetAnswer(session,question,name);
//             // getAnswer(question,dataset,function(intent,start,end){
//             //     session.send(start);
//             // },function(answer,qrelations,qentities,qdescriptions,qintent){
//             //     console.log('获取上一个的qlastentity',lastquestionentity);
//             //     if(qentities!=undefined && qentities[0]!=undefined &&　qentities[0][0]!=undefined) lastquestionentity = qentities;
//             //     if(qrelations!=undefined && qrelations[0]!=undefined && qrelations[0][0]!=undefined) lastquestionrelation = qrelations[0][0];  //保存上一个问题中的entity
//             //     if(answer == 'i dont know') answer = myutils.process(lastentity,'',qrelations,qentities,qdescriptions,qintent,dataset); //如果根据这次的信息得不到答案 使用复合问法
//             //     if(answer == 'i dont know'){
//             //         qentities = qentities.concat(lastquestionentity);
//             //         qentities = deleteSJTU(qentities);
//             //         answer = myutils.process('',lastquestionrelation,qrelations,qentities,qdescriptions,qintent,dataset); //若把上次的实体全部加入
//             //     } 
//             //     if(answer == 'i dont know') answer = myutils.process('上海交通大学','',qrelations,qentities,qdescriptions,qintent,dataset);
//             //     lastentity = answer;  
//             //     console.log('传给下一个的lastentity',lastentity);
//             //     session.send(answer);
                
//             //     // var lastObj = {
//             //     //     'lastentity':lastentity,
//             //     //     'lastquestionentity':lastquestionentity,
//             //     //     'lastquestionrelation':lastquestionrelation
//             //     // };
//             //     // console.log(lastObj);
//             //     // lastDict[clientName] = lastObj;
//             // });
//         }
//     }
// ]);


// for(var i=0;i<answers.length;i++){
// 							console.log('answer: ',answers[i].answer);
// 							console.log('questions:', answers[i].questions);
// 							console.log('score: ',answers[i].score);
// 						}