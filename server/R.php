);
	}


	public static function dump($data){
		echo '<pre>' ;
		var_dump($data);
	}

	//HTTP请求（支持HTTP/HTTPS，支持GET/POST）
	public static function http_request($url, $data = null , $headers = NULL )
	{
	    $curl = curl_init();
	    curl_setopt($curl, CURLOPT_URL, $url);
	    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, TRUE);
	  //  curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, TRUE);
	    if (!empty($data)){
	        curl_setopt($curl, CURLOPT_POST, 1);
	        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	    }

	    if($headers){
	        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	    }

	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
	    $output = curl_exec($curl);
	    curl_close($curl);
	    return $output;
	}

	/**
	 * String or array 
	 * @param  [type] $data [description]
	 * @return filter html tags   
	 */
	public static function filter_html($data){
		static $return = [];
		if(is_array($data)){
			foreach($data as $key => $val){
				 $return [$key] = htmlspecialchars($val);
			}
		}
		return $return ;
	}

/**
 * 构造ajax请求,不支持https
 */
public static function ajax_http_request($url, $data = array(), $type = "post", $params = array(), $accept = "", $ua = "", $referer = "", $file = false)
{

    $type = strtolower($type);

    $url_params = parse_url($url);

    if (!$url_params) {
        echo 'url错误';
        return false;
    }

    $hostip = gethostbyname($url_params['host']);

    if (!$hostip) {
        echo '无法访问服务器';
        return false;
    }

    $fp = fsockopen($url_params['host'], 80, $errno, $errstr, 30);

    if (!$fp) {
        echo "$errstr ($errno)<br />";
        return false;
    }

    $query_string = http_build_query($data);

    if ($type == 'post') {
        $out = 'POST '.$url_params['path']." HTTP/1.1\r\n";
    } else {
        if (strpos($url, '?') != false) {
            $path = $url .'&'.$query_string;
        } else {
            $path = $url . '?'.$query_string;
        }

        $out = 'GET '.$path.' HTTP/1.1'."\r\n";
    }

    $out .= 'Host: '.$url_params['host']."\r\n";

    $out .= "Connection: Close\r\n";

    if ($type == 'post') {
        if ($file) {
            $out .= ("Content-Type: multipart/form-data\r\n"); // ajax文件上传暂时没有此功能
        } else {
            $out .= ("Content-Type: application/x-www-form-urlencoded\r\n");
        }
        $out .= ("Content-Length: ".strlen($query_string)."\r\n");
    }

    if (isset($ua)) {
        $out .= ('User-Agent: '.$ua."\r\n");
    } else {
        $out .= ("User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36\r\n");
    }

    if (isset($referer)) {
        $out .= ('Referer: http://'.$url_params['host'].'/'.$referer."\r\n");
    } else {
        $out .= ('Referer: http://'.$url_params['host']."\r\n");
    }

    $out .= ("Origin: http://".$url_params['host']."\r\n");
    $out .= ("X-Requested-With: XMLHttpRequest\r\n");
    $out .= ("Accept:application/json, text/javascript, */*\r\n");

    $out .= "Accept-Language:zh-CN,zh;q=0.8,en;q=0.6\r\n\r\n";
    //新家的
    $out .= "Host:www.kancloud.cn\r\n\r\n";

    if ($type == 'post') {
        // 接下来是消息体信息
        $out .= $query_string;
    }

    fwrite($fp, $out);

    $output = "";

    while (!feof($fp)) {
        $output .= fgets($fp, 128);
    }

    fclose($fp);

    $result = explode("\r\n\r\n", $output);

    /**
     * addnew 
     */
    $preg = '/\"content":\"(.*?),\"info\"/i';
    preg_match($preg, $output , $match );
    return  "{\"data\" : \"". $match [1];

    $result = explode("\r\n",$result[1]);
    array_pop($result);
    array_shift($result);
    return implode("\r\n", $result);
}



}
