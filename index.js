var myChart=echarts.init(document.getElementById('echartsDiv'));
var ajax=new XMLHttpRequest();
var url='http://127.0.0.1:8431';//申请得到爬取到的top250数据
var topData;//储存服务器返回的数据
var star=[0,0,0,0,0,0,0,0,0,0,0,0];

//向服务器申请获取到top250数据
ajax.open('get',url);
ajax.send();
ajax.onreadystatechange=function(){
	if(ajax.readyState==4 && ajax.status==200){
		topData=JSON.parse(ajax.responseText);
		dataUse();
	}
}

//数据处理
function dataUse(){
	for(var i=0;i<topData.data.length;i++){
		if(topData.data[i].time[1]){
			var mon=parseInt(topData.data[i].time[1]);
			star[mon-1]+=parseInt(topData.data[i].star);
			showChart();
		}
	}
}

//生成图表
function showChart(){
	//图表配置参数
	var option={
		title:{
			text:'高分月份'
		},
		tooltip:{},
		legend:{
			data:['总评分']
		},
		xAxis:{
			data:['1','2','3','4','5','6','7','8','9','10','11','12']
		},
		yAxis:{},
		series:[{
			name:'总评分',
			type:'line',
			data:star,
			color:new echarts.graphic.LinearGradient(0,0,0,1,[{
				offset:0,
				color:'rgba(26,176,254,0.7)'
			},{
				offset:1,
				color:'rgba(26,176,254,0.1)'
			}])
		}]
	};
	myChart.setOption(option);
}
