/**
 * init   app  
 */



var __ROOT__ = null ;
var __HTML__ = null ;
var EVN = 1;// 1 为手机  2为浏览器
var KAN = 'http://www.kancloud.cn/';


if(EVN == 1){
	var server = "http://211.149.173.155/kancloud/index.php" ;
}else{
	var server = "http://211.149.173.155/kancloud/index.php" ;
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


function getMore(url , callback){
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

function openWin(name , url , data){
	api.openWin({
	    name: name ,
	    url: url ,
	    pageParam: data || {}
	});

}


function openFrame(name, url, data , x , y , w , h ){
	if(name == 'coverFrame'){
		var scaleEnabled = true ;
	}else{
		var scaleEnabled = false ;
	}

	api.openFrame({
	    name: name ,
	    url: url ,
	    rect: {
	        x: x || 0,
	        y: y || 0,
	        w: w || 'auto',
	        h: h || "auto", 
	        marginTop:0 ,
	    },
	    pageParam: data || {} ,
	    bounces: true,
	    scaleEnabled: scaleEnabled ,
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
	$(elid).append(tpl(data));
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

function rmDir(dir){

	var fs = api.require('fs');
		fs.rmdir({
		    path: "fs://" + dir
		}, function(ret, err) {
		   
		 return true ;
	});
}

function createDir(dir){
	var fs = api.require('fs');
	fs.createDir({
	    path: "fs://" + dir  
	}, function(ret, err) {
	    return true;
	});


}




function read(path){

	//同步返回结果：
	var data = api.readFile({
	    sync: true,
	    path: 'fs://' + path
	});
	return data ;
}

function mdRead(path){
	var mdReader = api.require('mdReader');
	mdReader.open({
	    path:  path ,
	    rect: {
	        x: 0,
	        y: 60,
	        w: "auto",
	        h: "auto"  
	    },
	    styles: {
	        bg: '#fff'
	    },
	    fixed : true
	});

}





function hasRead(href){
	var val = getValue(href.replace(/\//g , "_"));
	if( val){
		return true;
	}else{
		return false;
	}

}

function setValue(key , val){

	$api.setStorage(key , val);

}

function getValue(key){
	return $api.getStorage(key); 
}


function openReader(href ,dir , is_content){

	if(!hasRead(href)){
		createDir(dir [0]);
		createDir(dir [0] + "/" + dir [1]);
		if(is_content){
			// 首次阅读 
			get(server + '?r=content&link=' + href , function(data){
				var data = data.data ;// 服务器返回的数据 . 
				var content = data.data ; // 当前章节的内容. 
				var md_path = "fs://" + dir [0] + "/" + dir [1]  + "/" + data.id + ".md" ;
				write(content ,  md_path);
				setValue(href.replace(/\//g , "_") , data.id );
				var mdReader = api.require('mdReader');
				mdReader.close();
				mdRead(md_path);
			});
		
		}else{
			// 首次阅读 
			get(server + '?r=cover&href=' + href , function(data){
				var data = data.data ;// 服务器返回的数据 . 
				var cover = data.cover ; //目录页 
				var content = data.data ; // 当前章节的内容. 
				var cover_path = "fs://" + dir [0] + "/" + dir [1]  + "/cover.json" ;
				var md_path = "fs://" + dir [0] + "/" + dir [1]  + "/" + data.id + ".md" ;
				write($api.jsonToStr(cover) ,  cover_path );
				write(content ,  md_path);
				setValue(href.replace(/\//g , "_") , data.id );
				mdRead(md_path);
			});
		}
	}else{
		var id = getValue(href.replace(/\//g , "_") );
		var md_path = "fs://" + dir [0] + "/" + dir [1]  + "/" + id + ".md" ;
		mdRead(md_path);
	}

}





