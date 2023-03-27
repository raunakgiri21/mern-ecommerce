const { default: slugify } = require('slugify');
const fs = require('node:fs')
const Product = require('../models/product');

const getAllProducts = async (req,res) => {
    try {
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
                    if(queryObject[field]){
                        queryObject[field][operator] = Number(value)
                    }else
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
        const limit = Number(req.query.limit) || 9;
        const skip = (page - 1)*limit;
        
        result = result.skip(skip).limit(limit)
        
        const products = await result;
        res.status(200).json({products, nbHits: products.length})
    } catch (error) {
        res.status(400).json(error)
    }
}

const getSingleProduct = async(req,res) => {
    try {
        const product = await Product.findOne({slug: req.params.slug}).populate('category');
        if(!product){
            return res.status(404).json({error: "Not Found!"});
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json(error)
    }
}

const getProductByID = async(req,res) => {
    try {
        const product = await Product.findById(req.params.productID).populate('category');
        if(!product){
            return res.status(404).json({error: "Not Found!"});
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json(error)
    }
}

const getTotalProductsLength = async(req,res) => {
    try {
        const products = await Product.find({}).select('-image');
        res.status(200).json(products.length)
    } catch (error) {
        res.status(400).json(error)
    }
}

const getProductPhoto = async (req,res) => {
    try {
        const product = await Product.findById(req.params.productId).select('image');
        if(!product || !product.image) {
            return res.status(404).json({error: "Not Found!"});
        }
        res.set("Content-Type", product.image.contentType);
        res.status(200).send(product.image.imageBase64);
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
        const base64Img = {};
        if(image){
            const base64 = (fs.readFileSync(image.path)).toString('base64');
            base64Img.filename = image.name;
            base64Img.contentType = image.type;
            base64Img.imageBase64 = base64;
        }
        const product = await Product.create({...body,availability: quantity>0,image:base64Img,slug: slugify(name)});
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
        const base64Img = {}
        const newProduct = {...body,availability: quantity>0,slug: slugify(name)};
        if(image){
            const base64 = (fs.readFileSync(image.path)).toString('base64');
            base64Img.filename = image.name;
            base64Img.contentType = image.type;
            base64Img.imageBase64 = base64;
            
            newProduct.image = base64Img;
        }
        const productId = req.params.productId;
        const product = await Product.findByIdAndUpdate(productId,newProduct,{new: true}); //err
        if(!product){
            return res.status(404).json({error: "Not found!"});
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({error: 'Some Axios Error'})
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
    getAllProducts,getSingleProduct,getProductByID,createProduct,updateProduct,deleteProduct,getProductPhoto,getTotalProductsLength
}