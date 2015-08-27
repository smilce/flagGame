/*
	@title	冒险模式配置数据
	@description	冒险模式配置数据
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

	var _adventureMaker = [];

	var AdventureMaker = superMaker(function(arg, config){
		this.config = arg.config;
		this.nations = arg.nations;
		this.intro = arg.desc;

		this.chapterConfig = config.chapterData;
		this.index = config.index;

		var stepNum = 0;
		this.chapterConfig.forEach(function(c){
			stepNum += c.num;
		});
		this.majorCondition = arg.majorCondition||[
			{name: 'right', value: stepNum}
		];
		this.maxStep = stepNum;
	}, {
		overConditon: [
			{name: 'wrong', value: 0}
		],
		getTopic: function(arg){

			var topicData,
				detailsNations;
			
			this.setStepTopic(arg.step);
			//console.log(this.nations)
			if(!this.detailsNations||this.detailsNations.length<=0){
				this.detailsNations = this.nations.slice(0);
			}
			detailsNations = this.detailsNations;

			

			topicData = this.topic.build({ 
				detailsNations: this.detailsNations,
				optionsNations: this.nations
			});

			detailsNations.splice(detailsNations.indexOf(topicData.index.answer), 1);

			return topicData;


		},
		setStepTopic: function(step){
			var chapterConfig = this.chapterConfig,
				changeBase = false,
				nums = 0,
				index = 0;

			chapterConfig.some(function(c,i){
				var preNums = nums;
				nums+=c.num;
				if(step<=nums){
					index=i;
					if(step-preNums===1){
						changeBase = true;
					}
					return true;
				}
				return false;
			});

			var baseTopicData = chapterConfig[index],
				specNation;
			if(!this.topic||changeBase){
				this.detailsNations = null;
				this.topic = baseTopic[baseTopicData.topicName];
			}

		},
		runAdventure: function(arg){
			this.setStepTopic(arg.step);
			return this.run(arg);
		}
	});

	var _adventureConfig = {
		block5: [
			{
				topicName: 'flag2name',
				num: 2
			},{
				topicName: 'writeByLenWord',
				num: 2
			},{
				topicName: 'name2flag',
				num: 2
			},{
				topicName: 'writePlain',
				num: 5,
				nationSet: 'all'
			}
		],
		opec: [
			{
				topicName: 'flag2name',
				num: 5
			},{
				topicName: 'writeByLenWord',
				num: 2
			},{
				topicName: 'name2flag',
				num: 2
			},{
				topicName: 'writePlain',
				num: 5,
				nationSet: 'all'
			}
		],
		vertical3bar: [
			{
				topicName: 'flag2name',
				num: 5
			},{
				topicName: 'writeByLenWord',
				num: 2
			},{
				topicName: 'name2flag',
				num: 2
			},{
				topicName: 'writePlain',
				num: 5,
				nationSet: 'all'
			}
		]
	}

	/*Object.keys(unions).forEach(function(n, index){
		_adventureMaker.push(new AdventureMaker(unions[n], {
			chapterData: {},
	 		index: index+1
	 	}));
	})*/

	Object.keys(_adventureConfig).forEach(function(unionName, index){
	 	var chapterData = _adventureConfig[unionName],
	 		nationData = unions[unionName];
	 	_adventureMaker.push(new AdventureMaker(nationData, {
	 		chapterData: chapterData,
	 		index: index+1
	 	}));
	})

	return  {
		data: _adventureMaker,
		factory: function(topicId, arg){
			topicId--;
			return this.data[topicId].runAdventure(arg);
		}
	};

});