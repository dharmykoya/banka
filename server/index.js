import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressValidator from 'express-validator';
import dotenv from 'dotenv';

// Routes for the app
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import Auth from './routes/auth.route';
import Account from './routes/account.route';
import Transaction from './routes/transaction.route';
import User from './routes/user.route';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

const PORT = process.env.PORT || 2500;


app.get('/', (req, res) => res.send({
  status: 200,
  message: 'Welcome to Banka App by Damilola Adekoya',
}));

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/auth', Auth);
app.use('/api/v1/accounts', Account);
app.use('/api/v1/transactions', Transaction);
app.use('/api/v1/user', User);

app.listen(PORT, () => {});

export default app;
