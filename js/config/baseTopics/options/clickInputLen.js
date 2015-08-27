define([
	'../../../lib/lib',
	'../../../module/tool',
	'../optionsCommon'
],
function(lib, tool, common){

	return {

		tpl: 'input-len-word-options',
		methods: {
			renderRightTip: common.render_text,
			checkRight: common.check_input,
			buildOptions: function(answerIndex, config){
				return tool.getSliceOptions(answerIndex, 3, {
					nations: config.nations,
					noOrder: this.noOrder,
					wordLength: this.wordLength
				});
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

				
				var words = value.split(''),
					topicInputs = lib.toArr(lib.g('iw-op-inputs').children);

				words.forEach(function(word, index){
					topicInputs[index].textContent = word;
				});
				
					
				return true;
			},
			inputRight: common.inputRight,
			inputByClick: function(word, index){
				var words = this.words,
					submitInput = lib.g('topic-item-input'),
					topicInputs = lib.toArr(lib.g('iw-op-inputs').children),
					inputIndex = index===undefined?words.length:index,
					inputTopic;

				if(words.length>=topicInputs.length){
					return;
				}

				words.splice(inputIndex, 1, word);
				topicInputs[inputIndex].textContent = word;
				
				submitInput.value = words.join('');

				if(inputIndex===topicInputs.length-1){
					this.model.submit();
				}
				
			}
		}
	}
})