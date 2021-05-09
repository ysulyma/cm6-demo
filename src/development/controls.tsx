import * as React from "react";

import {Controls, Player} from "ractive-player";
import {RecordingControl} from "rp-recording";

import CodeRecordingPlugin from "rp-codemirror/recorder";

export default <>
  {Player.defaultControlsLeft}

  <div className="rp-controls-right">
    <RecordingControl plugins={[CodeRecordingPlugin]}/>
    <Controls.Settings/>
    <Controls.FullScreen/>
  </div>
</>;
