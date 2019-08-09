var express = require("express");
var router = express.Router();
var	methodOverride = require('method-override');
var middelware = require("../middleware");
var Campground = require("../models/campground");

router.use(methodOverride('_method'));
//------------------Show all campgrounds------------------------------------------------
router.get('/', function(req, res){
	// Get all caampgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render('campgrounds/campgrounds', {campgrounds: allCampgrounds, currentUser: req.user});
		}
	});
});

//------------------Create new campground-----------------------------------------
router.post('/',middelware.isLoggedIn, function(req, res){
	
	var name = req.body.name;
	var url = req.body.url;
	var price = req.body.price;
	var description = req.body.description;
	var author = {  id: req.user._id,
					username: req.user.username};

	var newCampground = {name: name, price: price, url: url, description: description, author: author};
	//Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
	
	
});

//------------------Show page to create new campground-----------------------------------
router.get('/new',middelware.isLoggedIn, function (req, res){
	res.render("campgrounds/new.ejs");
});


//----------------------------Show one campground------------------------------------
router.get('/:id', function(req, res){
	//find te campground
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log("ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			console.log(err);
		}else{
			// console.log("---------------------------------------------");
			// console.log(foundCampground);
			res.render("campgrounds/show", {campground:foundCampground});
		}
	});
});

//--------------------EDIT Campground--------
router.get('/:id/edit',middelware.checkUserOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("/campgrounds");
			console.log(err);
		}else{
			res.render("campgrounds/edit", {campground:foundCampground});
		}
	});
});
//--------------------UPDATE Campground------------
router.put("/:id",middelware.checkUserOwnership, function(req, res) {
	Campground.findOneAndUpdate({ _id: req.params.id}, req.body.campground, function (err, updateCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//---------------------------Remove Route-----------------------
router.delete("/:id",middelware.checkUserOwnership, function(req, res){
		Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;