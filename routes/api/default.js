const express = require("express");
const router = express.Router();
const utilsController = require("../../controller/utils");

router.post("/", async (req, res) => {
    // Read variables sent via POST from our SDK
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    console.log("###################", req.body);
    let response = "";
    if (text == "") {
        response += `CON Welcome, your phone number is ${phoneNumber} \n`;
        response += `1. Guess my name \n`;
        response += `2. Exit`
    } else if (text == "1") {
        const title  = await utilsController.fetchTitle()
        if (title.status == "error") {
            response += `END Error retreving your name`;
        } else {
            response += `CON Your name is ${title.title}\n`;
            response += `0. Back`;
        }
    } else if (text == "2") {
        response += `END Thank you for being a part of our survey`;
    } else if (text == "1*0") {
        const result = await utilsController.getRedisData("username");
        response += `END Sorry you can"t go back ${result}`;
    } else {
        response += `END Invalid response`
    }
    res.status(200).send(response);
});

module.exports = {
    router
} 