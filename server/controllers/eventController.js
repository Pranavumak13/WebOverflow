const Event = require("../models/eventModel"); // Event is a mongoose model
const axios = require("axios");
const multer = require('multer');         // for uploading images to the API
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');        // for handling the image files
const { eventNames } = require("process");



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
          urlList.push([media[i].link, media[i].deletehash])
        }
        res.send(urlList);        
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
    // adding this new album's details to the database
    const new_album = new Event({
      album: title,
      album_id: response.data.data.id,
      del_hash: response.data.data.deletehash
    })
    
    await new_album.save(function(err, newAlbum){
      if(err){
        res.json({
          message: "error in creating new album. please try again later...",
        })
      }
      else{
        res.json({
          message: "successful",
          album_id: new_album.album_id, 
          del_hash: new_album.del_hash
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
    if(err || eventData == null){
      res.json({
        status: "failed",
        total_uploaded_images: 0,
        error: `unable to find the album ${event_parameter}`
      })
    }
    else {
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


// delete a single image 
// DELETE /gallery/image/:deletehash
exports.del_image = function(req, res, next){
  let del_hash = req.params.deletehash

  axios({
    method:'delete',
    url: `https://api.imgur.com/3/image/${del_hash}`,
    headers:{
      Authorization: process.env.IMGUR_AUTHORIZATION
    }
  })
  .then((response)=>{
    console.log(response.data)
    res.json({
      status: "success", 
      message: response.data
    })
  })
  .catch((err)=>{
    console.log(err)
    res.json({
      status: 'failed',
      message: err
    })
  })
}


// deleting all the images from the album
async function delete_all_media(album_id){
  let deleted_media = 0
  let images = 0

  await axios({
    method: 'get',
    url:`https://api.imgur.com/3/album/${album_id}/images`,
    headers:{
      Authorization: process.env.IMGUR_AUTHORIZATION
    }
  })
  .then(async (response)=>{
    images = response.data.data.length

    for(let i=0; i<response.data.data.length; i++){
      let deletehash = response.data.data[i].deletehash
      
      await axios({
        method: 'delete',
        url: `https://api.imgur.com/3/image/${deletehash}`,
        headers:{
          Authorization: process.env.IMGUR_AUTHORIZATION
        }
      })
      .then((response)=>{
        deleted_media+=1
      })
      .catch((err)=>{
        console.log(err)
      })
    }

    if(deleted_media==response.data.data.length) return true
    else return false;
  })
  .catch((err)=>{
    console.log(err);
  })

  if(deleted_media==images) return true
  else return false;

}





// deleting album
// DELETE /gallery/event/year/delete
exports.del_yearly_event_album = function (req, res, next){

  // get the album_id from database
  let event_param = req.params.event.toLowerCase() + req.params.year.toString();
  
  Event.findOne(
    {album: event_param},
    async function(err, event_data){
      if(err || event_data==null){
        res.json({
          status: 'failed',
          message: `album ${event_param} not found`
        });
      }
      else{
        const del_hash = event_data.del_hash;
        const album_id = event_data.album_id;

        let resp = await delete_all_media(album_id);       // delete all the images from this album

        if(resp == true){

          // node delete the album itself
          await axios({
            method: 'delete',
            url:`https://api.imgur.com/3/album/${del_hash}`,
            headers:{
              Authorization: process.env.IMGUR_AUTHORIZATION
            }
          })
          .then((response)=>{

            // now delete from the db
            Event.deleteOne(
              {album_id: album_id},
              function(err){
                if(!err){
                  res.json({
                    status: "successful",
                    message: 'album deleted!'
                  })
                }
                else{
                  res.json({
                    status: 'failed',
                    message: "couldnot delete album"
                  })
                }
              }
            )
          })
          .catch((err)=>{
            console.log(err)
          })
        }
      }
    }
  )
}





