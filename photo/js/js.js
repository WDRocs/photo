document.addEventListener('touchstart',function(event){
	event.preventDefault();
});
window.onload = function(){
	//rem适配
	(function(){
		var width = document.documentElement.clientWidth;
		var styleN = document.createElement('style');
		styleN.innerHTML = 'html {font-size: ' + width/16 + 'px !important;}';
		document.head.appendChild(styleN);
	})();
	
	//获取元素
	var list = document.getElementById('list');
	var tabHeader = document.getElementById('tabHeader');
	var wrap = document.getElementById('wrap');
	var content = document.getElementById('content');
	var footer = document.getElementById('footer');
	var footerH = footer.offsetHeight;
	var scallBar = document.getElementById('scallBar');
	
	//是否在底部
	var isBottom = false;
	
	//储存路径
	var urlArr = [];
	for (var i = 0;i < 20;i++){
		urlArr.push('img/'+ (i%18+1) +'.jpg');
	};
	
	//footer隐藏
	transformCss(footer,'scale',0);
	
	//每次li创建的长度
	var length = 12;
	//记录每次li开始的数量
	var start = 0;
	
	//创建li
	creatLi();
	function creatLi(){
		if (start >= urlArr.length){
			footer.innerHTML = '没有啦';
			setTimeout(function(){
				var maxH = content.offsetHeight - wrap.clientHeight;
				content.style.transition = '0.5s';
				scallBar.style.opacity = '0';
				transformCss(content,'translateY',-maxH);
			},2000);
			return;
		}
		var end = start + length;
		end = end > urlArr.length ? urlArr.length : end;
		for (var i = start; i < end; i ++){
			var li = document.createElement('li');
			li.src = urlArr[i];
			li.isLoad = false;
			list.appendChild(li);
		};
		start = end;
		lazyLoad();
	};
	
	//懒加载
	function lazyLoad(){
		var minT = tabHeader.offsetHeight;
		var maxT = document.documentElement.clientHeight;
		
		var liNodes = document.querySelectorAll('#list li');
		for (var i = 0;i < liNodes.length; i++){
			var top = liNodes[i].getBoundingClientRect().top;
			
			if (!liNodes[i].isLoad && top > minT && top < maxT){
				createImg(liNodes[i]);
				
				//li中有图片
				liNodes[i].isLoad = true;
			};
		};
	};
	
	//创建img
	function createImg(li){
		var img = new Image();
		img.src = li.src;
		img.style.transition = '0.5s opacity';
		
		//图片获取完执行
		img.onload = function(){
			img.style.opacity = '1';
		};
		li.appendChild(img);
	};
	
	var scale = wrap.clientHeight / content.offsetHeight;
	scallBar.style.height = wrap.clientHeight * scale + 'px';
	
	//相册动起来
	var callback = {
		start:function(){
			var h = content.offsetHeight - wrap.clientHeight;
			var H = transformCss(content,'translateY');
			if (Math.abs(H) >= Math.abs(h)){
				
				//在底部
				isBottom = true;
			};
			scallBar.style.opacity = '1';
		},
		move:function (){
			
			//在底部
			if (isBottom){
				var h = content.offsetHeight - wrap.clientHeight;
				var H = transformCss(content,'translateY');
				var x = Math.abs(H) - Math.abs(h);
			
				var footscale = x / footerH;
				footscale = footscale > 1 ? 1 : footscale;
				transformCss(footer,'scale',footscale);
			};
			
			//懒加载
			lazyLoad();	
			
			scallBar.style.opacity = '1';
			
			var scale = wrap.clientHeight / content.offsetHeight;
			var scallDis = transformCss(content,'translateY') * scale;
			transformCss(scallBar,'translateY',-scallDis);
		},
		over:function(){
			//在底部
			//footer被全部拉出
			var h = content.offsetHeight - wrap.clientHeight;
			var H = transformCss(content,'translateY');
			var x = Math.abs(H) - Math.abs(h);
			
			if (isBottom && x > footerH){
				clearInterval(wrap.timer);
				creatLi();
				var scale = wrap.clientHeight / content.offsetHeight;
				scallBar.style.height = wrap.clientHeight * scale + 'px';
			};
		},
		end:function(){
			scallBar.style.opacity = '0';
		}
	};
	drag(wrap,callback);
};

