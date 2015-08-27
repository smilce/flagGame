/*
	@title	挑战模式配置数据
	@description	挑战模式配置数据
	@author	minoliu 刘炳礼
	@email	bing545812@gmail.com
	@web	http://www.snowmino.com
	@github	https://github.com/smilce
 */
define([
	'../configTopicBase',
	'../unions',
	'./super'
], 
function(baseTopic, unions, superMaker){

	var _challengeMaker = [];

	var ChallengeMaker = superMaker(function(arg, config){

		this.topic = arg.topic;
		this.name = this.topic.name;

		this.totalTime = 90;
	}, {
		init: function(){}
	});

	Object.keys(baseTopic).forEach(function(base, index){
		base = baseTopic[base];
		_challengeMaker.push(new ChallengeMaker({
			topic: base,
			name: base.name,
			index: index+1,
		}));
	})

	return  {
		data: _challengeMaker,
		factory: function(topicId, arg){
			topicId--;
			return _challengeMaker[topicId];
		}
	};

});