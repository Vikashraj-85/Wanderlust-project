const Listing = require('./models/listing.js');
const Review=require('./models/review.js');
const { listingSchema, reviewSchema } = require('./Schema.js');


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        // this is optional ---> to make flow of users easy we save our url is locals,(POST-LOGIN PAGE)
        req.session.redirectUrl=req.originalUrl;        
        // this is End of above line ABOBE LINE (POST-LOGIN PAGE) --->
        req.flash('error','You need to log in first.');
        return  res.redirect('/user/login');
    }
    next();
};


// when user land on our website without sign in ,and if he want to go some operation like adding new,edit, etc. then these path will save and and ask for login then after login , we will   redirect rhe user when he whta was he selected for like if he go to the editting page then  we redirect him to the page,
// we exporting this middleware to amke flow easy for user--> (POST-LOGIN PAGE)
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        next();
    }
};

module.exports.isOwner=async(req,res,next)=>{
    // request form hopscotch from (backend)---->
    let { id } = req.params;
    let findlisting=await Listing.findById(id);
    if(!findlisting.owner._id.equals(res.locals.currUser._id)){
        req.flash('error','You are not the Owner');
        return res.redirect(`/listings/${id}`);
    }
    next();
};


// deleting review by owner(author) only ,to do this we make middleware or we can also directly use(write) this in our deleting route,
module.exports.isAuthor=async(req,res,next)=>{
    // request form hopscotch from (backend)---->
    let { id, reviewId } = req.params;
   
         let findreview=  await Review.findById(reviewId);
        // checking if review or deleter are same or not
        if(!findreview.author._id.equals(res.locals.currUser._id)){
            req.flash('error','This review is not posted by you.');
          return  res.redirect(`/listings/${id}`);
        }
        next();
};


 // -------------> middile ware of joi to check validations
module.exports.listingValidate = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        throw new expressError(400, error)
    } else {
        next();
    }
};
// -------------> middile ware of joi to check validations

// --for reviewing valdation
module.exports.reviewValidate = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        throw new expressError(400, error)
    } else {
        next();
    }
};