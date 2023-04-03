const express = require("express");
const router = express.Router();
const upload = require('../models/multerModel');

const eventController = require("../controllers/eventController");


router.get('/', (req, res)=>{
    res.json({
        status: "success",
        message: "Authentication successful!"
    })
})

// POST /admin/eventName/year
router.post("/:event/:year", eventController.post_yearly_event_album);

// POST /admin/eventName/year/images
router.post("/:event/:year/images", upload.array("imagesMedia", 30), eventController.post_yearly_event_images);

// DELETE /admin/eventName/year/delete
router.delete("/:event/:year/delete", eventController.del_yearly_event_album);

// DELETE /admin/image/:deletehash
router.delete("/image/:deletehash", eventController.del_image);



module.exports = router;


