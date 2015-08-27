define([
	'../../../lib/lib',
	'../../../module/tool',
	'../optionsCommon'
],
function(lib, tool, common){

	return {
		tpl: 'input-word-options',
		methods: {
			buildOptions: function(answerIndex){
				return {
					index: [],
					data: []
				}
			},
			renderRightTip: common.render_text,
			checkRight: common.check_input,
			buildOptions: function(answerIndex, config){
				return tool.getSliceOptions(answerIndex, 3, {
					nations: config.nations,
					noOrder: this.noOrder,
					wordLength: this.wordLength
				});
			},
			setValue: function(data){
				lib.g('topic-item-input').value = data.data.answer.name;
				return true;
			},
			afterRender: function(arg){

				var that = this;

				this.words = [];
				this.model = arg.model;

				lib.proxyEvents(lib.g('iw-op-list'), 'click', {
					inputByClick: function(el){
						that.inputByClick(el.dataset.word);
					} 
				});

			},
			setValue: function(data){

				var value = data.data.answer.name;
				lib.g('topic-item-input').value = value;
					
				return true;
			},
			inputRight: common.inputRight,
			inputByClick: function(word, index){
				var words = this.words,
					submitInput = lib.g('topic-item-input');

				if(index!==undefined){
					words.splice(index, 1, word);
					words.length = index+1;
				}else{
					words.push(word);
				}
				submitInput.value = words.join('');
				
			}
		}
	}
})