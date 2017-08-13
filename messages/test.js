var ra = require("./read.js");
var data = ra.readNewData();
var la = require("./luis_api.js");
la.askLuisType('张杰是交大校长吗',function(data){
    console.log(data);
});