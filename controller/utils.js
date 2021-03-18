const redisClient = require('../redis/client');
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

const setAuthenticationInfo = async (sessionId, value) => {
    if (data = await getRedisData(sessionId)) {
        await setRedisData(sessionId, { ...data, auth: value });
        // console.log(`Data dey: ${done}`)
        // console.log(`Get: ${JSON.stringify(await getRedisData(sessionId))}`)
    } else {
        await setRedisData(sessionId, { auth: value});
        // console.log(`Data no dey: ${done}`)
        // console.log(`Get: ${JSON.stringify(await getRedisData(sessionId))}`)
    }
}

const setRegisterInfo = async (sessionId, value) => {
    if (data = await getRedisData(sessionId)) {
        // await setRedisData(sessionId, {...data, ...value})
        await setRedisData(sessionId, { ...data, registration: {...data.registration, ...value} })
        // console.log(`Data dey: ${done}`)
        console.log(`Get: ${JSON.stringify(await getRedisData(sessionId))}`)
    } else {
        // await setRedisData(sessionId, value)
        await setRedisData(sessionId, { registration: value })
        // console.log(`Data no dey: ${done}`)
        console.log(`Get: ${JSON.stringify(await getRedisData(sessionId))}`)
    }
}

const splitName = (payload) => {
    const values = payload.split(", ")
    if (values.length > 1) {
        return {
            firstName: values[0],
            lastName: values[1]
        }
    } else {
        const spacing =  payload.split(" ")
        return {
            firstName: spacing[0],
            lastName: spacing[1]
        }
    }
}

const healthMetrics = [
    {
        id: 1,
        title: "Weight",
        code: "weight",
        measurement: "kg"
    },
    {
        id: 2,
        title: "Weight Goal",
        code: "weight_goal",
        measurement: "kg",
    },
    {
        id: 3,
        title: "BP",
        code: "bp",
        measurement: "mm/Hg"
    },
    {
        id: 4,
        title: "Blood sugar",
        code: "blood_sugar",
        measurement: "mm/Hg"
    },
    {
        id: 5,
        title: "Physical activity",
        code: "physical_activity",
        measurement: "kg"
    },
    {
        id: 5,
        title: "Waist circumference",
        code: "waist_circumference",
        measurement: "cm"
    },
]

module.exports = {
    setRedisData, 
    getRedisData, 
    setAuthenticationInfo, 
    setRegisterInfo,
    splitName,
    healthMetrics
}

