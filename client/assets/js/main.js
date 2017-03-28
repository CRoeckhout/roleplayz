var App = (function() {
  'use strict';

  //Basic Config
  var config = {
      openLeftSidebarClass: 'open-left-sidebar',
      offCanvasLeftSidebarClass: 'be-offcanvas-menu',
      toggleLeftSidebarButton: $('.be-toggle-left-sidebar'),
      removeLeftSidebarClass: 'be-nosidebar-left',
      collapsibleSidebarClass: 'be-collapsible-sidebar',
      collapsibleSidebarCollapsedClass: 'be-collapsible-sidebar-collapsed',
      openLeftSidebarOnClick: true,
      transitionClass: 'be-animate',
      openSidebarDelay: 400
  };

  var colors = {}
  var body = $("body");
  var wrapper = $(".be-wrapper");
  var leftSidebar = $(".be-left-sidebar");
  var rightSidebar = $(".be-right-sidebar");
  var openSidebar = false;

  function getColor(c) {
      var tmp = $("<div>", {
          class: c
      }).appendTo("body");
      var color = tmp.css("background-color");
      tmp.remove();

      return color;
  }

  function leftSidebarInit() {

      var firstAnchor = $(".sidebar-elements > li > a", leftSidebar);
      var anchor = $(".sidebar-elements li a", leftSidebar);
      var lsc = $(".left-sidebar-scroll", leftSidebar);
      var lsToggle = $(".left-sidebar-toggle", leftSidebar);
      var openLeftSidebarOnClick = config.openLeftSidebarOnClick ? true : false;

      // Refresh scroller
      function updateScroller() {
          if (wrapper.hasClass("be-fixed-sidebar")) {
              lsc.perfectScrollbar('update');
          }
      }

      // Collapsible sidebar toggle functionality
      function toggleSideBar() {
          var button = $(".be-toggle-left-sidebar");

          button.on("click", function() {
              if (wrapper.hasClass(config.collapsibleSidebarCollapsedClass)) {
                  wrapper.removeClass(config.collapsibleSidebarCollapsedClass);
                  $("li.open", leftSidebar).removeClass("open");
                  $("li.active", leftSidebar).parents(".parent").addClass("active open");
                  $(".be-scroller", leftSidebar).perfectScrollbar("destroy");
              } else {
                  wrapper.addClass(config.collapsibleSidebarCollapsedClass);
                  $("li.active", leftSidebar).parents(".parent").removeClass("open");
                  $("li.open", leftSidebar).removeClass("open");
              }
          });
      }

      // Collapsed sidebar submenu title
      function syncSubMenu(item) {
          var elements;

          if (typeof item !== "undefined") {
              elements = item;
          } else {
              elements = $(".sidebar-elements > li", leftSidebar);
          }

          $.each(elements, function() {
              var title = $(this).find("> a span").html();
              var ul = $(this).find("> ul");
              var subEls = $("> li", ul);
              title = $('<li class="title">' + title + '</li>');
              var subContainer = $('<li class="nav-items"><div class="be-scroller"><div class="content"><ul></ul></div></div></li>');

              if (!ul.find("> li.title").length) {
                  ul.prepend(title);
                  subEls.appendTo(subContainer.find(".content ul"));
                  subContainer.appendTo(ul);
              }
          });
      }

      // Return boolean whether the sidebar is collapsed or not
      function isCollapsed() {
          return wrapper.hasClass(config.collapsibleSidebarCollapsedClass);
      }

      // Return true if the collapsible left sidebar is enabled 
      function isCollapsible() {
          return wrapper.hasClass(config.collapsibleSidebarClass);
      }

      // Close submenu function
      function closeSubMenu(subMenu, event) {
          var target = $(event.currentTarget);
          var li = $(subMenu).parent();
          var openChildren = $('li.open', li);

          var clickOutside = !target.closest(leftSidebar).length;
          var slideSpeed = config.leftSidebarSlideSpeed;
          var isFirstLevel = target.parents().eq(1).hasClass('sidebar-elements');

          // If left sidebar is collapsed, is not small device 
          // and the trigger element is first level 
          // or click outside the left sidebar
          if (!$.isXs() && isCollapsed() && (isFirstLevel || clickOutside)) {

              li.removeClass('open');
              subMenu.removeClass('visible');
              openChildren.removeClass('open').removeAttr('style');

          } else {
              // If not execute classic slide interaction

              subMenu.slideUp({
                  duration: slideSpeed,
                  complete: function() {
                      li.removeClass('open');
                      $(this).removeAttr('style');

                      // Close opened child submenus
                      openChildren.removeClass('open').removeAttr('style');
                      updateScroller();
                  }
              });

          }
      }

      // Open submenu function
      function openSubMenu(anchor, event) {
        console.log('hi')
          var _el = $(anchor);
          var li = $(_el).parent();
          var subMenu = $(_el).next();

          var slideSpeed = config.leftSidebarSlideSpeed;
          var isFirstLevel = $(event.currentTarget).parents().eq(1).hasClass('sidebar-elements');

          // Get the open sub menus
          var openSubMenus = li.siblings('.open');

          // If there are open sub menus close them
          if (openSubMenus) {
              closeSubMenu($('> ul', openSubMenus), event);
          }

          // If left sidebar is collapsed, is not small device 
          // and the trigger element is first level
          if (!$.isXs() && isCollapsed() && isFirstLevel) {
              var subMenuScroller = li.find('.be-scroller');

              li.addClass('open');
              subMenu.addClass('visible');

              // Renew nanoscroller
              subMenuScroller.perfectScrollbar('destroy');
              subMenuScroller.perfectScrollbar();

          } else {
              // If not execute classic slide interaction

              subMenu.slideDown({
                  duration: slideSpeed,
                  complete: function() {
                      li.addClass('open');
                      $(this).removeAttr('style');
                      updateScroller();
                  }
              });

          }
      }

      // Execute if collapsible sidebar is enabled
      if (isCollapsible()) {
          /*Create sub menu elements*/
          syncSubMenu();
          toggleSideBar();

          if (!openLeftSidebarOnClick) {

              /*Open sub-menu on hover*/
              firstAnchor.on('mouseover', function(event) {
                  if (isCollapsed()) {
                      openSubMenu(this, event);
                  }
              });

              /*Open sub-menu on click (fix for touch devices)*/
              firstAnchor.on('touchstart', function(event) {
                  var anchor = $(this);
                  var li = anchor.parent();
                  var subMenu = anchor.next();

                  if (isCollapsed() && !$.isXs()) {

                      if (li.hasClass('open')) {
                          closeSubMenu(subMenu, event);
                      } else {
                          openSubMenu(this, event);
                      }

                      if ($(this).next().is('ul')) {
                          event.preventDefault();
                      }
                  }
              });

              /*Sub-menu delay on mouse leave*/
              firstAnchor.on('mouseleave', function(event) {
                  var _self = $(this);
                  var _li = _self.parent();
                  var subMenu = _li.find('> ul');

                  if (!$.isXs() && isCollapsed()) {

                      //If mouse is over sub menu attach an additional mouseleave event to submenu
                      if (subMenu.length > 0) {

                          setTimeout(function() {
                              if (subMenu.is(':hover')) {

                                  subMenu.on('mouseleave', function() {
                                      setTimeout(function() {
                                          if (!_self.is(':hover')) {
                                              closeSubMenu(subMenu, event);
                                              subMenu.off('mouseleave');
                                          }
                                      }, 300);
                                  });

                              } else {
                                  closeSubMenu(subMenu, event);
                              }
                          }, 300);

                      } else {
                          _li.removeClass('open');
                      }
                  }
              });
          }

          /*Close sidebar on click outside*/
          $(document).on("mousedown touchstart", function(event) {
              if (!$(event.target).closest(leftSidebar).length && !$.isXs()) {
                  closeSubMenu($("ul.visible", leftSidebar), event);
              }
          });
      }

      /*Open sub-menu functionality*/
      anchor.on("click", function(event) {
        console.log("clic")
          var $el = $(this), $open;
          var $li = $el.parent();
          var $subMenu = $el.next();
          var isFirstLevel = $el.parents().eq(1).hasClass('sidebar-elements');

          // Get the open menus
          $open = $li.siblings(".open");

          if ($li.hasClass('open')) {
              closeSubMenu($subMenu, event);
          } else {
              openSubMenu(this, event);
          }

          //If current element has children stop link action
          if ($el.next().is('ul')) {
              event.preventDefault();
          }
      });

      /*Calculate sidebar tree active & open classes*/
      if (wrapper.hasClass(config.collapsibleSidebarCollapsedClass)) {
          $("li.active", leftSidebar).parents(".parent").addClass("active");
      } else {
          $("li.active", leftSidebar).parents(".parent").addClass("active open");
      }

      /*Scrollbar plugin init when left sidebar is fixed*/
      if (wrapper.hasClass("be-fixed-sidebar")) {
          if (!$.isXs() || wrapper.hasClass(config.offCanvasLeftSidebarClass)) {
              lsc.perfectScrollbar();
          }

          /*Update scrollbar height on window resize*/
          $(window).resize(function() {
              waitForFinalEvent(function() {
                  if ($.isXs() && !wrapper.hasClass(config.offCanvasLeftSidebarClass)) {
                      lsc.perfectScrollbar('destroy');
                  } else {
                      if (lsc.hasClass('ps-container')) {
                          lsc.perfectScrollbar('update');
                      } else {
                          lsc.perfectScrollbar();
                      }
                  }
              }, 500, "be_update_scroller");
          });
      }

      /*Toggle sidebar on small devices*/
      lsToggle.on('click', function(e) {
          var spacer = $(this).next('.left-sidebar-spacer')
            , toggleBtn = $(this);
          toggleBtn.toggleClass('open');
          spacer.slideToggle(config.leftSidebarToggleSpeed, function() {
              $(this).removeAttr('style').toggleClass('open');
          });
      });

      /*Off canvas menu*/
      function leftSidebarOffCanvas() {

          /*Open Sidebar with toggle button*/
          config.toggleLeftSidebarButton.on("click", function(e) {
              if (openSidebar && body.hasClass(config.openLeftSidebarClass)) {
                  body.removeClass(config.openLeftSidebarClass);
                  sidebarDelay();
              } else {
                  body.addClass(config.openLeftSidebarClass + " " + config.transitionClass);
                  openSidebar = true;
              }
              e.preventDefault();
          });

          /*Close sidebar on click outside*/
          $(document).on("mousedown touchstart", function(e) {
              if (!$(e.target).closest(leftSidebar).length && !$(e.target).closest(config.toggleLeftSidebarButton).length && body.hasClass(config.openLeftSidebarClass)) {
                  body.removeClass(config.openLeftSidebarClass);
                  sidebarDelay();
              }
          });
      }

      // Left sidebar off-canvas
      if (wrapper.hasClass(config.offCanvasLeftSidebarClass)) {
          leftSidebarOffCanvas();
      }
  }

  return {
    //General data
    conf: config,
    color: colors,
    //Init function
    init: function (options) {
      
      //Extends basic config with options
        $.extend( config, options );

      /*Left Sidebar*/
        leftSidebarInit();

      /*Get colors*/
        colors.primary = getColor('clr-primary');
        colors.success = getColor('clr-success');
        colors.warning = getColor('clr-warning');
        colors.danger  = getColor('clr-danger');
        colors.grey    = getColor('clr-grey');

      //Prevent Connections Dropdown closes on click
        $(".be-connections").on("click",function( e ){
          e.stopPropagation();
        });

      //Scroller plugin init
        //scrollerInit();

      /*Bind plugins on hidden elements*/
      /*Dropdown shown event*/
        $('.dropdown').on('shown.bs.dropdown', function () {
          $(".be-scroller").perfectScrollbar('update');
        });
        
      /*Tabs refresh hidden elements*/
        $('.nav-tabs').on('shown.bs.tab', function (e) {
          $(".be-scroller").perfectScrollbar('update');
        });

      /*Tooltips*/
        $('[data-toggle="tooltip"]').tooltip();
      
      /*Popover*/
        $('[data-toggle="popover"]').popover();

      /*Bootstrap modal scroll top fix*/
        $('.modal').on('show.bs.modal', function(){
          $("html").addClass('be-modal-open');
        });

        $('.modal').on('hidden.bs.modal', function(){
          $("html").removeClass('be-modal-open');
        });
    }
  }
})()