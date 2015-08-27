/*
	@title	无尽模式配置数据
	@description	无尽模式配置数据
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

	var _endlessMaker = [];

	var EndlessMaker = superMaker(function(arg, config){

		this.topic = arg.topic;
		this.name = this.topic.name;

	}, {
		overConditon: [
			{name: 'wrong', value: 0}
		],
		init: function(){}
	});

	Object.keys(baseTopic).forEach(function(base, index){
		base = baseTopic[base];
		_endlessMaker.push(new EndlessMaker({
			topic: base,
			name: base.name,
			index: index+1,
		}));
	})

	return  {
		data: _endlessMaker,
		factory: function(topicId, arg){
			topicId--;
			return _endlessMaker[topicId];
		}
	};

});