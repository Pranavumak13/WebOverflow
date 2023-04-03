const express = require("express");
const router = express.Router();
const upload = require('../models/multerModel');

const eventController = require("../controllers/eventController");


// GET /gallery/eventName/year
router.get("/:event/:year", eventController.get_yearly_event_media);



module.exports = router;


