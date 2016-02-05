// https://jsfiddle.net/gabrieleromanato/RkpYy/

(function (self, $, undefined) {

  self.slug = function (str,withDate) {
    str = self.removeDiacritics(str);
    if (arguments.length == 1){
      withDate = false;
    }
    var slug = '';
    var trimmed = $.trim(str);
    slug = trimmed.replace(/[^a-z0-9-]/gi, '-').
            replace(/-+/g, '-').
            replace(/^-|-$/g, '');
    if (withDate){
      var d = new Date();
      slug = d.getFullYear() + '-' + 
              ('0' + (d.getMonth()+1)).slice(-2) + '-' + 
              ('0' + d.getDate()).slice(-2) + 
              '-' + slug;
    }
    return slug.toLowerCase();
  };

}(window.deco = window.deco || {}, jQuery));