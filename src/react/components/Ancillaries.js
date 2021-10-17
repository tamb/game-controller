import React from "react";

export default function Ancillaries(props) {
  return (
    <div {...props} className={`game-controller__ancillaries ${props.classes}`}>
      <button type="button">Select</button>
      <button type="button">Start</button>
    </div>
  );
}
