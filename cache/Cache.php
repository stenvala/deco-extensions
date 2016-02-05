<?php

namespace deco\extensions\cache;

class Cache {

  static private $cacheDir = '';
  
  static public function conf($cacheDir){
    self::$cacheDir = $cacheDir;
  }
  
  static public function clearCache(){
    shell_exec('rm -f ' . self::$cacheDir . '/*');    
  }
  
  static public function isOlderThan($key,$sec){            
    if (rand(1,100) > 95){
      self::clearCache();
    }    
    if (!file_exists(self::file($key))){
      return true;
    }
    if ((time() - filemtime(self::file($key))) > $sec){
      return true;
    }
    return false;
  }
  
  static public function get($key){    
    if (!file_exists(self::file($key))){
      throw new \deco\essentials\exception\General(array('msg' => 'File does not exist.'));
    }
    return unserialize(file_get_contents(self::file($key)));
  }
  
  static public function set($key,$data){
    $content = serialize($data);
    file_put_contents(self::file($key), $content);
  }
  
  static private function file($key){
    return self::$cacheDir . '/' . $key;
  }
  
}
