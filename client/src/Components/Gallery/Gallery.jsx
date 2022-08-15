import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Gallery.css";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

function Gallery() {
  let params = useParams();
  const [urlList, setUrlList] = useState([]);
  const [activeImg, setActiveImg] = useState(-1);
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

  const ImageGallery = (props) => {
    return (
      <ul className="img-gallery">
        {props.list.map((i) => {
          return (
            <li>
              <img
                src={i}
                width="100px"
                onClick={() => {
                  imageclick(i);
                }}
              />
            </li>
          );
        })}
      </ul>
    );
  };

  const imageclick = (i) => {
    setActiveImg(i);
  };

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const ImageModal = (props) => {
    return (
      <>
        <div
          className="image-modal"
          style={
            props.activeImg === -1 ? { display: "none" } : { display: "block" }
          }
        >
          <div
            className="closebtn"
            onClick={() => {
              setActiveImg(-1);
            }}
          >
            X
          </div>
          <div className="photo-holder">
            <Swiper
              style={{
                "--swiper-navigation-color": "#fff",
                "--swiper-pagination-color": "#fff",
              }}
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper2"
            >
              {urlList.map((i) => {
                return (
                  <SwiperSlide>
                    <img src={i} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <Swiper
              // onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper"
            >
              {urlList.map((i) => {
                return (
                  <SwiperSlide>
                    <img src={i} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <ImageModal activeImg={activeImg} />
      <h1>
        {params.eventName} {params.eventYear}
      </h1>
      <ImageGallery list={urlList} />
    </>
  );
}

export default Gallery;
