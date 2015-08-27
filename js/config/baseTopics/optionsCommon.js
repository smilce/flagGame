define([
	'lib/lib',
	'module/tool'
],
function(lib, tool){

	return {
		render_name: function(right, rightAnswer){
			return right ? '回答正确' : "回答错误，正确答案为：" + rightAnswer.data.answer.name;
		},
		render_text: function(right, text){
			return right ? '回答正确' : "回答错误，正确答案为：" + text;
		},
		render_index: function(right, rightAnswer){
			return right ? '回答正确' : "回答错误，正确答案为第" + lib.getSameByName('topic-item', rightAnswer.index.answer).index + '项';
		},
		render_multName: function(right, answer, rightAnswer){
			return right ? '回答正确' : "回答错误，正确答案为：" + 
				rightAnswer.map(function(r){
					return r.name;
				}).join(';');
		},
		check_input: function(topic){
			var userAnswer = lib.g('topic-item-input').value.trim(),
				rightAnswer = topic.data.answer.name,
				right = userAnswer === rightAnswer,
				result = right ? {
					error: 0,
					msg: '回答正确'
				} : {
					error: 1,
					msg: this.renderRightTip(right, rightAnswer)
				};

			return result;
		},
		check_radio: function(topic){
			var val = lib.getNameVal('topic-item'),
				userAnswer = val !== null && val !== undefined ? val.value : -1, 
				rightAnswer = topic.index.answer,
				right = userAnswer === rightAnswer,
				result = right ? {
					error: 0,
					msg: '回答正确'
				} : {
					error: 1,
					msg: this.renderRightTip(right, topic)
				};

			return result;
		},
		check_multRadio: function(topic){
			var val = lib.getNameVal('topic-item'),
				userAnswer = val !== null && val !== undefined ? val.value.split(';') : [], 
				rightAnswer = topic.index.answer,
				right, result;

			userAnswer.forEach(function(d, index){
				userAnswer[index] = ~~d;
			});
			right = lib.equal(userAnswer, rightAnswer);
			result = right ? {
				error: 0,
				msg: '回答正确'
			} : {
				error: 1,
				msg: this.renderRightTip(right, topic, topic.data.answer)
			};

			return result;
		},
		remove_radio: function(data){
			return lib.removeRadio('topic-item', data.index.answer);
		},
		set_radio: function(data){
			lib.checkedRadio('topic-item', data.index.answer);
			return true;
		},
		inputRight: function(data){
			var submitInput = lib.g('topic-item-input'),
				rightWords = data.data.answer.name.split(''),
				userWords = this.words,
				inputIndex = -1;

			if(userWords.length===0){
				inputIndex = 0;
			}else{
				rightWords.some(function(rightWord, index){
					var notSame = userWords[index] !== rightWord;
					if(notSame){
						inputIndex = index;
					}
					return notSame;
				});
			}
			if(inputIndex!==-1){
				this.inputByClick(rightWords[inputIndex], inputIndex);
			}
			return !inputIndex===-1;
		}
	}

});