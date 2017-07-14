function addEvent(elem, type, handle) {
	if(elem.addEventListener) {
		elem.addEventListener(type, handle, false);
	}else if(elem.attachEvent) {
		elem['temp' + type + handle] = handle;
		elem[type + handle] = function() {
			elem['temp' + type + handle].call(elem);
		}
		elem.attachEvent('on' + type, elem[type + handle]);
	}else{
		elem['on' + type] = handle;
	}
}             


function removeEvent(elem, type,handle) {
	if(removeEventListener) {
		elem.removeEventListener(type, handle, false);
	}else if(elem.detachEvent) {
		elem.detachEvent('on' + type, handle);
	}else{
		elem['on' + type] = null;
	}
}


function stopBubble(event) {
	if(event.stopPropagation) {
		event.stopPropagation();
	}else{
		event.cancelBubble = true;
	}
}

function cancelHandler(event) {
	if(event.preventDefault) {
		event.preventDefault();
	}else{
		event.returnValue = false;
	}
}


Array.prototype.unique = function() {
	var arr = [],
		obj = {},
		len = this.length;
	for(var i = 0 ; i < len ; i ++) {
		if(!obj[this[i]]){
			obj[this[i]] = 1;
			arr.push(this[i]);
		}
	}
	return arr;
}


//深度克隆
function deepClone (parent,child) {
	var child = child || {},
		toString = object.prototype.toString,
		arrStr = '[object Array]';
	for(var prop in parent) {
		if(parent.hasOwnProperty(prop)) {
			if(typeof parent[prop] == 'object') {
				child[prop] = toString.call(parent[prop]) == arrStr ? [] : {};
				deepClone(parent[prop],child[prop]);
			}
			else{
				child[prop] = parent[prop];
			}
		}
	}
}


//圣杯模式
function inherit(C,P){
	function F(){};
	F.prototype = P.prototype;
	C.prototype = new F();
	C.prototype.constructor = C;
	C.prototype.uber = P.prototype;
}

var inherit = (function(){
	var F = function(){};
	return function(C,P){
		F.prototype = P.prototype;
		C.prototype = new F();
		C.prototype.constructor = C;
		C.prototype.uber = P.prototype;
	}
})();



//视口尺寸
function getviewportOffset() {
	if(window.innerHeight) {
		return {
			h: window.innerWidth,
			w: window.innerHeight
		}
	}else {
		if(document.compatMode === "CSS1Compat") {
			return{
				h: document.documentElement.clientHeight,
				w: document.documentElement.clientWidth
			}
		}else{
			return {
				h: document.body.clientHeight,
				w: document.body.clientWidth
			}
		}
	}
}


//元素尺寸
function getEleOffset(dom) {
	var box = dom.getBoundingClientRect();
	var w = box.width || (box.right - box.left),
		h = box.height || (box.bottom - box.top);
	return {
		w: w,
		h: h
	}
}


function getScrollOffset() {
	if(window.pageXOffset) {
		return{
			x : window.pageXOffset,
			y : window.pageYOffset
		}
	}else{
		return {
			x : document.body.scrollLeft + document.documentElement.scrollLeft,
			y : document.body.scrollTop + document.documentElement.scrollTop
		}
	}
}

function getStyle(obj, attr) {
	if(obj.currentStyle) {
		return obj.currentStyle[attr];
	}else{
		return window.getComputedStyle(obj, false)[attr]; 
	}
}	


//求相对于浏览器边框距离getElementPosition
function getElementPosition(ele) {
	var x = ele.offsetLeft,
		y = ele.offsetTop;

	while(ele.offsetParent != document.body){
		ele = ele.offsetParent;
		x += ele.offsetLeft;
		y += ele.offsetTop;
	}
	return {
		x: x,
		y: y
	}
}




//遍历元素节点树（不能用children）
function retChildren(node) {
	var child = node.childNodes,
		len = child.length;
	for(var i = 0; i < len; i ++) {
		if(child[i].nodeType == 1){
			console.log(child[i]);
			child[i].hasChildNodes() && retChildren(child[i]);
		}
	}
}


//返回n层祖先元素
function retParent (node, n) {
	var e = node;
	while(n && e) {
		e = e.parentNode;
		n --;
	}
	return e;
}

//返回元素e的第n个兄弟节点，n为正，返回后面的兄弟节点，n为负，返回前面的，n为0，返回自己。
function retSilbing(node, n) {
	var e = node;
	while(n && e) {
		if(n > 0) {
			if(e.nextElementSibling) {
				e = e.nextElementSibling;
			}else{
				for(e = e.nextSibling; e && e.nodeType != 1; e = e.nextSibling){}
			}

			n --;
		}else {
			if(e.previousElementSibling) {
				e = e.previousElementSiBling;
			}else{
				for(e = e.previousSibling; e && e.nodeType != 1; e = e.previousSibling){}
			}
			n ++;
		}
	}
	return e;
}

//4.编辑函数，封装children功能，解决以前部分浏览器的兼容性问题
Element.prototype.retchildren = function () {
	var child = this.childNodes,
		len = child.length,
		arr = [];
	for(var i = 0; i < len; i ++) {
		if(child[i].nodeType == 1) {
			arr.push(child[i])
		}
	}
	return arr;
}




//5.自己封装hasChildren()方法，不可用children属性
Element.prototype.hasChildren = function () {
	var child = this.childNodes,
		len = child.length;
	for(var i = 0; i < len; i ++) {
		if(child[i].nodeType == 1) {
			return true;
		}
	}
	return false;
}


//封装insertAfter
Element.prototype.insertAfter = function (insertNode, afterNode) {
	var node = this,
		targetNode = afterNode.nextElementSibling,
		child = node.children,
		len = child.length;
	if(len == 0 || !targetNode) {
		node.appendChild(insertNode);
	}else{
		node.insertBefore(insertNode,targetNode);
	}
}


//封装child.remove 可以直接销毁自身
Element.prototype.remove = function () {
	var node = this;
	node.parentNode.removeChild(node);
}




function writeDate() {
	var date = new Date();
	return (date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' + '星期' +  date.getDay())
} 


//拖拽
function drag(ele) {
	var disX,
		disY;
	addEvent(ele, 'mousedown', function (e) {
		var event = e || window.event;
		disX = event.clientX - parsetInt(getStyle(ele, 'left'));
		disY = event.clientY - parsetInt(getStyle(ele, 'top'));

		addEvent(document, 'mousemove', mouseMove);
		addEvent(document, 'mouseup', mouseUp);
		stopBubble(event);
		cancelHandler(event);
	});

	function mouseMove(e) {
		var event = e || winow.event;
		ele.style.left = event.clientX - disX + 'px';
		ele.style.top = event.clientY - disY + 'px';
	}

	function mouseUp() {
		var event = e || window.event;
		removeEvent(document, 'mousemove', mouseMove);
		removeEvent(document, 'mouseup', arguments.callee);
	}
}


//js模拟fixed定位
function fixed(ele) {
	var x = parsetInt(getStyle(ele,'left')),
		y = parsetInt(getStyle(ele, 'top'));
	window.onscroll = function () {
		ele.style.left = getScrollOffset().x + x + 'px';
		ele.style.top = getScrollOffset().y + y + 'px';
	}
}

//异步加载
function asyncLoaded(url, callback) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	if(script.readyState) {//ie才有readyState事件
		script.onereadystatechange = function() {
			if(script.readyState == "complete" || script.readyState == "loaded") {
				script.onreadystatechange = null;
				callback();
			}
		}
	}else{
		script.onload = function () {
			script.onload = null;
			callback();
		}
	}
	script.src = "tools.js";
	document.body.appendChild(script);
}


//兼容byclassname
Document.prototype.getByClassName = function (className) {
    var allEle = document.getElementsByTagName('*'),
        len = allEle.length,
        reg = /^\s+|\s+$/g,
        retArr = [];
    for(var i = 0; i < len; i ++) {
        if(allEle[i].className.replace(reg, "") == className) {
            retArr.push(allEle[i]);
        }
    }
    return retArr;
}



//封装ajax函数
function ajax(method,url,data,success){
	var xhr = null;
	try {
		xhr = new XMLHttpRequest();
	} catch (e) {
		xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}

	if (method == "get" && data) {
		url += "?" + data;
	}

	xhr.open(method,url,true);

	if (method == "get") {
		xhr.send();
	}else{
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send(data);
	}

	xhr.onreadystatechange = function() {
		
		if ( xhr.readyState == 4 ) {
			if ( xhr.status == 200 ) {
				success(xhr.responseText);
			} else {
				alert('出错了,Err：' + xhr.status);
			}
		}
		
	}
}