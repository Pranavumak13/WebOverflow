import React from 'react';
import './Timeline.css';

var event1 = ["2018", "2019", "2020"];
var event2 = ["a", "b", "c"];
var event3 = ["2018", "2019", "2020"];
var event4 = ["2018", "2019", "2020"];

function Cards(props) {
  const thisevent = reverseArray(props.event);
  function reverseArray(ogarray) {
    var revarray = [];
    var i = ogarray.length;
    var j = 0;
    while(i) {
      i--;
      revarray[j] = ogarray[i];
      j++;
    }
    return revarray;
  }
  return (
    <div>
      {thisevent.map((i) => {
        return <button>{i}</button>
      })}
    </div>
  );
}

export default function Timeline() {
  return(<>
    <h1>Timeline</h1>

    <p>Event1</p>
    <Cards event={event1} />

    <p>Event2</p>
    <Cards event={event2} />

    <p>Event3</p>
    <Cards event={event3} />

    <p>Event4</p>
    <Cards event={event4} />

    {/* <button onClick={adder}>a</button> */}

  </>);
}