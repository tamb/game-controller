import React from "react";

export default function Actions(props) {
  return (
    <div {...props} className={`game-controller__actions ${props.classes}`}>
      <button
        className="game-controller__action-btn game-controller__action-btn--1"
        type="button"
      >
        B
      </button>
      <button
        className="game-controller__action-btn game-controller__action-btn--2"
        type="button"
      >
        A
      </button>
    </div>
  );
}
