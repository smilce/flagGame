define([
	'../lib/lib',
	'./command',
	'./choice/config'
], function(lib, command, choiceConfig){

	var privateMethods = {
		sceneNodes: {
			//windowTip: lib.g('window-tip'),
			passRunning: {
				panel: lib.g('game-scene'),
				showMenu: false
			},
			adventureRunning: {
				panel: lib.g('game-scene'),
				showMenu: false
			},
			endlessRunning: {
				panel: lib.g('game-scene'),
				showMenu: false
			},
			challengeRunning: {
				panel: lib.g('game-scene'),
				showMenu: false
			}
		},
		prevScene: null,
		bodyPanel: document.body
	}
	var sceneNodes = privateMethods.sceneNodes;

	choiceConfig.data.forEach(function(d){
		sceneNodes[d.choiceName] = {
			panel: lib.g(d.nodeInfo.panel),
			showMenu: true
		};
	});	


	var publicMethods = {
		change: function(name, data){
			var nodes = privateMethods.sceneNodes,
				node = nodes[name],
				prevScene = privateMethods.prevScene;
			if(prevScene!==name){
				if(node){
					lib.show(node.panel);
				}
				if(nodes[prevScene]){
					lib.hide(nodes[prevScene].panel);
				}
				privateMethods.prevScene = name;
			}
			if(node){
				lib.changeClass(privateMethods.bodyPanel, 'showMenu', node.showMenu);
			}
			
		}
	}

	command.on('change', publicMethods.change);

	lib.proxyEvents(lib.g('main-menu'), 'click', {
		main: function(){
			command.changeStage(choiceConfig.get('model').choiceName);
		}
	});

	return lib.superClass(privateMethods, publicMethods);
});