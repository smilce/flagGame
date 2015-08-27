var request = require('request'),
	iconv = require('iconv-lite'),
	cheerio = require('cheerio'),
	http = require('http'),
	fs = require('fs');

var words = [],
	carWebs = [],
	carWebReg = /http\:\/\/car\.autohome\.com\.cn\/price\/brand\-\w+\.html/g,
	getWordTpl = 'http://www.autohome.com.cn/grade/carhtml/word.html',
	getCarWebTpl = 'http://car.autohome.com.cn/price/brand-{number}.html';

for(i=0;i<26;i++){
	words[i] = String.fromCharCode(i+65);
}

var r = request.defaults({'proxy':'http://10.199.75.12:8080'})

var get62 = {
	dic: (function(){
		var dic = [];
		for(var i=0;i<36;i++){ 
		    dic[i] = i<10 ? i :  String.fromCharCode(i+87)
		}
		for(i=36;i<62;i++){
			dic[i] = String.fromCharCode(i+29);
		}
		return dic;
	})(),
	excute: function() {
		num = Math.random()*Math.pow(10,16);
	    if(num===0){
	        return this.dic[num];
	    }
	    var result = [];
	    while (num >= 1) {
	        result.unshift(this.dic[num % 62]);
	        num = Math.floor(num / 62)
	    }
	    return result.join("");
	}
}

Array.prototype.unique = function(){
	var n = {},r=[]; //n为hash表，r为临时数组
	for(var i = 0; i < this.length; i++) //遍历当前数组
	{
		if (!n[this[i]]) //如果hash表中没有当前项
		{
			n[this[i]] = true; //存入hash表
			r.push(this[i]); //把当前数组的当前项push到临时数组里面
		}
	}
	return r;
}

function proxyDownload(data, name){
	var opt = {
		host:'10.199.75.12',
		port:'8080',
		method: data.method,//这里是发送的方法
		path: data.url,     //这里是访问的路径
	}

	http.get(opt).on('error', function(e) {
	  console.log("Got error: " + e.message);
	}).on('response', function(req, res){
		req.pipe(fs.createWriteStream(name));
	});	
}

request.proxyDownload = proxyDownload;

function downAllWord(){
	
	var dir = 'car_words';
	if(!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
	words.forEach(function(word, index){
		var opt = {
			encoding: null,
			method:'GET',//这里是发送的方法
			url: getWordTpl.replace('word', word),     //这里是访问的路径
			headers:{
				"Accept":"*/*",
				"Accept-Encoding":"gzip, deflate, sdch",
				"Accept-Language":"zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4",
				"Cache-Control":"no-cache",
				"Cookie":"sessionid=ADA48A26-53E1-7626-409F-F881B096E2E3%7C%7C2015-05-04+14%3A51%3A38.188%7C%7Cwww.baidu.com; sessionuid=ADA48A26-53E1-7626-409F-F881B096E2E3||2015-05-04+14%3A51%3A38.188||www.baidu.com; AccurateDirectseque=7,13,129,2902,-1; sessionip=60.10.8.5; area=131099; sessionfid=730032475; CheckCode=CodeValue=cx91; Hm_lvt_90ad5679753bd2b5dec95c4eb965145d=1432773400,1432773495,1432773588,1432773642; Hm_lpvt_90ad5679753bd2b5dec95c4eb965145d=1432773822; sessionvid=D0A29D58-DB06-0549-D22D-9CDD6294D6B0; ref=alading%7C%7C1018%7Capp.autohome.com.cn%7C2015-05-28+08%3A40%3A45.43%7C2015-05-28+08%3A38%3A18.120; __utma=1.1047453498.1430722311.1431307586.1432773248.4; __utmb=1.0.10.1432773248; __utmc=1; __utmz=1.1432773248.4.4.utmcsr=baidu|utmccn=(organic)|utmcmd=organic",
				"Host":"www.autohome.com.cn",
				"Pragma":"no-cache",
				"Proxy-Connection":"keep-alive",
				"Referer":"http://www.autohome.com.cn/car/",
				"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36",
				"X-Requested-With":"XMLHttpRequest"
			}
		}

		r(opt, function(err,httpResponse,body){
			fs.writeFileSync(dir + '/'+ word +'.html',  iconv.decode(body, 'gb2312'), 'utf8');
		})
	});
}

function getAllWeb(){
	var wordDir = 'car_words/',
		allWeb = [];
	words.forEach(function(word){
		var content = fs.readFileSync(wordDir+word+'.html', 'utf8');
		allWeb.push.apply(allWeb, content.match(carWebReg));
	});

	fs.writeFileSync('webs.json', JSON.stringify(allWeb.unique()), 'utf8');
		
}	

function downloadBrand(data){

	var dir = 'car_brands/'

	var opt = {
		host:'10.199.75.12',
		port:'8080',
		method:'GET',//这里是发送的方法
		path: data.url,     //这里是访问的路径
		headers:{
			"Accept":"image/webp,*/*;q=0.8",
			"Accept-Encoding":"gzip, deflate, sdch",
			"Accept-Language":"zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4",
			"Cache-Control":"no-cache",
			"Host":"ss2.baidu.com",
			"Pragma":"no-cache",
			"Proxy-Authorization":"Basic bGl1YmluZ2xpOmZjczEyMzU2ODk=",
			"Proxy-Connection":"keep-alive",
			"Referer": data.parent,
			"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36"
		}
	}

	http.get(opt).on('error', function(e) {
	  console.log("Got error: " + e.message);
	}).on('response', function(req, res){
		req.pipe(fs.createWriteStream(dir + data.name +'.jpg'));
	});	

}

function downloadPlant(data){

	var type = data.type,
		dataDir, 
		imageDir,
		plantData;

	dataDir = type + '_data/plant.json';
	imageDir = type + '_image/';

	plantData = JSON.parse(fs.readFileSync(dataDir, 'utf8'));

	plantData.forEach(function(d){
		request({
			encoding: null,
			url: d.img,
			method: 'GET'
		}, function(err, res, body){
			fs.writeFileSync(imageDir + d.name +'.jpg', body)
		});	
	});	

}

function downloadBrandFromBaidu(data){
	var dir = 'car_brands/';
	request({
		encoding: null,
		url: data.url,
		method: 'GET'
	}, function(err, res, body){
		fs.writeFileSync(dir + data.name +'.jpg', body)
	});	

}

function getPlant(data){
	var urlTpl = "https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?format=json&ie=utf-8&oe=utf-8&query={type}&resource_id=6829&rn={size}&from_mid=1&pn={start}&type_size=&type_func=&t=1432828472771&_=1432828451307";
	var start = data.start,
		end = data.end,
		size = data.size,
		type = data.type,
		dataDir, imageDir,
		plantData = [];

	dataDir = type + '_data';
	imageDir = type + '_image';

	if(!fs.existsSync(dataDir)){
		fs.mkdirSync(dataDir);
	}

	if(!fs.existsSync(imageDir)){
		fs.mkdirSync(imageDir);
	}

	dataDir += '/';
	imageDir += '/';

	var endIndex = Math.ceil(end/size);
	
	for(;start<end;start+=size){
		data.start = start;
		var url = urlTpl.replace(/\{(\w+)\}/g, function($0, $1){
			return data[$1];
		});
		

		request({
			url: url,
			method: 'GET'
		}, function(err, res, body){
			body = JSON.parse(body);
			body.data[0].disp_data.forEach(function(d){
				plantData.push({
					name: d.name,
					img: d.img,
					search: d.pet_typeclass,
					pv: d.pv,
					color: d.type_func,
					season: d.type_size
				})
			});

			endIndex --;

			console.log(endIndex)
			if(endIndex<=0){
				fs.writeFileSync(dataDir  +'plant.json', JSON.stringify(plantData, '', 4), 'utf8');
			}
			//fs.writeFileSync(dataDir  +'plant.json', body, 'utf8');
		});	
	}
}

function downloadDog(data){

	var type = data.type,
		dataDir, 
		imageDir,
		plantData;

	dataDir = type + '_data/dog.json';
	imageDir = type + '_image/';

	plantData = JSON.parse(fs.readFileSync(dataDir, 'utf8'));

	plantData.forEach(function(d){

		request({
			encoding: null,
			url: d.img,
			method: 'GET'
		}, function(err, res, body){
			console.log(err)
			fs.writeFileSync(imageDir + d.name +'.jpg', body)
		});	
	});	

}
function getDog(data){
	var urlTpl = "https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?format=json&ie=utf-8&oe=utf-8&query={type}&resource_id=6829&rn={size}&from_mid=1&pn={start}&type_size=&type_func=&t=1432828472771&_=1432828451307";
	var start = data.start,
		end = data.end,
		size = data.size,
		type = data.type,
		dataDir, imageDir,
		plantData = [];

	dataDir = type + '_data';
	imageDir = type + '_image';

	if(!fs.existsSync(dataDir)){
		fs.mkdirSync(dataDir);
	}

	if(!fs.existsSync(imageDir)){
		fs.mkdirSync(imageDir);
	}

	dataDir += '/';
	imageDir += '/';

	var endIndex = Math.ceil(end/size);
	
	for(;start<end;start+=size){
		data.start = start;
		var url = urlTpl.replace(/\{(\w+)\}/g, function($0, $1){
			return data[$1];
		});
		
		console.log(url)

		request({
			url: url,
			method: 'GET'
		}, function(err, res, body){
			body = JSON.parse(body);
			body.data[0].disp_data.forEach(function(d){
				plantData.push({
					name: d.name,
					img: d.img,
					search: d.pet_typeclass,
					pv: d.pv,
					feat: d.type_feat,
					func: d.type_func,
					size: d.type_size
				})
			});

			endIndex --;

			console.log(endIndex)
			if(endIndex<=0){
				fs.writeFileSync(dataDir  +'dog.json', JSON.stringify(plantData, '', 4), 'utf8');
			}
			//fs.writeFileSync(dataDir  +'plant.json', body, 'utf8');
		});	
	}
}

function getAllBrand(){
	
	var data = JSON.parse(fs.readFileSync('brands.json', 'utf8')).data[0].result.item;
	data.forEach(function(d){
		downloadBrandFromBaidu({
			name: d.attrquery,
			url: d.normalpic
		})
	});
	
}

function getAllCar(){
	var webs = JSON.parse(fs.readFileSync('webs.json', 'utf8'));

	var wordDir = 'car_words/',
		dir = 'car_brands';
	if(!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}

	words.forEach(function(word){
		var content = fs.readFileSync(wordDir+word+'.html', 'utf8');
		$ = cheerio.load(content);
		$('img').each(function(i, elem) {
			downloadBrand({
				name: $(this).parent().next().text(),
				parent: $(this).parent().attr('href').replace(/\/50\//, '/100/'),
				url: $(this).attr('src')
			});
		});
	});

	return;
	var opt = {
		encoding: null,
		method:'GET',//这里是发送的方法
		url: webs[0],     //这里是访问的路径
		headers:{
			"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
			"Accept-Encoding":"gzip, deflate, sdch",
			"Accept-Language":"zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4",
			"Cache-Control":"no-cache",
			"Cookie":"sessionid=ADA48A26-53E1-7626-409F-F881B096E2E3%7C%7C2015-05-04+14%3A51%3A38.188%7C%7Cwww.baidu.com; sessionuid=ADA48A26-53E1-7626-409F-F881B096E2E3||2015-05-04+14%3A51%3A38.188||www.baidu.com; AccurateDirectseque=7,13,129,2902,-1; sessionip=60.10.8.5; area=131099; sessionfid=730032475; CheckCode=CodeValue=cx91; ChangeImgId=2650931; ChangHref=/photo/series/19542/1/2650931.html; Hm_lvt_90ad5679753bd2b5dec95c4eb965145d=1432773400,1432773495,1432773588,1432773642; Hm_lpvt_90ad5679753bd2b5dec95c4eb965145d=1432773822; car_city=131000; __utma=1.1047453498.1430722311.1432773248.1432793446.5; __utmc=1; __utmz=1.1432793446.5.5.utmcsr=autohome.com.cn|utmccn=(referral)|utmcmd=referral|utmcct=/car/; ref=alading%7C%7C1018%7Capp.autohome.com.cn%7C2015-05-28+08%3A40%3A45.43%7C2015-05-28+08%3A38%3A18.120",
			"Host":"car.autohome.com.cn",
			"Pragma":"no-cache",
			"Proxy-Authorization":"Basic bGl1YmluZ2xpOmZjczEyMzU2ODk=",
			"Proxy-Connection":"keep-alive",
			"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36"
		}
	}
	r(opt, function(err,res,body){
		console.log(res.headers['content-type'])
		fs.writeFileSync(dir + '/b.html',  iconv.decode(body, 'gb2312'), 'utf8');
		//console.log( iconv.decode(iconv.toEncoding(body, 'gb2312', 'utf8'), 'utf8'))
		//console.log(Buffer.isEncoding('iso-8859-15'))
		//$ = cheerio.load(content);
		//console.log($('.carbradn-pic img').attr('src'));
		//
		fs.writeFileSync(dir + '/b.html',  iconv.decode(body, 'gb2312'), 'utf8');
	})
}


downloadDog({
	start: 0, 
	size: 50,
	end: 178,
	type: '狗'
});

//getAllBrand();

//downAllWord();

