define([
	'../../../lib/lib',
	'../../../module/tool',
	'../optionsCommon'
],
function(lib, tool, common){

	return {

		tpl: 'input-options',
		methods: {
			buildOptions: function(answerIndex){
				return {
					index: [],
					data: []
				}
			},
			renderRightTip: common.render_text,
			checkRight: common.check_input,
			setValue: function(data){
				lib.g('topic-item-input').value = data.data.answer.name;
				return true;
			}
		}
	}
})