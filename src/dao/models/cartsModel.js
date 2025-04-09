import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: {
        type:[
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                },
                quantity: {
                    type: Number,
                }
            }
        ]
    }
},{
    timestamps: true,
    strict: false
});

cartSchema.pre(['find', 'findOne'], function () {
    this.populate('products.product');
});
export const CartModel= mongoose.model('carts', cartSchema);
