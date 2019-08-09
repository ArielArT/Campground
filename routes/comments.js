var express = require("express");
var router = express.Router({mergeParams: true});
var middelware = require("../middleware");
var Campground = require("../models/campground");
var Comment    = require("../models/comment");


//comments Routes  new template
	router.get("/new",middelware.isLoggedIn, function(req, res){
		Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground:foundCampground});
		}
		});
		
	});


//Create a new comment and save to DB
router.post('/',middelware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			Comment.create(req.body.comment, function(err, comment){
            	if(err){
					req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
					// console.log(campground);
					comment.author.username = req.user.username;
					comment.author.id = req.user._id;
					comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    // console.log("Created new comment");
					req.flash("success", "You had create a comment :D");
					res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
			
		}
	});
});

//--------------------EDIT Comment--------
router.get('/:comment_id/edit',middelware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});
	
//--------------------UPDATE Campground------------
router.put("/:comment_id",middelware.checkCommentOwnership , function(req, res) {
	Comment.findOneAndUpdate({ _id: req.params.comment_id}, req.body.comment, function (err, updateComment){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "You had edit a comment :D");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//---------------------------Remove Route-----------------------
router.delete("/:comment_id",middelware.checkCommentOwnership, function(req, res){
		Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			req.flash("success", "You had remove your comment :D");
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});



module.exports = router;