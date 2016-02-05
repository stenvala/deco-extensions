<?php

namespace deco\extensions\ui;

class Util {

  static public function getFilesContents($pattern) {
    $files = self::getPaths($pattern);
    $included = array();
    $str = "";    
    foreach ($files as $file) {
      if (!in_array($file, $included)) {
        array_push($included, $file);
        $str .= file_get_contents($file);
      }
    }
    return $str;
  }

  static public function getPaths($pattern, $base = null) {
    $pattern = is_array($pattern) ? $pattern : array($pattern);
    $alreadyIncluded = array();
    foreach ($pattern as $pat) {
      if (preg_match("#:#", $pat)) {
        if (!in_array($pat, $alreadyIncluded)) {
          array_push($alreadyIncluded, $pat);
        }
      } else {
        if (!is_null($base)) {
          $files = glob("$base/$pat");
        } else {
          $files = glob($pat);
        }
        foreach ($files as $file) {
          if (!is_null($base)) {
            $file = preg_replace("#^$base/#", '', $file);
          }
          if (!in_array($file, $alreadyIncluded)) {
            array_push($alreadyIncluded, $file);
          }
        }
      }
    }
    return $alreadyIncluded;
  }

  static public function padArrayValues($pad, $array) {
    foreach ($array as $key => $value) {
      $array[$key] = $pad . $value;
    }
    return $array;
  }

  static public function minimizeJs($str) {
    /* Compilation levels
     * 
     * WHITESPACE_ONLY
     * SIMPLE_OPTIMIZATIONS
     * ADVANCED_OPTIMIZATIONS
     */

    // Debug errors in: http://closure-compiler.appspot.com/home
    // now compile
    $query = array('js_code' => $str,
        'compilation_level' => 'WHITESPACE_ONLY',
        'output_format' => 'text',
        'output_info' => 'compiled_code');
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://closure-compiler.appspot.com/compile');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($query));
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($query));
    $res = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $res;
  }

}
