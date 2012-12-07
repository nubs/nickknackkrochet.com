(function(win) {
  var app = Ember.Application.create({rootElement: '#app'});

  app.productsController = Ember.ArrayController.create({
    content: [],
  }),

  $.getJSON('/api/products', function(products) {
    app.productsController.setObjects(products);
  });

  win.NKK = app;
})(window);
