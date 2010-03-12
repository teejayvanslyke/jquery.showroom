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
      this.player      = $(this.settings.player);
      this.controller  = new $.showroom.Controller(this);
      this.currentView = null;
      this.gridView    = null;
      this.playerView  = null;

      var base = this;

      this.initialize = function() {
        if (this.settings.player == null) {
          alert("Showroom error: No player element specified.");
        }

        this.playerView = new $.showroom.PlayerView(this);
        this.gridView   = new $.showroom.GridView(this);

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
        this.base.element.removeClass(this.base.settings.gridView.gridClass);
        this.base.element.addClass(this.base.settings.playerView.gridClass);
        this.base.player.show();
      };
      this.items = new $.showroom.ItemSet(this.base.element, this.base.settings.playerView.perPage);
    },

    //
    // Class to encapsulate all logic for converting the Showroom instance
    // into a grid view without a player.
    //
    GridView: function(base) {
      this.base    = base;
      this.onEntry = function() {
        this.base.element.removeClass(this.base.settings.playerView.gridClass);
        this.base.element.addClass(this.base.settings.gridView.gridClass);
        this.base.player.hide();
      };
      this.items = new $.showroom.ItemSet(this.base.element, this.base.settings.gridView.perPage)
    },

    // 
    // Data structure to store items for a given Showroom instance.
    //
    ItemSet: function(gridElement, perPage) {
      var items       = {};
      var pages       = [ [] ];
      var $this       = this;

      function endOfPage() {
        return itemsOnCurrentPage() >= perPage;
      };

      function itemsOnCurrentPage() {
        return pages[pages.length - 1].length;
      };

      this.find = function(id) {
        return items[id];
      };

      this.page = function(number) {
        return pages[number];
      };

      this.add = function(key, item) {
        items[key] = item;

        if (endOfPage()) {
          pages.push([ item ]);
        } else {
          pages[pages.length - 1].push(item);
        }
      };

      //
      // Initialize
      //
      gridElement.find('a').each(function(index, element) {
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
