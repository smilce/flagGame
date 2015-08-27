/*
	@title	超类
	@description	用于定于各模块的格式
	@author	minoliu 刘炳礼
	@email	bing545812@gmail.com
	@web	http://www.snowmino.com
	@github	https://github.com/smilce
 */
define(function(){

	function SuperClass(privateMethods, publicMethods){

		privateMethods.init&&privateMethods.init();
		return publicMethods;
	}

	return SuperClass;

});