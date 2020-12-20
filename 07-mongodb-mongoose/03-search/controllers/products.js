const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query: searach } = ctx.request.query;
  const searchQuery = searach ? { $text: { $search: searach } } : {};
  const products = await Product.find(searchQuery);

  ctx.body = {products};
};
