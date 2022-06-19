import { Router} from 'express';
import TodoModel from '../models/TodoModel.js';
import todoController from '../controllers/TodoController.js';

const { getTodos, createTodo, updateTodo, deleteTodo } = new todoController(TodoModel);

const router = Router();

router.route('/')
    .get(getTodos)
    .post(createTodo);

router.route('/:id')
    .put(updateTodo)
    .delete(deleteTodo);

export default router;