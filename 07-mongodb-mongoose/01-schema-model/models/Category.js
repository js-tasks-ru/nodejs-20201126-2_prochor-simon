const mongoose = require('mongoose');
const connection = require('../libs/connection');

const CATEGORY_ITEM = {
  title: {
    type: String,
    index: true,
    required: true,
  }
}

const subCategorySchema = new mongoose.Schema(CATEGORY_ITEM);

const categorySchema = new mongoose.Schema({
  subcategories: [subCategorySchema],
  ...CATEGORY_ITEM
});

module.exports = connection.model('Category', categorySchema);
