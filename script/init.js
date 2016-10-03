/**
 * init   app  
 */



var __ROOT__ = null ;
var __HTML__ = null ;
var EVN = 1;// 1 为手机  2为浏览器
var KAN = 'http://www.kancloud.cn/';


if(EVN == 1){
	var server = "http://192.168.31.220/index.php" ;
}else{
	var server = "http://192.168.31.220/index.php" ;
}


function __init(){
	__ROOT__ =  "./";
	__HTML__ = __ROOT__ + "html/"; 

	openFrame('main', __HTML__ + 'main.html' , null , 0 , 60);

}
function get(url , callback){
	load();
	if(1 == EVN){
		api.ajax({
	    	url: url ,
	    	method: 'get',
	    	data: {}
		}, function(ret, err) {
			lclose();
		    if (ret) {
		        callback && callback(ret);
		    } else {
		    	//api.alert({msg : '请求失败'});
		        api.alert({ msg: JSON.stringify(err) });
		    }
		});
	}else{
		$.getJSON(url , function(data){
			console.log(data);
			lclose();
			callback && callback(data);
		});
	}

}

function getJSONP(url , callback ){
	 J.ajax({
	    url: url ,       //跨域到http://www.wp.com，另，http://test.com也算跨域
        type:'GET',                                //jsonp 类型下只能使用GET,不能用POST,这里不写默认为GET
        dataType:'jsonp',                          //指定为jsonp类型
        jsonp:'callback',  
         success: '{' + callback + '}' ,
         error:function(msg){
             api.alert({msg:JSON.stringify(msg)});
         }
    }); 

}

function openFrame(name, url, data , x , y , w , h ){
	api.openFrame({
	    name: name ,
	    url: url ,
	    rect: {
	        x: x || 0,
	        y: y || 0,
	        w: w || 'auto',
	        h: h || 'auto', 
	        marginTop:0 ,
	    },
	    pageParam: data || {} ,
	    bounces: true,
	    bgColor: 'rgba(0,0,0,0)',
	    vScrollBarEnabled: true,
	    hScrollBarEnabled: true
	});
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
	console.log(tpl);
	$(elid).html(tpl(data));
	callback && callback() ;

}

function load(){
	var load = layer.load(0);
}

function lmsg(msg){
	layer.msg(msg , {time:1500});
}
function lclose(){

	layer.closeAll();
}


function write(text , path){

	api.writeFile({
	    path: path ,
	    data: text
	}, function(ret, err) {
	    return true;
	});

}


















