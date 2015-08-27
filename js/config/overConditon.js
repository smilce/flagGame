/*
	@title	游戏结束判断
	@description	判断达到某些条件后，游戏即结束，此游戏结束与是否过关无关
	@author	minoliu 刘炳礼
	@email	bing545812@gmail.com
	@web	http://www.snowmino.com
	@github	https://github.com/smilce
 */
define(function(){
	return {
		/**
		 * 答错一定数量的题目即结束挑战
		 */
		'wrong': {
			/**
			 * 检测是否游戏结束
			 * @param  {boolean} conditionValue 结束的条件值
			 * @param  {object} userData       用户数据
			 * @return {boolean}                是否结束
			 */
			check: function(conditionValue, userData){
				return userData.wrong > conditionValue;
			},
			setUserDefault: function(userData, condition){
				userData.wrong = 0;
			},
			updateUserData: function(userData, result, condition){
				if(!result.right){
					userData.wrong++;
				}
			}
		},
		/**
		 * 总答题时间达到限制即结束挑战
		 */
		'totalTime': {
			/**
			 * 检测是否游戏结束
			 * @param  {boolean} conditionValue 结束的条件值
			 * @param  {object} userData       用户数据
			 * @return {boolean}                是否结束
			 */
			check: function(conditionValue, userData){
				return userData.totalTime > conditionValue;
			},
			setUserDefault: function(userData, condition){
				userData.wrong = new Date().getTime();
			},
			updateUserData: function(userData, result, condition){
				if(!result.right){
					userData.wrong++;
				}
			}
		},
	}
});