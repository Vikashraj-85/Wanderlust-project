const User = require('../models/user.js');
module.exports.signupPage=(req, res) => {
    res.render('./user/signup.ejs');
};
module.exports.PostsignUP=async (req, res) => {
    try{
    let { username, email, password } = req.body;
    console.log(username, email, password);
    let newUser = new User({
        username: username,
        email: email,
    });
    const registerUser = await User.register(newUser, password)
    console.log(registerUser);
    // ---------- for , when you sign up then automatically login 
    req.login(registerUser,(err)=>{
        if(err){
          return  next(err);
        }
        req.flash('success', 'Welcome to Wanderlust');
        res.redirect('/listings');
    });
    // -------------endin hee..---------->
}catch(e){
    req.flash('success',e.message);
    res.redirect('/user/signup');
}
};
module.exports.loginPage=(req,res)=>{
    res.render('./user/login.ejs');
};
module.exports.Postlogin=async(req,res)=>{
     req.flash('success','welcome to Wanderlus. You logged in.');
    // this is taken from saveRedirect Url ---> res.locals.redirectUrl, (POST-LOGIN PAGE)   
     res.redirect('/listings');
};
module.exports.logout=(req,res,nex)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash('success','You have been logged out');
        res.redirect('/listings');
    })
};