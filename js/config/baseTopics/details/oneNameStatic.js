define([
	'../../../lib/lib',
	'../../../module/tool',
	'../optionsCommon'
],
function(lib, tool){

	function details(){}
	details.prototype = {
		buildDetails: function(config){
			return tool.getDetails({
				nations: config.nations
			})
		}
	}

	return {
		tpl: 't2-details',
		methods: details
	}
})