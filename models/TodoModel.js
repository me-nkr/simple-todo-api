import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
    name: String,
    done: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model('Todo', todoSchema);