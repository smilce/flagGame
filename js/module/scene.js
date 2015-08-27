define([
	'../config/configTopics', 
	'./tool',
	'../lib/lib',
	'./command',
	'./dataFetch'], function(topics, tool, lib, command, dataFetch){

	var scene = {

		scoreTopic: lib.g('score-topic'),
		title: lib.g('game-title'),
		tip: lib.g('game-tip'),
		details: lib.g('game-details'),
		options: lib.g('game-options'),
		gameNext: lib.g('game-next'),
		gameNextPanel: lib.g('game-next-panel'),
		gameSubmit: lib.g('game-submit'),

		score: 0,
		hasAnswer: false,
		isAnswering: true,
		topicRecord: null,
		init: function(){
			var that = this;
			this.gameSubmit.onclick = function(){
				var userAnswer = that.topic.userAnswer();
				if(userAnswer===undefined){
					return;
				}
				if(that.isAnswering){
					that.submit(userAnswer);
				}else{
					that.continueStep();
				}
			}
			this.gameNext.onclick = function(){
				command.changeStage('scene', { topicId: ++that.topicId })
				//that.continueStep();	
			}

			lib.g('reset-topic').onclick = function(){
				command.changeStage('scene', {topicId: that.topicId});
			}

			lib.g('back-choice').onclick = function(){
				command.changeStage('choice');
			}

		
			command.on('change', function(name, data){

				if(!that.topicRecord){
					this.topicRecord = dataFetch.getSync('userAllTopic')||{};
					//that.topicRecord[1].step = 9;
				}
				if(name === 'scene'){
					that.go(data.topicId);
				}
			});
		},
		resetTool: function(){
			this.isAnswering = true;
			this.gameSubmit.textContent = '提交';
			this.renderNext(false);
		},
		answeredTool: function(){
			this.isAnswering = false;
			this.gameSubmit.textContent = '继续';
			this.renderNext(true);
		},
		continueStep: function(){
			//if(this.hasAnswer){
			this.next();
			//}
		},
		checkUnlockNext: function(){
			// 当前得分达到关卡设置的通过分数即可过关
			if(this.score >= this.topic.passScore){
				var topicId = this.topicId;
				topicId++;
				if(!this.topicRecord[topicId]){
					this.topicRecord[topicId] = {
						step: 0
					}
					dataFetch.set('userAllTopic', this.topicRecord);
				}	
			}
			this.gameNextPanel.style.display = 
					this.score >= this.topic.passScore ? '' : 'none';
		},
		render: function(topic, data){
			this.title.textContent = topic.title;
			this.details.innerHTML =  topic.details(data.answer);		
			this.options.innerHTML = topic.options( {data: data.options});
		},
		renderScore: function(){
			this.scoreTopic.textContent = this.score +'/'+ this.topic.passScore;
		},
		renderTip: function(tip){
			this.tip.textContent = tip;
		},
		renderNext: function(hasAnswer){
			//this.hasAnswer = hasAnswer;
			//this.gameNext.style.display = hasAnswer ? '' : 'none';
			this.tip.style.display = hasAnswer ? '' : 'none';
		},
		
		stopTopicTimer: function(){
			if(this.topicTimer){
				clearInterval(this.topicTimer);
				this.topicTimer = null;
			}
		},
		startTopicTimer: function(time){
			var that = this;
			this.stopTopicTimer();
			this.topicTimer = setInterval(function(){
				time--;
				console.log(time);
				if(time<=0){
					that.stopTopicTimer();
					this.timeoutTopics.push(true);
					return;
				}
			}, 1000);
		},
		go: function(topicId){

			if(!this.topicRecord[topicId]){
				this.topicRecord[topicId] = {
					step: 0,
					timeouts: 0,
					errors:
				}
			}
			var step = 

			this.topicId = topicId;
			this.topic = topics["t"+topicId];
			this.score = step !== undefined ? step : 0;
			this.timeoutTopics.length = 0;
			this.errorTopics.length = 0;

			(that.topicRecord[data.topicId]&&that.topicRecord[data.topicId].step)
			this.renderScore();


			this.next();

			
		},
		next: function(){
			var topic = this.topic,
				indexData = topic.build(),
				data = this.translateData(indexData);
			

			this.resetTool();
			this.checkUnlockNext();

			this.render(topic, data);

			var rightAnswer = indexData.answer;

			this.submit = function(answer){
				var answerResult = this.topic.checkAnswer(answer.value, rightAnswer, this);
				
				this.answeredTool();

				this.score = answerResult.score;
				this.renderScore();
				this.renderTip(answerResult.tip);

				this.topicRecord[this.topicId].step = this.score;

				this.checkUnlockNext();
			}

			this.startTopicTimer();


		}
	}

	scene.init();

	return scene;

});