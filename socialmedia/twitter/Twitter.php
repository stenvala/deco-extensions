<?php

namespace deco\extensions\socialmedia\twitter;

class Twitter {

  static private $settings;
  static private $TMPKEY;

  const CACHE_TIME = 30;

  static public function config($settings) {
    $mid = array_key_exists('SERVER_NAME', $_SERVER) ? $_SERVER['SERVER_NAME'] : 'cli';
    self::$TMPKEY = 'deco-twitter-' . $mid . '-';
    self::$settings = $settings;
  }

  static public function search($query, $count = 100, $maxid = null) {
    $key = self::$TMPKEY . 'search-' . $query . '-' . $maxid;
    if (!\deco\extensions\cache\Cache::isOlderThan($key, self::CACHE_TIME)) {
      return \deco\extensions\cache\Cache::get($key);
    }
    $url = 'https://api.twitter.com/1.1/search/tweets.json';
    $getfield = "?q=$query&include_entities=true&count=$count";
    $getfield .= is_null($maxid) ? '' : "&max_id=$maxid";
    $data = self::fetch($url, $getfield);
    \deco\extensions\cache\Cache::set($key, $data);
    return $data;
  }

  static public function userTimeline($user, $count = 100, $maxid = null) {
    $key = self::$TMPKEY . 'userTimeline-' . $user . '-' . $maxid;    
    if (!\deco\extensions\cache\Cache::isOlderThan($key, self::CACHE_TIME)) {
      return \deco\extensions\cache\Cache::get($key);
    }
    $url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
    $getfield = "?screen_name=$user&count=$count";
    $getfield .= is_null($maxid) ? '' : "&max_id=$maxid";    
    $data = self::fetch($url, $getfield);    
    \deco\extensions\cache\Cache::set($key, $data);    
    return $data;
  }

  static public function homeTimeline($count = 100, $maxid = null) {
    $key = self::$TMPKEY . 'homeTimeline-' . $maxid;
    if (!\deco\extensions\cache\Cache::isOlderThan($key, self::CACHE_TIME)) {
      return \deco\extensions\cache\Cache::get($key);
    }
    $url = 'https://api.twitter.com/1.1/statuses/home_timeline.json';
    $getfield = "?&count=$count";
    $getfield .= is_null($maxid) ? '' : "&max_id=$maxid";
    $data = self::fetch($url, $getfield);
    \deco\extensions\cache\Cache::set($key, $data);
    return $data;
  }

  static private function fetch($url, $getfield) {
    $requestMethod = 'GET';
    $twitter = new \TwitterAPIExchange(self::$settings);
    $data = $twitter->setGetfield($getfield)
        ->buildOauth($url, $requestMethod)
        ->performRequest();    
    $data = json_decode($data, true);    
    if (array_key_exists('errors', $data)) {
      throw new \deco\essentials\exception\General(array(
      'dict' => 'TWITTER.RATE_LIMIT_EXCEEDED',
      'param' => array('code' => $data['errors'][0]['code'],
          'reply' => json_encode($data, JSON_PRETTY_PRINT)),
      'msg' => $data['errors'][0]['message']));
    }
    return $data;
  }

}
