import '@babel/polyfill';
require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';

// Routes for the app
import User from './v1/routes/user.route';
import Account from './v1/routes/account.route';
import Transaction from './v1/routes/transaction.route';


const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 2500;


app.get('/', (req, res) => {
    return res.send({
        status: 200,
        message: 'Welcome to Banka by Damilola Adekoya By Damilola Adekoya'
    });
});

app.use('/api/v1/auth', User);
app.use('/api/v1/accounts', Account);
app.use('/api/v1/transactions', Transaction);

app.listen(PORT, () => {
    console.log(`server is listening on port:${PORT}`);
});

export default app;
