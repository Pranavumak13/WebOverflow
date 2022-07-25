const Event = require("../models/eventModel"); // Event is a mongoose model
const axios = require("axios");


// fetch the media files from API for given event and year
//GET /gallery/event/year
exports.get_yearly_event_media = function (req, res, next) {
  let event_parameter = req.params.event.toLowerCase(); // to match the casing in db
  let year = req.params.year.toString();
  event_parameter = event_parameter+year;

  Event.findOne({ album : event_parameter}, (err, eventData) => {
    if (err) console.log("Error: couldnot found specified event in db");
    else {
      const album_id = eventData.album_id;  // album_id will be unique for each yearly album

      //request to the imgur API to fetch data from eventyear album using album_id
      axios({
        method: "get",
        url: `https://api.imgur.com/3/album/${album_id}`,
        headers: {
          Authorization: process.env.IMGUR_AUTHORIZATION,
        },
      }).then((response) => {
        // in response, we get array of image as objects
        const media = response.data.data.images;
        var urlList = [];
        for(var i=0; i<media.length; i++){
          const obj = media[i];
          for(var prop in obj){
            if(prop==='link') urlList.push(obj[prop]);
          }
        }
        res.send(urlList);        // sent array 
      });
    }
  });
};



// creating new album for given event and year
// POST  /gallery/event/year
exports.post_yearly_event_media = function (req, res, next) {
  const albumEvent = req.params.event.toLowerCase();
  const year = req.params.year.toString();

  const title = albumEvent + year;               //eg: pragyaa2020

  axios({
    method: "post",
    url: `https://api.imgur.com/3/album?title=${title}&privacy=hidden`,
    headers: {
      Authorization: process.env.IMGUR_AUTHORIZATION,
    },
  }).then(async (response) => {
    const newAlbum_id = response.data.data.id;          //retrieving the album_id to store it in database
    const del_hash = response.data.data.deletehash;     // in case if need to delete this album

    // adding this new album's details to the database
    const new_album = new Event({
      album: title,
      album_id: newAlbum_id,
      del_hash: del_hash
    })
    
    new_album.save(function(err, newAlbum){
      if(err){
        res.json({
          message: "error in creating new album. please try again later...",
        })
      }
      else{
        res.json({
          message: "successful",
          album_id: newAlbum_id, 
          del_hash: del_hash
        })
      }
    })

  });
};



