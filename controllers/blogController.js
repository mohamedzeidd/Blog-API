const multer = require("multer");
const sharp = require("sharp");
const Blog = require("./../models/blogModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");

exports.checkBlogOwnership = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).noPopulate();
  if (!blog) return next(new AppError("Blog Not Found for that ID", 404));

  console.log(blog);
  if (req.user.role == "admin" || req.user.id == blog["author"]) return next();

  return next(
    new AppError("You don't have permission to (delete/update) this blog", 403)
  );
});

exports.setAuthorId = (req, res, next) => {
  req.body.author = req.user.id;
  next();
};

exports.getBlog = factory.getOne(Blog, { path: "comments" });
exports.createBlog = factory.createOne(Blog);
exports.updateBlog = factory.updateOne(Blog);
exports.deleteBlog = factory.deleteOne(Blog);
exports.getAllBlogs = factory.getAll(Blog);
