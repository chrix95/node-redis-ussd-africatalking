const redisClient = require('../redis/client');

/**
 * Store data in redis
 * @param {value} req 
 * @param {"success"} res 
 */
const setTestData = async (req, res) => {
    const key = "TEST_KEY";
    const value = req.body.value;
    await redisClient.setAsync(key, JSON.stringify(value));
    return res.status(200).send('Success');
};

/**
 * Retrieve data in cache
 * @param {*} req 
 * @param {*} res 
 */
const getTestData = async (req, res) => {
    const key = "TEST_KEY";
    const rawData = await redisClient.getAsync(key);
    return res.status(200).json(JSON.parse(rawData));
}

module.exports = {
    setTestData, getTestData
}

