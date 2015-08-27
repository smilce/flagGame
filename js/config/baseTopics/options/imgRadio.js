define([
	'../../../lib/lib',
	'../../../module/tool',
	'../optionsCommon'
],
function(lib, tool, commmon){

	return {

		tpl: 't2-options',
		methods: {
			buildOptions: function(answerIndex, config){
				return tool.getPlainOptions(answerIndex, 3, {
					nations: config.nations,
					images: {
						image: [100, 100]
					}
				})
			},
			afterRender: function(data){
				console.log(data)
				lib.proxyEvents(lib.g('options-wrap'), 'click', data.events);
			},
			renderRightTip: commmon.render_index,
			checkRight: commmon.check_radio,
			setValue: commmon.set_radio,
			removeError: commmon.remove_radio
		}
	}
})