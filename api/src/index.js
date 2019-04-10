import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';

// Routes for the app
import User from './v1/routes/user.route';
import Account from './v1/routes/account.route';
import Transaction from './v1/routes/transaction.route';

require('dotenv').config();


const app = express();

app.use(bodyParser.json());
app.use(expressValidator());

const PORT = process.env.PORT || 2500;


app.get('/', (req, res) => res.send({
  status: 200,
  message: 'Welcome to Banka App by Damilola Adekoya',
}));

app.use('/api/v1/auth', User);
app.use('/api/v1/accounts', Account);
app.use('/api/v1/transactions', Transaction);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server is listening on port:${PORT}`);
});

export default app;
