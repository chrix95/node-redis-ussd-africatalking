const axios = require('axios')

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: "https://ussd-data-house.mymdoc.com/api",
});

// Alter defaults after instance has been created
instance.defaults.headers.common["Content-Type"] = "application/json";
instance.defaults.headers.common["x-access-token"] = process.env.X_ACCESS_TOKEN ?? "test"

module.exports = { 
    instance
}