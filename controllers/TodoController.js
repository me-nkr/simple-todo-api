export default class Todo {

    constructor(model) {
        this.model = model;
    }

    getTodos = async (req, res, next) => {
        const todos = await this.model.find({ owner: req.user.id });
        res.json(todos);
    }

    createTodo = async (req, res, next) => {
        if (req.body.todos) {
            const todos = [];
            for await (let todo of req.body.todos) {
                const item = new this.model({
                    name: todo,
                    owner: req.user.id
                });
                await item.save()
                todos.push(item);
            }
            res.status(201).json(todos);
        }
        else res.status(500).json({ message: 'something went wrong' });
    }
    
    updateTodo = async (req, res, next) => {
        const todo = await this.model.findOneAndUpdate({ owner: req.user.id, _id: req.params.id }, req.body, { new: true });

        if (todo) {
            res.json(todo);
        }
        else res.status(404).json({ message: 'item not found' });
    }

    deleteTodo = async (req, res, next) => {
        const todo = await this.model.findOneAndDelete({ owner: req.user.id, _id: req.params.id });

        if (todo) res.json(todo);
        else res.status(404).json({ message: 'item not found' });
    }
}