import { AuthError, InvalidRequestError, NotFoundError } from "../helpers/errorHandler.js";

export default class Todo {

    constructor(model, userModel) {
        this.model = model;
        this.userModel = userModel;
    }

    getTodos = async (req, res, next) => {
        try {

            const finder = { owner: req.user.id };
            const { completed, name } = req.query;

            if (completed) finder.done = JSON.parse(completed.toLowerCase());
            if (name) finder.name = new RegExp(name);

            const todos = await this.model.find(finder);
            res.json(todos);
            
        } catch(error) { 
            if (error instanceof SyntaxError && /JSON/.test(error))
                return next(new InvalidRequestError('Invalid query parameter value'));
            next(error) 
        }
    }

    createTodo = async (req, res, next) => {
        try {

            if (!req.body.todos || !req.body.todos.length || !req.body.todos.every(todo => {
                if (typeof todo !== 'object' || Array.isArray(todo)) return false;
                const properties = Object.keys(todo);
                if (properties.length !== 2 || !properties.includes('name') || !properties.includes('collabrators')) return false;
                if (typeof todo.name !== 'string' || !Array.isArray(todo.collabrators) || !todo.collabrators.every(item => typeof item === 'string')) return false
                return true
            }))
                throw new InvalidRequestError('Invalid request body');

            if (req.body.todos.some(todo => todo.collabrators.some(collabrator => collabrator === req.user.email)))
                throw new InvalidRequestError('You can\'t add yourself as a collabrator');

                
                for await (let [index, todo] of Object.entries(req.body.todos)) {
                for await (let [person, email] of Object.entries(todo.collabrators)) {
                    const user = await this.userModel.exists({ email });
                    if (!user) throw new NotFoundError('User with email' + email + ' was');
                    req.body.todos[index].collabrators[person] = user._id;
                }
            }

            const todos = await this.model.create(req.body.todos.map(todo => ({
                name: todo.name,
                owner: [
                    req.user.id,
                    ...todo.collabrators
                ]
            })))
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