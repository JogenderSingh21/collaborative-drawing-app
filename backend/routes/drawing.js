const express = require("express");
const { Drawing } = require("../db");
const { authMiddleware } = require("../middleware");

const drawingRouter = express.Router();

drawingRouter.post("/create", authMiddleware, async (req, res) => {
    const { title } = req.body;

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm; 
    const formattedToday = mm + '/' + dd + '/' + yyyy;

    const drawing = await Drawing.create({
        userId: req.userId,
        elementsArray: [],
        title: title,
        created: formattedToday,
        image: ""
    })
    res.json({
        message: "Created Successfully",
        drawId: drawing._id,
    })
});

drawingRouter.put("/updateInfo", authMiddleware, async (req, res) => {
    const { imgId, elementsArray, image } = req.body;

    await Drawing.updateOne({
        _id: imgId
    }, {
        elementsArray: elementsArray,
        image: image,
    })

    res.json({
        message: "Updated successfully" 
    })
})

drawingRouter.get("/user-drawings", authMiddleware, async (req, res) => {
    const drawings = await Drawing.find({
        userId: req.userId
    });

    res.json({
        drawings: drawings
    });
})

drawingRouter.get("/:DrawId", authMiddleware, async (req, res) => {
    const drawId = req.params['DrawId'];
    const drawing = await Drawing.findOne({
        _id: drawId
    });

    res.json({
        message: "sending",
        drawing: drawing
    });
})



module.exports = {
    drawingRouter
};