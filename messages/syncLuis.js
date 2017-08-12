var request = require('urllib-sync');
var querystring = require('querystring');
var TypeApi = 'https://southeastasia.api.cognitive.microsoft.com/luis/v2.0/apps/0b51b9e7-2200-40c5-9a7d-d644b430364e?subscription-key=fc7f3816353045959d517198742e11e3&timezoneOffset=0&verbose=true&q=';
var IntentApi = 'https://southeastasia.api.cognitive.microsoft.com/luis/v2.0/apps/50e3e9d8-ab3c-4438-b27c-c88b4949ecef?subscription-key=fc7f3816353045959d517198742e11e3&timezoneOffset=0&verbose=true&q=';

module.exports = {
	getTypeLuis:function(question){
		return this.getRes(TypeApi,question)
	},
	getIntentLuis:function(question){
		return this.getRes(IntentApi,question)
	},
	getRes:function(Api,question) {
	// body...
		var Encodequestion = querystring.escape(question);
		var res = request.request(Api+Encodequestion);
		var buf = res.data;
		var content = JSON.parse(buf.toString("utf-8",0,buf.length));
		return [content,res.status]
	}
}
 


