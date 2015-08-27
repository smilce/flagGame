define([
	'../../config/configTopics', 
	'../tool',
	'../../lib/lib',
	'../command',
	'../dataFetch',
	'../../lib/underscore'], function(topics, tool, lib, command, dataFetch, _, tip){
		
	var privateMethods, publicMethods,
		STAR_FLAG = 'star-';

	privateMethods = {

		conditionNodes: {
			
		},
		starRender: {
			/*continueRight: function(userData, condition){
				var numId = STAR_FLAG + name+'-num',
					imageId = STAR_FLAG + name+'-image',
					numNodes = nodes[numId],
					imageNodes = nodes[imageId];
				if(!numNodes){
					numNodes = lib.g(numId);
				}
				if(!imageNodes){
					imageNodes = lib.g(imageId);
				}
				numNodes.textContent = userData[name];
				imageNodes.style.bottom = 
					Math.floor(userData[name]/condition.value*100) + '%';
			},*/
			quickAnswer: function(userData, condition){
				/*var nodes = privateMethods.conditionNodes,
					id = STAR_FLAG + 'quickAnswer' + condition.qualifiedTime
					numId = STAR_FLAG + condition. +'-num',
					imageId = STAR_FLAG + name+'-image',
					numNodes = nodes[numId],
					imageNodes = nodes[imageId];*/
			},
			allRight: function(userData, condition){

				//numNodes.textContent = userData[name] ? '全部答对' : '未全部答对';
				//imageNodes.style.bottom = 
				//		(userData[name] ? 100 : 0) + '%';
			}
		},
		conditionMethods: {
			//starTpl: _.template(lib.content('tpl-star')),

			right: function(value){
				var data = {
					title: '答对',
					intro: '答对' + value + '题'
				}
				return data;
				//return lib.str2dom(this.starTpl(data));
			},
			continueRight: function(value){
				var data = {
					title: '连对'+value+'题'
				}
				return data;
				//return lib.str2dom(this.starTpl(data));
			},
			allRight: function(data){
				var data = {
					title: '全部答对'
				}
				return data;
				//return lib.str2dom(this.starTpl(data));
			},
			timeout: function(value){
				var data = {
					title: '超时',
					intro: '超时少于' + value + '题'
				}
				return data;
				//return lib.str2dom(this.starTpl(data)); 
			},
			quickAnswer: function(value, condition){
				var qualifiedTime = condition.qualifiedTime,
					title = qualifiedTime <=3 ? '秒答' :  qualifiedTime + '秒答对'
					data = {
						title: title,
						intro: title +'题数达到'+value
					}
				return data;
				//return lib.str2dom(this.starTpl(data)); 
			}
		},
		nodes: {
			submit: lib.g('game-submit'),
			reset: lib.g('reset-topic'),
			back: lib.g('back-choice'),
			main: lib.g('to-main'),
			details: lib.g('game-details'),
			options: lib.g('game-options'),
			answerTip: lib.g('game-tip'),
			panel: lib.g('game-scene'),
			title: lib.g('game-title'),
			nextTopic: lib.g('game-next'),
			majorPass: lib.g('major-pass'),
			starPass: lib.g('star-pass'),
			countdownStep: lib.g('countdown-step')
		},
		render: function(dom, data){
			if(data.hide!==undefined){
				lib.hide(dom);
			}
			if(data.text!==undefined){
				dom.textContent = data.text;
			}
			if(data.html!==undefined){
				dom.innerHTML =  data.html;
			}
		},
		extendCondition: function(conditions){
			var methods = this.conditionMethods;
			if(conditions.major){
				conditions.major.forEach(function(condition){
					var renderData = methods[condition.name](condition.value, condition);
					lib.extend(condition, renderData);
				});
			}
			if(conditions.star){
				conditions.star.forEach(function(condition){
					var renderData = methods[condition.name](condition.value, condition);
					lib.extend(condition, renderData);
				});
			}
		},

		scene: {},
		tipObj: {},
		tipPanel: lib.g('window-tip')
	}

	publicMethods = {
		hasInitEvents: false,
		initSet: function(id, ev, events, context){
			privateMethods.scene[id] = {
				ev: ev,
				context: context
			};

			//lib
		},
		changeTo: function(id){
			var nodes = privateMethods.nodes,
				scene = privateMethods.scene[id],
				events = scene.ev,
				context = scene.context;

			Object.keys(events).forEach(function(ev){
				var data = events[ev],
					node = nodes[ev];

				node.onclick = data.click ? function(){
					data.click.call(context);
				} : null;
				// 默认显示
				lib[ data.hide ? 'hide' : 'show' ](node);
				
			});

		},
		render: function(data){
			var nodes = privateMethods.nodes,
				render = privateMethods.render;
			Object.keys(data).forEach(function(name){
				render(nodes[name], data[name]);
			});
		},
		renderRemindItems: function(userData, conditions){
			var vm = this.remindVm;
			conditions.forEach(function(condition){
				vm[condition](userData[condition]);
			});
		},
		renderCondition: function(userData, conditions){
			var vm = this.starViewModel,
				map = this.starMap,
				commonViewModel = this.commonViewModel,
				newValue;
			Object.keys(userData).forEach(function(key){
				var indexData = map[key];
				newValue = userData[key]
				if(indexData){
					var typeData = vm[indexData.type]();
					typeData[indexData.index].userValue(newValue);
				}
				if(commonViewModel[key]){
					commonViewModel[key](newValue);
				}
			});
			return;
		},
		/**
		 * 展现各种浮层弹窗
		 * @param  {string} id     浮层的id
		 * @param  {object} data   浮层的渲染数据
		 * @param  {object} events model层提供的一些供view使用的方法
		 * @return {object}        浮层对象
		 */
		showTip: function(id, data, events){
			var tipObj = privateMethods.tipObj[id],
				panel = privateMethods.tipPanel,
				detail,
				tpl,
				toolVm;
			if(!tipObj){
				tipObj = privateMethods.tipObj[id] = {};
				tipObj.init = true;
				tipObj.tpl = _.template(lib.content(id+'-tpl'));
				tipObj.detail = lib.g(id+'-detail');
				tipObj.toolVm = {
					hasPass: ko.observable(data.hasPass)
				}

				lib.g(id+'-tool').onclick = function(e){
					var target = e.target,
						clickEvent;
					if(target&&(clickEvent=lib.attr(target, 'pt-click'))){
						events[clickEvent]&&events[clickEvent].call(events);
					}
				}

				ko.applyBindings(tipObj.toolVm, lib.g(id+'-tool'));
			}
			tpl = tipObj.tpl;
			detail = tipObj.detail;
			privateMethods.extendCondition(data)
			detail.innerHTML = tpl(data);
			if(privateMethods.tipOldId){
				lib.removeClass(panel, privateMethods.tipOldId);
			}
			lib.addClass(panel, id);
			privateMethods.tipOldId = id;
			lib.show(panel);

			toolVm = tipObj.toolVm;
			Object.keys(data).forEach(function(d){
				if(d in toolVm){
					toolVm[d](data[d]);
				}
			});

			return tipObj;
		},
		hideTip: function(){
			lib.hide(privateMethods.tipPanel);
		},
		starViewModel: null,
		commonViewModel: null,
		starMap: {},
		initPassConditon: function(data, userData){
			var conditionData = {},
				map = this.starMap = {},
				methods = privateMethods.conditionMethods;
			for(var key in data){
				if(data.hasOwnProperty(key)){
					var cd = conditionData[key] = [];
					data[key].forEach(function(condition, index){
						var renderData = methods[condition.name](condition.value, condition);
						lib.extend(renderData, condition);
						renderData.userValue = 
							ko.observable(userData[renderData.id]);
						renderData.percent = ko.computed(function() {
							var per= this.userValue()/this.value;
						
							
					        return  -(100-Math.floor((per>1?1:per)*100))+"%" ;
					    }, renderData);
						cd.push(renderData);
						map[renderData.id] = {
							type: key,
							index: index
						}
					});
				}
			}

			lib[ data.star ? 'show' : 'hide' ](privateMethods.nodes.starPass);

			if(!this.starViewModel){
				this.starViewModel = {
					major: ko.observableArray(conditionData.major),
					star: ko.observableArray(conditionData.star)
				}
				ko.applyBindings(this.starViewModel, lib.g('star-panel'));
				
				var commonViewModel = this.commonViewModel = {};
				for(var key in userData){
					if(userData.hasOwnProperty(key)){
						commonViewModel[key] = ko.observable(userData[key]);
					}
				}
				ko.applyBindings(commonViewModel, lib.g('game-command'));
			}else{
				var vmMajor = this.starViewModel.major,
					vmStar = this.starViewModel.star,
					len = Number.MAX_VALUE;
				vmMajor.splice.apply(vmMajor, [0,len].concat(conditionData.major));
				vmStar.splice.apply(vmStar, [0,len].concat(conditionData.star));

			}
		},
		initOverConditon: function(){

		},
		remindVm: null,
		initRemindItems: function(items, userData){
			var vm = this.remindVm;

			if(!vm){
				vm = this.remindVm = {
					right: ko.observable(undefined),
					continueRight: ko.observable(undefined)
				}

				ko.applyBindings(vm, lib.g('remind-items'));
			}

			items.forEach(function(item){
				if(vm[item]){
					vm[item](userData[item]);
				}
			});
		},
		initCondition: function(data, userData){
			
			if(data.major||data.star){
				this.initPassConditon(data, userData);
				lib.show(lib.g('star-panel'));
			}else{
				lib.hide(lib.g('star-panel'));
			}
			if(data.remindItems){
				this.initRemindItems(data.remindItems, userData);
				lib.show(lib.g('remind-items'));
			}else{
				lib.hide(lib.g('remind-items'));
			}

		},
		processViewModel: null,
		renderProcess: function(data){
			if(data.totalTime!==undefined||data.restTime!==undefined){
				if(!this.processViewModel){
					this.processViewModel = {
						restTime: ko.observable(data.restTime),
						totalTime: ko.observable(data.totalTime)
					}
					this.processViewModel.per = ko.computed(function() {
				        return this.restTime()/this.totalTime()*100;
				    }, this.processViewModel);
					this.processViewModel.showTime = ko.computed(function() {
						var restTime = this.restTime(),
							timeTip = (restTime%60) + '秒';
						if(restTime>59){
							timeTip = Math.floor(restTime/60) + '分' + timeTip;
						}
				        return  timeTip;
				    }, this.processViewModel);
					ko.applyBindings(this.processViewModel, lib.g('process-time-wrap'));
				}else{
					var vm = this.processViewModel;
					if(data.restTime){
						vm.restTime(data.restTime);
					}
					if(data.totalTime){
						vm.totalTime(data.totalTime);
					}
				}				
			}
			return;
			if(data.maxStep){
				if(!this.processViewModel){
					this.processViewModel = {
						maxStep: ko.observable(data.maxStep),
						step: ko.observable(data.step)
					}
					this.processViewModel.per = ko.computed(function() {
				        return Math.floor(this.step()/this.maxStep()*100);
				    }, this.processViewModel);
					ko.applyBindings(this.processViewModel, lib.g('process-wrap'));
				}else{
					var vm = this.processViewModel;
					if(data.maxStep){
						vm.maxStep(data.maxStep);
					}
					if(data.step){
						vm.step(data.step);
					}
				}				
			}
		},
		renderCountdown: function(time){
			privateMethods.nodes.countdownStep.textContent = time;
		},
		getView: function(name){
			return privateMethods.nodes[name];
		}
	}

	return lib.superClass(privateMethods, publicMethods);

});