import express from 'express';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

await mongoose.connect(process.env.MONGO_URL);

const todoSchema = new mongoose.Schema({
    name: String,
    done: {
        type: Boolean,
        default: false
    }
})

const Todo = mongoose.model('Todo', todoSchema);

const app = express();

app.use(express.json());

app.route('/')
    .get(async (req, res) => {

        const todos = await Todo.find();
        res.json(todos);

    })
    .post(async (req, res) => {
        
        if (req.body.todos) {
            const todos = [];
            for await (let todo of req.body.todos) {
                const item = new Todo({ name: todo });
                await item.save()
                todos.push(item);
            }
            res.status(201).json(todos);
        }
        else res.status(500).json({ message: 'something went wrong' });

    });

app.route('/:id')
    .put(async (req, res) => {
        
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (todo) {
            res.json(todo);
        }
        else res.status(404).json({ message: 'item not found' });

    })
    .delete(async (req, res) => {

        const todo = await Todo.findByIdAndDelete(req.params.id);
        
        if (todo) res.json(todo);
        else res.status(404).json({ message: 'item not found' });

    });

app.listen(3000);
