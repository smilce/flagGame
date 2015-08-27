define([
	'../lib/lib',
	'./dataFetch'
], function(lib, dataFetch){

	var privateMethods = {
		modelData: {
			pass: {
				storeKey: 'userAllTopic',
				data: null
			}
		},
		getModel: function(name){
			var model = this.modelData[name];
			if(!model.data){
				model.data = dataFetch.getSync(model.storeKey);
			}
			return model.data;
		}
	}

	var publicMethods = {
		check: function(model, topic){
			switch(model){
				case 'pass':
					var data = privateMethods.getModel('pass'),
						canPlay = topic.index < data.length;
					canPlay = true;
					return canPlay ? {error: 0} : {error: 1, msg: '完成第'+topic.index+'关前面所有关卡进行解锁'};
				break;
			}
		}
	}

	return lib.superClass(privateMethods, publicMethods);

})