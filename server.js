const readline = require('readline');
var http=require("http");
var fs = require("fs");
var str;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Which json? ', (answer) => {
str=answer;
rl.close();

});
function onRequest(req,resp){
req.on("data",function(data){
//打印
console.log(decodeURIComponent(data));
});
//返回response
resp.writeHead(200,{"Content-Type":'text/plain','charset':'utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});
var whichFile=fs.readFileSync(str);
console.log("file data: "+whichFile);
resp.write(whichFile);    
//返回响应尾
resp.end();
}
//创建服务器
http.createServer(onRequest).listen(8431);