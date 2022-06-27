import React from "react";
import { useParams } from "react-router-dom";
import images from "../sampleimages.json";

function Gallery() {
  let params = useParams();

  const urlList = [];
  images.resources.forEach((i) => {
    if (i.event === params.eventName && i.year === params.eventYear) {
      urlList.push(i.url);
    }
  });

  return (
    <>
      <h1>
        year {params.eventYear} {params.eventName}
      </h1>
      {urlList.map((i) => {
        return <img style={{ width: "100px" }} src={i} alt="not found"></img>;
      })}
    </>
  );
}

export default Gallery;
