/*
	@title	挑战模式
	@description	在指定时间内，尽量答最多的分数，题的分数可能不一样，可选择放弃
	@author	minoliu 刘炳礼
	@email	bing545812@gmail.com
	@web	http://www.snowmino.com
	@github	https://github.com/smilce
 */
define([
	'./superModel',
	'../choice/config',
	'../../lib/lib'
], function(superModel, commonConfig, lib){
	var modelData = commonConfig.get('challenge'),
		modelConfig = {
			topicRecord: null,
			isAnswering: true,
			modelName: modelData.runningName,
			dataKey: modelData.modelName + 'Topics',
			topicKey: modelData.modelName,
			choiceName: modelData.choiceName,
			mainMenu: commonConfig.get('model').choiceName,
			remindItems: ['right'],
			
			/**
			 * 覆写游戏结束或者过关提示
			 * @param  {object} passData 过关数据
			 * @return {[type]}          [description]
			 */
			passTip: function(passData, result){
				var userData = this.userData,
					topic = this.topic,
					intro = '本次挑战共答对'+userData.right+'题'

				if(this.newMax){
					intro = '太了不起了，您创造了一个新的记录<br>' + intro;
				}else{
					intro =  '很遗憾您没能创造新记录<br>' + 
							intro +'<br>您最高记录为' +
							(this.recordData.max||0) +'题，请继续努力';
				}


				this.mainview.showTip('pass-tip', lib.extend({
					intro: intro
				}, passData) , this.events);
			},
			guideTip: function(){
				this.newMax = false;
				this.start();
				this.mainCountdown();
			},
			setGameOver: function(){
				this.endCountdown();

				var passData = {
					gameover: true,
					hasPass: false
				}

				this.updateRecord({
					passData: passData
				});

				this.passTip(passData);

			},
			mainCountdown: function(){
				var that = this,
					totalTime = this.topic.totalTime,
					restTime = that.recordData.mainRestTime||totalTime;
				this.endCountdown();
				this.mainview.renderProcess({
					totalTime: totalTime,
					restTime: restTime
				});
				
				this.mainRestTimer = setInterval(function(){
					restTime--;
					that.mainview.renderProcess({
						restTime: restTime
					});
					that.recordData.mainRestTime = restTime;
					if(restTime<=0){
						that.setGameOver();
						return;
					}
				}, 1000);
			},
			startCountdown: function(time){
				var that = this;
				this.endCountdown(true);
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
			endCountdown: function(keepMain){
				this.endTime = new Date();
				if(this.topicTimer){
					clearInterval(this.topicTimer);
					this.topicTimer = null;
				}

				if(!keepMain&&this.mainRestTimer){
					clearInterval(this.mainRestTimer);
					this.mainRestTimer = null;
				}
			},
			checkNewMax: function(rightNum){
				var topicRecord = this.recordData;
				if(!topicRecord.max||rightNum>topicRecord.max){
					topicRecord.max = rightNum;
					this.newMax = rightNum;
				}
			},
			submit: function(){
				if(this.isAnswering){
					this.endCountdown(true);

					var result = this.topicResult();
					
					this.checkNewMax(result.userData.right);

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

						}else{

							if(result.passData.gameover){
								setTimeout(this.passTip.bind(this, result.passData, result), 500)
							}else{
								this.submit();
							}
							
						}
						
					}
		  		}else{
					setTimeout(this.next.bind(this), 500);
				}
			}
		};

	superModel(modelConfig)

	return modelConfig;
});