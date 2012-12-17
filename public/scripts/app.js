(function(win) {
  var app = Ember.Application.create();

  app.Product = Ember.Object.extend();

  app.ApplicationController = Ember.Controller.extend();
  app.ProductsController = Ember.ArrayController.extend({
    content: [],

    init: function() {
      this._super.apply(this, arguments);

      var self = this;
      $.getJSON('/api/products', function(products) {
        self.setObjects(products);
      });
    },
  });

  app.ProductController = Ember.ObjectController.extend();

  app.ApplicationView = Ember.View.extend({templateName: 'application'});
  app.ComingSoonView = Ember.View.extend({templateName: 'comingSoon'});
  app.CopyrightView = Ember.View.extend({templateName: 'copyright'});
  app.ProductsView = Ember.View.extend({templateName: 'products'});
  app.ProductView = Ember.View.extend({templateName: 'product'});

  app.Router = Ember.Router.extend({
    root: Ember.Route.extend({
      goHome: Ember.Route.transitionTo('index'),
      showProduct: Ember.Route.transitionTo('products.product'),

      loading: Ember.State.extend(),

      index: Ember.Route.extend({
        route: '/',
        redirectsTo: 'products.index',
      }),

      products: Ember.Route.extend({
        route: '/products',

        index: Ember.Route.extend({
          route: '/',

          connectOutlets: function(router, context) {
            mixpanel.track('view products');
            router.get('applicationController').connectOutlet('header', 'comingSoon');
            router.get('applicationController').connectOutlet('body', 'products');
            router.get('applicationController').connectOutlet('footer', 'copyright');
          }
        }),

        product: Ember.Route.extend({
          route: '/:name',

          deserialize: function(router, context) {
            var products = router.get('productsController');
            var deferred = $.Deferred();
            var observer = function() {
              if (products.get('length')) {
                products.removeObserver('length', observer);
                deferred.resolve(products.findProperty('name', context.name));
              }
            };

            if (products.get('length')) {
              deferred.resolve(products.findProperty('name', context.name));
            } else {
              products.addObserver('length', observer);
            }

            return deferred.promise();
          },

          connectOutlets: function(router, context) {
            mixpanel.track('view product', {name: context.name});
            router.get('applicationController').connectOutlet('header', 'comingSoon');
            router.get('applicationController').connectOutlet('body', 'product', context);
            router.get('applicationController').connectOutlet('footer', 'copyright');
          }
        })
      })
    })
  });

  win.NKK = app;
})(window);
