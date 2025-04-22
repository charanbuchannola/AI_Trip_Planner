const express = require("express");
const {
  register,
  login,
  logout,
  checkAuth,
} = require("../controllers/authController");
const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check-auth", authMiddleware, checkAuth);

module.exports = router;
