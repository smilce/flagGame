/*
	@title	模式选择
	@description	模式选择界面的初始化；操作进入各模块
	@author	minoliu 刘炳礼
	@email	bing545812@gmail.com
	@web	http://www.snowmino.com
	@github	https://github.com/smilce
 */
define([
	'require',
	'../../lib/underscore',
	'../../lib/lib',
	'./../command',
	'../dataFetch',
	'../unlock',
	'./model',
	'./config',
	'./pass',
	'./adventure',
	'./endless',
	'./challenge'
], function(require, _, lib, command, dataFetch, unlock, model, modelConfig){


	var	configData = modelConfig.get('model'),
		modelName = configData.modelName,
		choiceName = configData.choiceName,
		modelData = modelConfig.modelData,
		docKey = configData.nodeInfo.panel;
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

			this.list.innerHTML = this.tpl_topic({data: modelData});

			var that = this;
			this.list.onclick = function(e){
				var target = e.target;
				while(target&&target!==this){
					if(target.getAttribute('role-type')!==null){
						var stageName = target.getAttribute('role-type');
						command.changeStage(stageName);
						break;
					}
					target = target.parentNode;
				}
			}

		}
	}

	choice.init();

	return choice;

});