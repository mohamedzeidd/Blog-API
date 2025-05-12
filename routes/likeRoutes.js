const express = require("express");
const router = express.Router({ mergeParams: true });
const authController = require("../controllers/authController");
const likeController = require("../controllers/likeController");

router
  .route("/")
  .post(
    authController.protect,
    likeController.setBlogUserIds,
    likeController.checkBlogExists,
    likeController.createLike
  )
  .get(likeController.getAllLikes);
router
  .route("/:id")
  .delete(
    authController.protect,
    likeController.checkLikeOwnership,
    likeController.deleteLike
  );

module.exports = router;
