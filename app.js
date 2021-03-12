const express = require('express');
const app = express();
require('dotenv').config()
const {router} = require('./routes/api/default');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});