const { instance } = require("./request");
const utilsController = require("../controller/utils");

const getUserInfo = async (phone) => {
    console.log("...sending")
    try {
        const payload = { phone: phone.replace("+", "") }
        const response = await instance.post("/user_info", payload);
        return { status, data } = response.data;
    } catch (error) {
        console.log(error);
        return {
            "status": "error"
        }
    }
}
const getHubList = async (phone) => {
    try {
        const payload = { phone: phone.replace("+", "") }
        const response = await instance.post("/hub_locations", payload);
        return { status, data } = response.data;
    } catch (error) {
        console.log(error);
        return {
            "status": "error"
        }
    }
}

const getTeleEducationSession = async (phone) => {
    try {
        const payload = { phone: phone.replace("+", "") }
        const response = await instance.post("/classes_dates", payload);
        return { status, data } = response.data;
    } catch (error) {
        console.log(error);
        return {
            "status": "error"
        }
    }
}

const getHealthMetrics = async (phone, input) => {
    const metric = utilsController.healthMetrics.find(c => c.id == input)
    try {
        const payload = { phone: phone.replace("+", ""), type: metric.code }
        const response = await instance.post("/retrieve_metrics", payload);
        const result = response.data;
        return { ...result, metric: {...metric} }
    } catch (error) {
        console.log(error);
        return {status: "error", metric: {...metric}}
    }
}

const registerUser = async (payload) => {
    console.log(JSON.stringify(payload))
    try {
        const response = await instance.post("/register_member", payload);
        console.log(JSON.stringify(response))
        return { status, data } = response.data;
    } catch (error) {
        console.log(error);
        return {
            "status": "error"
        }
    }
}

module.exports = {
    getHubList, 
    getUserInfo, 
    registerUser,
    getTeleEducationSession,
    getHealthMetrics
}