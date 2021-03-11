const express = require('express');
const router = express.Router();
const defaultController = require('../../controller/default');

router.post('/store',defaultController.setTestData);

router.get('/retrieve', defaultController.getTestData);

router.get('/', (req, res) => {
    return res.send('Hello world');
});

module.exports = {
router
} 