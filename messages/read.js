module.exports = {
	read:function(){
		var fs = require("fs");
		var path = require("path");
		var data = fs.readFileSync(path.join(__dirname, './data.txt'),"utf-8");
		datas = data.split("\r\n");
		for(var i=0;i<datas.length;i++){
			datas[i]=datas[i].split("\t");
		}
		return datas;
	}
	
}