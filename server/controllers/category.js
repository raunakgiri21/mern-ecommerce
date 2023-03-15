const Category = require('../models/category')
const slugify = require('slugify');

const createCategory = async(req,res) => {
    try {
        const body = req.body;
        const { name } = body;
        if(!name || !name.trim()) {
            return res.status(400).json({error: "Name cannot be empty!"});
        }
        const existingCategory = await Category.findOne({ name });
        if(existingCategory){
            return res.status(400).json({error: "Category already exists!"})
        }

        const category = await Category.create({name, slug: slugify(name)})
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json(error);
    }
}

const updateCategory = async(req,res) => {
    try {
        const {name} = req.body;
        const {categoryId} = req.params;
        const category = await Category.findByIdAndUpdate(categoryId, {name, slug: slugify(name)},{new: true});

        if(!category){
            return res.status(400).json({error: "Unable to update!",categoryId});
        }
        res.status(201).json(category) 
    } catch (error) {
        res.status(400).json(error);
    }
}

const deleteCategory = async(req,res) => {
    try {
        const {categoryId} = req.params;
        const category = await Category.findByIdAndRemove(categoryId);
        if(!category){
            return res.status(400).json({error: "Category doesn't exists!"});
        }
        res.status(201).json(category) 
    } catch (error) {
        res.status(400).json(error);
    }
}

const readSingleCategory = async(req,res) => {
    try {
        const {categoryId} = req.params;
        const category = await Category.findById(categoryId);
        if(!category){
            return res.status(400).json({error: "This Category doesn't exists!"});
        }
        res.status(200).json(category)
    } catch (error) {
        res.status(400).json(error);
    }
}

const readCategoryList = async(req,res) => {
    try {
        const all = await Category.find({});
        res.status(200).json(all)
    } catch (error) {
        res.status(400).json(error);
    }
}


module.exports = { createCategory, updateCategory, deleteCategory, readCategoryList, readSingleCategory }