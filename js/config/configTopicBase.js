define([
	'require',
	'../lib/underscore',
	'../lib/lib',
	'../module/tool',
	'./nations',
	'./baseTopics/details/oneFlagStatic',
	'./baseTopics/details/oneNameStatic',
	'./baseTopics/details/sliceStatic',
	'./baseTopics/details/lackStatic',
	'./baseTopics/details/overlying',
	'./baseTopics/options/clickInput',
	'./baseTopics/options/clickInputLen',
	'./baseTopics/options/imgRadio',
	'./baseTopics/options/input',
	'./baseTopics/options/radio',
	'./baseTopics/options/multRadio'
], function(require, _, lib, tool){

	var tplObj = {},
		baseTopics = {},
		defaultNations = lib.buildArr(require('./nations').length);

	var deps = [
		'details/oneFlagStatic',
		'details/oneNameStatic',
		'details/sliceStatic',
		'details/lackStatic',
		'details/overlying',
		'options/clickInput',
		'options/clickInputLen',
		'options/imgRadio',
		'options/input',
		'options/radio',
		'options/multRadio'
	]
	deps.forEach(function(path){
		var paths = path.split('/'),
			type = paths[0],
			typeObj = baseTopics[type];
		if(!typeObj){
			typeObj = baseTopics[type] = {};
		}
		typeObj[paths[1]] = require('./baseTopics/' + path);
	});

	function getTpl(id){
		if(tplObj[id]){
			return tplObj[id];
		}
		tplObj[id] = _.template(lib.content(id));
		setTimeout(function(){
			lib.g(id).remove();
		});
		
		return tplObj[id];
	};


	function build(config){

		var answer = this.buildDetails({
				nations: (config&&config.detailsNations)||defaultNations
			}),
			answerIndex = answer.index,
			options = this.buildOptions(answerIndex, {
				nations: (config&&config.optionsNations)||defaultNations
			}),
			optionsIndex = options.index;


		/*answerIndex = tool.toNationIndex(answerIndex, config.detailsNations);
		optionsIndex = tool.toNationIndex(optionsIndex, config.optionsNations);

		if(answerIndex instanceof Array){
			answer.data.forEach(function(ans, index){
				ans.index = answerIndex[index];
			})
		}else{
			answer.data.index = answerIndex;
		}

		options.data.forEach(function(option, index){
			option.index = optionsIndex[index];
		})*/

		return {
			index: {
				answer: answerIndex,
				options: optionsIndex,
			},
			data: {
				answer: answer.data,
				options: options.data
			}
		}
	}

	function topicFactory(arg){
		var detailsObj = baseTopics.details[arg.details],
			optionsObj = baseTopics.options[arg.options],
			Topic;


		Topic = lib.inherit(detailsObj.methods, function(){

			var that=this,
				detailsProto = detailsObj.methods.prototype,
				optionsProto = optionsObj.methods;

			lib.each(detailsProto, function(name, method){
				if(name in optionsProto){
					that[name] = function(){
						var args = lib.toArr(arguments);
						method.apply(that, args);
						optionsProto[name].apply(that, args);
					}
				}
			});	

			this.details = getTpl(detailsObj.tpl);
			this.options = getTpl(optionsObj.tpl);
			this.union = arg.union;
			this.build = build;
			this.name = arg.name;
			if(arg.config){
				lib.extend(this, arg.config);
			}
		}, optionsObj.methods);

		return new Topic();
	}


	var _topics = {

		flag2name: topicFactory({
			details: 'oneFlagStatic',
			options: 'radio',
			name: '国旗选国名'
		}),
		name2flag: topicFactory({
			details: 'oneNameStatic',
			options: 'imgRadio',
			name: '国名选国旗'
		}),
		writeByLenWord: topicFactory({
			details: 'oneFlagStatic',
			options: 'clickInputLen',
			name: '点击有序提示长度国名'
		}),
		writeByLenNoOrderWord: topicFactory({
			details: 'oneFlagStatic',
			options: 'clickInputLen',
			name: '点击无序提示长度国名',
			config: {
				noOrder: true,
				wordLength: 24
			}
		}),
		writeByWord: topicFactory({
			details: 'oneFlagStatic',
			options: 'clickInput',
			name: '点击有序不提示长度国名'
		}),
		writeByNoOrderWord: topicFactory({
			details: 'oneFlagStatic',
			options: 'clickInput',
			name: '点击无序不提示长度国名',
			config: {
				noOrder: true,
				wordLength: 24
			}
		}),
		writePlain: topicFactory({
			details: 'oneFlagStatic',
			options: 'input',
			name: '输入国名'
		}),
		slice2flag: topicFactory({
			details: 'sliceStatic',
			options: 'multRadio',
			name: '两旗拼接',
			config: {
				detailsLength: 2
			}
		}),
		slice3flag: topicFactory({
			details: 'sliceStatic',
			options: 'multRadio',
			name: '三旗拼接',
			config: {
				detailsLength: 3
			}
		}),
		circle: topicFactory({
			details: 'lackStatic',
			options: 'radio',
			name: '圆形国旗',
			config: {
				radius: 50
			}
		}),
		bean: topicFactory({
			details: 'lackStatic',
			options: 'radio',
			name: '豆状国旗',
			config: {
				radius: [0, 100, 0, 100],
				rotate: -30
			}
		}),
		cover2: topicFactory({
			details: 'lackStatic',
			options: 'radio',
			name: '两旗融合',
			config: {
				cover: [30, 50]
			}
		}),
		rotate5: topicFactory({
			details: 'lackStatic',
			options: 'radio',
			name: '旋转国旗',
			config: {
				radius: 50,
				animation: 5
			}
		}),
		overlying2: topicFactory({
			details: 'overlying',
			options: 'multRadio',
			name: '两覆盖物国旗',
			config: {
				detailsLength:2 
			}
		}),
		overlying3: topicFactory({
			details: 'overlying',
			options: 'multRadio',
			name: '三覆盖物国旗',
			config: {
				detailsLength:3
			}
		})
	}

	return _topics;
});