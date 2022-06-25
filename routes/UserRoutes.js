import { Router} from 'express';
import UserModel from '../models/UserModel.js';
import userController, { authenticate as auth } from '../controllers/UserController.js';

const { createUser, loginUser, sayWelcome } = new userController(UserModel);

const router = Router();

router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/welcome', auth, sayWelcome)

export default router;