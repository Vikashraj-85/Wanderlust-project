const express = require('express')
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapFunction.js'); //---> we will use use this function as middle ware to handle our Errors.
const passport = require('passport');
const { isLoggedIn } = require('../middleware.js');
// ------controller---
const userController = require('../controller/users.js');

// -for signup
router.
route('/signup')
.get(userController.signupPage ) // for signup page
.post( wrapAsync(userController.PostsignUP)); // for sign up

// ----for login
router.route('/login')
.get(userController.loginPage) // for login page
.post( 
     //===> saving path to make user experience eassier ------> optional (POST-LOGIN PAGE)
    passport.authenticate('local',{failureFlash:true,failureRedirect:'/user/login'}),
    (userController.Postlogin)); 

// ------for log out
router.get('/logout',isLoggedIn,userController.logout)
module.exports = router;