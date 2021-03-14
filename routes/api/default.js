const express = require("express");
const router = express.Router();
const { ussdRouter } = require('ussd-router');
const utilsController = require("../../controller/utils");

router.post("/", async (req, res) => {
    // Read variables sent via POST from our SDK
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    console.log("###################", req.body);
    let response = "";
    let footer = "\n00. Back \n 0. Main Menu"
    const textVal = ussdRouter(text);
    if (textVal == "" || textVal == "1*0" || textVal == "1*2*0" || textVal == "4*0" || textVal == "4*3*0") {
        response += `CON Welcome, to mDoc!\n`;
        response += `1. Register with mDoc\n`;
        response += `2. Information about Tele-ECHO sessions \n`
        response += `3. Pay for mDoc membership \n`
        response += `4. Retrieve health metrics \n`
        response += `5. Contact a health coach`
    } else if (textVal == "1") {
        // Check user registration status
        // If registered: 
        // a) Display a message that he/she is registered
        // b) Show the below information
        response += `CON 1. Receive a call from a health coach\n`;
        response += `2. Register via USSD\n`;
        response += `3. Register at one of our nudge hubs`
        response += footer
    } else if (textVal == "2") {
        response += `END Information about Tele-ECHO sessions will be displayed here`;
        response += footer
    } else if (textVal == "3") {
        response += `END Payment information will be displayed here`;
        response += footer
    } else if (textVal == "4" || textVal == "4*3*2") {
        response += `CON What would you like to retrieve?\n`;
        response += `1. Weight \n`;
        response += `2. Weight goal \n`
        response += `3. BP \n`
        response += `4. Blood sugar \n`
        response += `5. Cholesterol \n`
        response += `6. BMI \n`
        response += `7. Physical activity \n`
        response += `8. Waist circumference \n`
        response += `9. HBA1c values \n`
        response += footer
    } else if (textVal == "5") {
        response += `END Contact information of health coach will be displayed here`;
        response += footer
    } else if (textVal == "1*1") {
        // const result = await utilsController.getRedisData("username");
        response += `END One of our health coaches will contact you within xx hours.`;
        response += footer
    } else if (textVal == "1*2") {
        response += `CON Enter your name (First name, Last name) \n`;
        response += footer
    } else if (textVal == "1*3") {
        response += `END Here is a list of our nudgehubs: \n`;
        response += `a. Location A \n`;
        response += `b. Location B \n`;
        response += `c. Location C \n`;
        response += `Visit any of these to register and have your health metrics taken\n`;
        response += footer
    } else if (textVal == "4*3") {
        response += `CON Here is your BP (mm/Hg) over the last week: \n`;
        response += `Day 1: 140/90 \n`;
        response += `Day 2: 145/90 \n`;
        response += `Day 3: 132/85 \n`;
        response += `Day 4: 128/85 \n`;
        response += `Day 5: 120/80 \n`;
        response += footer
    } else {
        response += `END Unable to process request, please try again in 5 minutes`
    }
    res.status(200).send(response);
});

module.exports = {
    router
} 