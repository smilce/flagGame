define(function(){

    function Founder(arg){
        this.author = "minoliu";
        this.version = "0.0.0.0";
        this.web = (arg&&arg.web)||"http://www.snowmino.com";

    }
    Founder.prototype = {
        constructor: Founder
    }

    var tplObj = {};

    var needPxNames = ["left","top","bottom","right","width","height"]

	var lib = {
		contains: function(item, arr){
			return arr.indexOf(item) > -1 ? true : false;
		},
		g: function(id){
			return document.getElementById(id);
		},
        on: function(el, ev, fn){
            el = typeof el === 'string' ? lib.g(el) : el;
            el.addEventListener(ev, fn, false);
        },
        hasKey: function(obj){
            var has;
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    has = true;
                    break;
                }
            }
            return has;
        },
        attr: function(el, name){
            el = typeof el === 'string' ? lib.g(el) : el;
            return el.getAttribute(name);
        },
        style: function(dom, attrs){
            dom = typeof dom === 'string' ? lib.g(dom) : dom;
            var text = "";
            lib.each(attrs,function(key,value){
                text += key + ":" + value  +  
                    ((lib.contains(key, needPxNames)&&/^-{0,1}\d+(\.?\d+)*$/.test(value)) ? "px;" : ";");
            });
            dom.style.cssText = text;
        },
        show: function(dom){
            dom.style.display = '';
        },
        hide: function(dom){
            dom.style.display = 'none';
        },
        addClass: function(el, name){
            el = typeof el === 'string' ? lib.g(el) : el;
            el.classList.add(name);
            return this;
        },
        removeClass: function(el, name){
            el = typeof el === 'string' ? lib.g(el) : el;
            el.classList.remove(name);
            return this;
        },
        changeClass: function(el, name, show){
            lib[ show ? 'addClass' : 'removeClass' ](el, name);
        },
        proxyEvents: function(el, ev, events){
            var attrName = 'pt-'+ev,
                evName;
            el['on' + ev] = function(e){
                var target = e.target;
                while(target&&target!==this){
                    if((evName = target.getAttribute(attrName))!==null&&events[evName]){
                        events[evName](target);
                        break;
                    }
                    target = target.parentNode;
                }
            }
        },
        str2dom: function(str){
            var div = document.createElement('div');
            div.innerHTML = str;
            return div.firstElementChild;
        },
		content: function(dom){
			if(typeof dom === 'string'){
				dom = lib.g(dom);
			}
            if(!dom)
            console.log(arguments.callee.caller)
			return dom.textContent;
		},
		each: function(arr, fn){
            if(arr instanceof Array){
                arr.forEach(fn);
            }else{
                Object.keys(arr).forEach(function(key){
                    fn(key, arr[key]);
                })
            }
			
		},
		find: function(val, arr, fn){
			fn = fn || function(val, item){
				return val === item;
			};
			var match,
                matchIndex,
				have;

			have = arr.some(function(item, index){
                var isMatch = fn(val, item);
                if(isMatch){
                    match = item;
                    matchIndex = index+1;
                }
				return isMatch;
			});
			return match ? { value: isNaN(match.value) ? match.value : ~~match.value, index: matchIndex} : undefined;
		},
		toArr: function(list){
			return Array.prototype.slice.call(list);
		},
        upset: function(arr){
            var newArr = [];
            while(arr.length>0){
                var index = Math.floor(Math.random()*arr.length);
                newArr.push(arr.splice(index, 1)[0]);
            }
            return newArr;
        },
		getNameVal: function(name){
			var items = lib.toArr(document.getElementsByName(name)),
				match = lib.find(true, items, function(val, item){
					return val === item.checked;
				});
			return match;

		},
        getSameByName: function(name, value){
            var items = lib.toArr(document.getElementsByName(name)),
                match = lib.find(value, items, function(val, item){
                    return val === ~~item.value;
                });
            return match;
        },
        checkedRadio: function(name, value){
            var items = lib.toArr(document.getElementsByName(name)),
                match = lib.find(value, items, function(val, item){
                    var isSame = val === ~~item.value;
                    if(isSame){
                        item.checked = true;
                    }
                    return isSame;
                });
            return match;
        },
        removeRadio: function(name, value){

            var items = lib.toArr(document.getElementsByName(name)),
                match;
            if(items.length<3){
                return undefined;
            }
            match = lib.find(value, items, function(val, item){
                var notSame = val !== ~~item.value;
                if(notSame){
                    item.parentNode.parentNode.remove();
                }
                return notSame;
            });
            return match;
        },
		extend: function(target, source) {
            if (source) {
                for (var prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        target[prop] = source[prop];
                    }
                }
            }
            return target;
        },
        enableEvents: function(obj){
            lib.extend(obj, lib.Events);
        },
        loadImg: function(url, cb){
            var image = new Image();
            image.onload = function(){
                cb&&cb({
                    width: image.width,
                    height: image.height,
                    url: image.src
                });
            }
            image.src  = url;
        },
        loadImgs: function(urls, cb){
            var len = urls.length,
                data = [];
            urls.forEach(function(url, index){
                var image = new Image();
                image.onload = function(){
                    data[index] = {
                        width: image.width,
                        height: image.height,
                        url: image.src,
                        index: index
                    }
                    len--;
                    if(len<=0){
                        cb&&cb(data);
                    }
                }
                image.src  = url;
            });
        },
        calcImg: function(){

        },
        getTpl: function(id){
            if(tplObj[id]){
                return tplObj[id];
            }
            tplObj[id] = _.template(lib.content(id));
            setTimeout(function(){
                lib.g(id).remove();
            });
            
            return tplObj[id];
        },
        equal: function(left, right){
            if(left.length!==right.length){
                return false;
            }
            return !left.some(function(val, index){
                return val !== right[index];
            });
        },
        create: function(tagName, attrs){
            var tag = document.createElement(tagName);
            lib.each(Object.keys(attrs), function(key){
                tag.setAttribute(key, attrs[key]);
            });
            return tag;
        },
        Events: {
            on: function(ev, fn, context) {
                this.events = this.events || {};
                this.events[ev] = this.events[ev] || [];
                this.events[ev].push({
                    fn: fn,
                    context: context || this
                });

                if (this.events[ev].hasExcute) {
                    this.excute(ev, this.events[ev].hasExcute.args);
                }

            },
            emit: function(ev) {

                var that = this;
                if (!that.events || !that.events[ev]) {
                    this.events = this.events || {};
                    this.events[ev] = this.events[ev] || [];
                    that.events[ev].hasExcute = {
                        args: args
                    };
                    return;
                }
                var args = lib.toArr(arguments).slice(1);
                if (that.events[ev]) {
                    for (var i = 0,
                    f; f = that.events[ev][i]; i++) {
                        f.fn.apply(f.context || this, args || []); //ie下第二个参数必须是数组
                    }
                }

            }
        },

        inherit: function (parent, context, protoProps){
            parent = parent || Founder;
            var child = function(){
                parent.apply(this, arguments);
                context.apply(this, arguments);
            }
            var empty = function(){this.constructor = child};
            empty.prototype = parent.prototype;
            child.prototype = new empty;

            if(protoProps) lib.extend(child.prototype, protoProps);

            child.__super__ = parent.prototype;

            return child;
        },
        inheritObj: function(parentProto, proto){
            var obj = Object.create(parentProto);
            lib.extend(obj, proto);
            return obj;
        },
        superClass: function(privateMethods, publicMethods){

            privateMethods.init&&privateMethods.init();
            return publicMethods;
        },
        groupArr: function(oldArr, size){
            size = size||2;
            var arrLen=oldArr.length,
                endLen = arrLen - size + 1,
                resultArr = [];


            function run(arr, start, len){
                var baseArr = arr.slice();
                if(len===arrLen){
                    for(var i=start;i<len;i++){
                        var newArr = baseArr.slice();
                        newArr.push(oldArr[i]);
                        resultArr.push(newArr);
                    }
                }else if(len<arrLen){
                    for(var i=start;i<len;i++){
                        var newArr = baseArr.slice();
                        newArr.push(oldArr[i]);
                        run(newArr, i + 1, len+1);
                    }
                }
                
            }

            run([], 0, endLen);

            return resultArr;
        },
        groupArrNum: function(arr, size){
            size = size||2;
            var arrLen=arr.length,
                endLen = arrLen - size + 1,
                num = 0;


            function run(start, len){
                if(len===arrLen){
                    num += len - start; 
                }else if(len<arrLen){
                    for(var i=start;i<len;i++){
                        run(i + 1, len+1);
                    }
                }
            }

            run(0, endLen);
            return num;
        },
        buildArr: function(length){
            var arr = [];
            while(length>0){
                length--;
                arr.unshift(length);
            }
            return arr;
        }
	}

    var windowConsole = window.console||{};
    window.console2 = {
        log: function(){
            //return;
            windowConsole.log.apply(windowConsole, lib.toArr(arguments) );

        }
    }

	return lib;

});