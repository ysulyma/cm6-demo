import * as React from "react";
import * as ReactDOM from "react-dom";

import {Audio, Script, Player} from "ractive-player";

// resources
import controls from "@env/controls";
import MEDIA_URL from "@env/media-url";
import markers from "./markers";

// slides
import {HTMLBooth} from "@env/HTMLBooth";

function Lesson() {
  const playerRef = React.useRef<Player>();

  React.useEffect(() => {
    const player = playerRef.current;

    player.canPlay.then(() => {
      player.ready();
    });
  }, []);

  const script = new Script(markers);

  const highlights = [
  ];

  const thumbData = {
    cols: 5,
    rows: 5,
    height: 100,
    width: 160,
    frequency: 4,
    path: `${MEDIA_URL}/thumbs/%s.png`,
    highlights
  };

  return (
    <Player controls={controls} ref={playerRef} script={script} thumbs={thumbData}>
      <Audio start={0}>
        <source src={`${MEDIA_URL}/audio/audio.webm`} type="audio/webm"/>
        <source src={`${MEDIA_URL}/audio/audio.mp4`} type="audio/mp4"/>
      </Audio>
      <HTMLBooth/>
    </Player>
  );
}

ReactDOM.render(<Lesson/>, document.querySelector("main"));
