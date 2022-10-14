const jwt = require('jsonwebtoken')

const config = process.env;

const verifToken = (req, res, next) => {

    const email = req.body.email;

    const token = req.headers['x-access-token'];

    console.log("\n \t ACCESS TOKEN === ", token)

    if (!token) {
        return res.status(401).send("A token is required for authentication")
    }

    try {

        console.log("try === ", token);

        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user_id = decoded;

        console.log("\n END \n")

    } catch (error) {

        return res.status(401).send("AUTH: -Invalid Token ")

    }


    return next()


}

module.exports = verifToken