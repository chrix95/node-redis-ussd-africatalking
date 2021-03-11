const express = require('express');
const app = express();
require('dotenv').config()
const {router} = require('./routes/demo/default');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/demo",router);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});