var express=require('express');
var cheerio=require('cheerio');
var superagent=require('superagent');
var eventproxy=require('eventproxy');
var fs=require('fs');

var app=express();
var ep=eventproxy();

var moviePages=[];//存放电影页面url
var movieAs=[];//存放各个电影页面链接
var movieInfos=[];//存放各电影信息

var jsonData={};//要写入文件的json数据

moviePages[0]='https://movie.douban.com/top250';
for(var i=1;i<10;i++){
	moviePages[i]='https://movie.douban.com/top250'+'?start='+25*i+'&filter=';
}

app.listen(3000,()=>{
	console.log('Listening to port 3000……');
})

app.get('/',function(req,res){
	for(var i=0;i<10;i++){
		superagent.get(moviePages[i]).end(function(err,sres){
			if(err){
				console.log('There is an error when asking for top250');
			}
			var $=cheerio.load(sres.text,{decodeEntitle:false});
			$('.hd').each(function(index,element){
				var thisHref=$(element).find('a').first().attr('href');
				movieAs.push(thisHref);
			})
			ep.emit('allMovies');
		});
	}
	ep.after('allMovies',moviePages.length,function(){
//		res.send(movieAs);
		askForInfo();
	});
	ep.after('allInfos',250,function(){
		writeIntoFs();
		res.send(movieInfos);
	});
})

var UTFTranslate = {
	Change:function(pValue){
		return pValue.replace(/[^\u0000-\u00FF]/g,function($0){return escape($0).replace(/(%u)(\w{4})/gi,"&#x$2;")});
	},
	ReChange:function(pValue){
		return unescape(pValue.replace(/&#x/g,'%u').replace(/\\u/g,'%u').replace(/;/g,''));
	}
};

function askForInfo(){
	for(var i=0;i<250;i++){
		superagent.get(movieAs[i]).end(function(err,sres){
			if(err){
				console.log('There is an error when asking for'+movieAs[i]);
			}
			var $=cheerio.load(sres.text,{decodeEntitle:false});
			var movieName=UTFTranslate.ReChange($('h1').first().find('span').first().html());
			var movieStar=$('strong').first().html();
			var movieDate=[];
			var regexp1=/\d+/g;
			var spanPls=$('#info').find('.pl');
			for(var j=0;j<spanPls.length;j++){
				var theText=UTFTranslate.ReChange($('#info').find('.pl').eq(j).html());
				if(theText=='上映日期:'){
					var thisDate=UTFTranslate.ReChange($('#info').find('.pl').eq(j).next().html());
					movieDate=thisDate.match(regexp1);
					if(movieDate.length==1 && $('#info').find('.pl').eq(j).next().next()){
						thisDate=UTFTranslate.ReChange($('#info').find('.pl').eq(j).next().next().html());
						movieDate=thisDate.match(regexp1);
					}
				}
			}
			var info={
				name:movieName,
				star:movieStar,
				time:movieDate
			};
			movieInfos.push(info);
			ep.emit('allInfos');
		})
	}
}

function writeIntoFs(){
	jsonData.success=true;
	jsonData.data=movieInfos;
	jsonData=JSON.stringify(jsonData);
	console.log('开始写入……');
	fs.writeFileSync('top250.json',jsonData);
	console.log('写入完成!');
}
