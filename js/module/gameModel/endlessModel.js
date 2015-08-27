/*
	@title	无尽模式
	@description	用户答对可一直答题，答错挑战结束
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
	var modelData = commonConfig.get('endless'),
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
				var userData = result.userData,
					passData = passData||this.topicRecord[this.topicId],
					topic = this.topic,
					intro = '本次挑战共答对'+userData.right+'题'

				if(this.newMax){
					intro = '太了不起了，您创造了一个新的记录<br>' + intro;
				}else{
					intro =  '很遗憾您没能创造新记录<br>' + 
							intro +'<br>您最高记录为' +
							this.topicRecord[this.topicId].max+'题，请继续努力';
				}


				this.mainview.showTip('pass-tip', lib.extend({
					intro: intro
				}, passData) , this.events);
			},
			guideTip: function(){
				this.newMax = false;
				this.start();
			},
			checkNewMax: function(rightNum){
				var topicRecord = this.topicRecord[this.topicId];
				if(!topicRecord.max||rightNum>topicRecord.max){
					topicRecord.max = rightNum;
					this.newMax = rightNum;
				}
			},
			submit: function(){
				if(this.isAnswering){
					this.endCountdown();

					var result = this.topicResult();
					


					this.updateView(result);
					if(result){

						this.isAnswering = false;
						this.updateRecord(result);								

						this.checkNewMax(result.userData.right);

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