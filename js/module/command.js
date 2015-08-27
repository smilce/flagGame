/**
*	控制场景切换
**/

define([
	'../lib/lib',
	'./dataFetch'
], function(lib, dataFetch){	

	var command = {

		stageData: null,
		/**
		 * 切换不同场景
		 * @name  {string 场景名}
		 * @arg  {object 传给各场景的参数}
		 * @noSave {boolean 是否需要保存场景信息}
		 * @return {string 场景名}
		 */
		changeStage: function(name, arg, noSave){

			this.emit('change', name, arg);

			if(!noSave){
				this.stageData = {
					type: name,
					data: arg
				}
				dataFetch.set('recent', this.stageData);
			}
		}
	}

	lib.enableEvents(command);

	return command;

});