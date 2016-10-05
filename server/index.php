<?php 
header("Content-type:text/html;charset=utf-8");
header("Access-Control-Allow-Origin: *");
define('__URL__' , 'http://www.kancloud.cn/explore') ;
define('__COVER__' , 'http://www.kancloud.cn/');
include './simple_html_dom.php';
include './R.php';

$get = $_GET ;
$get = R::filter_html($get);
/**
 * default route 
 */
if(empty($get) || isset($get ['page']) ){
	if(isset($get ['page'])){
		$page = $get ['page'];
	}else{
		$page = 1;
	}
	$data = R::http_request(__URL__ . "?page=" . $page);
	$html = new simple_html_dom();
	$html->load($data);
	$img_items = $html->find('.e-cover'); // 链接 ， 标题 ， 图片 ， 地址 
	$info_items = $html->find('.data-number'); // 阅读量
	$book_info = [];
	foreach($img_items as $key => $item){
		$tmp ['href'] = $item->href;
		$tmp ['title'] = $item->children[0]->title;
		$tmp ['img'] = $item->children[0]->src;
		$tmp ['read'] = $info_items[$key]->innertext;
		$book_info [] = $tmp ;
	}
	R::json($book_info);
}

if(!isset($get ['r'])){
	die('403 Forbiddn');
}

if($get ['r'] == 'cover'){ // cover page 
	$href = $get ['href'] ;
	$data = R::http_request(__COVER__ . $href );
	$html = new simple_html_dom();
	$html->load($data);
	$hrefs = $html->find('.btn-yellow');
	foreach($hrefs as $href){
		$link [] = $href->href;
	}
	$link = (string) $link[0];

	$arr = parse_url($link);

	$path = $arr ['path'];
	$path_arr = explode("/", $path);
	$id = $path_arr [3];

	$content_data = R::http_request($link);
//	echo $content_data;
	$html->load($content_data);
	$nodes = $html->find('.read-book-preview');
	$nodes = $nodes[0]->children;
	$covers = [] ; 
	foreach($nodes as $key => $val){
		$tmp ['href'] = $val->attr['href'];
		$tmp ['text'] = $val->innertext ;
		$covers [] = $tmp ;
	}
	$data = R::ajax_http_request($link , [] , 'GET' , []  );
	$data = json_decode($data , true );
	$data ['cover'] = $covers ; 
	$data ['id'] = $id ;
	R::json($data);
}

if($get ['r'] == 'content'){
	$link = __COVER__ . $get ['link'] ; 
	$arr = parse_url($link);
	$path = $arr ['path'];
	$path_arr = explode("/", $path);
	$id = $path_arr [3];
	$data = R::ajax_http_request($link , [] , 'GET' , []  );
	$data = json_decode($data , true );
	$data ['id'] = $id ;
	R::json($data);
}







/**
 * 本地存储功能. 
 */

/**
 *  ==========================================================================
 *  步骤 : 第一步 ， 获取看云首页的文章 , 根据文章抓取文章的连接 、 标题 、 图片 、 以及阅读数量 .
 *  	   第二步 ， 根据看云的连接 。 比如  thinkphp/tp5/ + id 这是首章内容 。
 *  	   	  获取页面内容 ， 缓存方式： 文件夹 ： thinkphp/tp5/id.md 文件 .
 *  	   	  目录缓存方式 ： thinkphp/tp5/covers.json 文件
 *
 *         第三步 ， 也就是说， 第一次点开某篇文章 ， 目录和该章节的内容都被缓存了 。
 *         	  因此 后续如果继续阅读该书籍 ， 只需要请求内容就行了 。
 *         	  1. 先判断 目录存不存在 ， 如果目录不存在 。 那么是第一次访问 。 => 请求 
 *         	  2. 判断 该id.md 文件存不存在 ， 如果不存在 ， => 请求 。 
 * 
 */




























