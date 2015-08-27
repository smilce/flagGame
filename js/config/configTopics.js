define([
	'./model/pass',
	'./model/adventure',
	'./model/endless',
	'./model/challenge'
], 
function(passData, adventureData, endlessData, challengeData){
	
	var MODELS = {
		pass: passData,
		adventure: adventureData,
		endless: endlessData,
		challenge: challengeData
	}
	function topicFactory(model, topicId, arg){
		if(MODELS[model]){
			return MODELS[model].factory(topicId, arg);
		}
	}

	return {
		topicFactory: topicFactory,
		passTopics: passData.data,
		adventureTopics: adventureData.data,
		endlessTopics: endlessData.data,
		challengeTopics: challengeData.data
	};

});