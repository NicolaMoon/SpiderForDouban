@[TOC](����Top250���а�������ȡ)

## ����


�Ͽ���ʦ��������ȥ��python��ȥ�������棬��ȡ��֪������Ϣ��Ȩ����һ�£�����Ҫ��ȥ��ʱ��ѧpython�ˣ�����Node�����ˣ�˳����һ��Node��������ȡ����Ϣ�ϣ�ѡ������ȡ�����Top250���У�׼������12���·���߷ֵ�Ӱ�ķֲ�����Ȼ���������ܲ��ߣ����ǻ�����Щʵ������ġ�
Node�����֪ʶ�������ڡ�Node.js���̲����ᡷ�Ͽ���lesson3����Ȼ�̣ܶ�����������֮�����Ż���OK�ģ������������Լ�����΢����ѧһ���ˡ�
�ܵ����������������������http���󣬲�����ȡ����ҳ�������з�����ȡ���Լ���Ҫ����Ϣ��ͨ��Node������ʱ����һЩģ������𵽺ܱ�ݵ����ã�

 1. **Express** 
��װ�õķ������������Ǻܷ���Ĵһ�����׵ķ��������������������Ҫ��ԭ����NodeҲ���ԽϿ��������
 2. **Superagent** 
http������Ӧģ�飬����ʮ�ֺ��õģ���Ȼͬ��������ԭ��Node���������������ǲ�Ҫ�ظ��������
 3. **Cheerio** 
������ر���Ҫ�ˡ���ȡ��ҳ���html����ʱ�����������Ǻܸ��ӵģ��������ģ����������ʹ��JQuery�ķ�ʽȥ��������ʽ����Ҳ�ܱ�ݣ������ڲ���ǰ�˵ĸо���
 4. **Eventproxy** 
���ģ�������������Ƶġ������Ĺ����У�Ҳû���õ�ʲô�������ܣ�ֻ����Ϊһ���첽��ɵļ��������ѡ�

��ҪҲ�����⼸��ģ�飬�����Ҫ����ȡ�������ݴ��뵽�ļ��������ݿ�Ļ�����Ҫ����fs��������ģ���ˣ�������Ҳֻ����ҳ������չʾ��һ�£���δ��Ҫ��Щ������׼����LayUiչʾ���ݣ�˳������LayUi�ĸ���ͼ��UI����ʱ���ٲ��ϰɡ�

## ����

### 1. ����ģ��
 ����Ҳ���Ǹ���ģ��������ˣ�Ҳû��ʲô���⣺
 

```javascript
var express=require('express');
var cheerio=require('cheerio');
var superagent=require('superagent');
var eventproxy=require('eventproxy');
	
var app=express();
var ep=eventproxy();
```
 ### 2. ȫ�ֱ���
 Ȼ������ȫ�ֱ����������ݴ洢��
 

```javascript
var moviePages=[];//��ŵ�Ӱҳ��url
var movieAs=[];//��Ÿ�����Ӱҳ������
var movieInfos=[];//��Ÿ���Ӱ��Ϣ
```
	
### 3. �������
 ���ȴ���׵ķ�������չʾ��ȡ�����ݣ�ֱ�ӵ���express��һЩ��������3000�˿ڽ���get��������Ӧ��
 

```javascript
app.get('/',function(req,res){
	//��Ӧ��ִ�д���
	����
});
//����3000�˿�
app.listen(3000,()=>{
	console.log('Listening to port 3000����');
})
```

### 4. ��ȡҳ��url
��Ӱҳ���url������ҳ����Ե�֪��250�����ݣ��ܹ���ʮ��ҳ�棬��ȥ��һ��ҳ���urlΪ��
https://movie.douban.com/top250
����ҳ���url���㣺
https://movie.douban.com/top250?start=25*i&filter=
������ҳ��url����moviePages�����Դ����á�
��Top250ҳ�����棬�����ܹ���ȡ��������̫�٣�ֻ�е�Ӱ���Լ���飬�ܶ�������ӳ����ʱ�䣬���ݵȵ���ϢҪ�ȵ㿪֮���ҳ����ܵõ�������Ҫ�Ƚ�250����Ӱ�����ӷֱ��ȡ����ȡ��movieAs���棬�ٽ������ҳ�������Ϣ�Ļ�ȡ��
### 5. ��ȡҳ��
ͨ��sugeragent��ȡ��ҳ��Ĵ��룺
 ```javascript
for(var i=0;i<10;i++){
superagent.get(moviePages[i]).end(function(err,sres){
	if(err){
		console.log('There is an error when asking for top250');
	}
//����ȡ����ҳ����븳��$��ʹ�����ͨ��JQ��������decodeEntitleΪ�˱����ȡ����
	var $=cheerio.load(sres.text,{decodeEntitle:false});
	����
	});
}
```
### 6. ����ҳ�����
����ҳ�����ɵã�
![ҳ��������](https://img-blog.csdn.net/20181008223835231?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pY29sYV9Nb29u/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
 �ɿ���������ҳ������Ӷ���classΪhd��div�ڵĵ�һ��a��ǩ���棬ͨ��cheerio���õ���push��movieAs��
```JavaScript
$('.hd').each(function(index,element){
	var thisHref=$(element).find('a').first().attr('href');
	movieAs.push(thisHref);
})
```
### 7. �첽����
���ֻ�ǽ���Щ����get����Ӧ���棬ֱ�Ӿͼ���res.send()�������һ�����⣬���ǵ�������Ӧ��ʱ���ֱ�ӵ�������send()��Ȼ��ͻὫ��Ӧ�رգ����첽�����������Ӧ��ʱ�򣬾ͻ����error:
Error: Can't set headers after they are sent.
���������˼����˵����Ӧͷ�ظ��ˣ��Ѿ�������ˡ�
�Ҳ��õĽ���취����ʹ��eventproxy�ļ��������п��ƣ�ֻ�е�ʮ��ҳ�涼�����֮��Ż������һ����
�����õ���ep.after()���Լ�ep.emit()
```JavaScript
ep.after('allMovies',moviePages.length,function(){
//	res.send(movieAs);
	askForInfo();
});
```
��δ������˼������һ���������ã�ֻ�е��������Ĵ����ﵽ��moviePages.length�ε�ʱ�򣬲Ż�����ڲ����롣
��
```JavaScript
ep.emit('allMovies');
```
����forѭ��֮�У�ÿ��ִ�������룬���Ƕ�ep.after��Ӧ������һ�δ�����
### 8. ���
����ľ�����������Щִ������ܹ���������Ӱ�����Ӵ���movieAs���飬Ȼ����askForInfo�����������Щ���ӷֱ����ҳ��������õ��Լ���Ҫ����Ϣ���ҽ�ÿ����Ӱ�����֣����֣��Լ���ӳ���ڽ�������ȡ��
![��ȡ�Ľ��](https://img-blog.csdn.net/20181008225256391?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L05pY29sYV9Nb29u/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

## ȫ������

```javascript
var express=require('express');
var cheerio=require('cheerio');
var superagent=require('superagent');
var eventproxy=require('eventproxy');

var app=express();
var ep=eventproxy();

var moviePages=[];//��ŵ�Ӱҳ��url
var movieAs=[];//��Ÿ�����Ӱҳ������
var movieInfos=[];//��Ÿ���Ӱ��Ϣ

moviePages[0]='https://movie.douban.com/top250';
for(var i=1;i<10;i++){
	moviePages[i]='https://movie.douban.com/top250'+'?start='+25*i+'&filter=';
}

app.listen(3000,()=>{
	console.log('Listening to port 3000����');
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
//������utf-8�ַ�ת��Ϊ����
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
				if(theText=='��ӳ����:'){
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

## ���
Ϊ�����ݱ��棬�ֲ���һЩ�ļ�������룬����û��ʲô�Ѷȣ�������ͬ���첽���������鷳����ֵ���ʵ�Ƕ���ķ�������ƣ����Ե�ʱ�����Ǳ�����ip�������ػػ��˺ü�������

```javascript
//��res.send()ǰ����һ����������ͺã�Ҫ������fsģ�飩
function writeIntoFs(){
	jsonData.success=true;
	jsonData.data=movieInfos;
	jsonData=JSON.stringify(jsonData);
	console.log('��ʼд�롭��');
	fs.writeFileSync('top250.json',jsonData);
	console.log('д�����!');
}
```

