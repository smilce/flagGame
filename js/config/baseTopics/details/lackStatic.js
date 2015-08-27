define([
	'../../../lib/lib',
	'../../../module/tool',
	'../optionsCommon'
],
function(lib, tool){

	function details(){}
	details.prototype = {
		buildDetails: function(config){
			var result;

			result = tool.getDetails({
				detailsLength: this.detailsLength,
				images: {
					flag: [300, 300]
				},
				nations: config.nations
			})

			this.flag = result.answer.flag;

			return result;
		},
		afterRender: function(){
			var rotate = this.rotate,
				skew = this.skew,
				radius = this.radius,
				cover = this.cover,
				animation = this.animation,
				cssObj = {},
				that = this;

			if(rotate||skew){
				this._addTransform(cssObj, rotate, skew);
			}
			if(radius){
				this._addRadius(cssObj, radius);
			}
			if(animation){
				this._addAnimation(animation);
			}

			lib.loadImg(this.flag, function(data){
				var flag = lib.g('lack-flag'),
					flagImg = lib.g('lack-flag-img'),
					panelHeight = 100;

				flagImg.height = panelHeight;
				if(animation){
					flagImg.width = panelHeight;
				}
				flagImg.src = data.url;
				if(cover){
					flag.appendChild(that._addCovers(flag, cover));
				}
				if(lib.hasKey(cssObj)){
					lib.style(flag, cssObj);
				}

			});

		},
		_addRadius: function(cssObj, radius){
			var radiusNames = this._radiusNames;
			if(!radius.length){
				cssObj["border-radius"] = radius+'%';
			}else{
				radius.forEach(function(radiu, index){
					if(radiu){
						cssObj[radiusNames[index]] = radiu + '%';
					}
				});
			}
		},
		_addTransform: function(cssObj, rotate, skew){
			var transform = [];
			if(rotate){
				transform.push('rotate(' + rotate + 'deg)');
			}
			if(skew){
				transform.push('skew(' + rotate + 'deg)');
			}
			cssObj['transform'] = transform.join(' ');
		},
		_coverNode: lib.create('div', {
			"class": 'flag-cover-item'
		}),
		_addCovers: function(flag, covers){
			var fra = document.createDocumentFragment(),
				coverNode = this._coverNode,
				flagRect = flag.getBoundingClientRect(),
				width = flagRect.width,
				height = flagRect.height;
			covers.forEach(function(cover){
				var node = coverNode.cloneNode();
				lib.style(node, {
					width: cover,
					height: cover,
					left: Math.floor(Math.random()*(width-cover)),
					top: Math.floor(Math.random()*(height-cover))
				});
				fra.appendChild(node);
			});
			return fra;
		},
		_addAnimation: function(flag, speed){
			lib.addClass(lib.g('lack-flag'), 'rotate');
		},
		_radiusNames: [
			'border-top-left-radius', 
			'border-top-right-radius',
			'border-bottom-right-radius',
			'border-bottom-left-radius'
		]
	}



	return {
		tpl: 'lack-details',
		methods: details
	}
})