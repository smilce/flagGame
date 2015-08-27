define([
	'./command',
	'./dataFetch',
	'../lib/lib'
], function(command, dataFetch, lib){

	var privateMethods, publicMethods, COMMAND_NAME='useTool',
		allTool;

	var defaultTool = [
		{
			id: 1,
			name: 'autoRight',
			intro: '自动答对',
			icon: '&#xe610;',
			num: 3
		},{
			id: 2,
			name: 'addTime5',
			intro: '增加5秒',
			icon: '&#xe60e;',
			num: 5
		},{
			id: 3,
			name: 'addTime10',
			intro: '增加10秒',
			icon: '&#xe60e;',
			num: 3
		},{
			id: 4,
			name: 'removeError',
			intro: '去除错误',
			icon: '&#xe617;',
			num: 10
		},{
			id: 5,
			name: 'inputRight',
			intro: '填入一字',
			icon: '&#xe605;',
			num: 10
		}
	]

	privateMethods = {
		toolVm: null,
		allToolMap: {},
		vmToolMap: {},
		userTool: null,
		use: function(tool){
			var name = tool.name,
				vm = this.toolVm(),
				vmIndex = this.vmToolMap[name],
				storeIndex = this.allToolMap[name];

			if(vmIndex!==undefined&&vm[vmIndex]&&vm[vmIndex].num()>0&&
				allTool[storeIndex]&&allTool[storeIndex].num >0){

				var result = this.topic.userTool[name]();

				if(!result.error){
					var num = vm[vmIndex].num() - 1;
					vm[vmIndex].num(num);
					allTool[storeIndex].num = num;
				}

				//command.emit(COMMAND_NAME, name);
			}
		},
		init: function(){
			var events = {},
				allToolMap = this.allToolMap;
			defaultTool.forEach(function(tool){
				var name = tool.name;
				events[name] = function(){
					privateMethods.use(tool);
				}
			});
			lib.proxyEvents(lib.g('user-tool'), 'click', events);

			allTool = dataFetch.getSync('userTool');
			if(!allTool||!allTool.length){
				allTool = defaultTool;
				dataFetch.set('userTool', allTool);
			}
			allTool.forEach(function(tool, index){
				allToolMap[tool.name] = index;
			});


		}
	}

	publicMethods = {
		change: function(topic){

			privateMethods.topic = topic;

			var tools = [],
				toolMap = privateMethods.vmToolMap;			
			allTool.forEach(function(tool, index){
				var vmTool = lib.extend({}, tool);
				tools.push(vmTool);
				vmTool.num = ko.observable(vmTool.num);
				toolMap[tool.name] = index;
			});

			if(!privateMethods.toolVm){
				
				privateMethods.toolVm = ko.observableArray(tools);
				ko.applyBindings({
					data: privateMethods.toolVm
				}, lib.g('user-tool'));
			}else{
				var vm = privateMethods.toolVm;
				vm.splice.apply(vm, [0,Number.MAX_VALUE].concat(tools));
			}
		},
		COMMAND_NAME: COMMAND_NAME
	}

	return lib.superClass(privateMethods, publicMethods);

});