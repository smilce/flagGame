/*
	@title	模式配置数据的基类
	@description	模式配置数据的基类
	@author	minoliu 刘炳礼
	@email	bing545812@gmail.com
	@web	http://www.snowmino.com
	@github	https://github.com/smilce
 */
define([
	'../../lib/lib'
], 
function(lib){

	var superMethods = {
		init: function(arg){
			this.majorCondition = arg.majorCondition||[
				{name: 'right', value: 5}
			];
			this.starCondition = arg.starCondition||[
				{name: 'continueRight', value: 5},
				{name: 'timeout', value: 3},
				{name: 'quickAnswer', value: 3, qualifiedTime: 25},
				{name: 'quickAnswer', value: 1, qualifiedTime: 10},
			];

			if(arg.overCondition){
				this.overCondition = arg.overCondition;
			}
			this.initCondition();
		},
		initCondition: function(){
			this.allStar = this.majorCondition.length + this.starCondition.length;
		},
		run: function(arg){
			var conditionChange = false;
			if(arg.timeLimit!==undefined){
				this.timeLimit = arg.timeLimit
			}
			if(arg.majorCondition!==undefined){
				this.majorCondition = arg.majorCondition;
				conditionChange = true;
			}
			if(arg.starCondition!==undefined){
				this.starCondition = arg.starCondition;
				conditionChange = true;
			}
			if(conditionChange){
				this.initCondition();
			}
			return this;
		},
		beforeRender: function(){
		},
		afterRender: function(arg){
			this.topic.afterRender&&this.topic.afterRender(arg);
		},
		getTopic: function(arg){

			var topic = this.topic,
				data = topic.build();

			return data;


		},
		get: function(key){
			return this.topic[key];
		},
		setBase: function(key, value){
			this.topic[key] = value;
		},
		checkRight: function(arg){
			return this.topic.checkRight(arg);
		},
		useTool: function(name, data){
			var success = true,
				useMethod = this.topic[name==='autoRight'?'setValue':name];
			if(!useMethod||!useMethod.call(this.topic, data)){
				success = false;
			}
			return success;
		}
	}
	function SuperTopic(arg){
		this.name = arg.name;
		this.index = arg.index;
		this.timeLimit = arg.timeLimit||30;
		this.topic = arg.topic;

		this.init(arg);

	};
	SuperTopic.prototype = superMethods;


	return function(fn, proto){
		return fn ? lib.inherit(SuperTopic, fn, proto) : SuperTopic;
	};

});