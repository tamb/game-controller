import React from "react";

export default function Stage(props) {
  return (
    <div className={`game-controller__stage ${props.classes}`} {...props}></div>
  );
}
