var fs = require('fs');  

module.exports = {
	unique:function(array){
		var n = []; //用n来存放entity
		var res = [];
		for(var i = 0; i < array.length; i++){
		    if (n.indexOf(array[i][0]) == -1){
		    	n.push(array[i][0]);
		    	res.push(array[i]);
		    } 
		}
		return res;
	},
	process:function(lastentity,lastrelation,qrelations,qentities,qdescriptions,intent,dataset,originalquestion){
		//使用函数时 qentities请按句子中的Index排序
		// if(qentities.length==0) qentities.push([lastentity,-1,-1]);
		//将上一次entity作为一个
		if(lastentity!='') qentities.push([lastentity,-1,-1]); 
		if(lastrelation!='') qrelations.push([lastrelation,-1,-1]);
		var answer;
		if(intent == 'AskIf'){
			answer = false;
			var all = qentities.concat(qrelations);
			var puredes=[];
			for(var i in qdescriptions){
				if(this.indexOfArray(qdescriptions[i],all)==-1) puredes.push(qdescriptions[i]);
			}
			qentities = this.disIndex(qentities); puredes = this.disIndex(puredes);
			qrelations = this.disIndex(qrelations);
			//console.log('pudre'+puredes);
			for(var i in dataset){
				var kb = dataset[i];
				//找到所有单描述的
				var tags = kb[3];
				if(qentities.length==1){
					if((qentities[0]==kb[0] || qentities[0]==kb[2]) && this.isChildSet(puredes,tags)){
						answer = true;
						break;
					}
				}else{
					if(qrelations.length==0){
						if(qentities.indexOf(kb[0])!=-1 && qentities.indexOf(kb[2])!=-1 && this.isChildSet(puredes,tags)){
							answer= true;
							break;
						} 
					}else{
						if(qentities.indexOf(kb[0])!=-1 && qentities.indexOf(kb[2])!=-1 && this.isChildSet(puredes,tags) && qrelations.indexOf(kb[1])!=-1){
							answer= true;
							break;
						} 
					}
				}			
			}

			//第二种判别if的方法
			// singleBestPair = this.getOneLogicBestPair(qentities,qrelations,puredes,dataset);
			// if(singleBestPair!=undefined && singleBestPair[1]!=-1){
			// 	if(qentities.indexOf(singleBestPair[0])!=-1){
					
			// 		answer=true;
			// 	}
			// }
			if(originalquestion.indexOf('有')>=0) return answer ? '有' : '没有';
			if(originalquestion.indexOf('对')>=0) return answer ? '对' : '不对';
			return answer ? '是' : '不是';
			

		}else{   //对于AskWhat
			answer = 'i dont know';
			var notDesRelations = [];
			for(var i in qrelations){
				if(this.indexOfArray(qrelations[i],qdescriptions)==-1) notDesRelations.push(qrelations[i]);
			}
			// console.log(notDesRelations);
			//若某关系不作为description，那么此关系一定更优
			var singleBestPair;
			if(notDesRelations.length!=0){			
				singleBestPair = this.getOneLogicBestPair(this.disIndex(qentities),this.disIndex(notDesRelations),this.disIndex(qdescriptions),dataset);
			}else{
				singleBestPair = this.getOneLogicBestPair(this.disIndex(qentities),this.disIndex(qrelations),this.disIndex(qdescriptions),dataset);
			}
			//console.log('singleBestPair= '+singleBestPair)
			if(singleBestPair == undefined) return 'i dont know';
			//console.log('singlebest= '+singleBestPair);
			//若存在复合逻辑
			var doubleBestPair = [];
			if(qrelations.length<2){
				return singleBestPair==undefined ? 'i dont know' : singleBestPair[0];
			}else{
				var answ1 = this.getOneLogicBestPair(this.disIndex(qentities),this.disIndex(qrelations),this.disIndex(qdescriptions),dataset);
				if(answ1 != undefined && answ1[1]!=-1){
					var usedEntity = answ1[2];	//console.log('usedEntity= '+usedEntity);
					var usedRelation = answ1[3]; //console.log('usedRelation= '+usedRelation);
					var usedDescription = answ1[4]; //console.log('usedDescription= '+usedDescription);
					var usedAll = usedDescription; usedAll.push(usedEntity); usedAll.push(usedRelation);
					//console.log('usedAll= '+usedAll);
					var qrelations = this.disIndex(qrelations);
					qrelations = this.reomve12(usedAll,qrelations);
					var qdescriptions = this.disIndex(qdescriptions); qdescriptions = this.reomve12(usedAll,qdescriptions);
					//console.log('double= '+qrelations);
					var answ2 = this.getOneLogicBestPair([answ1[0]],qrelations,qdescriptions,dataset);
					//console.log('answ2: '+answ2);
					if(answ2!=undefined && answ2[1]!=-1) doubleBestPair = answ2;
				}
			}
			//console.log('doublebest= '+doubleBestPair);
			if(doubleBestPair==undefined || doubleBestPair.length == 0 || doubleBestPair[1]==-1){
				if(singleBestPair[1]==-1) return 'i dont know';
				// console.log(singleBestPair);
				else return singleBestPair[0];
			}
			else{
				console.log('二重逻辑works');
				return doubleBestPair[0];	
				
			} 
		}
		//return answer;
	},
	getDescriptionScore:function(qdescriptions,tags,qrelation){
		var score=0;
		var descriptions=[];
		if(tags!=undefined){
			if(tags.indexOf('默认')>=0) score+=0.5;
			if(qrelation == '数量' && score>=0.5) score-=0.55;
		}
		for (i in qdescriptions){
			if(tags!=undefined){
				if(tags.indexOf(qdescriptions[i])>=0){
					score+=1;
					descriptions.push(qdescriptions[i]);
				}
			}
		}
		return [score,descriptions];
	},
	getSingleTripleScore:function(qentity,qrelation,qdescriptions,dataset){
		//若未找到 返回maxscore=0
		var res = [];
		var maxanswernum=0;
		var maxscore=-1;
		var argmaxdes=[];
		for(var i in dataset){
	        var kb = dataset[i];
	        tags = kb[3];   //对于新版本 kb[3]已经为数组 现在有时候会没定义
			if(qentity == kb[0] && qrelation == kb[1]){ //匹配到了起始entity与relationship相同的      		
				var score = this.getDescriptionScore(qdescriptions,tags,qrelation)[0];
				var descriptions = this.getDescriptionScore(qdescriptions,tags,qrelation)[1];
					// console.log('该行知识得分: '+score);
				if(score>maxscore){
						maxscore = score; maxanswernum = i;argmaxdes=descriptions;
				}
			}	
        }
       	var answer = dataset[maxanswernum][2];
       	if(maxscore==-1){
			   
       		res.push('i dont know');res.push(maxscore);
       	}else res.push(answer);res.push(maxscore);res.push(qentity);res.push(qrelation);res.push(argmaxdes);
       	return res;
	},
	disIndex:function(array){
		res = [];
		for(var i in array){
			res.push(array[i][0]);
		}
		return res;
	},
	getDisOneIndexArray:function(si,ei,array){
		res = [];
		for(var i in array){
			if(!(array[i][1]==si && array[i][2]==ei)) res.push(array[i]);
		}
		return res;
	},
	indexOfArray:function(ele,array){
		for(var i in array){
			if(ele[0] == array[i][0] && ele[1] == array[i][1] && ele[2] == array[i][2]) return i;
		}
		return -1;
	},
	getCommon:function(arr1,arr2){
		var res = [];
		for(i in arr1){
			if(indexOfArray(arr1[1],arr2)!=-1) res.push(arr1[i]);
		}
		if(res.length!=0) return false;
		return res;
	},
	getMaxPair:function(array){
		var v = [];
		for(var i in array){
			v.push(array[i][1]);
		}
		var index = v.indexOf(Math.max.apply(null,v));
		return array[index];
	},
	getOneLogicBestPair:function(entities,relations,descriptions,dataset){
		var respair = [];
		for(var i in relations){
			for(var j in entities){
				respair.push(this.getSingleTripleScore(entities[j],relations[i],descriptions,dataset));
			}
		}
		return this.getMaxPair(respair);
	},
	removeSmallEntity:function(entities,all){
		var res = [];
		for(var i in entities){
			var tag = true;
			for(var j in all){
				// if(i==j) continue;
				if(parseInt(entities[i][1])>=parseInt(all[j][1]) && parseInt(entities[i][2])<parseInt(all[j][2])) tag=false;
				if(parseInt(entities[i][1])>parseInt(all[j][1]) && parseInt(entities[i][2])<=parseInt(all[j][2])) tag=false;
			}
			if(tag){
				res.push(entities[i]);
			}
		}
		return res;
	},
	saveFile:function(data,path){
		// data+='\r\n';
		fs.appendFile(path,data,'utf8',function(err){  
		    if(err)  
		    {  
		        console.log(err);  
		    }  
		});  
	},
	isChildSet:function(set1,set2){
		for(var i in set1){
			if(set2.indexOf(set1[i])==-1) return false;
		}
		return true;
	},
	colleges:['计算机科学与工程系','船舶海洋与建筑工程学院','机械与动力工程学院','电子信息与电气工程学院','材料科学与工程学院','环境科学与工程学院','生物医学工程学院','航空航天学院','数学科学学院','物理与天文学院','化学化工学院','致远学院','生命科学技术学院','农业与生物学院','医学院','药学院','安泰经济与管理学院','凯原法学院','外国语学院','人文学院','马克思主义学院','国际与公共事务学院','媒体与设计学院','体育系','上海交通大学上海高级金融学院','上海交大密西根学院','上海交大-巴黎高科卓越工程师学院','上海交大-南加州大学文化创意产业学院','中欧国际工商学院',
],
	removeSJTU:function(array){
		var res = [];
		var tag = false;
		for(var i in array){
			if(this.colleges.indexOf(array[i][0])!=-1){
				tag = true;break;
			}
		}
		if(tag){
			for(var i in array){
				if(array[i][0]!='上海交通大学') res.push(array[i]);
			}
		}
		if(tag) return res;
		else return array;
	},
	reomve12:function(arr1,arr2){
		var res = [];
		for(var i in arr2){
			if(arr1.indexOf(arr2[i])==-1) res.push(arr2[i]);
		}
		return res;
	}	
	
}
