const mongoose = require("mongoose");
const Blog = require("../models/blogModel");

const likeSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Like must belong to a user"],
  },
  blog: {
    type: mongoose.Schema.ObjectId,
    ref: "Blog",
    required: [true, "Like must belong to a blog"],
  },
});

likeSchema.index({ user: 1, blog: 1 }, { unique: true });

likeSchema.pre(/^find/, function (next) {
  if (!this._noPopulate) {
    this.populate({ path: "user", select: "name photo" });
  }
  next();
});

likeSchema.query.noPopulate = function () {
  this._noPopulate = true;
  return this;
};

likeSchema.post("save", function () {
  this.constructor.calcNumOfLikes(this.blog);
});

likeSchema.pre(/^findOneAnd/, async function (next) {
  console.log("test");
  this.like = await this.model.findOne(this.getQuery());
  next();
});

likeSchema.post(/^findOneAnd/, async function () {
  console.log(this.like);
  if (this.like) {
    await this.like.constructor.calcNumOfLikes(this.like.blog);
  }
});

likeSchema.statics.calcNumOfLikes = async function (blogId) {
  const stats = await this.aggregate([
    {
      $match: { blog: blogId },
    },
    {
      $group: {
        _id: "$blog",
        numOfLikes: { $sum: 1 },
      },
    },
  ]);

  console.log(stats);

  if (stats.length > 0) {
    await Blog.findByIdAndUpdate(blogId, {
      numOfLikes: stats[0].numOfLikes,
    });
  } else {
    await Blog.findByIdAndUpdate(blogId, {
      numOfLikes: 0,
    });
  }
};

const likeModel = mongoose.model("Like", likeSchema);
module.exports = likeModel;
