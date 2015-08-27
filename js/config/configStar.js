/*
	@title	用户数据游戏数据设置的过关评定
	@description	根据关卡的过关条件设置用户的一些游戏数据，以及检查是否过关和星级
	@author	minoliu 刘炳礼
	@email	bing545812@gmail.com
	@web	http://www.snowmino.com
	@github	https://github.com/smilce
 */
define(function(){
	return {
		right: {
			/**
			 * 检测是否过关
			 * @param  {boolean} conditionValue 通过的条件值
			 * @param  {object} userData       用户回答数据
			 * @return {boolean}                是否达到了过关条件
			 */
			check: function(conditionValue, userData){
				return conditionValue <= userData.right;
			},
			setUserDefault: function(userData){
				userData.right = 0;
			},
			updateUserData: function(userData, result){
				if(result.right){
					userData.right++;
				}
			}
		},
		continueRight: {
			check: function(conditionValue, userData){
				return conditionValue <= userData.maxRight;
			},
			setUserDefault: function(userData){
				userData.continueRight = 0;
				userData.maxRight = 0;
				return 'maxRight';
			},
			updateUserData: function(userData, result){
				userData.continueRight = result.right ? ++userData.continueRight : 0;
				if(userData.continueRight>userData.maxRight){
					userData.maxRight = userData.continueRight;
				}
			}
		},
		allRight: {
			check: function(conditionValue, userData){
				return userData.allRight;
			},
			setUserDefault: function(userData){
				userData.allRight = true;
			},
			updateUserData: function(userData, result, condition){
				if(!result.right&&userData.allRight){
					userData.allRight = false;
				}
			}
		},
		timeout: {
			check: function(conditionValue, userData){
				return userData.timeout <= conditionValue;
			},
			setUserDefault: function(userData){
				userData.timeout = 0;
			},
			updateUserData: function(userData, result, condition){
				if(result.timeout){
					userData.timeout ++;
				}
			}
		},
		quickAnswer: {
			check: function(conditionValue, userData, condition){ 
				return  userData[ 'quickAnswer' + condition.qualifiedTime ] >= conditionValue;
			},
			setUserDefault: function(userData, condition){
				var id = 'quickAnswer' + condition.qualifiedTime;
				userData[ id ] = 0;
				return id;
			},
			updateUserData: function(userData, result, condition){
				if(result.right && result.usedTime <= condition.qualifiedTime ){
					userData[ 'quickAnswer' + condition.qualifiedTime ] ++;
				}
			}
		}  
	}
})