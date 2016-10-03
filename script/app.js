window.API = {
	index: '/Mobile/Api/index'  , //首页接口  get 
 	newsDetail : '/Home/App/articleDetail/id/' , //新闻详情接口  get 
	register : '/Mobile/Api/register' , // post 表单发送即可
	login : '/Mobile/Api/login' , //登录接口
	teacher : '/Mobile/Api/teacher' , //教师 
	master : '/Mobile/Api/master' , //专家
	region : '/Mobile/Api/get_region/pid/' , // + pid    pid为上级  获取地区接口 
	sendsms : '/Mobile/Api/sendsms/mobile/' , // + mobile 电话号码 发送短信接口 
	userinfo : '/Mobile/Api/userinfo' ,  //个人信息
	order : '/Mobile/Api/order/t/' , // 订单列表 t = 0 全部订单  t=1待付款  t=2待收货 t=3已完成
	teacherAndMaster : '/Mobile/Api/teacher_master/t/' , //t = 1 教师 t = 2 专家
	tdetail : '/Mobile/Api/get_teacher_detail/id/' , // id => 详情ID ， 需要配置额外参数t  t = 1为教师  t = 2 为专家
	daily : '/Mobile/Api/daily/subject_id/' , //每日一练 + subject_id 课程id 
	xuanke : '/Mobile/Api/xuanke' , 
	addtocart : '/Mobile/Api/addtocart' ,  // 加入购物车 .
	done : '/Mobile/Api/done' , //结算
	submit : '/Mobile/Api/submit', //提交订单
	mall : '/Mobile/Api/mall' , //商城商品
	detail : '/Mobile/Api/detail/id/' , //商品详情
	collec : '/Mobile/Api/collect_add' , 
	cart : '/Mobile/Api/cart' ,
	handle_cart : '/Mobile/Api/handle_cart' , 
	handle_check_all : '/Mobile/Api/handle_check_all' , 
} ;

/**
 * layer msg 
 */
function lmsg(msg,reload){ 
	layer.msg(msg , {time:1500});
	if(reload){
		reload() ;
	} 
}

/**
 * layer loading 
 */
function load(){
	var index = layer.load();
}

/**
 * close load 
 */
function cload(){
	layer.closeAll() ;
}

/**
 * set Time out 
 */
function reload(time){
	if(time){
		time = time ;
	}else{
		time = 1500 ;
	}
	setTimeout(function(){
		window.location.reload () ;
	} , 1500 )
}
/**
 * st to redirect 
 */
function redirect (url ,time){
	if(time){
		setTimeout(function(){
			window.location.href = url ;
		} ,time) ;
	}else{
		window.location.href = url ;
	}
}

/**
 * ajax get 
 */
function __get(url , callback){
	$.get(url , function(data){
		callback(data);
	});
}

/**
 * ajax getJSON 
 */
function __getJSON(url , callback){
	$.getJSON(url , function(data){
		callback(data);
	});
}

/**
 * ajax post
 */
function __post(url , data , callback){
	$.post(url , data , function(json){
		callback(json);
	} , 'json');
}

/**
 * 解析模板引擎 
 * @param tplid 模板的id 
 * @param elid 视图中的id 
 * @param data 数据
 * @param callback 回调函数
 */
function T(tplid , elid , data , callback){

	var tpl = doT.template($(tplid).text());
	$(elid).html(tpl(data));
	callback && callback() ;

}

/**
 * 表单验证 
 */
function V($rule , $str ){
	var $validate = [] ;

	$validate['require'] = /.+/; //包含
	$validate['url'] = /^http(s?):\/\/(?:[A-za-z0-9-]+\.)+[A-za-z]{2,4}(?:[\/\?#][\/=\?%\-&~`@[\]\':+!\.#\w]*)?$/; //网址
	$validate['currency'] = /^\d+(\.\d+)?$/; //货币
	$validate['number'] = /^\d+$/; //数字
	$validate['integer'] = /^[\+]?\d+$/; //整数
	$validate['double'] = /^[\+]?\d+(\.\d+)?$/;//浮点
	$validate['english'] = /^[A-Za-z]+$/; // 英文
	$validate['idcard'] = /^([0-9]{15}|[0-9]{17}[0-9a-zA-Z])$/;//身份证
	$validate['username'] = /^[a-zA-Z]{1}[0-9a-zA-Z_]{5,15}$/; //用户名
	$validate['email'] = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;//email
	$validate['mobile'] = /^1[3|4|5|6|7|8|9]\d{9}$/; //手机号
	$validate['password'] = /^[a-zA-Z0-9_\@\#\$\%\^\&\*(\\)\!\,\.\?\-\+\|\=]{6,16}$/;//密码
	$validate['verify'] = /^\d{6}$/;//短信验证码
	//如果规则存在 
	if(typeof $validate[$rule.toLowerCase()] != 'undefined'){
			$r = $validate[$rule.toLowerCase()] ;
			return $r.test($str);
	}
	//如果是自定义规则 
	return eval($rule).test($str);
}

/**
 * 表单发送。
 */
function S(form,callback){
	var $form = $(form);
	var inputs = $($form).find('input');//只针对输入型表单进行过滤
	var flag = true ; errorIndex = false ;
	inputs.each(function(i , v){
		var validate = $(this).attr('data-validator');
		if(validate){
			if(!V(validate , $(v).val())){
				flag = false ;
				errorIndex = i ;
				return false ;
			}
		} 
	});	
	if(!flag){
		lmsg( $(inputs [errorIndex]).attr('data-error'));
		return false ;
	}
	//发送表单 . 

	var url = $($form).attr('action');
	var method = $($form).attr('method');
	if(method.toLowerCase() == 'get'){
		$($form).submit(); //get直接发送 
	} else {
		__post( url , $($form).serialize() , function(data){
			callback(data);
		});
	}
}


function timeToString(time){
		if(time < 0){
			return '';
		}
		var dateStr = new Date(time * 1000 );
		return dateStr.getFullYear() + '-' + ( dateStr.getMonth())+1 +'-' + dateStr.getDate() + ' ' + dateStr.getHours() + ':' + dateStr.getMinutes() + ':' + dateStr.getSeconds();
}

//地区两级联动 
function setRegion(pid , elementId , value , callback ){
	var url = API.region ; 
	__getJSON(url + pid , function(data){
		if(!data.status){
			lmsg('获取城市失败');
			console.log(data) ;
		}else{
			var list = data.data ; 
			var html = ''; 
			$.each(list , function(i , v ){
				html += '<option value="'+v.id+'">'+v.name+'</option>' ; 
			});
			$(elementId).html(html);
			value && $(elementId).val(value);
			callback && callback() ;
		}
	});
}