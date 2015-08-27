/*
	@title	闯关模式配置数据
	@description	闯关模式配置数据
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
function(_topics, unions, superMaker){


	var PassMaker = superMaker();

	var _passMaker = [
		new PassMaker({
			name: '国旗选国名（10题过关）',
			topic: _topics.flag2name
		}),
		new PassMaker({
			name: '国旗选国名（20题过关）',
			majorCondition: [
				{name: 'right', value: 6}
			],
			starCondition:  [
				{name: 'continueRight', value: 2},
				{name: 'allRight'}
			],
			topic: _topics.flag2name
		}),
		new PassMaker({
			name: '国名选国旗（10题过关）',
			topic:  _topics.name2flag
		}),
		new PassMaker({
			name: '国旗和有序国名填国名',
			topic: _topics.writeByLenWord
		}),
		new PassMaker({
			name: '国旗和无序国名填国名',
			topic: _topics.writeByLenNoOrderWord
		}),
		new PassMaker({
			name: '国旗、有序国名、国名无长度',
			topic: _topics.writeByWord
		}),
		new PassMaker({
			name: '国旗、无序国名、国名有长度',
			topic: _topics.writeByNoOrderWord
		}),
		new PassMaker({
			name: '无提示根据国旗输入国名',
			topic: _topics.writePlain
		}),
		new PassMaker({
			name: '二旗拼接',
			topic: _topics.slice2flag
		}),
		new PassMaker({
			name: '三旗拼接',
			topic: _topics.slice3flag
		}),
		new PassMaker({
			name: '圆形国旗',
			topic: _topics.circle
		}),
		new PassMaker({
			name: '眼睛国旗',
			topic: _topics.bean
		}),
		new PassMaker({
			name: '残缺两块',
			topic: _topics.cover2
		}),
		new PassMaker({
			name: '旋转国旗',
			topic: _topics.rotate5
		}),
		new PassMaker({
			name: '两国旗叠加',
			topic: _topics.overlying2
		}),
		new PassMaker({
			name: '三国旗叠加',
			topic: _topics.overlying3
		})
	]
	_passMaker.forEach(function(t, index){
		t.index = index+1;
	});


	return {
		data: _passMaker,
		factory: function(topicId, arg){
			topicId--;
			return  this.data[topicId].run(arg);
		}
	};

});