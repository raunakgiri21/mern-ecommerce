const User = require('../models/user');

const getUserCart = async(req,res) => {
    try {
        const user = await User.findById(req.params.userID);
        if(!user){
            return res.status(400).json({msg : 'User not found!'})
        }
        if(!user?.cart){
            return res.status(400).json({msg : 'User has no cart!'})
        }
        res.status(200).json(user?.cart)
    } catch (error) {
        res.status(400).json({msg : 'error finding user Cart'})
        console.log(error)
    }
}
const addToCart = async(req,res) => {
    try {
        const productID = req.body.productID;
        const quantity = req.body.quantity;
        const user = await User.findOneAndUpdate(
            {_id: req.params.userID},
            { $addToSet: { cart: {productID, quantity} } },
            {new: true});
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({msg : 'error finding user Cart'})
        console.log(error)
    }
}
const updateCartItem = async(req,res) => {
    try {
        const quantity = req.body.quantity;
        const user = await User.findOneAndUpdate(
            // filtering DB by userID and then finding Cart array object by cartItemID
            {_id: req.params.userID, "cart": { "$elemMatch": { "_id": req.params.cartItemID }}},
            // Positional operator $ is a placeholder for the first matching array element
            {
                "$set": { "cart.$.quantity": quantity }
            },
            {new: true}
        );
        res.status(201).json(user.cart)
    } catch (error) {
        res.status(400).json({msg : 'error updating Cart'})
        console.log(error)
    }
}
const deleteCartItem = async(req,res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userID, {$pull: {"cart": { "_id": req.params.cartItemID }}},{new: true});
        res.status(201).json(user.cart)
    } catch (error) {
        res.status(400).json({msg : 'error deleting Cart-Item'})
        console.log(error)
    }
}
const clearCart = async(req,res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userID, {$set: {"cart": []}},{new: true});
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({msg : 'error clearing Cart'})
        console.log(error)
    }
}

module.exports = {getUserCart, addToCart, updateCartItem, deleteCartItem, clearCart}