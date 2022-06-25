import { AuthError, InvalidRequestError, NotFoundError } from "../helpers/errorHandler.js";

export default class Todo {

    constructor(model) {
        this.model = model;
    }

    getTodos = async (req, res, next) => {
        const todos = await this.model.find({ owner: req.user.id });
        res.json(todos);
    }

    createTodo = async (req, res, next) => {
        try {

            if (!req.body.todos || !req.body.todos.length || !req.body.todos.every(todo => typeof todo === 'string'))
                throw new InvalidRequestError('Invalid request body');

            const todos = await this.model.create(req.body.todos.map(todo => ({ name: todo, owner: req.user.id })))
            res.status(201).json(todos);

        } catch (error) { next(error) }
    }

    updateTodo = async (req, res, next) => {
        try {

            if (! await this.model.exists({ _id: req.params.id })) throw new NotFoundError('Todo');
            const todo = await this.model.findOneAndUpdate({ owner: req.user.id, _id: req.params.id }, req.body, { new: true });

            if (todo) res.json(todo);
            else throw new AuthError('permission');

        } catch (error) { next(error) }
    }

    deleteTodo = async (req, res, next) => {
        try {

            if (! await this.model.exists({ _id: req.params.id })) throw new NotFoundError('Todo');
            const todo = await this.model.findOneAndDelete({ owner: req.user.id, _id: req.params.id });

            if (todo) res.json(todo);
            else throw new AuthError('permission');

        } catch (error) { next(error) }
    }
}