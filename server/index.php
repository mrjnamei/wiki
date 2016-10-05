<?php 
header("Content-type:text/html;charset=utf-8");
header("Access-Control-Allow-Origin: *");
define('__URL__' , 'http://www.kancloud.cn/tag/PHP') ;
define('__COVER__' , 'http://www.kancloud.cn/');
include './simple_html_dom.php';
include './R.php';

$get = $_GET ;
$get = R::filter_html($get);
/**
 * default route 
 */
if(empty($get)){
	$data = R::http_request(__URL__);
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
	$data = R::ajax_http_request($link , [] , 'GET' , []  );
	$data = json_decode($data , true );
	R::json($data);
}



