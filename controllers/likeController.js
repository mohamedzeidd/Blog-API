const Like = require("../models/likeModel");
const factory = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.setBlogUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.blog) req.body.blog = req.params.blogId;
  next();
};

exports.checkLikeOwnership = catchAsync(async (req, res, next) => {
  const like = await Like.findById(req.params.id).noPopulate();

  if (!like) return next(new AppError("Like not found for that ID", 404));
  if (req.user.role == "admin" || req.user.id == like["user"]) return next();

  return next(
    new AppError("You don't have permission to (delete/update) this like", 403)
  );
});

exports.createLike = factory.createOne(Like);
exports.deleteLike = factory.deleteOne(Like);
exports.getAllLikes = factory.getAll(Like)