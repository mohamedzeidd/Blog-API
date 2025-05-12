const Comment = require("../models/commentModel");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const factory = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.setBlogUserIds = (req, res, next) => {
  req.body.user = req.user.id;
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

exports.checkCommentOwnership = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id).noPopulate();

  if (!comment) return next(new AppError("Comment not found for that ID", 404));
  if (req.user.role == "admin" || req.user.id == comment["user"]) return next();

  return next(
    new AppError(
      "You don't have permission to (delete/update) this comment",
      403
    )
  );
});

exports.getAllComments = factory.getAll(Comment);
exports.createComment = factory.createOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
exports.updateComment = factory.updateOne(Comment);
