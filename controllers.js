const express = require('express');
const router = express.Router();
const path = require('path');
const validation = require('./Validation');
const Operations = require('./db/dboperations');

const validation_options = {
    Login: "login",
    Register: "register"
}

// router.get('/', (req, res) => {
//     try {
//         console.log("Entered VideoConference ");
//         res.sendFile(path.resolve(__dirname, "react_client", "build", "index.html"));
//         //res.json({ status: true, message: "Welcome to Video conferenceing Hall" })
//     } catch (err) {
//         console.log(err);
//         res.json({ status: false, message: 'Internal error request cannot be completed' })
//     }
// })

router.post('/Login', async (req, res) => {
    try {
        let validation_result = await validation.validatedata(req.body, validation_options.Login);
        if (validation_result.status) {
            let result = await Operations.login(req.body);
            res.json(result);
        } else {
            res.json(validation_result);
        }
    } catch (err) {
        console.log(err);
        res.json({ status: false, message: 'Internal error request cannot be completed' })
    }
})

router.post('/Register', async (req, res) => {
    try {
        console.log("Body = ", req.body);
        let validation_result = await validation.validatedata(req.body, validation_options.Register);
        console.log("Validation result  :", validation_result);
        if (validation_result.status) {
            let result = await Operations.Register(req.body);
            res.json(result);
        } else {
            res.json(validation_result);
        }
    } catch (err) {
        console.log(err);
        res.json({ status: false, message: 'Internal error request cannot be completed' })
    }
})

router.post('/Login', async (req, res) => {
    try {
        console.log("Body = ", req.body);
        let validation_result = await validation.validatedata(req.body, validation_options.Login);
        console.log("Validation result  :", validation_result);
        if (validation_result.status) {
            let result = await Operations.login(req.body);
            res.json(result);
        } else {
            res.json(validation_result);
        }
    } catch (err) {
        console.log(err);
        res.json({ status: false, message: 'Internal error request cannot be completed' })
    }
})

router.get('/Register', async (req, res) => {
    try {
        let validation_result = await validation.validatedata(req.query, validation_options.Register);
        if (validation_result.status) {
            let result = await Operations.Register(req.body);
            res.json(result);
        } else {
            res.json(validation_result);
        }
    } catch (err) {
        console.log(err);
        res.json({ status: false, message: 'Internal error request cannot be completed' })
    }
})

router.post('/Get_Users', async (req, res) => {
    try {
        let fetch_result = { status: false, message: "Please pass valid filter" };
        if (req.body.filter) {
            switch (req.body.filter) {
                case "userid": fetch_result = await Operations.fetchdata(req.body, Operations.Mysql_Tables.users, 'userid');
                    break;
                case "mobileno": fetch_result = await Operations.fetchdata(req.body, Operations.Mysql_Tables.users, 'mobileno');
                    break;
                default: fetch_result = await Operations.fetchdata({}, Operations.Mysql_Tables.users, '');
            }
        } else {
            fetch_result = await Operations.fetchdata({}, Operations.Mysql_Tables.users, '');
        }
        res.json(fetch_result);
    } catch (err) {
        console.log(err);
        res.json({ status: false, message: 'Internal error request cannot be completed' })
    }
})


router.post('/JoinRoom', async (req, res) => {
    try {
        res.json({ status: true, message: "Welcome to Video conferenceing Hall" })
    } catch (err) {
        console.log(err);
        res.json({ status: false, message: 'Internal error request cannot be completed' })
    }
})

router.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
        console.log(ValidationError);
        // At this point you can execute your error handling code
        res.json({ status: false, message: "Invalid Request", err: ValidationError });
        //res.status(400).send('invalid');
        next();
    }
    else next(err); // pass error on if not a validation error
});


module.exports = router;

