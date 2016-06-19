<?php

namespace deco\extensions\socialmedia\instagram;

class Instagram {

  static private $accessToken;
  static private $TMPKEY;

  const CACHE_TIME = 30;

  static public function config($accessToken) {
    $mid = array_key_exists('SERVER_NAME', $_SERVER) ? $_SERVER['SERVER_NAME'] : 'cli';
    self::$TMPKEY = 'deco-instagram-' . $mid . '-';
    self::$accessToken = $accessToken;
  }

  static public function getMediaByTag($tag, $count = 100, $maxid = null) {
    $key = self::$TMPKEY . 'mediaByTag-' . $tag . '-' . $maxid;
    if (!\deco\extensions\cache\Cache::isOlderThan($key, self::CACHE_TIME)) {
      return \deco\extensions\cache\Cache::get($key);
    }
    $url = "https://api.instagram.com/v1/tags/$tag/media/recent?access_token=" . self::$accessToken;
    $url .= "&count=$count";
    $url .= is_null($maxid) ? '' : "&max_tag_id=$maxid";      
    $url .= '&scope=basic+public_content+follower_list+comments+relationships+likes';
    $data = self::executeGet($url);    
    \deco\extensions\cache\Cache::set($key, $data);
    return $data;
  }

  static public function getMediaByUser($user, $count = 20, $maxid = null) {
    $key = self::$TMPKEY . 'mediaByUser-' . $user . '-' . $maxid;
    if (!\deco\extensions\cache\Cache::isOlderThan($key, self::CACHE_TIME)) {
      return \deco\extensions\cache\Cache::get($key);
    }
    $url = "https://api.instagram.com/v1/users/$user/media/recent/?access_token=" . self::$accessToken;
    $url.= "&count=$count";
    $url .= is_null($maxid) ? '' : "&max_id=$maxid";
    $data = self::executeGet($url);        
    \deco\extensions\cache\Cache::set($key, $data);
    return $data;
  }

  static private function executeGet($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json',
        'Accept: application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $reply = curl_exec($ch);    
    $json = json_decode($reply, true);        
    $data = $json['data'];
    foreach ($data as $key => $value){      
      $data[$key]['max_tag_id'] = $json['pagination']['next_max_id'];
    }
    return $data;
  }


}
