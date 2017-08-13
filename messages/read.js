var rf = require("fs");
var path = require('path');
function getContent(string){
	var arr = string.split(":");
	if(arr.length>=2) return arr[arr.length-1];
	else return string;
}

module.exports = {
    readNewData:function(){
		var data = rf.readFileSync(path.join(__dirname, './newData.txt'),"utf-8");
		var datas = data.split("\n");
		for(var i in datas){
			datas[i] = datas[i].split("\t\t");
			for(var j in datas[i]){
				if(j == 3){
					datas[i][j] = datas[i][j].split("\t");
					for(var k in datas[i][j]){
						datas[i][j][k] = getContent(datas[i][j][k])
					}
				}else{
					datas[i][j] = getContent(datas[i][j]);
				}
			}
		}
		return datas;
	},
	write:function(data){
		rf.appendFile(path.join(__dirname, './log.txt'),data+'\r\n',function(err){
			if(err) console.log(path+'\t'+'Writing Fail...')
			else console.log(path+'\t'+'Writing Success...')
		})
	}
}