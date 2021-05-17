// Import our libraries
const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const {check, validationResult} = require("express-validator")
const Recaptcha = require("express-recaptcha").RecaptchaV2
require('dotenv').config()
const Mailgun = require("mailgun-js")

const mailgun = Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN})

const validation = [
    check("name", "A valid name is required").not().isEmpty().trim().escape(),
    check("email", "Please provide a valid email").isEmail(),
    check("subject").optional().trim().escape(),
    check("message", "Please provide a message that is under two thousand characters")
        .trim()
        .escape().isLength({min:1, max:2000})

]

//initialize Express
const app = express()
const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY)

// app.use allows for different middleware to be brought into Express
// Morgan: a logger for express so that we have a record for debugging.
app.use(morgan("dev"))
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


const indexRoute = express.Router()


const handleGetRequest = (request, response, next) => {
    return(response.json("server is live"))
}
const handlePostRequest = (request, response, next) => {

    response.append("Content-Type", "text/html")

    //TODO remove header when Docker has been successfully added.
    response.append("Access-Control-Allow-Origin", "*")

    if (request.recaptcha.error) {
        return response.send(Buffer.from(`<div class='alert alert-danger' role='alert'><strong>Oh snap!</strong>There was an error with Recaptcha please try again</div>`))
    }

    const errors = validationResult(request)

    if(errors.isEmpty() === false) {
        const currentError = errors.array()[0]
        return response.send(Buffer.from(`<div class="alert alert-danger" role="alert"><strong>Oh snap!</strong> ${currentError.msg}</div>`))
    }

    const {email, subject, name, message} = request.body;

    const mailgunData = {
        to:process.env.MAIL_RECIPIENT,
        from:`${name} <postmaster@${process.env.MAILGUN_DOMAIN}>`,
        subject: `${email}: ${subject}`,
        text: `${message}`
    }
    mailgun.messages().send(mailgunData, (error) => {
        if (error) {
            return (response.send(Buffer.from(`<div class='alert alert-danger' role='alert'><strong>Oh
                snap!</strong> Unable to send email error with email sender</div>`)))
        }
    })
}

indexRoute.route("/")
    .get(handleGetRequest)
    .post(recaptcha.middleware.verify ,validation, handlePostRequest)


app.use("/apis", indexRoute)

app.listen(4200, ()=> {console.log("express successfully built")})


