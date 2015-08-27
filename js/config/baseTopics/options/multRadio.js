define([
	'../../../lib/lib',
	'../../../module/tool',
	'../optionsCommon'
],
function(lib, tool, commmon){

	return {

		tpl: 'op-multRadio',
		methods: {
			buildOptions: function(answerIndex, config){
				return tool.getMultOptions(answerIndex, 4, {
					nations: config.nations
				})
			},
			afterRender: function(data){
				lib.proxyEvents(lib.g('options-wrap'), 'click', data.events);
			},
			renderRightTip: commmon.render_multName,
			checkRight: commmon.check_multRadio,
			setValue: commmon.set_radio,
			removeError: commmon.remove_radio
		}
	}
})