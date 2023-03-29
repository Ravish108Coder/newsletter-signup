const express = require('express');
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})



app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailName = req.body.emailName;
    // console.log("firstName: " + firstName + ", lastName: " + lastName + ", emailName: " + emailName);
    // res.sendFile(__dirname + "/success.html");
    var data = {
        members: [
            {
                email_address: emailName,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    const url = 'https://us10.api.mailchimp.com/3.0/lists/0294615641';

    const options = {
        method: "POST",
        auth: "Rowdy:d1d5987fb009fa6dd6ab8fcb735ab06f-us10"
        // auth: "Rowdy:69d1d5987fb009fa6dd6ab8fcb735ab06f-us10" //for failure checking
    }

    const request = https.request(url, options, function (response) {
        if(response.statusCode === 200){
            // res.send("OK, we got your details!");
            res.sendFile(__dirname + "/success.html");
        }else{
            // res.send("SORRY, we don't get your request try again later!");
            res.sendFile(__dirname + "/failure.html");
            console.log(response.statusCode);
        }
        response.on("data", function(data){
            // console.log(JSON.parse(data)); // to console
        })
    })

    request.write(jsonData);// to mailchimp
    request.end();
})


// app.post("/failure", (req, res) => {
app.post("/failure", function(req, res) {
    // res.sendFile(__dirname + "/signup.html");
    res.redirect("/");
})

// API Key
// d1d5987fb009fa6dd6ab8fcb735ab06f-us10

// List Id
// 0294615641



app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on Port 3000.");
})
