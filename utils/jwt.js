const jsonwebtoken = require("jsonwebtoken");

const jwt = {
    //create token
    issueJWT: async (user, position) => {
        let payload = {
            id: user.id,
            email: user.email_address,
            position: position
        };
        const expiresIn = 60 * 60 * 24;
        const jwtToken = jsonwebtoken.sign(payload, 'KEy', { expiresIn })
        return jwtToken;
    },

    verifyUser: async (req, res, next) => {
        var token = req.headers.authorization
        jsonwebtoken.verify(token, 'KEy', function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Session timed out. Please sign in again",
                });
            } else {
                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                }
                return next();
            }
        });
    }

};
module.exports = jwt;