define(function(){

	var dataFetch = {

		// 用户所有的数据存储，下面数据为默认值
		defaullData: {
			// 用户最后一次操作，type是操作类型：choice or scene
			// value是具体值，choice时无值，scene时代表上次玩的第几关
			recent: {
				type: 'choice',
				//data: {topicId: _ }
			},
			// 用户通关的最高关数，默认为第1关
			userMaxTopic: 1,
			// 用户所有关卡的记录
			// key值是每个关卡，step是进行到第几题，
			// question是题目内容，暂不实现
			userAllTopic: [
				{},
				{
					step: 1, 
					// question: {question: 1, options: [123, 56, 38]}
				}
			],
			userTool: [],
			endlessTopics: [
				{},
			],
			challengeTopics: [
				{},
			]
		},
		data: {},
		setMethod: {
			/*userAllTopic: function(val){
				var topics = this.data.userAllTopic,
					setId = val.id;

				topics[setId] = val.data;
				this.ls.setItem('userAllTopic', JSON.stringify(topics));

			}*/
		},
		ls: window.localStorage,
		fetch: function(key, cb){
			var val = JSON.parse(this.ls.getItem(key));
			if(!val){
				val = this.defaullData[key];
			}
			this.data[key] = val;
			cb&&cb(val);
			return val;
		},
		set: function(key, val){
			if(this.setMethod[key]){
				this.setMethod[key].call(this, val);
			}else{
				this.data[key] = val;
				//this.ls.setItem(key, JSON.stringify(val));
			}
		},
		get: function(key, cb){
			if(this.data[key]){
				cb&&cb(this.data[key]);
			}else{
				this.fetch(key, cb);
			}
		},
		/**
		 * 同步方式获取数据，方便以后服务器获取方式的策略修改
		 * @key  {string 数据名称}
		 * @return {object 数据}
		 */
		getSync: function(key){
			return this.data[key] ? this.data[key] : this.fetch(key);
		},
	}

	window.onbeforeunload = function(){
		var df = dataFetch,
			ls = df.ls;
		ls.setItem('recent', JSON.stringify(df.getSync('recent')));	
		ls.setItem('userAllTopic', JSON.stringify(df.getSync('userAllTopic')));
		ls.setItem('endlessTopics', JSON.stringify(df.getSync('endlessTopics')));
		ls.setItem('challengeTopics', JSON.stringify(df.getSync('challengeTopics')));
		//ls.setItem('userTool', JSON.stringify(df.getSync('userTool')));
	}

	return dataFetch;

});