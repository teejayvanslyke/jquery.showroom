//
// Showroom.
// 
// An anything gallery plugin inspired by the MercedesBenzTV 
// YouTube channel:  http://www.youtube.com/profile?user=MercedesBenzTV
//
// Created by T.J. VanSlyke.
//            http://github.com/teejayvanslyke/jquery.showroom
//            2010-Mar-12 11:33:46 
//
(function($) {

  $.fn.showroom = function(options) {
    var IMAGE_URL_MATCHER = /(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF)$/
    var settings = $.extend({}, $.fn.showroom.defaultOptions, options);
    var element  = $(this);
    var player   = $(settings.player);
    var urls     = {};

    var app      = $.sammy(function() {
      this.get('#/player', function() {
        setPlayerView();
      });

      this.get('#/player/:id', function() {
        setPlayerView();

        setPlayerContent(urls[this.params['id']]);
      });

      this.get('#/grid', function() {
        setGridView();
      });
    });

    function initialize() {
      if (settings.player == null) {
        alert("Showroom error: No player element specified.");
      }

      element.find('a').each(function(index, element) {
        urls[index] = $(this).attr('href');
        $(this).attr('href', '#/player/' + index);
      });

      app.run('#/grid');
    }

    function log(message) {
      console.log("Showroom | " + message);
    }

    function setGridView() {
      console.log("Entering grid view");
      element.removeClass(settings.playerViewClass);
      element.addClass(settings.gridViewClass);
      player.hide();
    }

    function setPlayerView() {
      console.log("Entering player view");
      element.removeClass(settings.gridViewClass);
      element.addClass(settings.playerViewClass);
      player.show();
    }

    function setPlayerContent(url) {
      if (url.match(IMAGE_URL_MATCHER)) {
        player.html('<img src="'+url+'"/>');
      } else {
        player.load(url);
      }
    }

    initialize();
  };

  $.fn.showroom.defaultOptions = { 
    player:               null,
    gridViewClass:        'grid',
    playerViewClass:      'player',
    onPlayerView:         function() { },
    onGridView:           function() { }
  };

})(jQuery);
