const { dbScript, db_sql } = require("../../utils/db_script");
const { issueJWT } = require("../../utils/jwt");
const { welcomeEmail } = require("../../utils/sendMail");
const connection = require("../config/db");
const bcrypt = require("bcrypt");

module.exports.createUser = async (req, res) => {
    try {
        let {
            username,
            email,
            password,
            refferalID,
            transactionID
        } = req.body;

        let s1 = dbScript(db_sql["Q1"], { var1: email });
        let findUser = await connection.query(s1);
        if (findUser.rowCount === 0) {
            await connection.query("BEGIN")

            const generateOtp =
                Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;


            const encryptedPassword = await bcrypt.hash(password, 10);
            let s2 = dbScript(db_sql["Q2"], { var1: username, var2: email, var3: encryptedPassword, var4: refferalID, var5: transactionID, var6: generateOtp });
            let insertUser = await connection.query(s2);
            if (insertUser.rowCount > 0) {
                welcomeEmail(email, generateOtp, username)
                await connection.query("COMMIT")

                res.json({
                    status: 201,
                    success: true,
                    message: "User registered successfully",
                });
            } else {
                res.json({
                    status: 400,
                    success: false,
                    message: "Something went wrong",
                });
            }
        } else {
            res.json({
                status: 409,
                success: false,
                message: "Email already exists",
            });
        }
    } catch (error) {
        await connection.query("ROLLBACK")
        res.json({
            status: 500,
            success: false,
            message: `Error Occurred ${error.message}`,
        });
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body
        let s1 = dbScript(db_sql["Q1"], { var1: email });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            const result = await bcrypt.compare(password, findUser.rows[0].password);
            if (result) {
                let jwtToken = await issueJWT(findUser.rows[0]);
                res.send({
                    status: 200,
                    success: true,
                    message: "Login successfull",
                    data: {
                        token: jwtToken
                    }
                });
            } else {
                res.json({
                    status: 401,
                    success: false,
                    message: "Incorrect Password"
                })
            }
        } else {
            return res.json({
                status: 400,
                success: false,
                message: "Invalid Email or Password",
            });
        }
    } catch (error) {
        res.json({
            status: 500,
            success: false,
            message: `Error Occurred ${error.message}`,
        });
    }
}

module.exports.showProfile = async (req, res) => {
    try {
        let userId = req.user.id
        let s1 = dbScript(db_sql["Q3"], { var1: userId });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            res.json({
                success: true,
                status: 200,
                message: "User details",
                data: findUser.rows
            })
        } else {
            res.json({
                success: false,
                status: 400,
                message: "User not found"
            })
        }
    } catch (error) {
        res.json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

module.exports.verifyUser = async (req, res) => {
    try {
        const {
            email, otp
        } = req.body;

        let s1 = dbScript(db_sql["Q1"], { var1: email });
        let findUser = await connection.query(s1);
        if (findUser.rowCount > 0) {
            if (findUser.rows[0].otp === otp) {
                await connection.query("BEGIN")

                let _dt = new Date().toISOString();

                let s2 = dbScript(db_sql["Q4"], { var1: email });
                let verifyUser = await connection.query(s2);
                if (verifyUser.rowCount > 0) {
                    await connection.query("COMMIT")
                    res.json({
                        status: 200,
                        success: true,
                        message: "User verified successfully",
                    });
                } else {
                    res.json({
                        status: 400,
                        success: false,
                        message: "Something went wrong",
                    });
                }
            } else {
                return res.json({
                    status: 400,
                    success: false,
                    message: "Entered Incorrect OTP.",
                });
            }

        } else {
            return res.json({
                status: 400,
                success: false,
                message: "User not found with this email address.",
            });
        }
    } catch (error) {
        await connection.query("ROLLBACK")
        res.json({
            status: 500,
            success: false,
            message: "Error Occurred" + error.message,
        });
    }
}