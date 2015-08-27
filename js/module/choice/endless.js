define([
	'../../lib/underscore',
	'../../lib/lib',
	'../../config/configTopics', 
	'./../command',
	'../dataFetch',
	'../gameModel/endlessModel',
	'../unlock',
	'./config'
], function(_, lib, allTopics, command, dataFetch, running, unlock, config){

	var configData = config.get('endless'),
		choiceName = configData.choiceName,
		runningName = configData.runningName,
		docKey = configData.nodeInfo.panel,
		topics = allTopics.endlessTopics,
		passData;
	var choice = {

		tpl_topic: _.template(lib.content(docKey+'-tpl')),
		list: lib.g(docKey+'-list'),

		init: function(){
			var that = this;
			command.on('change', function(name, data){
				if(name === choiceName){
					
					that.build();
				}
			});
		},
		build: function(){
			var data = [],
				passData = this.passData;
			for(var key in topics){
				if(topics.hasOwnProperty(key)){
					var topic = topics[key],
						index = topic.index,
						showData = {
							name: topic.name,
							index: index,
							canPlay: true
						};
					data.push(showData);
				}
			}
			this.list.innerHTML = this.tpl_topic({data: data});

			var that = this;
			this.list.onclick = function(e){
				var target = e.target;
				while(target&&target!==this){
					if(target.getAttribute('role-step')!==null){
						var step = ~~target.getAttribute('role-step');
						that.select(step);
						break;
					}
					target = target.parentNode;
				}
			}

		},
		select: function(topicId){
			command.changeStage(runningName, {topicId: topicId})
		}
	}

	choice.init();

	return choice;

});