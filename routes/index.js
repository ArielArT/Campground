var express = require("express");
var router = express.Router();

var passport = require("passport");
var User = require("../models/user");

//---------------------Show home page---------------------------------------------------
router.get('/', function(req, res){
	res.render('campgrounds/landing.ejs');
});



//-----------------------------Register-----------------------
router.get('/register', function (req, res){
	res.render("register");
});

router.post('/register', function (req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err,user){
		if(err){
			req.flash("error", err.message);
			res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome "+req.body.username );
			res.redirect("/campgrounds");
		});
	});
});

//----------------login--------------------
router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}) , function(req, res){
	req.flash("success", "Welcome "+req.body.username );
});
//----------------logout--------------------
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});


module.exports = router;