import { Router} from 'express';
import UserModel from '../models/UserModel.js';
import userController from '../controllers/UserController.js';

const { createUser, loginUser, sayWelcome } = new userController(UserModel);

const router = Router();

router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/welcome', sayWelcome)

export default router;