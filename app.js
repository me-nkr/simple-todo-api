import express from 'express';
import './helpers/dbConnect.js';
import errorHandler from './helpers/errorHandler.js';

import todoRoutes from './routes/TodoRoutes.js';
import userRoutes from './routes/UserRoutes.js';

const app = express();

app.use(express.json());

app.use('/todo', todoRoutes);
app.use('/auth', userRoutes)

app.use(errorHandler);

app.listen(3000);