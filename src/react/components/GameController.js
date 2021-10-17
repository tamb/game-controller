import React from "react";

import Stage from "./Stage";
import Actions from "./Actions";
import DPad from "./DPad";

import Ancillaries from "./Ancillaries";
export default class GameController extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="game-controller__wrapper">
        <Stage />
        <Ancillaries />
        <div className="game-controller__main-controls">
          <DPad />
          <Actions />
        </div>
      </div>
    );
  }
}
