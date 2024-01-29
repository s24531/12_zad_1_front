const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Product = require('./Schemas');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/products');

app.get('/products', async (req, res) => {
    const products = await Product.find(req.query).sort(req.query.sort);
    res.json(products);
});

app.post('/products', async (req, res) => {
    const productExists = await Product.findOne({ name: req.body.name });
    if (productExists) return res.status(400).send('Product already exists');
    const product = new Product(req.body);
    await product.save();
    res.json(product);
});

app.put('/products/:id', async (req, res) => {
    const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
});

app.delete('/products/:id', async (req, res) => {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
});

app.get('/products/report', async (req, res) => {
    const report = await Product.aggregate([
        { 
            $group: { 
                _id: null, 
                averageQuantity: { $avg: '$quantity' }, 
                averageValue: { $avg: { $multiply: ['$price', '$quantity'] } } 
            } 
        }
    ]);
    res.json(report);
});

app.listen(3000, () => console.log('Server started on port 3000'));