// import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';


const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 6000;


app.get('/', (req, res) => {
    return res.send({
        status: 200,
        message: 'Welcome to Banka by Damilola Adekoya By Damilola Adekoya'
    });
});

app.listen(PORT, () => {
    console.log(`server is listening on port:${PORT}`);
});

export default app;
