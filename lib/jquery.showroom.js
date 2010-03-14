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
      this.settings    = $.extend(true, {}, $.showroom.defaultOptions, options);
      this.element     = $(this);
      this.grid        = $(this.settings.grid);
      this.player      = $(this.settings.player);
      this.controller  = new $.showroom.Controller(this);
      this.currentView = null;
      this.gridView    = null;
      this.playerView  = null;
      this.currentPage = 0;

      var base = this;

      this.initialize = function() {
        if (this.settings.player == null) {
          alert("Showroom error: No player element specified.");
        }

        this.playerView = new $.showroom.PlayerView(this);
        this.gridView   = new $.showroom.GridView(this);
        this.grid.serialScroll(this.settings.scrollOptions);

        this.controller.run('#/grid');
      }

      this.log = function(message) {
        console.log("Showroom | " + message);
      }

      this.setView = function(view) {
        view.onEntry();
        this.currentView = view;
      }

      this.setPlayerContent = function(url) {
        if (url.match(IMAGE_URL_MATCHER)) {
          this.player.html('<img src="'+url+'"/>');
        } else {
          this.player.load(url);
        }
      }

      this.initialize();
    },

    // 
    // Class to encapsulate all logic for converting the Showroom instance
    // into a player with a smaller grid view.
    //
    PlayerView: function(base) {
      this.base     = base;
      this.onEntry  = function() {
        this.base.grid.removeClass(this.base.settings.gridViewClass);
        this.base.grid.addClass(this.base.settings.playerViewClass);
        this.base.player.show();
      };
      this.items = new $.showroom.ItemSet(this.base.grid);
    },

    //
    // Class to encapsulate all logic for converting the Showroom instance
    // into a grid view without a player.
    //
    GridView: function(base) {
      this.base    = base;
      this.onEntry = function() {
        this.base.grid.removeClass(this.base.settings.playerViewClass);
        this.base.grid.addClass(this.base.settings.gridViewClass);
        this.base.player.hide();
      };
      this.items = new $.showroom.ItemSet(this.base.grid);
    },

    // 
    // Data structure to store items for a given Showroom instance.
    //
    ItemSet: function(gridElement) {
      var items       = {};
      var $this       = this;

      this.find = function(id) {
        return items[id];
      };

      this.add = function(key, item) {
        items[key] = item;
      };

      //
      // Initialize
      //
      gridElement.find('li a').each(function(index, element) {
        $this.add(index, { url: $(this).attr('href') });
        $(this).attr('href', '#/player/' + index);
      });

    },

    //
    // Controller for the Showroom, using Sammy.js to drive 
    // #-based routes within the same page.
    //
    Controller: function(base) {
      return $.sammy(function() {
        this.get('#/player', function() {
          base.setView(base.playerView);
        });

        this.get('#/player/:id', function() {
          base.setView(base.playerView);
          base.setPlayerContent(base.playerView.items.find(this.params['id']).url);
        });

        this.get('#/grid', function() {
          base.setView(base.gridView);
        });
      });
    },

    // 
    // Default options for showroom plugin.
    //
    defaultOptions: { 
      // [required] Player element.
      player: null,
      grid:   null,
      
      gridViewClass:    'showroom-grid-view',
      playerViewClass:  'showroom-player-view',

      scrollOptions: {
        items: 'li',
        next:  '#next_page_button',
        prev:  '#prev_page_button'
      }
    }


  };

  $.fn.showroom = $.showroom.Base;

})(jQuery);
