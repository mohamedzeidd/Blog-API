const express = require("express");
const router = express.Router({ mergeParams: true });
const authController = require("../controllers/authController");
const commentController = require("../controllers/commentController");

router.use(authController.protect);

router
  .route("/")
  .get(commentController.getAllComments)
  .post(
    commentController.setBlogUserIds,
    commentController.checkBlogExists,
    commentController.createComment
  );

router
  .route("/:id")
  .delete(
    commentController.checkCommentOwnership,
    commentController.deleteComment
  )
  .patch(
    commentController.checkCommentOwnership,
    commentController.updateComment
  );

module.exports = router;
