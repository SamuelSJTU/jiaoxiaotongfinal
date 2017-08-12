var rf = require("fs");
var path = require('path');

function getContent(string){
	var arr = string.split(":");
	if(arr.length>=2) return arr[arr.length-1];
	else return string;
}
module.exports = {
	readData:function(){
		var data = rf.readFileSync(path.join(__dirname, './testlessonData.txt'),"utf-8");
		var datas = data.split("\r\n");
		for(var i=0;i<datas.length;i++){
			datas[i]=datas[i].split("\t");
		}
		return datas;
	},
	readNewData:function(){
		var data = rf.readFileSync(path.join(__dirname, './newData.txt'),"utf-8");
		var datas = data.split("\r\n");
		for(var i in datas){
			datas[i] = datas[i].split("\t\t");
			for(var j in datas[i]){
				if(j == datas[i].length-1){
					datas[i][j] = datas[i][j].split("\t");
					for(var k in datas[i][j]){
						datas[i][j][k] = getContent(datas[i][j][k])
					}
				}else{
					datas[i][j] = getContent(datas[i][j]);
				}
			}
		}
		return datas
	},
	readPlace:function(){
		var data = rf.readFileSync(path.join(__dirname, './place.txt'),"utf-8");
		var datas = data.split("\r\n");
		//console.log(datas);
		return datas;
	},
	read:function(path){
		var data = rf.readFileSync(path,"utf-8");
		//var datas = data.split("\r\n");
		//console.log(datas);
		return data;
	},
	write:function(path,data){
		rf.writeFile(path,data,function(err){
			if(err) console.log(path+'\t'+'Writing Fail...')
			else console.log(path+'\t'+'Writing Success...')
		})
	},
	readLessonData:function(){
		var data = rf.readFileSync(path.join(__dirname, './testlessonData.txt'),"utf-8");
		var datas = data.split("\r\n");
		for(var i in datas){
			datas[i] = datas[i].split('\t\t');
			for(var j in data){
				if(j==0){
					datas[i][j] = datas[i][j].split('\t');
				}
			}
		}
		return datas;
	}
	
}