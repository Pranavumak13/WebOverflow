import React from "react";
import "./Timeline.css";
import { Link } from "react-router-dom";

import events from "../data";

function Cards(props) {
  const eventname = Object.keys(events).find(
    (key) => events[key] === props.event
  );
  const thisevent = reverseArray(props.event);
  function reverseArray(ogarray) {
    var revarray = [];
    var i = ogarray.length;
    var j = 0;
    while (i) {
      i--;
      revarray[j] = ogarray[i];
      j++;
    }
    return revarray;
  }
  return (
    <div>
      {thisevent.map((i) => {
        return (
          <Link to={`/gallery/${eventname}/${i}`}>
            <button>{i}</button>
          </Link>
        );
      })}
    </div>
  );
}

export default function Timeline() {
  return (
    <>
      <h1>Timeline</h1>

      <p>Pragyaa</p>
      <Cards event={events.Pragyaa} />

      <p>Zenith</p>
      <Cards event={events.Zenith} />

      <p>Utsav</p>
      <Cards event={events.Utsav} />

      {/* <button onClick={adder}>a</button> */}
    </>
  );
}
