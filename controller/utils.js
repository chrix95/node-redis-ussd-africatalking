const redisClient = require('../redis/client');
const axios = require('axios');
/**
 * Store data in redis
 * @param {value} req 
 * @param {"success"} res 
 */
const setRedisData = async (key, value) => {
    await redisClient.setAsync(key, JSON.stringify(value));
    return "OK"
};

/**
 * Retrieve data in cache
 * @param {*} req 
 * @param {*} res 
 */
const getRedisData = async (key) => {
    const rawData = await redisClient.getAsync(key);
    return JSON.parse(rawData);
}

/**
 * Retrieve data in from mocked endpoint
 * @param {*} req 
 * @param {*} res 
 */
const fetchTitle = async () => {
    try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
        const result = { title } = response.data;
        setRedisData("username", result.title);
        return {
            "status": "false",
            "title": result.title
        };
    } catch (error) {
        console.log(error);
        return {
            "status": "error"
        }
    }
}

const setRegisterInfo = async (sessionId, value) => {
    if (data = await getRedisData(sessionId)) {
        await setRedisData(sessionId, {...data, ...value})
        // console.log(`Data dey: ${done}`)
        // console.log(`Get: ${JSON.stringify(await getRedisData(sessionId))}`)
    } else {
        await setRedisData(sessionId, value)
        // console.log(`Data no dey: ${done}`)
        // console.log(`Get: ${JSON.stringify(await getRedisData(sessionId))}`)
    }
}

module.exports = {
    setRedisData, getRedisData, fetchTitle, setRegisterInfo
}

