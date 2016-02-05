<?php

namespace deco\extensions\ui;

class Theme {

  public static $dirLayout = null;
  public static $dirColors = null;
  protected $theme;
  protected $colors;
  protected $parameters = array();
  protected $css = array();
  protected $js = array();
  protected $deco = array();
  protected $bakeInJs = array();
  protected $webroot;
  protected $angularJs = null;
  protected $toaster = false;
  protected $themeCssExtra = array();

  public function __construct($webroot) {
    $this->webroot = $webroot;
    if (is_null(self::$dirLayout)) {
      self::$dirLayout = __DIR__ . '/../themes/layouts';
    }
    if (is_null(self::$dirColors)) {
      self::$dirColors = __DIR__ . '/../themes/colors';
    }
    $this->deco = json_decode(file_get_contents(__DIR__ . '/../deco.json'), true);
  }

  public function bakeInJs($js) {
    array_push($this->bakeInJs, $js);
    return $this;
  }

  public function withParameters($parameters) {
    $this->parameters = $parameters;
    return $this;
  }

  public function withAngularJs($app, $mainController) {
    $this->angularJs = array('app' => $app, 'mainController' => $mainController);
    return $this;
  }

  public function withColorScheme($colors) {
    $this->colors = $colors;
    return $this;
  }

  public function withCss($rel) {
    $this->css = array_merge($this->css, Util::getPaths($rel, $this->webroot));
    return $this;
  }

  public function withJs($rel) {
    $this->js = array_merge($this->js, Util::getPaths($rel, $this->webroot));
    return $this;
  }

  // include deco JS via symbolic link
  public function withDecoJs($bower, $deco) {
    // bower includes    
    $base = __DIR__ . "/../{$this->deco["bowerBase"]}";
    $files = Util::getPaths($this->deco["bower"], $base);
    foreach ($files as $file) {
      $this->withJs("$bower/$file");
    }
    // deco js
    $base = __DIR__ . "/../{$this->deco["decoBase"]}";
    $files = Util::getPaths($this->deco["deco"], $base);
    foreach ($files as $file) {
      $this->withJs("$deco/$file");
    }
    return $this;
  }

  public function withTheme($theme) {
    $this->theme = $theme;
    return $this;
  }

  public function withToaster() {
    $this->toaster = true;
    return $this;
  }

  public function addToThemeCss($files) {
    array_merge($this->themeCssExtra, $files);
    return $this;
  }

  public function buildThemeCss($to, $with = true) {
    $scss = '';
    if (count($this->themeCssExtra) > 0) {
      $scss .= Util::getFilesContents(Util::padArrayValues(__DIR__ . '/../', $this->themeCssExtra));
    }
    $scss .= Util::getFilesContents(array(
            self::$dirColors . "/$this->colors/main.scss",
            self::$dirLayout . "/$this->theme/mixin.scss",
            self::$dirLayout . "/$this->theme/layout.scss",
            self::$dirLayout . "/$this->theme/*.scss",
            self::$dirLayout . "/$this->theme/layout-media/*.scss"
    ));
    $tmpfname = tempnam("/tmp", "style.css");
    $handle = fopen($tmpfname, "w");
    fwrite($handle, $scss);
    fclose($handle);
    shell_exec("/usr/local/bin/scss $tmpfname $this->webroot/$to");
    unlink($tmpfname);
    if ($with) {
      $this->withCss("$to");
    }
    return $this;
  }

  public function buildScss($pattern, $to, $with = true) {
    $selected = array();
    if (!is_array($pattern)) {
      $pattern = array($pattern);
    }
    foreach ($pattern as $pat) {
      $files = glob($pat);
      $str = "";
      foreach ($files as $file) {
        if (!in_array($file, $selected)) {
          array_push($selected, $file);
          $str .= file_get_contents($file) . PHP_EOL;
        }
      }
    }
    $tmpfname = tempnam("/tmp", "style.css");
    $handle = fopen($tmpfname, "w");
    fwrite($handle, $str);
    fclose($handle);
    shell_exec("/usr/local/bin/scss $tmpfname $this->webroot/$to");
    unlink($tmpfname);
    if ($with) {
      $this->withCss("$to");
    }
    return $this;
  }

  public function buildDecoJs($to) {
    // bower includes
    $base = __DIR__ . "/../{$this->deco['bowerBase']}/";
    $files = Util::padArrayValues($base,$this->deco['bower']);
    $string = Util::getFilesContents($files);

    $base = __DIR__ . "/../{$this->deco['decoBase']}/";
    $files = Util::padArrayValues($base,$this->deco['deco']);
    $string .= Util::getFilesContents($files);

    $all = preg_replace('#(-min)?.js$#', '-all.js', $to);
    file_put_contents("$this->webroot/$all", $string);
    $res = Util::minimizeJs($string);
    file_put_contents("$this->webroot/$to", $res);    
    return $this;
  }

  public function output() {
    print "<!doctype html>\n\n<html>\n\n";
    print "<head>\n";
    print $this->getComponent('head');
    $this->includeCss();
    $this->includeJs();
    if (count($this->bakeInJs) > 0) {
      print "<script>" . implode("</script>\n<script", $this->bakeInJs) . "</script>\n";
    }
    print "</head>\n\n";
    print "<body";
    if (!is_null($this->angularJs)) {
      print ' ng-app="' . $this->angularJs['app'] . '"' .
          ' ng-controller="' . $this->angularJs['mainController'] . '"';
    }
    print ">\n\n";
    $this->bakeInTemplates();
    if ($this->toaster) {
      print '<toaster-container toaster-options="{\'time-out\': 3000,\'spinner\':false}"></toaster-container>';
    }
    print $this->getComponent('navigation-right');
    print $this->getComponent('navigation');
    print "\n\n<div class=\"main-content\">\n\n";
    print $this->getComponent('logo');
    print $this->getComponent('ngView');
    print $this->getComponent('footer');
    print "\n\n</div\n\n</body>";
    print "\n\n</html>";
  }

  public function bakeInTemplates() {
    $files = glob(__DIR__ . '/../templates/*.html');
    foreach ($files as $file) {
      $contents = file_get_contents($file);
      preg_match('#([^/]*).html$#', $file, $data);
      $id = 'deco.' . $data[1];
      print "\n<script type=\"text/ng-template\" id=\"$id\">\n$contents\n</script>\n";
    }
  }

  public function includeCss() {
    foreach ($this->css as $rel) {
      print '<link rel="stylesheet" href="' . $rel . '" \>' . PHP_EOL;
    }
  }

  public function includeJs() {
    foreach ($this->js as $rel) {
      print '<script src="' . $rel . '"></script>' . PHP_EOL;
    }
  }

  public function getComponent($component) {
    $text = file_get_contents(self::$dirLayout . "/$this->theme/$component.html");
    return $this->substituteParameters($text) . PHP_EOL;
  }

  protected function substituteParameters($text) {
    while (true) {
      if (!preg_match('#\[\[([a-zA-Z]*)\]\]#m', $text, $match)) {
        break;
      }
      $key = $match[1];
      $value = array_key_exists($key, $this->parameters) ? $this->parameters[$key] : "";
      $text = str_replace($match[0], $value, $text);
    }
    return $text;
  }

}
