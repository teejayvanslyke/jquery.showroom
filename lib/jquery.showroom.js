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

  $.showroom = {

    //
    // The Showroom plugin itself.
    //
    Base: function(options) {
      var IMAGE_URL_MATCHER = /(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF)$/
      var settings = $.extend({}, $.showroom.defaultOptions, options);
      var element  = $(this);
      var player   = $(settings.player);

      var gridView,
          playerView,
          currentView;

      var app      = $.sammy(function() {
        this.get('#/player', function() {
          setView(playerView);
        });

        this.get('#/player/:id', function() {
          setView(playerView);
          setPlayerContent(playerView.items.urls[this.params['id']]);
        });

        this.get('#/grid', function() {
          setView(gridView);
        });
      });

      function initialize() {
        if (settings.player == null) {
          alert("Showroom error: No player element specified.");
        }

        playerView = {
          onEntry:  function() {
            console.log("Entering player view");
            element.removeClass(settings.gridView.gridClass);
            element.addClass(settings.playerView.gridClass);
            player.show();
          },
          items: new $.showroom.ItemSet(element, settings.playerView.perPage)
        };

        gridView = { 
          onEntry: function() {
            console.log("Entering grid view");
            element.removeClass(settings.playerView.gridClass);
            element.addClass(settings.gridView.gridClass);
            player.hide();
          },
          items: new $.showroom.ItemSet(element, settings.gridView.perPage)
        };

        app.run('#/grid');
      }

      function log(message) {
        console.log("Showroom | " + message);
      }

      function setView(view) {
        view.onEntry();
        currentView = view;
      }

      function setPlayerContent(url) {
        if (url.match(IMAGE_URL_MATCHER)) {
          player.html('<img src="'+url+'"/>');
        } else {
          player.load(url);
        }
      }

      initialize();
    },

    // 
    // Data structure to store items for a given Showroom instance.
    //
    ItemSet: function(gridElement, perPage) {
      var urls = {};

      gridElement.find('a').each(function(index, element) {
        urls[index] = $(this).attr('href');
        $(this).attr('href', '#/player/' + index);
      });

      this.urls = urls;
    },

    // 
    // Default options for showroom plugin.
    //
    defaultOptions: { 
      // Options for Grid View mode.
      gridView: {
        // Class to assign to the grid when in Grid View mode.
        gridClass:  'grid',
        // Number of items per page in Grid View mode. If null, does not paginate.
        perPage:    null,
        // Callback on entry into Grid View mode.
        onEntry:    function() { }
      },

      // Options for Player View mode.
      playerView: {
        // Class to assign to the grid when in Player View mode.
        gridClass:  'player',
        // Number of items per page in Player View mode. If null, does not paginate.
        perPage:    null,
        // Callback on entry into Player View mode.
        onEntry:    function() { }
      },

      // [required] Player element.
      player: null
    }

  };

  $.fn.showroom = $.showroom.Base;

})(jQuery);
