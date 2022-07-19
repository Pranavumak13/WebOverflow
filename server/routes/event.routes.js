const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController')



// GET /gallery/eventName/year
router.get('/:event/:year', eventController.get_yearly_event_media)

// POST /gallery/eventName/year
router.post('/:event/:year', eventController.post_yearly_event_media);



module.exports = router;
