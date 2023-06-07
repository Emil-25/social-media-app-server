const JWT = require("jsonwebtoken")

exports.checkAuth = (req, res, next) => {

    const bearerToken = req.header("Authorization")

    if (bearerToken) {
        const token = bearerToken.split(" ")[1]

        JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status("401").json("Unauthorized")
            }
            req.user = decoded;
            return next()
        })
    }else {
        res.status("401").json("Unauthorized")
    }
}