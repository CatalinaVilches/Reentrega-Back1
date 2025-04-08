import mongoose from "mongoose";
import mongosePaginate from "mongoose-paginate-v2";

const messageSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
},{
    timestamps: true,
    strict: false
});

messageSchema.plugin(mongosePaginate);

export const MessageModel= mongoose.model('messages', messageSchema);