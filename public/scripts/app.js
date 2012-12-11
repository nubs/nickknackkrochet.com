(function(win) {
  var app = Ember.Application.create();

  app.Product = Ember.Object.extend();
  app.Product.reopenClass({
    _listOfProducts: Ember.A(),
    all: function() {
      if (this._listOfProducts.length == 0) {
        var allProducts = this._listOfProducts;

        $.getJSON('/api/products', function(products) {
          allProducts.setObjects(products);
        });
      }

      return this._listOfProducts;
    },
    find: function(name) {
      var product = app.Product.create({name: name});

      if (this._listOfProducts.length == 0) {
        var allProducts = this._listOfProducts;

        $.getJSON('/api/products', function(products) {
          allProducts.setObjects(products);
          product.setProperties(allProducts.findProperty('name', name));
        });
      } else {
        product.setProperties(this._listOfProducts.findProperty('name', name));
      }

      return product;
    }
  });

  app.ApplicationController = Ember.Controller.extend();
  app.ProductsController = Ember.ArrayController.extend();
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
      index: Ember.Route.extend({
        route: '/',
        connectOutlets: function(router, context) {
          mixpanel.track('view index', context);
          router.get('applicationController').connectOutlet('header', 'comingSoon');
          router.get('applicationController').connectOutlet('body', 'products', app.Product.all());
          router.get('applicationController').connectOutlet('footer', 'copyright');
        }
      }),

      products: Ember.Route.extend({
        route: '/products',

        product: Ember.Route.extend({
          route: '/:name',

          deserialize: function(router, context) {
            return app.Product.find(context.name);
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
