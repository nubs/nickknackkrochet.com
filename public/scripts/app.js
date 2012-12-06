(function(win) {
  var app = Ember.Application.create();

  app.productsController = Ember.ArrayController.create({
    content: [],
  }),

  $.getJSON('/api/products', function(products) {
    app.productsController.setObjects(products);
  });

  win.NKK = app;
})(window);
