const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth");

router.get("/profile", authenticateToken, (req, res) => {
    res.json({
        message: "This is your protected profile route!",
        user: req.user
    });
});

module.exports = router;
