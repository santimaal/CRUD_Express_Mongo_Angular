const { category } = require("../models");
const db = require("../models");
const Category = db.category;
const serializeCategory = require('./serializers/serializers_category');

// Create and Save a new Category
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.id_cat) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  try {
    // Create a Category
    const category = new Category({
      id_cat: req.body.id_cat || null,
      cat_name: req.body.cat_name || null,
    });
    await category.save();
    res.send(category);
  } catch (error) {
    res.status(500).send('Hubo un error');
  }
};

// Find all Categories from the database.
exports.findAll = async (req, res) => {
  try {
    const id_cat = req.body.id_cat;
    var condition = id_cat ? { id_cat: { $regex: new RegExp(id_cat), $options: "i" } } : {};

    const category = await Category.find(condition);
    res.json(serializeCategory.serializeAllCategories(category));
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving tutorials."
    });
  }
};

// Find a one Categoryes with an id
exports.findOne = async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.id });

    if (!category) {
      res.status(404).json({ msg: 'No existe la categoria' })
    }

    res.json(category)
    // res.json(serializeCategory.serializeOneCategory(category));

  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }

};

// Update a Tutorial by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  try {
    let old_category = await Category.findOne({ slug: req.params.id });
    if (old_category.cat_name !== req.body.cat_name && req.body.cat_name !== undefined) {
      old_category.slug = null;
    }
    old_category.cat_name = req.body.cat_name || old_category.cat_name;
    old_category.id_cat = req.body.id_cat || old_category.id_cat;
    const category = await old_category.save();
    if (!category) { res.status(404).json(FormatError("Category not found", res.statusCode)); }
    res.json({ msg: "Category updated" })

  } catch (error) {
    res.status(404).send({
      message: `Cannot update Tutorial with id=${req.params.id}. Maybe Tutorial was not found!`
    });
  }
};

// Delete a Tutorial with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {

    let category = await Category.findOneAndDelete({slug : req.params.id});

    if (!category) {
      res.status(404).json({ msg: 'No existe la categoria' })
    }

    res.send({ msg: 'Category eliminado con éxito!' })


  } catch (error) {
    res.status(404).send({
      message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
    });
  }
};

// Delete all Categories from the database.

exports.deleteAll = async (req, res) => {

  try {
    const deleteALL = await Category.collection.drop();
    res.send({ msg: 'Category were deleted successfully' })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all category."
    });
  }
}

// Find all published Tutorials
exports.findAllPublished = async (req, res) => {
  try {
    Category.find({ published: true })
    res.json(data);
  } catch (error) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving tutorials."
    });
  }
};
