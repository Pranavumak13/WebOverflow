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

      <p>One</p>
      <Cards event={events.event1} />

      <p>Two</p>
      <Cards event={events.event2} />

      <p>Three</p>
      <Cards event={events.event3} />

      {/* <button onClick={adder}>a</button> */}
    </>
  );
}
