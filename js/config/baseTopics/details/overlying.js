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
				detailsLength: this.detailsLength,
				images: {
					flag: [150, 150]
				},
				nations: config.nations
			})
		}

	}

	return {
		tpl: 'overlying-details',
		methods: details
	}
})