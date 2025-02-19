const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const blogController = require("../controllers/blogController");
const commentRoutes = require("../routes/commentRoutes")
const likeRoutes = require("../routes/likeRoutes")



router.use("/:blogId/comments" , commentRoutes)
router.use("/:blogId/likes" , likeRoutes)
router
  .route("/")
  .post(
    authController.protect,
    blogController.setAuthorId,
    blogController.createBlog
  )
  .get(blogController.getAllBlogs)

router.get("/:id", blogController.getBlog);

router.use(authController.protect);
router
  .route("/:id")
  .delete(blogController.checkBlogOwnership, blogController.deleteBlog)
  .patch(blogController.checkBlogOwnership, blogController.updateBlog);
module.exports = router;
