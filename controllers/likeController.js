const Like = require("../models/likeModel");
const Blog = require("../models/blogModel");
const factory = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.setBlogUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.blog) req.body.blog = req.params.blogId;
  next();
};

exports.checkBlogExists = catchAsync(async (req, res, next) => {
  const blogId = req.body.blog;
  if (!blogId) return next(new AppError("Blog ID is required.", 400));

  const blog = await Blog.findById(blogId);
  if (!blog) return next(new AppError("Blog not found for that id.", 404));
  next();
});

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
exports.getAllLikes = factory.getAll(Like);
