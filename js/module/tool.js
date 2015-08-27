define([
	'../lib/lib',
	'../config/nations'], function(lib, nationData){

	var tool = {
		//imageTpl: 'http://7xj6vp.com1.z0.glb.clouddn.com/nation.jpg?imageView/2/w/width/h/height',
		nationData: nationData,
		imageTpl: 'guoqi_data/nation.jpg',
		getImage: function(name, width, height){
			console.log(name)
			width = width||300;
			height = height||300;
			return this.imageTpl.replace('nation', name).
				replace('width', width).
				replace('height', height);
		},
		getOne: function(config){
			return Math.floor(Math.random()*config.nations.length);
		},
		getSome: function(num, config, ex){
			var arr = [];
			if(ex===undefined){
				ex = [];
			}else if(!(ex instanceof Array)){
				ex = [ex];
			}
			for(var i=0;i<num;i++){
				var item = this.getOne(config);
				while(lib.contains(item, ex)||lib.contains(item, arr)){
					item = this.getOne(config);
				}
				arr.push(item);
			}
			return arr.length===1?arr[0]:arr;
		},
		getDetails: function(config){
			var answerIndex,
				answer,
				curNations = config.nations;

			if(config.detailsLength&&config.detailsLength>0){
				answerIndex= this.getSome(config.detailsLength, config);
				answerIndex = this.toNationIndex(answerIndex, config.nations);
				answer= this.indexs2Data(answerIndex, config)
			}else{
				answerIndex = this.getOne(config);
				answerIndex = this.toNationIndex(answerIndex, config.nations);
				answer = this.index2Data(answerIndex, config);
			}

			return {
				index: answerIndex,
				data: answer
			}
		},
		getIndexOptions: function(answer, num, config){
			config = config||{};
			var curNations = config.nations,
				answerIndex = curNations.indexOf(answer);

			//	根据基础数据获取选项
			var arr = this.getSome(num, config, answerIndex);
			arr = this.toNationIndex(arr, curNations);

			arr.push(answer);			
			// 打乱选项顺序
			/*while(arr.length>0){
				optionsIndex.push(arr.splice(this.getOne(arr.length), 1)[0]);
			}*/

			return lib.upset(arr);
		},
		getPlainOptions: function(answer, num, config){
			var options,
				optionsIndex = this.getIndexOptions(answer, num, config),
				that = this;

			options = this.indexs2Data(optionsIndex, config)

			return {
				index: optionsIndex,
				data: options
			}
		},
		getSliceOptions: function(answer, num, config){
			var options = [],
				optionsIndex = this.getIndexOptions(answer, num, config),
				that = this;

			lib.each(optionsIndex, function(index){
				options.push.apply(options, that.index2Data(index, config).name.split(''));
			});

			if(config.noOrder){
				var wordLength = config.wordLength;
				while(options.length<wordLength){
					options.push.apply(options, that.index2Data(that.getOne(config), config).name.split(''));
				}
				options.length = wordLength;
				options = lib.upset(options);
			}

			return {
				index: optionsIndex,
				data: options
			}
		},
		getMultOptions: function(answer, num, config){
			var arr = answer.slice(),
				size = answer.length,
				optionsIndex,
				options = [],
				that = this,
				curNations;

			config = config||{};
			curNations = config.nations;

			arr.unshift(this.getSome(1, config, answer));

			while(lib.groupArrNum(arr, size) < num){
				arr.unshift(this.getSome(1, config, arr));
			}

			optionsIndex = lib.groupArr(arr, size).slice(-num);
			optionsIndex = lib.upset(options);

			lib.each(optionsIndex, function(index){
				options.push(that.indexs2Data(index, config));
			});

			options = options.map(function(option){
				var indexArr = [],
					nameArr = [];
				option.forEach(function(item){
					indexArr.push(item.index);
					nameArr.push(item.name);
				});
				return {
					index: indexArr,
					name: nameArr
				}
			});
			
			return {
				index: optionsIndex,
				data: options
			};
		},
		/**
		 * 通过索引获取相关信息
		 * @param  {number} index  索引
		 * @param  {object} images 是否需要获取图片信息以及图片的尺寸
		 * @return {object}        根据索引获取的数据
		 * {
		 * 	name: 名字,
		 * 	index: 索引
		 * 	*image(n): 图片
		 * }
		 */
		index2Data: function(index, config, images){
			var names = this.nationData,
				data = {
					name: names[index],
					index: index
				};
				images = images||config.images;
				if(images){
					for(var key in images){
						var image = images[key];
						data[key] = this.getImage(data.name, image[0], image[1]);
					}
				}
			return data;
		},
		indexs2Data: function(indexs, config, images){
			var data = [],
				that = this;
			images = images||config.images;
			indexs.forEach(function(index){
				data.push(that.index2Data(index, config, images));
			});
			return data;
		},
		toNationIndex: function(index, nationData){
			if(typeof index === 'number'){
				return nationData[index];
			}else{
				return index.map(function(i){
					return nationData[i];
				});
			}
		}	
	}

	return tool;
});