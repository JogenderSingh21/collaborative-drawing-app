const express = require('express');
const { userRouter } = require('./user');
const { drawingRouter } = require('./drawing');
const { authMiddleware } = require("../middleware");
const { User } = require("../db");

const router = express.Router();

router.use("/user", userRouter);
router.use("/drawing", drawingRouter);
router.get("/me", authMiddleware, async (req, res) => {
    const user = await User.findOne({
        _id: req.userId
    });

    res.json({
        fullName: user.fullName,
        username: user.username,
    })
})

module.exports = router;