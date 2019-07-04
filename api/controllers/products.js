const mongoose = require('mongoose');

const Product = require('../models/products');

const ChaincodeActions = require('./hlf-panel/chaincode-actions');

exports.queryChaincode = async (req, res, next) => {
    console.log(req.userData.nickName);
    try {
        const cars = await ChaincodeActions.queryChaincode(req.userData.nickName);
        res.status(200).json({
            cars
        })
    } catch (err) {
        res.status(500).json({
            message: "Error invoking chaincode",
            err
        })
    }

};

exports.invokeChaincode = async (req, res, next) => {
    console.log(req.userData.nickName);

    try {
        const txn = await ChaincodeActions.invokeChaincode('createCar', req.userData.nickName);
        res.status(200).json({
            txn
        })
    } catch (err) {
        res.status(500).json({
            message: "Error invoking chaincode",
            err
        })
    }

};

exports.create_product = (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            createdProduct: result
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            err
        })
    });


};

exports.get_all_products = (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc.id
                        }
                    }
                })
            };
            res.status(200).json({
                response
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err
            })
        });
};

exports.get_product_by_id = (req, res, next) => {
    const productID = req.params.id;

    Product.findById(productID)
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json({
                doc
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err
            })
        });
};

exports.modify_product = (req, res, next) => {
    const productID = req.params.id;

    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.updateOne({_id: productID} , { $set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + productID
                },
                result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err
            })
        })
};

exports.delete_product = (req, res, next) => {
    const productID = req.params.id;

    Product.deleteOne({_id: productID})
        .exec()
        .then(result => {
            res.status(200).json({
                result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                err
            })
        });
};
