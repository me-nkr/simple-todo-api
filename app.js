import express from 'express';
import './helpers/dbconnect.js';
import todoRoutes from './routes/TodoRoutes.js';
import userRoutes from './routes/UserRoutes.js';

const app = express();

app.use(express.json());
app.use('', todoRoutes);
app.use('/auth', userRoutes)

app.listen(3000);