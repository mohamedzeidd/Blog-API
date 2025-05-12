const mongoose = require("mongoose");
const Blog = require("../models/blogModel");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "Comment cannot be empty"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  blog: {
    type: mongoose.Schema.ObjectId,
    ref: "Blog",
    required: [true, "Comment must belong to a blog"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Comment must belog to a user"],
  },
});

commentSchema.pre(/^find/, function (next) {
  if (!this._noPopulate) {
    this.populate({ path: "user", select: "name photo" });
  }
  next();
});

commentSchema.statics.calcNumOfComments = async function (blogId) {
  const stats = await this.aggregate([
    {
      $match: { blog: blogId },
    },
    {
      $group: {
        _id: "$blog",
        numOfComments: { $sum: 1 },
      },
    },
  ]);

  // console.log(stats);

  if (stats.length > 0) {
    await Blog.findByIdAndUpdate(blogId, {
      numOfComments: stats[0].numOfComments,
    });
  } else {
    await Blog.findByIdAndUpdate(blogId, {
      numOfComments: 0,
    });
  }
};

commentSchema.post("save", function () {
  this.constructor.calcNumOfComments(this.blog);
});

// findByIdAndUpdate
// findByIdAndDelete
commentSchema.pre(/^findOneAnd/, async function (next) {
  this.comment = await this.model.findOne(this.getQuery());
  next();
});

commentSchema.post(/^findOneAnd/, async function () {
  if (this.comment) {
    await this.comment.constructor.calcNumOfComments(this.comment.blog);
  }
});

commentSchema.query.noPopulate = function () {
  this._noPopulate = true;
  return this;
};

const commentModel = mongoose.model("Comment", commentSchema);
module.exports = commentModel;
