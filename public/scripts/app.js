(function(win) {
  var app = Ember.Application.create();

  app.Product = DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    price: DS.attr('string'),
    pictures: DS.hasMany('NKK.Picture'),
    sizes: DS.hasMany('NKK.Size'),
    tags: DS.hasMany('NKK.Tag'),
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

  app.Tag = DS.Model.extend({
    name: DS.attr('string')
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
    sizes: {embedded: 'always'},
    tags: {embedded: 'always'}
  });

  app.Store = DS.Store.extend({
    revision: 11,
    adapter: app.RESTAdapter
  });

  app.Router.map(function() {
    this.resource('root', {path: '/'}, function() {
      this.resource('tags', {path: '/'}, function() {
        this.resource('tag', {path: '/:tag_name'}, function() {
          this.resource('products', {path: '/products'}, function() {
          });
        });

        this.resource('product', {path: '/products/:product_id'});
      });
    });
  });

  /* This route exists primarily to circumvent special handling of the
   * ApplicationRoute in Ember.  In particular, the issue where the back button
   * causes the application route to be rendered inside itself. */
  app.RootRoute = Ember.Route.extend({
    events: {
      showProduct: function(product) {
        this.transitionTo('product', product);
      },
      showTag: function(tag) {
        this.transitionTo('tag', tag);
      },
      goHome: function() {
        this.transitionTo('tags');
      }
    },

    model: function() {
      return app.Product.find({});
    }
  });

  app.TagsRoute = Ember.Route.extend({
    setupController: function(controller, model) {
      //mixpanel.track('view tags');
    },
    model: function() {
      return this.modelFor('root').reduce(function(tags, product) {
        return tags.addObjects(product.get('tags').filter(function(tag) {
          return !tags.findProperty('name', tag.get('name'));
        }));
      }, Ember.A());
    }
  });

  app.TagsIndexRoute = Ember.Route.extend({
    model: function() {
      return this.modelFor('tags');
    }
  });

  app.TagRoute = Ember.Route.extend({
    serialize: function(tag) {
      return {tag_name: tag.get('name')};
    },
    redirect: function() {
      this.transitionTo('products', this.get('context'));
    },
    setupController: function(controller, model) {
      //mixpanel.track('view tag');
    },
    model: function(params) {
      return this.modelFor('tags').findProperty('name', params.tag_name);
    }
  });

  app.ProductsRoute = Ember.Route.extend({
    setupController: function(controller, model) {
      //mixpanel.track('view products');
    },
    model: function() {
      var tagName = this.modelFor('tag').get('name');
      return this.modelFor('root').filter(function(product) {
        return product.get('tags').someProperty('name', tagName);
      });
    }
  });

	app.ProductRoute = Ember.Route.extend({
    setupController: function(controller, model) {
      //mixpanel.track('view product', {name: model.get('name')});
    }
	});

  win.NKK = app;
})(window);
