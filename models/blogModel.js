const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "Blog must have a title."],
      minlengh: [10, "Minimum length for a blog is 10 characters."],
      minlengh: [40, "Max length for a blog is 40 characters."],
      trim: true,
    },

    slug: String,
    summary: {
      type: String,
      trim: true,
      required: [true, "Blog must have a summary."],
    },
    content: {
      type: String,
      trim: true,
      required: [true, "Blog must have content."],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    numOfComments: {
      type: Number,
      default: 0,
    },
    numOfLikes: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Blog must have an author."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.query.noPopulate = function () {
  this._noPopulate = true;
  return this;
};

blogSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

blogSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "blog",
  localField: "_id",
});

blogSchema.pre(/^find/, function (next) {
  if (!this._noPopulate) {
    this.populate({
      path: "author",
      select: "-__v -passwordChangedAt",
    });
  }
  next();
});

blogSchema.post(/^find/, function (docs, next) {
  // console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const blogModel = mongoose.model("Blog", blogSchema);
module.exports = blogModel;
