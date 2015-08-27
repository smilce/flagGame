define([
	'./module/command',
	'./module/choice/config', 
	'./module/choice/model', 
	'./module/dataFetch',
	'./module/sceneCut'], function(command, modelConfig, choice, dataFetch){
	
	dataFetch.get('recent', function(result){
		command.changeStage(modelConfig.get('model').choiceName , result.data, true);
	});
	
});