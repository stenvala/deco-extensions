<?php

namespace deco\extensions\ui;

class Minimize {

  protected $base = '../bower_components';
  protected $dependencies = array();
  // Define here dependencies
  protected $bower = array(
      'angularjs/angular.min.js',
      'angular-route/angular-route.min.js',
      'angular-touch/angular-touch.min.js',
      'angular-sanitize/angular-sanitize.min.js',
      'mobile-angular-ui/dist/js/mobile-angular-ui.min.js',
      'angular-filter/dist/angular-filter.min.js',
      'ngstorage/ngStorage.min.js',
      'angular-socialshare/angular-socialshare.min.js',
      'angular-resource/*.min.js',
      'angular-animate/angular-animate.min.js',
      'angularjs-toaster/toaster.js',
      'angular-bootstrap/ui-bootstrap-tpls.min.js',
      'angular-translate/angular-translate.min.js',
      'angular-translate-loader-url/angular-translate-loader-url.min.js',
      'ace-builds/src-min-noconflict/ace.js',
      'angular-ui-ace/ui-ace.js',
      'angular-dialog-service/dist/dialogs.min.js',
      'angular-ui-bootstrap-datetimepicker/datetimepicker.js',
      'jquery/jquery.min.js',
      'jquery-backstretch/jquery.backstretch.min.js',
  );
  protected $deco = array(
      
  );

  public function __construct() {
    foreach ($this->bower as $value) {
      array_push($this->dependencies, __DIR__ . "/$this->base/$value");
    }
    $deco = array('*/*.js', 'deco.js', 'services/*.js');
    foreach ($deco as $value) {
      $files = glob(__DIR__ . "/../js/$value");
      foreach ($files as $value) {
        if (!array_key_exists($this->dependencies, $value)) {
          array_push($this->dependencies, $value);
        }
      }
    }
  }

  public function minimize() {    
  }

  public function copy() {
    $paths = array('mcc.js', 'services/*.js', '*/*.js');
    $files = array();
    foreach ($paths as $path) {
      $data = glob($path);
      foreach ($data as $file) {
        if (!in_array($file, $files)) {
          array_push($files, $file);
        }
      }
    }

    $string = '';
    foreach ($files as $file) {
      $string .= PHP_EOL . file_get_contents($file);
    }

    file_put_contents('mcc-full.js', $string);

    /* Compilation levels
     * 
     * WHITESPACE_ONLY
     * SIMPLE_OPTIMIZATIONS
     * ADVANCED_OPTIMIZATIONS
     */

// Debug errors in: http://closure-compiler.appspot.com/home
// now compile
    $query = array('js_code' => $string,
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


    file_put_contents('mcc-min.js', $res);
  }

}
