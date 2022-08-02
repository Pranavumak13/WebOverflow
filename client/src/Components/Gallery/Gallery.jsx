import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Gallery.css";
import axios from "axios";

const ImageGallery = (props) => {
  return (
    <ul className="img-gallery">
      {props.list.map((i) => {
        return (
          <li>
            <img src={i} width="100px" />
          </li>
        );
      })}
    </ul>
  );
};

const ImageModal = () => {
  return (
    <>
      <div className="image-modal"></div>
    </>
  );
};

function Gallery() {
  let params = useParams();
  const [urlList, setUrlList] = useState([]);
  const event = params.eventName.toLowerCase();
  const year = params.eventYear;

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8000/gallery/${event}/${year}`,
    }).then((response) => {
      setUrlList(response.data);
    });
  }, []);

  return (
    <>
      <ImageModal />
      <h1>
        {params.eventName} {params.eventYear}
      </h1>
      <ImageGallery list={urlList} />
    </>
  );
}

export default Gallery;
