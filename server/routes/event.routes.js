const express = require("express");
const router = express.Router();
const upload = require('../models/multerModel');


const eventController = require("../controllers/eventController");


// GET /gallery/eventName/year
router.get("/:event/:year", eventController.get_yearly_event_media);

// POST /gallery/eventName/year
router.post("/:event/:year", eventController.post_yearly_event_album);

// POST /gallery/eventName/year/images
router.post("/:event/:year/images", upload.array("imagesMedia", 30), eventController.post_yearly_event_images);




module.exports = router;
