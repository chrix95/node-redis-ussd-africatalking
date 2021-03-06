const express = require("express");
const router = express.Router();
const { ussdRouter } = require('ussd-router');
const utilsController = require("../../controller/utils");
const initiateRequest = require("../../functions");
const request = require('request');

router.post("/", async ( req, res) => {
    // Read variables sent via POST from our SDK
    const { sessionId, serviceCode, phoneNumber, text } = req.body
    console.log("###################", req.body)
    let response = ""
    let footer = "\n00. Back \n 0. Main Menu"
    const textVal = ussdRouter(text)

    // Check the level of a user
    let ussd_string_exploded = textVal.split("*")
    $level = ussd_string_exploded.length

    if (textVal == "") {
        // Fetch the user info and check if registered
        const data = await utilsController.getRedisData(sessionId)
        if (!data || !data.auth) {
            const { status, data } = await initiateRequest.getUserInfo(phoneNumber)
            if (status == "success") {
                // set user data id registered
                utilsController.setAuthenticationInfo(sessionId, {...data, ...req.body})
            }
        }
        response += `CON Welcome, to mDoc!\n`
        response += `1. Register with mDoc\n`
        response += `2. Information about Tele-education classes \n`
        response += `3. Renew/Upgrade mDoc membership \n`
        response += `4. View health metrics \n`
        response += `5. Put in my Health Metrics \n`
        // show the below if the member has paid
        response += `6. Contact a health coach`
    } else if (textVal == "1") {
        // If user is registered show a message of "You are already a member of mDoc"
        const data = await utilsController.getRedisData(sessionId)
        if (data && data.auth) {
            response += `END You are a registered member of mDoc, feel free to explore other available options`
        } else {
            response += `CON 1. Register via USSD \n`
            response += `2. Register in-person at our NudgeHub \n`
            response += footer
        }
    } else if (textVal == "2") {
        // get the list of tele-education list
        // Fetch the available hubs
        const { status, data } = await initiateRequest.getTeleEducationSession(phoneNumber);
        if (status == "success") {
            response += `END The next 3 Tele-education classes will be on: \n`
            data.forEach((element) => {
                response += `${element.date}: ${element.title}\n`
            })
            response += `\nFor more information, visit @mymdoc on Facebook and Instagram`
        } else {
            response += `END Sorry no classes are currently available, we will reachout once available.`
        }
    } else if (textVal == "3") {
        response += `CON We offer monthly subscription plans. This service is currently free. We will update it shortly\n`
        response += footer
    } else if (textVal == "4") {
        response += `CON What would you like to view?\n`
        utilsController.healthMetrics.forEach((element) => {
            response += `${element.id}. ${element.title} \n`
        });
        response += footer
    } else if (textVal == "5") {
        response += `CON What would you like to put in?\n`;
        utilsController.healthMetrics.forEach((element) => {
            response += `${element.id}. ${element.title} \n`
        });
        response += footer
    } else if (textVal == "6") {
        response += `CON Please briefly (in 10 words or less) type your reason for wanting to contact a health coach\n`
        response += footer
    } else if (textVal == "1*1") {
        response += `CON Please enter your name (First name, Last name): \n`;
        response += footer
    } else if (textVal == "1*2") {
        // Fetch the available hubs
        const { status, data } = await initiateRequest.getHubList(phoneNumber);
        if (status == "success") {
            response += `END Here is a list of our NudgeHubs: \n`
            data.forEach((element, index) => {
                response += `${index + 1}. ${element}\n`
            })
            response += `Visit any of these to register and have your health metrics taken`
        } else {
            response += `END Sorry we couldn't retrieve the hubs try again...`
        }
    } else if (ussd_string_exploded[0] === "1" && ussd_string_exploded[1] === "1" && $level === 3) {
        // Split input into firstname and lastname
        const nameObj = utilsController.splitName(ussd_string_exploded[2])
        // store the name of the user
        utilsController.setRegisterInfo(sessionId, nameObj)
        response += `CON Please enter your email address: \n`
        response += `1. No email address \n`
        response += footer
    } else if (ussd_string_exploded[0] === "1" && ussd_string_exploded[1] === "1" && $level === 4) {
        // store the email of the user
        utilsController.setRegisterInfo(sessionId, {email: ussd_string_exploded[3] != "1" ? ussd_string_exploded[3] : "" })
        response += `CON Please enter your Date of Birth (DD/MM/YYYY): \n`
        response += footer
    } else if (ussd_string_exploded[0] === "1" && ussd_string_exploded[1] === "1" && $level === 5) {
        // store the dob of the user
        utilsController.setRegisterInfo(sessionId, {dateOfBirth: ussd_string_exploded[4].split("/").reverse().join("/")})
        response += `CON Please select your gender (Female/Male): \n`
        response += footer
    } else if (ussd_string_exploded[0] === "1" && ussd_string_exploded[1] === "1" && $level === 6) {
        // store the gender of the user
        utilsController.setRegisterInfo(sessionId, {gender: ussd_string_exploded[5]})
        response += `CON Please enter your Local Government Area: \n`
        response += footer
    } else if (ussd_string_exploded[0] === "1" && ussd_string_exploded[1] === "1" && $level === 7) {
        // store the lGA of the user
        utilsController.setRegisterInfo(sessionId, {lga: ussd_string_exploded[6]})
        response += `CON Please enter your height (cm): \n`
        response += `1. I don't know \n`
        response += footer
    } else if (ussd_string_exploded[0] === "1" && ussd_string_exploded[1] === "1" && $level === 8) {
        // store the height of the user
        utilsController.setRegisterInfo(sessionId, {height: ussd_string_exploded[7] != "1" ? ussd_string_exploded[7] : "" })
        response += `CON Please enter your weight (kg): \n`
        response += `1. I don't know \n`
        response += footer
    } else if (ussd_string_exploded[0] === "1" && ussd_string_exploded[1] === "1" && $level === 9) {
        // store the weight of the user
        utilsController.setRegisterInfo(sessionId, {weight: ussd_string_exploded[8] != "1" ? ussd_string_exploded[8] : ""})
        response += `CON Please enter your waist circumference (cm): \n`
        response += `1. I don't know \n`
        response += footer
    } else if (ussd_string_exploded[0] === "1" && ussd_string_exploded[1] === "1" && $level === 10) {
        // store the waist circumference of the user
        await utilsController.setRegisterInfo(sessionId, {waist_circumference: ussd_string_exploded[9] != "1" ? ussd_string_exploded[9] : ""});
        // register the user now
        const payload = await utilsController.getRedisData(sessionId)
        const { status } = await initiateRequest.registerUser({...payload.registration, ...{phone: phoneNumber.replace("+", "")}})
        if (status == "success") {
            // send a request to create the user account and response with feedback
            response += `CON Congratulations, ${payload.registration.firstName}! You are now a member of mDoc. Explore the various options on our menu to track your metrics and personalise your care. We are here to help you live a healthier life!\n`
            response += `0. Menu`
        } else {
            response += `END Sorry we could not register your account at the moment, kindly try again`
        }
    // } else if (ussd_string_exploded[0] === "1" && ussd_string_exploded[1] === "1" && $level === 11) {
    //     // send a request to create the user account and response with feedback
    //     response += `END Please visit mymdoc.com or one of our NudgeHubsTM or dial *xxx# to enter and view your health metrics`
    } else if (ussd_string_exploded[0] === "4" && $level === 2) {
        // Split input into firstname and lastname
        const { status, data, metric } = await initiateRequest.getHealthMetrics(phoneNumber, ussd_string_exploded[1])
        if (status == "success" && data.length > 0) {
            if (metric.measurement) {
                response += `CON Here is your ${metric.title} in ${metric.measurement} over the last 7 days: \n`
            } else {
                response += `CON Here is your ${metric.title} over the last 7 days: \n`
            }
            data.forEach(element => {
                response += `${element.dateEntered.substring(0,10)}: ${element.value} ${metric.measurement ? metric.measurement : ""} \n`
            });
        } else {
            response += `CON Sorry you haven't entered any ${metric.title} health metric.\n`
        }
        response += footer
    } else if (ussd_string_exploded[0] === "5" && $level === 2) {
        // Collect all required health metric input and send to the API
        if (ussd_string_exploded[1] == 8) {
            const { title, measurement, sample } = await utilsController.healthMetrics.find(c => c.id == ussd_string_exploded[1])
            response += `CON What is your ${title} (${measurement}) (Sample: ${sample})?`
        } else if (ussd_string_exploded[1] == 6) {
            response += `CON Type of activity \n`
            utilsController.physicalExercise.forEach(element => {
                response += `${element.sn}. ${element.name} \n`
            });
        } else {
            const object = { type: await utilsController.healthMetrics.find(c => c.id == ussd_string_exploded[1]).code }
            utilsController.setHealthMetrics(sessionId, object)
            response += `CON What date is this measurement for? (DD/MM/YYYY)`
        }
        response += footer
    } else if (ussd_string_exploded[0] === "5" && ussd_string_exploded[1] == 6 && $level === 3) {
        const object = { exerciseActivityId: await utilsController.physicalExercise.find(c => c.sn == ussd_string_exploded[2]).id, type: "exercise" }
        utilsController.setExercise(sessionId, object)
        response += `CON Duration of exercise in minute \n`
        response += footer
    } else if (ussd_string_exploded[0] === "5" && ussd_string_exploded[1] == 6 && $level === 4) {
        const object = { value:  ussd_string_exploded[3] }
        utilsController.setExercise(sessionId, object)
        response += `CON What is the intensity of your exercise? \n`
        utilsController.intensity.forEach(element => {
            response += `${element.id}. ${element.name} \n`
        });
        response += footer
    } else if (ussd_string_exploded[0] === "5" && ussd_string_exploded[1] == 6 && $level === 5) {
        const object = { exerciseIntensity:  await utilsController.intensity.find(c => c.id == ussd_string_exploded[4]).name }
        utilsController.setExercise(sessionId, object)
        response += `CON Date of exercise (DD/MM/YYYY): \n`
        response += footer
    } else if (ussd_string_exploded[0] === "5" && ussd_string_exploded[1] == 6 && $level === 6) {
        const object = { date:  ussd_string_exploded[5].split("/").reverse().join("/") }
        await utilsController.setExercise(sessionId, object)
        // send the request
        const payload = await utilsController.getRedisData(sessionId)
        const { status } = await initiateRequest.sendHealthMetrics({ ...payload.exercise, ...{phone: phoneNumber.replace("+", "") }})
        if (status == "success") {
            // send a request to create the user account and response with feedback
            response += `CON Thank you! Please visit mymdoc.com to access the CompleteHealth platform and view your progress.\n`
        } else {
            response += `CON Sorry we could not add your health metric at the moment, kindly try again`
        }
        response += footer
    } else if (ussd_string_exploded[0] === "5" && $level === 3) {
        if (ussd_string_exploded[1] == 8) {
            const object = { height:  ussd_string_exploded[2] }
            await utilsController.setHealthMetrics(sessionId, object)
            // send the request
            const payload = await utilsController.getRedisData(sessionId)
            const { status } = await initiateRequest.sendHealthMetrics({ ...payload.metrics, ...{phone: phoneNumber.replace("+", "") }})
            if (status == "success") {
                // send a request to create the user account and response with feedback
                response += `CON Thank you! Please visit mymdoc.com to access the CompleteHealth platform and view your progress.\n`
            } else {
                response += `CON Sorry we could not add your health metric at the moment, kindly try again`
            }
            response += footer
        } else {
            const object = { date:  ussd_string_exploded[2].split("/").reverse().join("/") }
            // store the name of the user
            utilsController.setHealthMetrics(sessionId, object)
            const { title, measurement, sample } = await utilsController.healthMetrics.find(c => c.id == ussd_string_exploded[1])
            response += `CON What is your ${title} (${measurement}) (Sample: ${sample})?`
            response += footer
        }
    } else if (ussd_string_exploded[0] === "5" && $level === 4) {
        const object = { value:  ussd_string_exploded[3] }
        await utilsController.setHealthMetrics(sessionId, object)
        // send the request
        const payload = await utilsController.getRedisData(sessionId)
        const { status } = await initiateRequest.sendHealthMetrics({ ...payload.metrics, ...{phone: phoneNumber.replace("+", "") }})
        if (status == "success") {
            // send a request to create the user account and response with feedback
            response += `CON Thank you! Please visit mymdoc.com to access the CompleteHealth platform and view your progress.\n`
        } else {
            response += `CON Sorry we could not add your health metric at the moment, kindly try again`
        }
        response += footer
    } else if (ussd_string_exploded[0] === "6" && $level === 2) {
        // send the value to the API for contact health coach
        const { status, data } = await initiateRequest.contactHealthCoach(phoneNumber, ussd_string_exploded[1])
        if (status == "success") {
            response += `END Thank you! A health coach will contact you shortly.`
        } else {
            response += `END We could not connect to server, kindly try again.`
        }
    } else {
        response += `END Unable to process request, please try again in 5 minutes`
    }
    // clear the existing sessionId on Redis
    if (response.substring(0,3) === "END") {
        // clear the redis cache
    }
    res.status(200).send(response)
})

router.get("/test", async(req, res) => {
    //eventhough deprecated, still able to use
    request('https://www.reddit.com', function (error, response, body) {
        // console.error('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
        res.send({
            status: response && response.statusCode == 200 ? response.statusCode : 400,
            body: body ? body : error
        })
    });
})

module.exports = {
    router
} 