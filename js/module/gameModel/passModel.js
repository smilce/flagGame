/*
	@title	闯关模式
	@description	用户挑战关卡，满足条件可过关并开启下一个关卡
	挑战过程中，每关的过关条件可能不一样，每题也可能会有星级评定
	@author	minoliu 刘炳礼
	@email	bing545812@gmail.com
	@web	http://www.snowmino.com
	@github	https://github.com/smilce
 */
define([
	'./superModel',
	'../choice/config'
], function(superModel, commonConfig){

	var modelData = commonConfig.get('pass'),
		name = modelData.modelName,
		config = {
			topicRecord: null,
			isAnswering: true,
			modelName: name + 'Running',
			dataKey: 'userAllTopic',
			topicKey: name,
			choiceName: name + 'Choice',
			mainMenu: commonConfig.get('model').choiceName
		};

	superModel(config);

	return config;

});