const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EventSchema = new Schema({
    album:{
        type: String,
        required: true
    }, 
    album_id:{                   // will be unique for each album
        type: String, 
        required: true
    }, 
    del_hash:{                   // will be unique for each album (used for deleting the album)
        type: String,
        required:true
    }
})


module.exports = new mongoose.model('Event', EventSchema);