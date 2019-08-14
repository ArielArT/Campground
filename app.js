var express = require('express');
var flash = require("connect-flash");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var	methodOverride = require('method-override');


var router = express.Router({mergeParams: true});
//requier routes
var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes      = require("./routes/index");

//------------------------Mongoose Connect------------------------------------
mongoose.connect('mongodb+srv://Ariel:@T5nje8fqs@clusterariel-zb1ma.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB udalo sie !');
}).catch(err => {
	console.log('error: ', err.message);
}) ;

//------------------------------------------------------------------------------------
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride('_method'));
app.use(flash());
//-------------Password configuration---------------------------------------------------
app.use(require("express-session")({
	secret: "Ariel jest super webdeveloperem",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
//use routes----------------------------------------------------------------------------
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//----------------------------Server on -------------------------------------------------
//HEROKU version
app.listen(process.env.PORT, process.env.IP);

// //GOORM version
// app.listen(3000, () => {
// 	console.log('server listenign on port 3000');
// });