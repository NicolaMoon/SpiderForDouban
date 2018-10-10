@[TOC](豆瓣Top250排行榜数据爬取)

## 先言


上课老师提议我们去用python等去做个爬虫，爬取下知乎的信息。权衡了一下，不想要再去费时间学python了，就拿Node来做了，顺便练一下Node。而在爬取的信息上，选择了爬取豆瓣的Top250排行，准备分析12个月份里高分电影的分布，虽然数据量可能不高，可是还是有些实际意义的。
Node爬虫的知识，先是在《Node.js包教不包会》上看了lesson3，虽然很短，不过看完了之后入门还是OK的，接下来就是自己来稍微深入学一下了。
总的来讲，爬虫就是依靠发起http请求，并将获取到的页面代码进行分析，取出自己想要的信息。通过Node来做的时候，有一些模块可以起到很便捷的作用：

 1. **Express** 
封装好的方法可以让我们很方便的搭建一个简易的服务器，不过这个并不必要，原生的Node也可以较快的做到；
 2. **Superagent** 
http请求及响应模块，还是十分好用的，虽然同样可以用原生Node来做到，不过还是不要重复造轮子嘛；
 3. **Cheerio** 
这个就特别重要了。当取到页面的html代码时，分析过程是很复杂的，可是这个模块允许我们使用JQuery的方式去分析，链式操作也很便捷，有种在操作前端的感觉。
 4. **Eventproxy** 
这个模块是做并发控制的。我做的过程中，也没有用到什么其他功能，只是作为一个异步完成的计数器而已。

主要也就是这几个模块，如果需要将读取到的数据存入到文件或者数据库的话，就要引入fs或者其他模块了，可是我也只是在页面上先展示了一下，尚未需要这些，后续准备用LayUi展示数据，顺便练下LayUi的各种图形UI，到时候再补上吧。

## 步骤

### 1. 引入模块
 首先也就是各种模块的引入了，也没有什么问题：
 

```javascript
var express=require('express');
var cheerio=require('cheerio');
var superagent=require('superagent');
var eventproxy=require('eventproxy');
	
var app=express();
var ep=eventproxy();
```
 ### 2. 全局变量
 然后设立全局变量进行数据存储：
 

```javascript
var moviePages=[];//存放电影页面url
var movieAs=[];//存放各个电影页面链接
var movieInfos=[];//存放各电影信息
```
	
### 3. 搭建服务器
 首先搭建简易的服务器来展示获取的数据，直接调用express的一些方法，对3000端口进行get方法的响应：
 

```javascript
app.get('/',function(req,res){
	//响应的执行代码
	……
});
//监听3000端口
app.listen(3000,()=>{
	console.log('Listening to port 3000……');
})
```

### 4. 存取页面url
电影页面的url，分析页面可以得知，250个数据，总共有十张页面，除去第一张页面的url为：
https://movie.douban.com/top250
其余页面的url满足：
https://movie.douban.com/top250?start=25*i&filter=
将所有页面url存入moviePages数组以待调用。
在Top250页面里面，我们能够获取到的数据太少，只有电影名以及简介，很多类似上映具体时间，主演等等信息要等点开之后的页面才能得到，所以要先将250个电影的链接分别获取并存取到movieAs里面，再进入各个页面进行信息的获取。
### 5. 获取页面
通过sugeragent获取到页面的代码：
 ```javascript
for(var i=0;i<10;i++){
superagent.get(moviePages[i]).end(function(err,sres){
	if(err){
		console.log('There is an error when asking for top250');
	}
//将获取到的页面代码赋给$，使你可以通过JQ来操作，decodeEntitle为了避免获取乱码
	var $=cheerio.load(sres.text,{decodeEntitle:false});
	……
	});
}
```
### 6. 分析页面代码
分析页面代码可得：
![页面代码分析](https://raw.githubusercontent.com/NicolaMoon/SpiderForDouban/master/%E9%93%BE%E6%8E%A5%E4%BD%8D%E7%BD%AE.png)
 可看出，所有页面的链接都在class为hd的div内的第一个a标签里面，通过cheerio来得到并push进movieAs：
```JavaScript
$('.hd').each(function(index,element){
	var thisHref=$(element).find('a').first().attr('href');
	movieAs.push(thisHref);
})
```
### 7. 异步处理
如果只是将这些放在get的响应里面，直接就加上res.send()，会出现一个问题，就是当进行响应的时候会直接调用最后的send()，然后就会将响应关闭，当异步的请求进行响应的时候，就会出现error:
Error: Can't set headers after they are sent.
这个错误意思就是说，响应头重复了，已经被输出了。
我采用的解决办法就是使用eventproxy的计数器进行控制，只有当十次页面都完成了之后才会进行下一步。
这里用到了ep.after()，以及ep.emit()
```JavaScript
ep.after('allMovies',moviePages.length,function(){
//	res.send(movieAs);
	askForInfo();
});
```
这段代码的意思就是起到一个计数作用，只有当被触发的次数达到了moviePages.length次的时候，才会调用内部代码。
而
```JavaScript
ep.emit('allMovies');
```
放在for循环之中，每次执行这句代码，就是对ep.after对应参数的一次触发。
### 8. 结果
具体的就是这样，这些执行完毕能够将各个电影的链接存入movieAs数组，然后，在askForInfo函数里面对这些链接分别进行页面分析，得到自己想要的信息，我将每个电影的名字，评分，以及上映日期进行了爬取：
![爬取的结果](https://raw.githubusercontent.com/NicolaMoon/SpiderForDouban/master/%E7%88%AC%E5%8F%96%E5%88%B0%E7%9A%84%E6%95%B0%E6%8D%AE.png)

## 全部代码

```javascript
var express=require('express');
var cheerio=require('cheerio');
var superagent=require('superagent');
var eventproxy=require('eventproxy');

var app=express();
var ep=eventproxy();

var moviePages=[];//存放电影页面url
var movieAs=[];//存放各个电影页面链接
var movieInfos=[];//存放各电影信息

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
		res.send(movieInfos);
	});
})
//将中文utf-8字符转换为汉字
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

```

## 后记
为了数据保存，又补了一些文件保存代码，倒是没有什么难度，就是在同步异步上遇到点麻烦，最棘手的其实是豆瓣的反爬虫机制，测试的时候总是被封了ip，来来回回换了好几个……

```javascript
//在res.send()前调用一下这个方法就好（要引入下fs模块）
function writeIntoFs(){
	jsonData.success=true;
	jsonData.data=movieInfos;
	jsonData=JSON.stringify(jsonData);
	console.log('开始写入……');
	fs.writeFileSync('top250.json',jsonData);
	console.log('写入完成!');
}
```

