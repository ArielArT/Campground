var Comment = require("../models/comment.js");
var Campground = require("../models/campground.js");

// all the middelware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'Please Login First!');
	res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){
			//find te campground
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			req.flash('error', 'Campground does not Exist !');
			res.redirect("back");
			console.log(err);
		}else{
			if(foundComment.author.id.equals(req.user._id)){
			next();
			}else{
				req.flash('error', 'You did not create the comment!');
				res.redirect("back");
			}
		}
		});
	}else{
		res.redirect("back");
	}
}

middlewareObj.checkUserOwnership = function checkUserOwnership(req, res, next){
	if(req.isAuthenticated()){
			//find te campground
		Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash('error', 'Campground does not Exist !');
			res.redirect("back");
			console.log(err);
		}else{
			if(foundCampground.author.id.equals(req.user._id)){
			next();
			}else{
				req.flash('error', 'You did not create the Campground!');
				res.redirect("back");
			}
		}
		});
	}else{
		res.redirect("back");
	}
}

module.exports = middlewareObj;