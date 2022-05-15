import React, { useEffect, useRef } from 'react';



export default function Gallery() {
  const myelem = useRef();
  
  myelem.innerHTML="done";
  function resizeimg() {
    console.log("done")
  }
  
  useEffect(resizeimg)
  
  return(<>

    <img id="img1" src="https://i.stack.imgur.com/LmD3e.png" />
    <p id="name" ref={myelem}></p>
    <img src="https://i.imgur.com/DLmvz6b.jpeg" />

</>);
}