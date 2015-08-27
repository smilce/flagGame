/*
	@title	冒险模式
	@description	指定一个专题，如G8国家，所有的题目都跟这个专题有关，答对所有
	题通关
	@author	minoliu 刘炳礼
	@email	bing545812@gmail.com
	@web	http://www.snowmino.com
	@github	https://github.com/smilce
 */
define([
	'./superModel',
	'../choice/config'
], function(superModel, commonConfig){

	var modelData = commonConfig.get('adventure'),
		modelConfig = {
			topicRecord: null,
			isAnswering: true,
			modelName: modelData.runningName,
			dataKey: modelData.modelName + 'Topics',
			topicKey: modelData.modelName,
			choiceName: modelData.choiceName,
			mainMenu: commonConfig.get('model').choiceName
		};

	superModel(modelConfig)

	return modelConfig;
});