define([
	'../../lib/lib',
	'../../lib/underscore'
],function(lib, _){

	var privateMethods = {
		tipObj: {},
		tipPanel: lib.g('game-tip')
	};

	var publicMethods = {

		show: function(content){
			panel.style.display = '';
			return tipObj;
		},
		hide: function(){

		}
	};

	return lib.superClass(privateMethods, publicMethods);
});