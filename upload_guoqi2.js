var http = require('http'),
	fs = require('fs');

var path = 'guoqi';

var names = ["阿富汗","亚美尼亚","阿塞拜疆","巴林","孟加拉国","不丹","文莱","缅甸","韩国","塞浦路斯","东帝汶","格鲁吉亚","哈萨克斯坦","印度","印度尼西亚","伊拉克","伊朗","以色列","日本国","约旦","柬埔寨","吉尔吉斯斯坦","朝鲜","科威特","老挝","黎巴嫩","马尔代夫","马来西亚","蒙古国","尼泊尔","阿曼","巴基斯坦","巴勒斯坦","菲律宾","卡塔尔","沙特阿拉伯","锡金","新加坡","斯里兰卡","叙利亚","塔吉克斯坦","泰国","土耳其","土库曼斯坦","阿拉伯联合酋长国","越南","乌兹别克斯坦","也门","阿尔巴尼亚","安道尔","奥地利","白俄罗斯","比利时","波斯尼亚和黑塞哥维那","保加利亚","克罗地亚","捷克","丹麦","爱沙尼亚","芬兰","法国","德国","希腊","匈牙利","冰岛","爱尔兰","意大利","拉脱维亚","列支敦士登","立陶宛","卢林堡","马其顿","马耳他","摩尔多瓦","摩纳哥","荷兰","挪威","波兰","葡萄牙","罗马尼亚","俄罗斯","圣马力诺","斯洛伐克","斯洛文尼亚","西班牙","瑞典","瑞士","乌克兰","英国","梵蒂冈","南斯拉夫","阿尔及利亚","安哥拉","贝宁","博茨瓦纳","布基纳法索","布隆迪","喀麦隆","佛得角","中非","乍得","科摩罗","刚果","科特迪瓦","吉布提","埃及","赤道几内亚","厄立特里亚","埃塞俄比亚","加蓬","冈比亚","加纳","几内亚","几内亚比绍","肯尼亚","莱索托","利比果亚","利比亚","马达加斯加","马拉维","马里","毛里塔尼亚","毛里求斯","摩洛哥","莫桑比克","纳米比亚","尼日尔","尼日利亚","卢旺达","圣多美和普林西比","塞内加尔","塞舌尔","塞拉利亚","索马里","南非","苏丹","斯威士兰","坦桑尼亚","多哥","突尼斯","乌干达","扎伊尔","赞比亚","津巴布韦","安提瓜和巴布达","巴哈马","巴巴多斯","伯利兹（英属洪都拉斯）","加拿大","哥斯达黎加","古巴","多米尼克国","多米尼加","萨尔瓦多","格林纳达","危地马拉","海地","洪都拉斯","牙买加","墨西哥","尼加拉瓜","巴拿马","圣卢西亚","圣基茨和尼维斯","圣文森特和格林纳丁斯","特立尼达和多巴哥","美国","阿根廷","玻利维亚","巴西","智利","哥伦比亚","厄瓜多尔","圭亚那","巴拉圭","秘鲁","苏里南","乌拉圭","委内瑞拉","澳大利亚","斐济","基里巴斯","马绍尔群岛","密克罗尼西亚联邦","瑙鲁","新西兰","帕劳","巴布亚新几内亚","所罗门群岛","汤加","图瓦卢","瓦努阿图","西萨摩亚"],
	urls =	["http://img.xixik.net/custom/topic/xixik_20bb5382ac9a298f.jpg","http://img.xixik.net/custom/topic/xixik_a01f94ca8a5d7c93.jpg","http://img.xixik.net/custom/topic/xixik_02199e0139b20b90.jpg","http://img.xixik.net/custom/topic/xixik_e5527406d543f37c.jpg","http://img.xixik.net/custom/topic/xixik_5a5ce92bb983b4d7.jpg","http://img.xixik.net/custom/topic/xixik_a585694ecaa003a3.jpg","http://img.xixik.net/custom/topic/xixik_1ee6f6d585296aac.jpg","http://img.xixik.net/custom/topic/xixik_225b04feff3e463c.jpg","http://img.xixik.net/custom/topic/xixik_2363686a0aa65b10.jpg","http://img.xixik.net/custom/topic/xixik_9d5e777f738e91b8.jpg","http://img.xixik.net/custom/topic/xixik_ee91fdcb2e371541.gif","http://img.xixik.net/custom/topic/xixik_867d2fd65ad5640c.jpg","http://img.xixik.net/custom/topic/xixik_868adb544f203f12.jpg","http://img.xixik.net/custom/topic/xixik_82c18a20b5ee24c9.jpg","http://img.xixik.net/custom/topic/xixik_d8a6e09001b465a6.jpg","http://img.xixik.net/custom/topic/xixik_265afa1d117d74d8.jpg","http://img.xixik.net/custom/topic/xixik_24bf7d477c541433.jpg","http://img.xixik.net/custom/topic/xixik_3743c11e4e1fd595.jpg","http://img.xixik.net/custom/topic/xixik_b123616b248769fc.jpg","http://img.xixik.net/custom/topic/xixik_35e451a703dcae9f.jpg","http://img.xixik.net/custom/topic/xixik_1809b4c30d0d8d06.jpg","http://img.xixik.net/custom/topic/xixik_4303afedc5537a6e.jpg","http://img.xixik.net/custom/topic/xixik_72321d99cd447db2.jpg","http://img.xixik.net/custom/topic/xixik_fce4be90eae74cfd.jpg","http://img.xixik.net/custom/topic/xixik_cf157da54bc49b8d.jpg","http://img.xixik.net/custom/topic/xixik_3e5f9a8e73586dc9.jpg","http://img.xixik.net/custom/topic/xixik_abc90ae83e764da2.jpg","http://img.xixik.net/custom/topic/xixik_4e562bcbc47e1ccb.jpg","http://img.xixik.net/custom/topic/xixik_419d0795c2531f6c.jpg","http://img.xixik.net/custom/topic/xixik_3907ceef824bc0be.jpg","http://img.xixik.net/custom/topic/xixik_827db404e6ab235c.jpg","http://img.xixik.net/custom/topic/xixik_6b27f779263a2c36.jpg","http://img.xixik.net/custom/topic/xixik_b2104699eaa2346f.gif","http://img.xixik.net/custom/topic/xixik_fcb36b521ff05168.jpg","http://img.xixik.net/custom/topic/xixik_9c3b6b2532e59f1e.jpg","http://img.xixik.net/custom/topic/xixik_baa834d317360321.jpg","http://img.xixik.net/custom/topic/xixik_b4696e2b37d59c2a.jpg","http://img.xixik.net/custom/topic/xixik_d05ee73c21e5e820.jpg","http://img.xixik.net/custom/topic/xixik_a424c3717fa08cbc.jpg","http://img.xixik.net/custom/topic/xixik_8159b912875bc773.jpg","http://img.xixik.net/custom/topic/xixik_eae881f330bded23.jpg","http://img.xixik.net/custom/topic/xixik_d63eb8dbe3b119d6.jpg","http://img.xixik.net/custom/topic/xixik_33bef323feab3ab2.jpg","http://img.xixik.net/custom/topic/xixik_e274c4ed7cef3a19.jpg","http://img.xixik.net/custom/topic/xixik_13d0bdd91231060d.jpg","http://img.xixik.net/custom/topic/xixik_c6e3dbe0be5ec61c.jpg","http://img.xixik.net/custom/topic/xixik_9cc160fe1686c9b1.jpg","http://img.xixik.net/custom/topic/xixik_ce6376269c688fc4.jpg","http://img.xixik.net/custom/topic/xixik_6aa2c04536b0075c.jpg","http://img.xixik.net/custom/topic/xixik_0bd2baa7f3a8ed2d.jpg","http://img.xixik.net/custom/topic/xixik_44cd5adeb9c01b0f.jpg","http://img.xixik.net/custom/topic/xixik_078ed11d6e594439.jpg","http://img.xixik.net/custom/topic/xixik_c6b3550f6b2d5a64.jpg","http://img.xixik.net/custom/topic/xixik_28fd3c9f08e0d34c.jpg","http://img.xixik.net/custom/topic/xixik_daa7ae98d7c04fd5.jpg","http://img.xixik.net/custom/topic/xixik_d3aa2362be8d6554.jpg","http://img.xixik.net/custom/topic/xixik_a12f497a717dd8f8.jpg","http://img.xixik.net/custom/topic/xixik_52238f148e96e70d.jpg","http://img.xixik.net/custom/topic/xixik_6bd5d6182c4281c3.jpg","http://img.xixik.net/custom/topic/xixik_1503454dc2e4ad0e.jpg","http://img.xixik.net/custom/topic/xixik_b1f3f31ab45d185d.jpg","http://img.xixik.net/custom/topic/xixik_11bc6201547d2edb.jpg","http://img.xixik.net/custom/topic/xixik_b248206f9baef7b3.jpg","http://img.xixik.net/custom/topic/xixik_cf3e224b6c582bcc.jpg","http://img.xixik.net/custom/topic/xixik_a96de03155e9fe2e.jpg","http://img.xixik.net/custom/topic/xixik_d0bbf015cd4799f3.jpg","http://img.xixik.net/custom/topic/xixik_d55d96b3b016c66e.jpg","http://img.xixik.net/custom/topic/xixik_5fd52cf80aad7160.jpg","http://img.xixik.net/custom/topic/xixik_afd75088fae0d556.jpg","http://img.xixik.net/custom/topic/xixik_77f20067d33b9011.jpg","http://img.xixik.net/custom/topic/xixik_eb37c09b1b6c6187.jpg","http://img.xixik.net/custom/topic/xixik_195395d7d84e113b.jpg","http://img.xixik.net/custom/topic/xixik_06af16d614c454a5.jpg","http://img.xixik.net/custom/topic/xixik_203bceaa6977b887.jpg","http://img.xixik.net/custom/topic/xixik_0f5bad5f45e2638f.jpg","http://img.xixik.net/custom/topic/xixik_8bf6fcd6167c712b.jpg","http://img.xixik.net/custom/topic/xixik_e35c6d7da7ff065b.jpg","http://img.xixik.net/custom/topic/xixik_cf61a97468901c77.jpg","http://img.xixik.net/custom/topic/xixik_178708b9e8790f8d.jpg","http://img.xixik.net/custom/topic/xixik_01b1099539c7dedd.jpg","http://img.xixik.net/custom/topic/xixik_22d5be91519affeb.jpg","http://img.xixik.net/custom/topic/xixik_0930b1265d44c2af.jpg","http://img.xixik.net/custom/topic/xixik_1cfcce08cb255b05.jpg","http://img.xixik.net/custom/topic/xixik_27c191f5053cae57.jpg","http://img.xixik.net/custom/topic/xixik_c2c82832017eb801.jpg","http://img.xixik.net/custom/topic/xixik_5fac0b39bfb26c3c.jpg","http://img.xixik.net/custom/topic/xixik_2a464ff66983c706.jpg","http://img.xixik.net/custom/topic/xixik_9a7cbad0e3c09cd2.jpg","http://img.xixik.net/custom/topic/xixik_6dc0afbdd4627700.jpg","http://img.xixik.net/custom/topic/xixik_fd1d64984250e79d.jpg","http://img.xixik.net/custom/topic/xixik_007791d701a24b97.jpg","http://img.xixik.net/custom/topic/xixik_97f647da7c66fc8a.jpg","http://img.xixik.net/custom/topic/xixik_c270a0f2a6cec420.jpg","http://img.xixik.net/custom/topic/xixik_dd08d5e0e69c0f33.jpg","http://img.xixik.net/custom/topic/xixik_e20958b8b6a359b1.jpg","http://img.xixik.net/custom/topic/xixik_679d50372a00ac3e.jpg","http://img.xixik.net/custom/topic/xixik_4ba0f800a6a3c476.jpg","http://img.xixik.net/custom/topic/xixik_ab46808d5e103a81.jpg","http://img.xixik.net/custom/topic/xixik_514251b954725b75.jpg","http://img.xixik.net/custom/topic/xixik_45ddcc151a105d14.jpg","http://img.xixik.net/custom/topic/xixik_448eff47c039a92b.jpg","http://img.xixik.net/custom/topic/xixik_449bbb34b57802f3.jpg","http://img.xixik.net/custom/topic/xixik_9900a7c331623a8b.jpg","http://img.xixik.net/custom/topic/xixik_ae377ee586b68791.jpg","http://img.xixik.net/custom/topic/xixik_846f0d3f0b9c9e16.jpg","http://img.xixik.net/custom/topic/xixik_94fe2ac6830ffd66.jpg","http://img.xixik.net/custom/topic/xixik_d96e946a293328fb.jpg","http://img.xixik.net/custom/topic/xixik_f33e36d7bd23d637.jpg","http://img.xixik.net/custom/topic/xixik_0a0012dab5fa44cd.jpg","http://img.xixik.net/custom/topic/xixik_6ab305e671a743c4.jpg","http://img.xixik.net/custom/topic/xixik_60b083515416a335.jpg","http://img.xixik.net/custom/topic/xixik_fe949b730c0b562a.jpg","http://img.xixik.net/custom/topic/xixik_07e433ccde64c5bc.jpg","http://img.xixik.net/custom/topic/xixik_d644b6f7173c4c60.jpg","http://img.xixik.net/custom/topic/xixik_7313fe391f9bbcee.jpg","http://img.xixik.net/custom/topic/xixik_c64eba6dedf9f36e.jpg","http://img.xixik.net/custom/topic/xixik_d6bd265985071c4d.jpg","http://img.xixik.net/custom/topic/xixik_82c8688cf9f0493b.jpg","http://img.xixik.net/custom/topic/xixik_74a17e1e735d69f4.jpg","http://img.xixik.net/custom/topic/xixik_e2c3183c8192df21.jpg","http://img.xixik.net/custom/topic/xixik_6defe007343986fd.jpg","http://img.xixik.net/custom/topic/xixik_f53bc7b2bfa707a5.jpg","http://img.xixik.net/custom/topic/xixik_ac9a8d5db1e25e16.jpg","http://img.xixik.net/custom/topic/xixik_f07d16fd7c2dbd10.jpg","http://img.xixik.net/custom/topic/xixik_4b9f524fda918231.jpg","http://img.xixik.net/custom/topic/xixik_8ff9bdf6774388cf.jpg","http://img.xixik.net/custom/topic/xixik_c717baa1da6c8bf6.jpg","http://img.xixik.net/custom/topic/xixik_5e9b4225bc0dac58.jpg","http://img.xixik.net/custom/topic/xixik_18ab51d9d83bd97a.jpg","http://img.xixik.net/custom/topic/xixik_e6a726e747d95ad4.jpg","http://img.xixik.net/custom/topic/xixik_f6feb415261aee96.jpg","http://img.xixik.net/custom/topic/xixik_3b86656f16feec92.jpg","http://img.xixik.net/custom/topic/xixik_5b3076f7e82048a1.jpg","http://img.xixik.net/custom/topic/xixik_d3c61fa3f4763050.jpg","http://img.xixik.net/custom/topic/xixik_6aadc89941e4a37e.jpg","http://img.xixik.net/custom/topic/xixik_924799e5dd43014a.jpg","http://img.xixik.net/custom/topic/xixik_3e177c64fa0fc479.jpg","http://img.xixik.net/custom/topic/xixik_3af60bc74eb90a33.jpg","http://img.xixik.net/custom/topic/xixik_9d27899170558503.jpg","http://img.xixik.net/custom/topic/xixik_cfeed7095d408ac7.jpg","http://img.xixik.net/custom/topic/xixik_f46f7ffe2690f8d3.jpg","http://img.xixik.net/custom/topic/xixik_9b700b6139256e77.gif","http://img.xixik.net/custom/topic/xixik_cbaab629e081bb16.jpg","http://img.xixik.net/custom/topic/xixik_9e46e3cc8630ac38.jpg","http://img.xixik.net/custom/topic/xixik_43c356306eab1071.jpg","http://img.xixik.net/custom/topic/xixik_9fcf07dbe15177f9.jpg","http://img.xixik.net/custom/topic/xixik_e6b4b052195736f9.jpg","http://img.xixik.net/custom/topic/xixik_03ed787ae17c1e81.png","http://img.xixik.net/custom/topic/xixik_597539f7c9630a3b.jpg","http://img.xixik.net/custom/topic/xixik_10101a65722e7ffe.jpg","http://img.xixik.net/custom/topic/xixik_61a36f3dbad08985.jpg","http://img.xixik.net/custom/topic/xixik_2f8c096eb1197188.jpg","http://img.xixik.net/custom/topic/xixik_78bf418d9ca6ef40.jpg","http://img.xixik.net/custom/topic/xixik_b1618ffd374a1802.jpg","http://img.xixik.net/custom/topic/xixik_9141ac8f4f65aa39.jpg","http://img.xixik.net/custom/topic/xixik_a6a02e00ea73ad51.jpg","http://img.xixik.net/custom/topic/xixik_d7d2126d4057311b.jpg","http://img.xixik.net/custom/topic/xixik_4bc095587259d6e6.jpg","http://img.xixik.net/custom/topic/xixik_21396af1587d4902.jpg","http://img.xixik.net/custom/topic/xixik_d626d99301c215ed.jpg","http://img.xixik.net/custom/topic/xixik_f341f6e5a67f5c06.jpg","http://img.xixik.net/custom/topic/xixik_350c865b306d695a.jpg","http://img.xixik.net/custom/topic/xixik_25ecc27ffa6ae263.jpg","http://img.xixik.net/custom/topic/xixik_982c7decbdeed351.jpg","http://img.xixik.net/custom/topic/xixik_55bf7a1108e6a09f.jpg","http://img.xixik.net/custom/topic/xixik_f7467e80761b3165.jpg","http://img.xixik.net/custom/topic/xixik_1bc27210b77d4034.jpg","http://img.xixik.net/custom/topic/xixik_3da92917a684c2ae.jpg","http://img.xixik.net/custom/topic/xixik_00d4f78e45e73ee6.jpg","http://img.xixik.net/custom/topic/xixik_0fc6c473d5bb5b12.jpg","http://img.xixik.net/custom/topic/xixik_3f4590db41165b36.jpg","http://img.xixik.net/custom/topic/xixik_fd099c6cc9c44f5a.jpg","http://img.xixik.net/custom/topic/xixik_aa3cfcf21cdb26d5.jpg","http://img.xixik.net/custom/topic/xixik_4c018d905a3c571b.jpg","http://img.xixik.net/custom/topic/xixik_1356cde8ff8d165d.jpg","http://img.xixik.net/custom/topic/xixik_659cc426e4391a7a.jpg","http://img.xixik.net/custom/topic/xixik_1dc7e376c2159fbe.jpg","http://img.xixik.net/custom/topic/xixik_bb1d481fe42353a8.jpg","http://img.xixik.net/custom/topic/xixik_0c354f0803ecb1c0.jpg","http://img.xixik.net/custom/topic/xixik_dc38d19ac0b1fd17.jpg","http://img.xixik.net/custom/topic/xixik_9f745109791fee41.jpg","http://img.xixik.net/custom/topic/xixik_bc303f5b506c93e0.jpg","http://img.xixik.net/custom/topic/xixik_6ce8c42862fe32ab.jpg","http://img.xixik.net/custom/topic/xixik_097575bce6f14f50.jpg","http://img.xixik.net/custom/topic/xixik_3fb46807efc7a46d.jpg","http://img.xixik.net/custom/topic/xixik_20d971897139c1bb.jpg","http://img.xixik.net/custom/topic/xixik_fd57701c22fb20ba.jpg","http://img.xixik.net/custom/topic/xixik_ff804e1b780f2448.jpg","http://img.xixik.net/custom/topic/xixik_82c979627e385327.jpg","http://img.xixik.net/custom/topic/xixik_77ecddf4d5241664.jpg","http://img.xixik.net/custom/topic/xixik_f514ad0b136431c2.jpg","http://img.xixik.net/custom/topic/xixik_912e82107bd518d8.jpg","http://img.xixik.net/custom/topic/xixik_ae7047f826e9ce92.jpg"];

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

function buildOtherName(){
	var otherNames = [];
	names.forEach(function(name){
		otherNames.push({
			name: name,
			imageName: get62.excute()
		});
	});
}

buildOtherName();

if(!fs.existsSync(path)){
	fs.mkdirSync(path);
}

var opt = {
	host:'10.199.75.12',
	port:'8080',
	method:'GET',//这里是发送的方法
	path:' http://img.xixik.net/custom/topic/xixik_20bb5382ac9a298f.jpg',     //这里是访问的路径
	headers:{
	//这里放期望发送出去的请求头
	}
}

function calcGuoqi(){
	opt.path = 'http://114.xixik.com/country-flag/';
	http.get(opt).on('error', function(e) {
	  console.log("Got error: " + e.message);
	}).on('response', function(req, res){
		
		req.pipe(fs.createWriteStream('guoqi.html'));
	});	
	
}

function downloadGuoqi(){

	urls.forEach(function(url, index){
		if(index!==2){
			return;
		}
		var opt = {
			host:'10.199.75.12',
			port:'8080',
			method:'GET',//这里是发送的方法
			path: url,     //这里是访问的路径
			headers:{
				"Accept":"image/webp,*/*;q=0.8",
				"Accept-Encoding":"gzip, deflate, sdch",
				"Accept-Language":"zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4",
				"Cache-Control":"max-age=0",
				"Host":"img.xixik.net",
				"If-Modified-Since":"Thu, 11 Dec 2014 10:30:57 GMT",
				"If-None-Match":"a2c1228d2d15d01:7a58",
				"Proxy-Connection":"keep-alive",
				"Referer":"http://114.xixik.com/country-flag/",
				"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36"
			}
		}

		http.get(opt).on('error', function(e) {
		  console.log("Got error: " + e.message);
		}).on('response', function(req, res){
			req.pipe(fs.createWriteStream(path + '/'+ names[index] +'.jpg'));
		});	
	});

	
}

//downloadGuoqi();
