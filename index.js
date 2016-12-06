$(function(){
	 var canvas=$("#canvas").get(0);
	 var ctx=canvas.getContext('2d');
	 var sq=40; 
	 var r=5;   
	 var bS=18;
	 var shen=true;
     var kaiguan=true;
     var zuo;
     var you;
	 var qizi={};
	 var kongbai={};
//***********************************************************将每颗棋子的位置封装整数，便于调用	 
	 function l(a){
	    	return (a+0.5)*sq+0.5;
	    }
//***********************************************************创建棋盘	 
	 function qipan(){
	    	 ctx.save()
			  ctx.beginPath()
				   for(var i=0;i<15;i++){
				   	  ctx.moveTo(l(0),l(i))
				      ctx.lineTo(l(14),l(i))
				      ctx.moveTo(l(i),l(0))
				      ctx.lineTo(l(i),l(14))
				   }
			  ctx.closePath()
			  ctx.stroke()
			  ctx.restore()
			  
			  for(var i=0;i<15;i++){
			  	  for(var j=0;j<15;j++){
			  	  	kongbai[i+"_"+j]=true;
			  	  }
			 }
	    }
	    qipan();
//***********************************************************画棋子	 
	 function circle(x,y){
	 	ctx.save()
		    ctx.beginPath()
		        ctx.translate(l(x),l(y))
		        ctx.arc(0,0,bS,0,Math.PI*2)
		    ctx.closePath()
		    ctx.fill();
		ctx.restore()
	 }
//***********************************************************落子，判断是黑棋或下白棋
	 function luozi(x,y,color){
	  	    ctx.save();
     	    ctx.beginPath()
		    	var g=ctx.createRadialGradient(-4,-4,0,0,0,18)
		    	 if(color=="black"){
		    	 	g.addColorStop(0,"#fff")
		    	 	g.addColorStop(0.6,"black")
		    	 }else{
		    	 	g.addColorStop(0,"#EAEAEA")
		    	 	g.addColorStop(0.6,"#fff")
		    	 }
		    	 ctx.fillStyle=g;
		    	 circle(x,y)
	    	 ctx.closePath()
	    	 ctx.restore()
	    	 qizi[x+"_"+y]=color;
	 }
//***********************************************************落棋盘上的五子
	    function lunda(x,y,b){
	    	ctx.save()
		    ctx.beginPath()
		        ctx.translate(l(x),l(y))
		        ctx.arc(0,0,b,0,Math.PI*2)
		    ctx.closePath()
		    ctx.fill();
		    ctx.restore();
	    }
	    lunda(3,3,r)
	    lunda(3,11,r)
	    lunda(7,7,r)
	    lunda(11,3,r)
	    lunda(11,11,r)
//*************************************************************************人人对战	    
	function renren(){
	    $(canvas).on("click",function(e){
	    	var x=Math.floor(e.offsetX/sq); 
	    	var y=Math.floor(e.offsetY/sq);
	    	if(qizi[mt(x,y)]){return;}
		    	 if(kaiguan){
		    	 	 luozi(x,y,"black");
		    	 	if(cal(x,y,"black")>=5){
		    	 		$("#zhao").css({"display":"block"})
		    	 		$("#yiyan").text("黑棋胜")
		    	 		$(canvas).off("click");
		    	 	}
		    	 }else{
		    	 	 luozi(x,y,"white");
		    	 	 if(cal(x,y,"white")>=5){
		    	 		$("#zhao").css({"display":"block"})
		    	 		$("#yiyan").text("白棋胜")
		    	 		$(canvas).off("click");
		    	 	}
		    	 }
	    	 kaiguan=!kaiguan;
	    	 if(shen){
	    	 	$("#audio").get(0).play();
	    	 }
	    	  t=0;
	    	 if(qizi[mt(x,y)]=="black"){                           //判断当前是下黑棋，还是白棋
	    	 	  clearInterval(you);
	    	 	zuo=setInterval( miaozhenzuo,1000);
	    	 	$("#hei").css("background","#000")               //var a=12; o.a=11;出现在点后面都是字符串（简写方法）;
	    	 	$("#bai").css("background","#34E8E5")
	    	 }else{
	    	 	 clearInterval(zuo);
	    	 	 you=setInterval( miaozhenyou,1000);
	    	 	 $("#hei").css("background","#34E8E5")
	    	 	$("#bai").css("background","#fff")
	    	 }
	    })
}
//*****************************************点击消失罩子
$("#zhao").on('click',function(){
	$("#zhao").css({"display":"none"})
})	
//********************************************************************人机对战	
 function ai(){
	var max = -Infinity; 
	var xx = {};
    for ( var i  in kongbai){
      var pos = i;
      var x = cal(parseInt(pos.split('_')[0]),parseInt(pos.split('_')[1]),'black');
      if( x > max ){
        max = x;
        xx.x = parseInt(pos.split('_')[0])
        xx.y = parseInt(pos.split('_')[1])
      }
    }
    var max2 = -Infinity;
    var yy = {};
    for ( var i  in kongbai){
      var pos = i;
      var x = cal(parseInt(pos.split('_')[0]),parseInt(pos.split('_')[1]),'white');
      if( x > max2 ){
        max2 = x;
        yy.x = parseInt(pos.split('_')[0]);
        yy.y = parseInt(pos.split('_')[1])
      }
    }
    if( max2 >= max){
      return yy;
    }
    return xx;
}
function handle(e){
	$(canvas).on("click",function(e){
	   var x=Math.floor(e.offsetX/sq); 
	   var y=Math.floor(e.offsetY/sq);
	   if(qizi[x+"_"+y]){return;};
	   luozi(x,y,'black');
	   delete kongbai[x+"_"+y];
	   if( cal(x,y,'black') >= 5 ){
	     $("#zhao").css({"display":"block"})
		  $("#yiyan").text("黑棋胜")
	      $(canvas).off("click");
	    }
	   
	    var pos=ai();
	    luozi(pos.x,pos.y,'white');
	    delete kongbai[ pos.x + '_' + pos.y ];
	    if( cal(pos.x,pos.y,'white') >= 5 ){
	      $("#zhao").css({"display":"block"})
		   $("#yiyan").text("白棋胜")
	      $(canvas).off("click");
	    }; 
	    
	    if(shen){$("#audio").get(0).play();}
	     t=0;
//	    	 if(qizi[ pos.x + '_' + pos.y ] = 'white'){                           //判断当前是下黑棋，还是白棋
//	    	 	  clearInterval(you);
//	    	 	zuo=setInterval( miaozhenzuo,1000);
//	    	 	$("#hei").css("background","#000")               //var a=12; o.a=11;出现在点后面都是字符串（简写方法）;
//	    	 	$("#bai").css("background","#34E8E5")
//	    	 }else if(qizi[mt(x,y)]=="black"){
//	    	 	 clearInterval(zuo);
//	    	 	 you=setInterval( miaozhenyou,1000);
//	    	 	 $("#hei").css("background","#34E8E5")
//	    	 	$("#bai").css("background","#fff")
//	    	 }	 	
   })
}
function renji(){
	handle();
}
//*************************************************************************输赢判断
      function mt(x,y){
      	 return x+"_"+y;
      }
        function cal(x,y,color){
        	var row=1;
        	var i=1;
        	while(qizi[mt(x+i,y)]===color){row++; i++;};
        	i=1;while(qizi[mt(x-i,y)]===color){row++; i++;}
        	
        	var lie=1;
        	while(qizi[mt(x,y+i)]===color){lie++; i++;};
        	i=1;while(qizi[mt(x,y-i)]===color){lie++; i++;}
        		
        	var zx=1;
        	while(qizi[mt(x+i,y+i)]===color){zx++; i++;};
        	i=1;while(qizi[mt(x-i,y-i)]===color){zx++; i++;}
        	
        	var yx=1;
        	while(qizi[mt(x-i,y+i)]===color){yx++; i++;};
        	i=1;while(qizi[mt(x+i,y-i)]===color){yx++; i++;}
        	 
        	return Math.max(row,lie,zx,yx);
        }
  
//*********************************收集画布中所有的像素，转换成一张图片，浏览器中可用的图片，字符串形式存储的图片() 
chearManual=function(){
    	   ctx.beginPath();
	    	   ctx.font="20px 微软雅黑";
	    	   ctx.fillStyle="red";
	    	   ctx.textAlign="center";
	    	   ctx.textBaseline="middle";
	    	   var i=1;
	    	   for(var k in qizi){
	    	   	  var arr=k.split("_");
		    	   	  if(qizi[k]==="black"){
		    	   	 ctx.fillStyle="#fff";
		    	   }else {
		    	   	  ctx.fillStyle="#000";
		    	   }
		    	   ctx.fillText(i++,l(parseInt(arr[0])) ,l(parseInt(arr[1])));
	    	   }
    	   ctx.closePath();
    }
//***************************************************人机与人人模式切换
$("#modelbox div").on("click",function(){
   	   for(var k in qizi){if(qizi[k]){return;}}
   	   var index=$(this).index();
   	   $("#modelbox div").removeClass("active").eq(index).addClass("active");
   	   if(index===0){
	   	   	renren();
   	   }else if(index===1){
	   	   renji();
   	   }
   })
//*********************************************************************开始
	    $("#begin").on("click",function(){
	    	$("#zhao").css({"display":"none"});
	    })
//**************************************************************************黑白指针
//指针右 黑棋
     var t=0;
	  var canvas1=$(".imgr").get(0);
	   var ctx1=canvas1.getContext('2d');
	   function miaozhenyou(){
	   	ctx1.clearRect(0,0,100,100);
      	  ctx1.save()
	      ctx1.beginPath()
	          ctx1.translate(50,50);
	          ctx1.rotate(Math.PI/180*6*t);
	          ctx1.arc(0,0,5,0,Math.PI*2)
	          ctx1.moveTo(0,5)
	          ctx1.lineTo(0,15)
	          ctx1.moveTo(0,-5)
	          ctx1.lineTo(0,-40)
          ctx1.closePath()  	
          ctx1.stroke()
	      ctx1.restore() 
	      t++;
    }
	   miaozhenyou();
	//指针左 白棋
	  var canvas2=$(".imgl").get(0);
	   var ctx2=canvas2.getContext('2d');
	   function miaozhenzuo(){
	   	 ctx2.clearRect(0,0,100,100);
      	 ctx2.save()
	      ctx2.beginPath()
	          ctx2.translate(50,50);
	          ctx2.rotate(Math.PI/180*6*t);
	          ctx2.arc(0,0,5,0,Math.PI*2)
	          ctx2.moveTo(0,5)
	          ctx2.lineTo(0,15)
	          ctx2.moveTo(0,-5)
	          ctx2.lineTo(0,-40)
          ctx2.closePath()  	
          ctx2.stroke()
          ctx2.restore() 
          t++;
     }
	    miaozhenzuo()
//***************************************************************************点击功能
var show=true;
$("#shezhi").on("click",function(e){
	e.stopPropagation();
	if(show){
		$("#items").slideDown();
	}else{
		$("#items").slideUp();
	}
	show=!show;
})
$(".lists").on("click",function(){
	return false;
})
//************************************************************************点击游戏介绍
$("#jieshao").on("click",function(e){
	e.stopPropagation();
	if(show){
		$("#content").slideDown();
	}else{
		$("#content").slideUp();
	}
	show=!show;
})
$("#content").on("click",function(){
	return false;
})
$(document).on("click",function(){
	$("#content").slideUp();
	$("#items").slideUp();
	$("#modelbox").slideUp();
	return false;
})
//**********************************************************************背景切换
     var back=[{"a": "url(item-2.jpg)"},
			   {"a": "url(item-3.jpg)"},
			   {"a": "url(item-4.jpg)"},
		       {"a": "url(item-5.jpg)"}
    		  ]
     var m=0;
$("#qie").on("click",function(){
	   console.log(back[m].a);
	   console.log(m)
	  	if(m>=4){
	  		m=0;
	  	}
	     $("body").css("background-image",back[m].a);
	    m++;
})
//**************************************************************************查看棋谱
$("#checkmunal").on("click",function(){
     	$('#xiazai').css({"transform":"scale(1)"});
     	  chearManual();
     	  if($('#xiazai').find('img').length){
     	  	   $('#xiazai').find('img').attr("src",canvas.toDataURL()).appendTo($('#xiazai'));
     	  }else{
     	  	$("<img>").attr("src",canvas.toDataURL()).css({"width":500,"height":500}).appendTo($('#xiazai'));
     	  }
     	  if($('#xiazai').find('a').length){
     	  	 $('#xiazai').find('a').attr("href",canvas.toDataURL()).attr("dowanlod","qipu.png").appendTo($('#xiazai'));
     	  }else{
     	  	 $("<a>").attr('href',canvas.toDataURL()).attr("dowanlod","qipu.png").appendTo($('#xiazai'));
     	  }	
     })
   $("#cha").on("click",function(){
        $('#xiazai').css({"transform":"scale(0)"});
        for(var k in qizi){
	    	var arr=k.split("_");
		    luozi(parseInt(arr[0]),parseInt(arr[1]),qizi[k])   	  
	     }
      })
//**************************************************************退出游戏
    $("#tuichu").on("click",function(){
    	  window.close();
    })
//*********************************************************************重新开始
   $(".ff:nth-child(1)").on("click",function(){
	    	//$("#zhao").css({"display":"block"});
	    	ctx.clearRect(0,0,600,600);
	    	qipan();
	    	lunda(3,3,r)
		    lunda(3,11,r)
		    lunda(7,7,r)
		    lunda(11,3,r)
		    lunda(11,11,r)
		    $("#hei").css({"background":"#000","color":"#fff"})
	    	$("#bai").css({"background":"#fff","color":"#000"});
	    	$("#yiyan").css({"opacity":"1","top":"40%"});
	    	qizi={};	
	    	 $(canvas).off("click");
   })
//***************************************************************************人机切换
$(".ff:nth-child(2)").on("click",function(e){
	e.stopPropagation();
	if(show){
		$("#modelbox").slideDown();
	}else{
		$("#modelbox").slideUp();
	}
	show=!show;
})
$("#modelbox").on("click",function(){
	return false;
})
});
