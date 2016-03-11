<?php

namespace deco\extensions\ui;

class Theme {

  protected $css = array();
  protected $js = array();
  protected $deco = array();
  protected $webroot;

  public function __construct($webroot) {
    $this->webroot = $webroot;
    $this->deco = json_decode(file_get_contents(__DIR__ . '/../deco.json'), true);
  }

  public function bakeInJs($js) {
    if (!is_array($js)) {
      $js = array($js);
    }
    print "<script>" . implode("</script>\n<script", $js) . "</script>\n";
    return $this;
  }

  public function withCss($rel) {
    $this->css = array_merge($this->css, Util::getPaths($rel, $this->webroot));
    return $this;
  }

  public function withJs($rel) {    
    $this->js = array_merge($this->js,Util::getPaths($rel, $this->webroot));
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

  public function ga($ua, $domain) {
    print "<script>
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  ga('create', '$ua', '$domain');
  ga('require', 'displayfeatures');
  ga('send', 'pageview');
</script>";
  }

  public function bakeInDecoTemplates() {
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

}
