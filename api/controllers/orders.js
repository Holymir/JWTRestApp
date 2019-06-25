const mongoose = require('mongoose');

const Order = require('../models/orders');
const Product = require('../models/products');

exports.create_order = (req, res, next) => {
    Product.findById(req.body.productID)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product Not Found'
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productID
            });

            return order.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Order Stored',
                        createdOrder: {
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity
                        }
                    });
                })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });

};

exports.get_all_orders = (req, res, next) => {
    Order.find()
        .select('_id quantity product')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            })
        }).catch(err => {
        res.status((500).json({
            err
        }))
    });
};

exports.get_order_by_id = (req, res, next) => {
    Order.findById(req.params.id)
        .populate('product')
        .exec()
        .then(order => {
            res.status(200).json(order)
        })
        .catch()


};

exports.delete_order = (req, res, next) => {
    Order.remove({_id: req.params.id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'order Deleted',
                result
            })
        })
        .catch()
};
