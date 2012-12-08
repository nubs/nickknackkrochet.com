(function(win) {
  var app = Ember.Application.create();

  app.Product = Ember.Object.extend();
  app.Product.reopenClass({
    _listOfProducts: Ember.A(),
    all: function() {
      var allProducts = this._listOfProducts;

      $.getJSON('/api/products', function(products) {
        allProducts.setObjects(products);
      });

      return this._listOfProducts;
    }
  });

  app.ApplicationController = Ember.Controller.extend();
  app.ProductsController = Ember.ArrayController.extend(),

  app.ApplicationView = Ember.View.extend({templateName: 'application'});
  app.ComingSoonView = Ember.View.extend({templateName: 'comingSoon'});
  app.CopyrightView = Ember.View.extend({templateName: 'copyright'});
  app.ProductsView = Ember.View.extend({templateName: 'products'});

  app.Router = Ember.Router.extend({
    root: Ember.Route.extend({
      index: Ember.Route.extend({
        route: '/',
        connectOutlets: function(router, context) {
          router.get('applicationController').connectOutlet('header', 'comingSoon');
          router.get('applicationController').connectOutlet('body', 'products', app.Product.all());
          router.get('applicationController').connectOutlet('footer', 'copyright');
        }
      })
    })
  });

  win.NKK = app;
})(window);
