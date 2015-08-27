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
				nations: config.nations,
				images: {
					image: [300, 300]
				}
			})
		}
	}

	return {
		tpl: 't1-details',
		methods: details
	}
})