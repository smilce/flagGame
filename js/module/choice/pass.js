define([
	'../../lib/underscore',
	'../../lib/lib',
	'../../config/configTopics', 
	'./../command',
	'../dataFetch',
	'../gameModel/passModel',
	'../unlock',
	'./config'
], function(_, lib, allTopics, command, dataFetch, running, unlock, config){

	var configData = config.get('pass'),
		choiceName = configData.choiceName,
		userStep, 
		RUNNING_NAME = running.modelName,
		topics = allTopics.passTopics,
		passData;

	var choice = {

		tpl_topic: _.template(lib.content('tpl-choice')),
		list: lib.g('topic-list'),

		init: function(){
			var that = this;
			command.on('change', function(name, data){

				if(name === choiceName){
					if(!passData){
						that.passData = dataFetch.getSync('userAllTopic');
					}
					userStep = that.passData.length - 1;		
					if(data&&data.topicId){
						that.showRecentTip(data.topicId);
					}else{
						that.build();
					}
				}else if(name === RUNNING_NAME){
					userStep = data.topicId;
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
							canPlay: !unlock.check('pass', topic).error
						};
					if(showData.canPlay){
						showData.allStar= topics[index -1].allStar;
						showData.getStar= (passData[index]&&passData[index].star)||0;
					}
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
		showRecentTip: function(topicId){
			var recentTip = lib.g('recent-tip'),
				recentTopicId = lib.g('recent-topic');

			recentTopicId.textContent = topicId;
			recentTip.style.display = '';

			lib.g('recent-go').onclick = function(){
				recentTip.style.display = 'none';
				command.changeStage(RUNNING_NAME, {topicId: topicId});
			}
			lib.g('recent-cancel').onclick = function(){
				recentTip.style.display = 'none';
				command.changeStage(choiceName);
			}
		},
		select: function(topicId){
			var unlockResult = unlock.check('pass', topics[topicId-1]);
			if(!unlockResult.error){
				command.changeStage(RUNNING_NAME, {topicId: topicId})
			}else{
				alert(unlockResult.msg);
			}
		}
	}

	choice.init();

	return choice;

});