import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    meals: [
        {
            meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
            quantity: { type: Number, default: 1 }
        }
    ],
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    methodOfPayment: { type: String, required: true }
}, { timestamps: true })

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;