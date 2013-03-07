(function(win) {
  var app = Ember.Application.create();

  app.Product = DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    price: DS.attr('string'),
    pictures: DS.hasMany('NKK.Picture'),
    sizes: DS.hasMany('NKK.Size'),
    primaryPicture: function() {
      return this.get('pictures').objectAt(0);
    }.property('pictures.0'),
  });

  app.Picture = DS.Model.extend({
    small: DS.attr('string'),
    large: DS.attr('string')
  });

  app.Size = DS.Model.extend({
    name: DS.attr('string'),
    price: DS.attr('string')
  });

  app.RESTAdapter = DS.RESTAdapter.extend({
    namespace: 'api',
      serializer: DS.RESTSerializer.extend({
        primaryKey: function(type) {
          return '_id';
        }
      })
  });

  app.RESTAdapter.map(app.Product, {
    pictures: {embedded: 'always'},
    sizes: {embedded: 'always'}
  });

  app.Store = DS.Store.extend({
    revision: 11,
    adapter: app.RESTAdapter
  });

  app.Router.map(function() {
    this.resource('products', {path: '/'}, function() {
      this.resource('product', {path: '/:product_id'});
    });
  });

  app.ProductsRoute = Ember.Route.extend({
    events: {
      showProduct: function(product) {
        this.transitionTo('product', product);
      },
      goHome: function() {
        this.transitionTo('products');
      }
    },
    model: function() {
      return app.Product.find({});
    }
  });

  app.ProductsIndexRoute = Ember.Route.extend({
    setupController: function(controller, model) {
      mixpanel.track('view products');
    },
    model: function() {
      return this.modelFor('products');
    }
  });

	app.ProductRoute = Ember.Route.extend({
    setupController: function(controller, model) {
      mixpanel.track('view product', {name: model.get('name')});
    }
	});

  win.NKK = app;
})(window);