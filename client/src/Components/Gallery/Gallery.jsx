import React from "react";
import { useParams } from "react-router-dom";
// import images from "../sampleimages.json"; 
import axios from "axios";

function Gallery() {
  let params = useParams();
  const event = params.eventName.toLowerCase();
  const year = params.eventYear;

  var urlList = [];
  
  axios({
    method:'get',
    url: `http://localhost:8000/gallery/${event}/${year}`,              // for eg: localhost:8000/gallery/pragyaa/2020
  }).then((response)=>{
    urlList = response.data;      // response will contain other info as well. bt the response.data will contain the actual images' link
    for(var i = 0; i<urlList.length; i++){
      console.log(urlList[i])       
    }
  })

  return (
    <>
      <h1>
        {params.eventName} {params.eventYear}
      </h1>
      {urlList.map((i) => {
        return <img style={{ width: "100px" }} src={i} alt="not found"></img>;
      })}
    </>
  );
}

export default Gallery;
