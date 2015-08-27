define([
	'../../../lib/lib',
	'../../../module/tool',
	'../optionsCommon'
],
function(lib, tool){

	function details(){}
	details.prototype = {
		buildDetails: function(config){
			var result,
				flags;

			result = tool.getDetails({
				detailsLength: this.detailsLength,
				images: {
					flag: [150, 150]
				},
				nations: config.nations
			})

			flags = this.flags = [];
			result.answer.forEach(function(d){
				flags.push(d.flag);
			});

			return result;
		},
		afterRender: function(){
			var panelHeight = 100,
				panel = lib.g('slice2-wrap'),
				tpl = this.flagTpl,
				size = this.detailsLength,
				preWidth=0;
			lib.loadImgs(this.flags, function(data){
				data.forEach(function(d, index){
					//d.preWidth = preWidth;
					d.width = ((d.width*panelHeight)/d.height)/size;
					d.preWidth = -(d.width*index); 
				});
				panel.innerHTML = tpl({data: data, panelHeight: panelHeight});
			});
		},
		flagTpl: lib.getTpl('slice2-item-tpl')

	}

	return {
		tpl: 'slice2-details',
		methods: details
	}
})