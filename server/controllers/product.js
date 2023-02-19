const { default: slugify } = require('slugify');
const fs = require('node:fs')
const Product = require('../models/product');

const getAllProducts = async (req,res) => {
    const {category, name, sort, availability, fields, numericFilters} = req.query;
    const queryObject = {}
    if(category){
        queryObject.category = category ;
    }
    if(name){
        queryObject.name = {$regex: name, $options: 'i'};
    }
    if(availability){
        queryObject.availability = availability;
    }
    if(numericFilters){
        const operatorMap = {
            '<':'$lt',
            '<=':'$lte',
            '>=':'$gte',
            '>':'$gt',
            '=':'$e',
        }
        const regEx = /\b(<|>|<=|>=|=)\b/g;
        let filters = numericFilters.replace(regEx,(match) => `-${operatorMap[match]}-`)
        const options = ['price','quantity'];
        filters.split(',').forEach(item => {
            const [field,operator,value] = item.split('-');
            if(options.includes(field)){
                queryObject[field] = { [operator] : Number(value)}
            }
        });
    }
    let result = Product.find(queryObject).populate('category');
    if(sort){
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
    }
    else{
        result = result.sort('createdAt')
    }
    if(fields){
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList)
    }
    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1)*limit;

    result = result.skip(skip).limit(limit)

    const products = await result;
    res.status(200).json({products, nbHits: products.length})
}

const getSingleProduct = async(req,res) => {
    try {
        const product = await Product.findOne({slug: req.params.slug}).select('-image').populate('category');
        if(!product){
            return res.status(404).json({error: "Not Found!"});
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json(error)
    }
}
const getProductPhoto = async (req,res) => {
    try {
        const product = await Product.findOne({slug: req.params.slug}).select('image');
        if(!product || !product.image.data) {
            return res.status(404).json({error: "Not Found!"});
        }
        res.set("Content-Type", product.image.contentType);
        res.status(200).send(product.image.data);
    } catch (error) {
        res.status(400).json(error)
    }
}
const createProduct = async(req,res) => {
    try {
        const body = req.fields; //uses express-formidable
        const file = req.files; //uses express-formidable
        const {name,description,price,category,quantity,shipping} = body;
        const {image} = file;
        // validation
        if(!name.trim()){
            return res.status(400).json({error: "Name is required!"})
        }
        if(!description.trim()){
            return res.status(400).json({error: "Description is required!"})
        }
        if(!price){
            return res.status(400).json({error: "Price is required!"})
        }
        if(!category.trim()){
            return res.status(400).json({error: "Category is required!"})
        }
        if(!quantity){
            return res.status(400).json({error: "Quantity is required!"})
        }
        if(image && image.size > 1000000){
            return res.status(400).json({error: "Image size should be less than 1MB!"})
        }
        const imageDB = {};
        if(image){
            imageDB.data = fs.readFileSync(image.path);
            imageDB.contentType = image.type;
        }
        const product = await Product.create({...body,availability: quantity>0,image:imageDB,slug: slugify(name)});
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json(error)
    }
}
const updateProduct = async(req,res) => {
    try{
        const body = req.fields; //uses express-formidable
        const file = req.files; //uses express-formidable
        const {name,description,price,category,quantity} = body;
        const {image} = file;
        // validation
        if(!name || !name.trim()){
            return res.status(400).json({error: "Name is required!"})
        }
        if(!description || !description.trim()){
            return res.status(400).json({error: "Description is required!"})
        }
        if(!price){
            return res.status(400).json({error: "Price is required!"})
        }
        if(!category){
            return res.status(400).json({error: "Category is required!"})
        }
        if(!quantity){
            return res.status(400).json({error: "Quantity is required!"})
        }
        if(image && image.size > 1000000){
            return res.status(400).json({error: "Image size should be less than 1MB!"})
        }
        const newProduct = {...body,availability: quantity>0,slug: slugify(name)};
        const productId = req.params.productId;
        const product = await Product.findByIdAndUpdate(productId,newProduct,{new: true}); //err
        if(!product){
            return res.status(404).json({error: "Not found!"});
        }
        if(image){
            product.image.data = fs.readFileSync(image.path);
            product.image.contentType = image.type;
            await product.save()
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json(error)
    }
}
const deleteProduct = async(req,res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.productId).select('-image');
        if(!product){
            return res.status(404).json({error: "product doesnt exists!"})
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports = {
    getAllProducts,getSingleProduct,createProduct,updateProduct,deleteProduct,getProductPhoto
}