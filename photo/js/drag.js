(function (window){
	window.drag = function(navsWrap,callback){
		var navsBars = navsWrap.children[0];
		transformCss(navsBars,'translateZ',0.2);

		//模拟touchend快速滑屏速度
		var beginValue = 0;
		var beginTime = 0;
		var endValue = 0;
		var endTime = 0;
		var disValue = 0;
		var disTime = 1;
		
		var Tween = {
			//中间状态---匀速
			Linear: function(t,b,c,d){ return c*t/d + b; },
			//两边回弹状态
			easeOut: function(t,b,c,d,s){
	            if (s == undefined) s = 1.70158;
	            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	       }
		};
		
		
		//定义元素和手指初始位置
		var eleY = 0;
		var startY = 0;
		
		//防抖动
		var startX = 0;
		var isFirst = true;
		var isY = true;
		
		navsWrap.addEventListener('touchstart',function(event){
			var touch = event.changedTouches[0];
			
			//即点即停
			clearInterval(wrap.timer);
			//清空过渡
			navsBars.style.transition = 'none';
			//获取元素和手指初始位置
			eleY = transformCss(navsBars,'translateY');
			startY = touch.clientY;
			startX = touch.clientX;
			
			//速度
			beginValue = eleY;
			beginTime = new Date().getTime();
			//清空
			disValue = 0;
			isFirst = true;
			isY = true;
			
			if(callback && callback['start']){
				callback['start']();
			};
		});
		navsWrap.addEventListener('touchmove',function(event){
			var touch = event.changedTouches[0];
			
			//防抖动
			if (!isY){
				return;
			};
			
			
			//手指结束位置
			endY = touch.clientY;
			endX = touch.clientX;
			
			//手指距离差
			var disY = endY - startY;
			var translateY = disY + eleY;
			
			var disX = endX - startX;
			
			//临界状态translateY值
			var minY = navsWrap.clientHeight - navsBars.offsetHeight;
			
			var scale = 0;
			if (translateY > 0){
				//橡皮筋效果，越拉越难拉
				//1-留白区域/屏宽 - 比例
				scale = 1 - translateY/navsWrap.clientHeight;
				translateY = translateY * scale;
			} else if (translateY < minY){
				var over = - (translateY- minY);//正值
				scale = 1 - over/navsWrap.clientHeight;
				translateY =  minY - over*scale;
			};
			
			//防抖动
			if (isFirst){
				isFirst = false;
				if (Math.abs(disX) > Math.abs(disY)){
					isY = false;
					return;
				};
			};
			
			//赋值
			transformCss(navsBars,'translateY',translateY);
			
			//速度
			endValue = translateY;
			endTime = new Date().getTime();
			
			
			disValue =  endValue - beginValue;
			disTime =  endTime - beginTime;
			
			if(callback && callback['move']){
				callback['move']();
			};
		});
		//快速滑屏
		navsBars.addEventListener('touchend',function(event){
			var touch = event.changedTouches[0];
			
			
			
			//速度
			var speed = disValue/disTime;
			var target = transformCss(navsBars,'translateY') + speed*100;
			var minY = navsWrap.clientHeight - navsBars.offsetHeight;
			//cubic-bezier(.04,1.53,.45,1.59)
			var type = 'Linear';
			if (target > 0){
				target = 0;
				type = 'easeOut';
			} else if (target < minY){
				target = minY;
				type = 'easeOut';
			};
			var time = 1;
			moveTween(type,target,time);
			
			if (callback && callback['over']){
				callback['over']();
			};
			
		});
		function moveTween(type,target,time){
			//		t:当前次数
			//		b:元素初始位置
			//		c:初始位置与结束位置距离差
			//		d:总次数
			//		s:回弹系数,s越大回弹越远
			//		返回值:每次运动达到的目标位置
			var t = 0;
			var b = transformCss(navsBars,'translateY');
			var c = target - b;
			var d = time/0.02;
			
			clearInterval(wrap.timer);
			wrap.timer = setInterval(function(){
				t ++;
				if (t > d){
					clearInterval(wrap.timer);
					if(callback && callback['end']){
						callback['end']();
					};
				} else {
					var point = Tween[type](t,b,c,d);
					transformCss(navsBars,'translateY',point);
					if(callback && callback['move']){
						callback['move']();
					};
				};
			},20)
		};
	};
})(window)
