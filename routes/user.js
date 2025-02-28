const express = require("express");
const router = express.Router();
const{handleSignupUser ,handleLoginUser} = require("../controllers/user");
const user = require("../models/user");

router.post("/user/signup",handleSignupUser);

router.post("/user/login",handleLoginUser);

module.exports = router;