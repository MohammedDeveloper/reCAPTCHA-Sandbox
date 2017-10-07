/// declare the const
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

/// set the app
const app = new express();

/// set the body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/// Set the default
app.get("/", (req, res) => {

    /// send the file
    res.sendFile(__dirname + "/index.html");
});

/// Set the susbscibe
app.post("/subscribe", (req, res) => {

    /// get the data from body
    let name = req.body.name;
    let email = req.body.email;
    let captcha = req.body.captcha;

    /// check for null
    if (!captcha || captcha === undefined || captcha === "" || captcha === null) {
        return res.json({ success: false, message: "Captcha is required" });
    }

    /// set the secret key and the request address
    const secretKey = "6LcthjMUAAAAABi8XqndyBkbQT-MJojGVEZJO_RC";
    const verifyGoogleUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;

    /// use the request...
    request(verifyGoogleUrl, (err, resp, body) => {

        /// Log them
        console.log(err)
        console.log(resp)
        console.log(body)

        /// parse the body
        body = JSON.parse(body);

        /// Check the body - If not success
        if(body.success === undefined || !body.success){
            return res.json({ success: false, message: "Captcha validation failed" });
        }

        /// If success
        return res.json({ success: true, message: "Captcha validation success" });
    });
});

/// set the port
app.listen(3005, () => {

    /// Log server start message
    console.log("Server started at 3005...");
    console.log("http://localhost:3005/");
});