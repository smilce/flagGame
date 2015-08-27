define([
	'../../config/configStar',
	'../../lib/lib',
	'../command',
	'../view/runningView',
	'../dataFetch',
	'../../config/configTopics',
	'../gameTool',
	'../../config/overConditon'
],
function(starMethods, lib, command, mainview, dataFetch, topicMaker, gameTool, overMethods){

var getAnswer; 

var _proto = {
	initEvent: function(){
		var that = this;
		this.userTool = {
			autoRight: function(){
				var result = { error: 1 },
					rightAnswer = getAnswer();
				if(that.isAnswering&&that.topic.useTool('autoRight', rightAnswer)){
					that.submit();
					result.error = 0;
				}
				return result;
			},
			addTime5: function(){
				that.recordData.addTime = (that.recordData.addTime||0)+5;
			},
			addTime10: function(){
				that.recordData.addTime = (that.recordData.addTime||0)+10;
			},
			removeError: function(){
				var result = { error: 1 }
				if(that.topic.useTool('removeError', getAnswer())){
					result.error = 0;
				}
				return result;
			},
			inputRight: function(){
				var result = { error: 1 }
				if(that.topic.useTool('inputRight', getAnswer())){
					result.error = 0;
				}
				return result;
			}
		}
	},
	topicInit: function(arg){
		this.hasPass = false;
		this.step = 0;
		this.userData = {};
		this.initCondition();
		this.topicUpdate(arg);
	},
	/**
	 * 根据设置的关卡通关条件、结束条件设置默认值
	 * @return {[type]} [description]
	 */
	resetUserData: function(){
		var userData = this.userData,
			topic = this.topic,
			major = topic.majorCondition,
			star = topic.starCondition,
			over = topic.overConditon;

		if(major){
			major.forEach(function(condition){
				starMethods[condition.name].setUserDefault(userData, condition);
			});
		}
		if(star){
			star.forEach(function(condition){
				starMethods[condition.name].setUserDefault(userData, condition);
			});
		}
		if(over){
			over.forEach(function(condition){
				overMethods[condition.name].setUserDefault(userData, condition);
			});
		}
		if(this.remindItems){
			this.initRemindItems();
		}
	},
	/**
	 * 初始化关卡的各种相关设置：通关条件、星级评价、失败条件、信息提示等
	 * 只在关卡开始时执行，关卡内的题目切换不会执行此方法
	 * @return {[type]} [description]
	 */
	initCondition: function(){
		var topic = this.topic;
		this.hasPassCondition = false;
		this.userDataMap = {};
		if(topic.majorCondition){
			this.initStarCondition();
		}
		if(topic.overConditon){
			this.initOverConditon();
		}
		if(this.remindItems){
			this.initRemindItems();
		}
		return this;
	},
	initStarCondition: function(){
		var userCondition = this.condition = {},
			userData = this.userData,
			topic = this.topic,
			userDataMap = this.userDataMap;

		this.hasPassCondition = true;

		topic.majorCondition.forEach(function(condition){
			var defaultData = starMethods[condition.name].setUserDefault(userData, condition);
			condition.id = defaultData||condition.name;
			userCondition[condition.id] = condition;

			userDataMap[condition.id] = {
				update: starMethods[condition.name].updateUserData,
				data: condition
			}
		});

		if(topic.starCondition){
			topic.starCondition.forEach(function(condition){
				var defaultData = starMethods[condition.name].setUserDefault(userData, condition);
				condition.id = defaultData||condition.name;
				userCondition[condition.id] = condition;

				userDataMap[condition.id] = {
					update: starMethods[condition.name].updateUserData,
					data: condition
				}
			});
		}

	},
	initOverConditon: function(){
		var userData = this.userData,
			userDataMap = this.userDataMap;
		this.topic.overConditon.forEach(function(condition){
			var name = condition.name,
				methods = overMethods[name];
			methods.setUserDefault(userData, condition);

			if(!userDataMap[name]){
				userDataMap[name] = {
					update: methods.updateUserData
				}
			}
			
		})
	},
	initRemindItems: function(){
		var userData = this.userData,
			userDataMap = this.userDataMap;
		this.remindItems.forEach(function(remindItem){
			userData[remindItem] = 0;

			if(!userDataMap[remindItem]){
				userDataMap[remindItem] = {
					update: starMethods[remindItem].updateUserData
				}
			}

		});
	},
	topicUpdate: function(arg){
		var conditionChange = false;
		if(arg.step!==undefined){
			this.step = arg.step
		}
		if(arg.userData!== undefined){
			var newData = this.userData,
				oldData = arg.userData;

			Object.keys(newData).forEach(function(key){
				if(oldData[key]!==undefined){
					newData[key] = oldData[key];
				}
			});
		}
		return this;
	},
	topicReset: function(){
		this.hasPass = false;
		this.step = 0;
		this.gameover = false;
		this.resetUserData();
	},
	beforeRender: function(){
		this.topic.beforeRender();
		//gameModel.registEvents()
	},
	checkPass: function(){


		return result;
	},
	checkGameOver: function(right, timeout){
		
		var result = { hasPass: false },
			star = 0,
			userData = this.userData,
			topic = this.topic,
			majorCondition = topic.majorCondition,
			overConditon,
			starCondition;

		if(majorCondition){
			majorCondition.forEach(function(condition){
				if(starMethods[condition.name].check(condition.value, userData, condition)){
					result.hasPass = true;
					result.gameover = true;
					star ++;
				}
			});
		}
		

		if(result.hasPass){
			starCondition = topic.starCondition;
			starCondition.forEach(function(condition){
				if(starMethods[condition.name].check(condition.value, userData, condition)){
					star ++;
				}
			});
		}

		// 如果没有满足过关条件并且有游戏结束的条件设置，则检查游戏是否结束
		if((overConditon = this.topic.overConditon)&&!result.hasPass){
			thisOverMethods = overMethods;
			overConditon.some(function(condition){
				if(thisOverMethods[condition.name].check(condition.value, userData)){
					result.gameover = true;
					return true;
				}
			});
		}

		return result;
	},
	updateUserData: function(userData, result){
		var userDataMap = this.userDataMap;

		Object.keys(userDataMap).forEach(function(key){
			var methods = userDataMap[key];
			methods.update(userData, result, methods.data);
		});

	},
	topicResult: function(){
		var answerResut = this.topic.checkRight(getAnswer()),
			right = !answerResut.error,
			result,
			passData,
			userData = this.userData,
			curUsedTime = (this.endTime - this.startTime)/1000,
			totalUsedTime = curUsedTime + this.recordData.usedTime;

		timeout = totalUsedTime > this.topic.timeLimit;

		this.updateUserData(userData, {
			right: right,
			timeout: timeout,
			usedTime: totalUsedTime
		});

		passData = this.checkGameOver();
		
		result = {
			userData: this.userData,
			passData: passData,

			right: right,
			step: this.step,
			answerTip: timeout ? '回答超时' : answerResut.msg
		}

		result.error = right ? 0 : timeout ? 2 : 1;

		this.recordData.usedTime = 0;

	
		return result;
	},
	updateView: function(result){
		var renderData = {
			submit: {
				text: '继续'
			},
			answerTip: {
				text: result.answerTip
			}
		};
		this.mainview.render(renderData);

		if(this.hasPassCondition){
			this.mainview.renderCondition(result.userData, this.topic.condition);
		}

		if(this.remindItems){
			this.mainview.renderRemindItems(result.userData, this.remindItems);
		}


	},
	topicBuild: function(){
		var data = this.topic.getTopic({ step: this.step });
		getAnswer = function(){
			return data;
		}
		return data.data;
	},
	startCountdown: function(time){
		var that = this;
		this.endCountdown();
		this.mainview.renderCountdown(time);
		this.recordData.usedTime = this.topic.timeLimit - time;
		this.startTime = new Date();
		this.topicTimer = setInterval(function(){
			time--;
			that.countdownTime=time;
			that.mainview.renderCountdown(time);
			that.recordData.usedTime = that.topic.timeLimit - time;
			if(time<=0){
				that.submit();
				return;
			}
		}, 1000);
	},
	endCountdown: function(){
		this.endTime = new Date();
		if(this.topicTimer){
			clearInterval(this.topicTimer);
			this.topicTimer = null;
		}
	},
	init: function(){

		var that = this;

		this.mainview = mainview;
		this.mainview.initSet(this.modelName, {
			nextTopic: {
				click: this.nextTopic
			},
			reset: {
				click: this.reset
			},
			submit: {
				click: this.submit,
			},
			back: {
				click: this.back
			},
			main: {
				click: this.main
			}
		}, this.events, this);

		command.on('change', function(name, data){
			if(name === that.modelName){
				that.topicRecord = dataFetch.getSync(that.dataKey)||{};
				that.mainview.changeTo(that.modelName);
				that.go(data);
			}
		});

		this.initEvent();
	},
	go: function(data, config){
		data.step !== undefined ? data.step : 0;
		var recordData = this.updateRecord(data, data.topicId);
		if(data.topicId !== this.topicId){
			this.topicId = data.topicId;
			this.topic = topicMaker.topicFactory(this.topicKey, this.topicId, recordData);
			this.topicInit(recordData);
			this.recordData = recordData;
		}else{
			config&&config.reset ? this.topicReset() : this.topicUpdate(recordData);
		}
		
		if(recordData.gameover){
			this.overTip();
		}else{
			this.guideTip();	
		}
	},
	/**
	 * 游戏结束或者过关提示
	 * @param  {object} passData 过关数据
	 * @return {[type]}          [description]
	 */
	passTip: function(passData){
		var passData = passData||this.topicRecord[this.topicId],
			topic = this.topic,
			intro = passData.hasPass ? '恭喜您已顺利通关！' : '很遗憾，闯关失败'
		
		this.mainview.showTip('pass-tip', lib.extend({
			intro: intro,
			starLen: topic.allStar,
			starGetLen: passData.star
		}, passData) , this.events);
	},
	/**
	 * 游戏引导
	 * @return {[type]} [description]
	 */
	guideTip: function(){
		var majorCondition = this.topic.majorCondition,
			starCondition = this.topic.starCondition;
		this.mainview.showTip('star-guide', {
			title: this.topic.get('title'),
			intro: '',
			major: majorCondition,
			star: starCondition
		}, this);
	},
	overTip: function(){
		this.mainview.showTip('reset-tip', {}, this)
	},
	start: function(){

		var renderData = {
				title: {
					text: this.topic.get('title')
				}
			},
			majorCondition = this.topic.majorCondition,
			starCondition = this.topic.starCondition,
			maxStep = this.topic.maxStep,
			conditionData = {};

		if(majorCondition){
			conditionData.major = majorCondition;
		}
		if(starCondition){
			conditionData.star = starCondition;
		}
		if(this.remindItems){
			conditionData.remindItems = this.remindItems;
		}

		this.mainview.hideTip();
		this.mainview.render(renderData);
		this.mainview.initCondition(conditionData, this.userData);
		gameTool.change(this);
		/*if(data.userData){
			this.mainview.renderCondition(this.topic.userData, this.topic.condition);
		}*/


		this.next();
	},
	next: function(){

		this.step ++;

		this.isAnswering = true;

		var data = this.topicBuild();
		
		//this.beforeRender();

		this.mainview.render({
			submit: {
				text: '提交'
			},
			answerTip: {
				text: ''
			},
			details: {
				html: this.topic.get('details')({
					data: data.answer
				})
			},
			options: {
				html: this.topic.get('options')({
					data: data.options, 
					answerLen: (data.answer.name&&data.answer.name.length)
				})						
			}
		});


		this.topic.afterRender({
			optionsView: this.mainview.getView('options'),
			model: this,
			events: this.events
		});
		if(this.topic.timeLimit){
			var usedTime = this.recordData.usedTime,
				timeLimit = this.topic.timeLimit;
			if(usedTime===undefined||usedTime>=timeLimit){
				usedTime = 0;
			}
			this.startCountdown(timeLimit - usedTime);
		}

		var maxStep = this.topic.maxStep;
		if(maxStep){
			this.mainview.renderProcess({
				maxStep: maxStep,
				step: this.step-1
			})
		}

	},
	updateRecord: function(data, topicId){
		topicId = topicId || this.topicId;
		this.topicRecord[topicId] = this.topicRecord[topicId] || {};
		var record = this.topicRecord[topicId];
		if(data.step!==undefined){
			record.step = data.step;
		}
		if(data.userData!==undefined){
			record.userData = data.userData;
		}
		if(data.passData&&data.passData.star!== undefined){
			if(!record.star||record.star < data.passData.star){
				record.star = data.passData.star;
			}
		}
		if(data.passData&&data.passData.gameover!==undefined){
			record.gameover = data.passData.gameover;
		}
		return record;
	},
	reset: function(){
		this.go({
			topicId: this.topicId,
			step: 0,
			score: 0,
			userData: {},
			passData: { star: 0 , gameover: false}
		}, {
			reset: true
		})
	},
	nextTopic: function(){
		var topicId = this.topicId;
		this.go({ topicId: ++topicId });
	},
	back: function(){
		this.mainview.hideTip();
		this.endCountdown();
		command.changeStage(this.choiceName);
	},
	submit: function(){
		if(this.isAnswering){
			this.endCountdown();

			var result = this.topicResult();

			this.updateView(result);
			if(result){

				this.isAnswering = false;
				this.updateRecord(result);								

				

				if(result.passData.hasPass){
					var topicId = this.topicId;
					topicId++;
					this.updateRecord( {
						step: 0
					}, topicId);
					this.passTip(result.passData, result);
					/*renderData.tip = {
						star: result.star,
						text: '恭喜过关，点击进入下一关'
					}*/

				}else{

					if(result.passData.gameover){
						this.passTip(result.passData, result);
					}

					if(result.error!==2){
						//setTimeout(this.submit.bind(this), 1000);
					}
				}
				
			}
		}else{
			this.next();
		}
	},
	pause: function(){
		this.endCountdown();
	},
	resume: function(){
		this.startCountdown(this.countdownTime);
	},
	main: function(){
		this.mainview.hideTip();
		this.endCountdown();
		command.changeStage(this.mainMenu);
	}
}

return function(config){
	var model = lib.inheritObj(_proto, config);
	model.events = {
		back: model.back.bind(model),
		nextTopic: model.nextTopic.bind(model),
		reset: model.reset.bind(model),
		submit: model.submit.bind(model),
		main: model.main.bind(model)
	}
	model.init();
	//config.init.call(model);
};

});