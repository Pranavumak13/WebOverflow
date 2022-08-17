const Event = require("../models/eventModel"); // Event is a mongoose model
const axios = require("axios");
const multer = require('multer');         // for uploading images to the API
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');        // for handling the image files



// fetch the media files from API for given event and year
//GET /gallery/event/year
exports.get_yearly_event_media = function (req, res, next) {
  let event_parameter = req.params.event.toLowerCase(); // to match the casing in db
  let year = req.params.year.toString();
  event_parameter = event_parameter+year;

  Event.findOne({ album : event_parameter}, (err, eventData) => {
    if (err) console.log("Error: couldnot find specified album in db");
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
exports.post_yearly_event_album = function (req, res, next) {
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



// uploading images(multiple) to the album which is already created 
// POST /gallery/event/year/images
exports.post_yearly_event_images = function(req, res, next){

  // for this, i need album_id from the database for the given event and year
  let event_parameter = req.params.event.toLowerCase(); 
  let year = req.params.year.toString();
  const image_files = req.files;        // array of images files 

  event_parameter = event_parameter+year;

  Event.findOne({ album : event_parameter}, async (err, eventData) => {
    //if (err) console.log("Error: couldn't find specified album in db");
    if(err || eventData == null){
      res.json({
        status: "failed",
        total_uploaded_images: 0,
        error: `unable to find the album ${event_parameter}`
      })
    }
    else {
      // we found the album
      const album_id = eventData.album_id;

      // now posting the images from the device to the album using the album_id
      // all the images to be uploaded to the API album are stored in image_files variable
      let uploaded_images = 0;   

      for(let i =0; i<image_files.length; i++){          // uploading images one by one
        var img = fs.readFileSync(req.files[i].path);
        var encoded_img = img.toString('base64');
        var image = Buffer.from(encoded_img, 'base64')
    
        const formData = new FormData();
        formData.append('image', image)               
        formData.append('album', album_id);            // uploading image to this album_id
    
        await axios({
          method:'post',
          url: "https://api.imgur.com/3/image",
          headers:{
            Authorization: process.env.IMGUR_AUTHORIZATION
          },
          data: formData
        }).then(function (response){  
          console.log(`${i+1} image is uploaded..`);       
          uploaded_images=uploaded_images+1;
        }).catch(function(error){
          console.log(error.response.status)
        })
      }

      // delete the images from server/public/images folder
      const uploads_dir = '../server/public/uploads';
      fs.rmSync(uploads_dir, { recursive: true, force: true });
      console.log(`Total uploaded images to the album ${event_parameter} : `, uploaded_images);    
      
      res.json({
        status: "success",
        total_uploaded_images: uploaded_images,
        uploaded_to: event_parameter
      })
    }



  })

}






