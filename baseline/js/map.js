/*地图绘制部分*/		
	var amap = new AMap.Map('container', {
		mapStyle: 'amap://styles/midnight',
        resizeEnable: true,
        center: [120.68, 28],
		viewMode: '2D',
        zoom: 13
    });
	
	var loaded = false;

    function createVisualMap() {
		if (loaded) return;
        loaded = true;
		var map = Loca.create(amap);

		layer = Loca.visualLayer({
			container: map,
			type: 'line',
			shape: 'line',
		});

        layer.setData(data, {
            lnglat: function(data){
					var item = data.value;
					return item.polylines;
			}
        });

        layer.setOptions({
            style: {
                borderWidth: 3,
                opacity: 0.4,
                color: '#ffffff'
				}
        });
		
        layer.render();
	}
	createVisualMap();
	
	function alterSpeed(time) {
		layer.setOptions({
            style: {
                borderWidth: 3,
                opacity: 0.4,
                color: function(data){
					var item = data.value;
					var timelist = item.time;
					var speedlist = item.speed;
					var counts = item.speed_count;
					if (counts==-1) 
						return'#ffffff';
					for(var i =0;i<timelist.length;i++){
						if (Math.abs(Date.parse(time)-Date.parse(timelist[i]))<600000)
							return speedlist[i];
						if(Date.parse(timelist[i])-Date.parse(time)>600000) 
							break;
					}
					return '#ffffff';
				}
            }
        });
		 layer.render();
	}

//预留
/*
	var logMapinfo = function (){
	
	  console.log("resize")
    };
	
	amap.on('zoomchange', logMapinfo);
*/
/*滑槽部分*/
 $(document).ready(function (e) {
            SetProgressTime(null, "2020-03-09 00:00:00", "2020-03-09 09:40:00")
        });
        var _index = 0;
        var myfun;
        function SetProgressTime(fun, startTime, endTime) {
            myfun = fun;
			/*根据文本修改显示项*/
            $("#progressTime").show();	
            $("#scrollBarTxt").html(startTime);
            $("#startTime").text(startTime);
            $("#endTime").text(endTime);
			
            //设置最大值
            var qdsjDate = new Date(startTime)
            var jssjDate = new Date(endTime)
            ScrollBar.maxValue = Math.abs(qdsjDate - jssjDate) / 1000 ;
            //初始化
            ScrollBar.Initialize();
        }
        //滑块
        var ScrollBar = {
            value: 0,
            maxValue: 40,
            step: 1,
            currentX: 0,
            Initialize: function () {
                if (this.value > this.maxValue) {
                    alert("给定当前值大于了最大值");
                    return;
                }
                this.GetValue();
                $("#scroll_Track").css("width", this.currentX + 2 + "px");
                $("#scroll_Thumb").css("margin-left", this.currentX + "px");
                this.Value();
            },
            SetValue: function (aValue) {
                this.value = aValue;
                if (this.value >= this.maxValue) this.value = this.maxValue;
                if (this.value <= 0) this.value = 0;
                var mWidth = this.value / this.maxValue * $("#scrollBar").width() + "px";
                $("#scroll_Track").css("width", mWidth);
                $("#scroll_Thumb").css("margin-left", mWidth - 5);
            },

            Value: function () {
                var valite = false;
                var currentValue;
                $("#scroll_Thumb").mousedown(function () {
                    valite = true;
                    $("#scrollBar").mousemove(function (event) {
                        if (valite == false) return;
                        var changeX = event.clientX - ScrollBar.currentX;
                        currentValue = changeX - ScrollBar.currentX - $("#scrollBar").offset().left;
                        $("#scroll_Thumb").css("margin-left", (currentValue - 5) + "px");
                        $("#scroll_Track").css("width", currentValue + 2 + "px");
                        if(currentValue+$("#scrollBarTxt").width()>=$("#progressTime").width()){
                            $("#scrollBarTxt").css("left",$("#progressTime").width()-($("#scrollBarTxt").width()/2+3));
                        }else if(currentValue<=83){
                            $("#scrollBarTxt").css("left", "83px");
                        }else{
                            $("#scrollBarTxt").css("left", currentValue);
                        }
                        if ((currentValue + 1) >= $("#scrollBar").width()) {
                            $("#scroll_Thumb").css("margin-left", ($("#scrollBar").width() - 15) + "px");/*改动  15改为1*/
                            $("#scroll_Track").css("width", $("#scrollBar").width() + 2 + "px");
                            ScrollBar.value = ScrollBar.maxValue;
                        } else if (currentValue <= 0) {
                            $("#scroll_Thumb").css("margin-left", "0px");
                            $("#scroll_Track").css("width", "0px");
                            ScrollBar.value = 0;
                        } else {
                            ScrollBar.value = Math.round(currentValue * ScrollBar.maxValue / $("#scrollBar").width());
                        }
                        SetTime("mousedown",ScrollBar.value);
                    });
                });
                $("#scroll_Thumb").mouseup(function () {
                    if ($("#progressTime_control").attr("title") == "暂停") {
                        if (ScrollBar.value < ScrollBar.maxValue) {
                            _index = ScrollBar.value - 1;
                            _mProgressTimer = window.setInterval(function () {
                                if (_index <= ScrollBar.value && _index != ScrollBar.maxValue) {
                                    _index += 1;
                                    ScrollBar.SetValue(_index);
                                    SetTime("mouseup",_index)
                                }
                                else {
                                    progressTimeStop()
                                }
                            }, _speed);
                        }
                    }
                    $("#scrollBarTxt").hide();
                    valite = false;
                });
                /*hover*/
                $("#scrollBar").mouseover(function(event){
                    setHover("mouseover",event);
                });
                $("#scrollBar").mousemove(function (event){
                    setHover("mousemove",event);
                })
                $("#scrollBar").mouseout(function(event){
                    $("#scrollBarTxt").hide()
                });
                $("#scrollBar").click(function(event){
                    var changeX = event.clientX - ScrollBar.currentX;
                    currentValue = changeX - ScrollBar.currentX - $("#scrollBar").offset().left;
                    $("#scroll_Thumb").css("margin-left",(currentValue - 5 ) + "px");
                    $("#scroll_Track").css("width", currentValue + 2 + "px");
                    if ((currentValue + 1) >= $("#scrollBar").width()) {
                        $("#scroll_Thumb").css("margin-left", ($("#scrollBar").width() - 5) + "px");/*改动  15改为1*/
                        $("#scroll_Track").css("width", $("#scrollBar").width() + 2 + "px");
                        ScrollBar.value = ScrollBar.maxValue;
                    } else if (currentValue <= 0) {
                        $("#scroll_Thumb").css("margin-left", "0px");
                        $("#scroll_Track").css("width", "0px");
                        ScrollBar.value = 0;
                    } else {
                        ScrollBar.value = Math.round(currentValue * ScrollBar.maxValue / $("#scrollBar").width());
                    }
                    SetTime("click",ScrollBar.value);
                });
            },
            GetValue: function () {
                this.currentX = $("#scrollBar").width() * (this.value / this.maxValue);
            }
        }
        //当前时间
        function SetTime(type,value,curValue) {
            var start = $("#startTime").html();
            var startDate = new Date(start);
            startDate.setSeconds(startDate.getSeconds() + 1 * value);//十五分钟为进度,改动
            var month = startDate.getMonth() + 1 < 10 ? "0" + (startDate.getMonth() + 1) : startDate.getMonth() + 1;
            var currentDate = startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate();
            var Hours = startDate.getHours() < 10 ? "0" + startDate.getHours() : startDate.getHours();
            var Minutes = startDate.getMinutes() < 10 ? "0" + startDate.getMinutes() : startDate.getMinutes();
            var Seconds = startDate.getSeconds() < 10 ? "0" + startDate.getSeconds() : startDate.getSeconds();
            var indexStart = startDate.getFullYear() + "/" + month + "/" + currentDate + " " + Hours + ":" + Minutes + ":" + Seconds;

            $("#scrollBarTxt").show().html(indexStart);
            if(type=="mousedown"|| type=="mouseover" || type=="mousemove"){
                if(curValue+$("#scrollBarTxt").width()>=$("#progressTime").width()){
                    $("#scrollBarTxt").css("left",$("#progressTime").width()-($("#scrollBarTxt").width()/2+3));
                }else if(curValue<=83){
                    $("#scrollBarTxt").css("left", "83px");
                }else{
                    $("#scrollBarTxt").css("left", curValue);
                }
            }
            if(type=="click" || type=="mouseup"){ alterSpeed(indexStart)}
            if (window.parent.currentTime) {
                currentTime = indexStart;
            }
            if (typeof (myfun) == "function") {
                var jscode = new Function('return ' + myfun)();
                jscode(indexStart)
            }
        }
        function setHover(type,event){
            var changeX = event.clientX - ScrollBar.currentX;
            currentValue = changeX - ScrollBar.currentX - $("#scrollBar").offset().left;
            if ((currentValue + 1) >= $("#scrollBar").width()) {
                ScrollBar.value = ScrollBar.maxValue;
            } else if (currentValue <= 0) {

                ScrollBar.value = 0;
            } else {
                ScrollBar.value = Math.round(currentValue * ScrollBar.maxValue / $("#scrollBar").width());
            }
            SetTime(type,ScrollBar.value,currentValue);
        }	