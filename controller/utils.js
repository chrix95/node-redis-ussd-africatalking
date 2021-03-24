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
    } else {
        await setRedisData(sessionId, { auth: value});
    }
}

const setRegisterInfo = async (sessionId, value) => {
    if (data = await getRedisData(sessionId)) {
        await setRedisData(sessionId, { ...data, registration: {...data.registration, ...value} })
        console.log(`Get: ${JSON.stringify(await getRedisData(sessionId))}`)
    } else {
        await setRedisData(sessionId, { registration: value })
        console.log(`Get: ${JSON.stringify(await getRedisData(sessionId))}`)
    }
}

const setHealthMetrics = async (sessionId, value) => {
    if (data = await getRedisData(sessionId)) {
        await setRedisData(sessionId, { ...data, metrics: {...data.metrics, ...value} })
        console.log(`Get: ${JSON.stringify(await getRedisData(sessionId))}`)
    } else {
        await setRedisData(sessionId, { metrics: value })
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
        measurement: "kg",
        sample: "75"
    },
    {
        id: 2,
        title: "Weight Goal",
        code: "weight_goal",
        measurement: "kg",
        sample: "60"
    },
    {
        id: 3,
        title: "BP",
        code: "blood_pressure",
        measurement: "mm/Hg",
        sample: "120/80"
    },
    {
        id: 4,
        title: "Fasting Blood sugar",
        code: "fasting_blood_sugar",
        measurement: "mg/dl",
        sample: "80"
    },
    {
        id: 5,
        title: "Random Blood sugar",
        code: "random_blood_sugar",
        measurement: "mg/dl",
        sample: "80"
    },
    {
        id: 6,
        title: "Physical activity",
        code: "physical_activity",
        measurement: "kg"
    },
    {
        id: 7,
        title: "Waist circumference",
        code: "waist_circumference",
        measurement: "cm",
        sample: "32"
    },
    {
        id: 8,
        title: "Height",
        code: "height",
        measurement: "cm",
        sample: "120"
    },
]

const sortItem = (payload) => {
    return payload.sort((a, b) => a.updated_at < b.updated_at ? -1 : 1)
}

module.exports = {
    setRedisData, 
    getRedisData, 
    setAuthenticationInfo, 
    setRegisterInfo,
    setHealthMetrics,
    splitName,
    healthMetrics
}

