import express from 'express';
import './helpers/dbconnect.js';
import todoRoutes from './routes/TodoRoutes.js';

const app = express();

app.use(express.json());
app.use('', todoRoutes);

app.listen(3000);