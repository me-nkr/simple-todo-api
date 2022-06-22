import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    done: {
        type: Boolean,
        required: true,
        default: false
    }
})

export default mongoose.model('Todo', todoSchema);