const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

router.get('/:id', (req, res) => {
  Category.findById(req.params.id)
    .then((category) => {
      if (category) {
        return res.send(category);
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'Category not found!' });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.put('/:id', async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon || category.icon,
      color: req.body.color,
    },
    { new: true }
  );
  if (!category) return res.status(404).send('The category cannot be found!');

  res.send(category);
});

router.post(`/`, async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  category = await category.save();

  if (!category) return res.status(404).send('The category cannot be created!');

  res.send(category);
});

router.delete(`/:id`, (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: 'The category is deleted successfully',
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'Category not found!' });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
