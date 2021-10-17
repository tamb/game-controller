import React from "react";

export default function DPad(props) {
  return (
    <div className="game-controller__d-pad-container">
      <button
        type="button"
        className="
              game-controller__d-pad-button game-controller__d-pad-button--up
            "
      ></button>
      <button
        type="button"
        className="
              game-controller__d-pad-button game-controller__d-pad-button--left
            "
      ></button>
      <button
        type="button"
        className="
              game-controller__d-pad-button game-controller__d-pad-button--right
            "
      ></button>
      <button
        type="button"
        className="
              game-controller__d-pad-button game-controller__d-pad-button--down
            "
      ></button>
    </div>
  );
}
