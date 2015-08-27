define(function(){

	var data = [
		{
			name: '模式选择',
			modelName: 'model',
			nodeInfo: {
				panel: 'choice-model'
			},
			canPlay: true
		},
		{
			name: '闯关模式',
			modelName: 'pass',
			nodeInfo: {
				panel: 'game-choice'
			},
			canPlay: true,
			icon: '&#xe61c;'
		},
		{
			name: '地图模式',
			modelName: 'adventure',
			nodeInfo: {
				panel: 'choice-adventure'
			},
			canPlay: true,
			icon: '&#xe61e;'
		},
		{
			name: '无尽模式',
			modelName: 'endless',
			nodeInfo: {
				panel: 'choice-endless'
			},
			canPlay: true,
			icon: '&#xe61f;'
		},
		{
			name: '挑战模式',
			modelName: 'challenge',
			nodeInfo: {
				panel: 'choice-challenge'
			},
			canPlay: true,
			icon: '&#xe620;'
		},
		{
			name: '对战模式',
			modelName: 'fight',
			nodeInfo: {
				panel: 'choice-fight'
			},
			canPlay: false,
			icon: '&#xe622;'
		},
		{
			name: '擂台模式',
			modelName: 'scuffle',
			nodeInfo: {
				panel: 'choice-scuffle'
			},
			canPlay: false,
			icon: '&#xe621;'
		}
	]

	var dataMap = {};
	data.forEach(function(d){
		var name = d.modelName;
		d.choiceName = name + 'Choice';
		d.runningName = name + 'Running';
		d.topicName = name + 'Topic';
		dataMap[name] = d;
	});

	return {
		data: data,
		get: function(key){
			return dataMap[key];
		},
		modelData: data.slice(1)
	};
});