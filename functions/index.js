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
        console.log(JSON.stringify(result))
        return { ...result, metric: {...metric} }
    } catch (error) {
        console.log(error);
        return {status: "error", metric: {...metric}}
    }
}

const contactHealthCoach = async (phone, message) => {
    try {
        const payload = { phone: phone.replace("+", ""), reason: message }
        const response = await instance.post("/contact_coach", payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return { status: "error" }
    }
}

const registerUser = async (payload) => {
    try {
        const response = await instance.post("/register_member", payload);
        return { status, data } = response.data;
    } catch (error) {
        console.log(error);
        return {
            "status": "error"
        }
    }
}

const sendHealthMetrics = async (payload) => {
    try {
        let response;
        if (payload.hasOwnProperty('height')) {
            response = await instance.post("/update_height", payload);
        } else {
            response = await instance.post("/add_metrics", payload);
        }
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
    getHealthMetrics,
    contactHealthCoach,
    sendHealthMetrics
}