import * as React from "react";
import {useMemo, useRef} from "react";

import {usePlayer} from "ractive-player";

// codemirror
import {keymap, EditorView} from "@codemirror/view";

import {passThrough, suspendControls} from "rp-codemirror/extensions";
import CodeRecordingPlugin from "rp-codemirror/recorder";

// local
import {Record} from "../cm-views";

export function HTMLBooth() {
  const player = usePlayer();
  const iframe = useRef<HTMLIFrameElement>();

  const recordExtensions = useMemo(() => [
    EditorView.domEventHandlers(suspendControls(player)),

    // refresh iframe
    keymap.of([{
      key: "Mod-Enter",
      run: (view) => {
        iframe.current.srcdoc = view.state.doc.toString();
        return false;
      }}]),

    // allow recording hotkeys to be handle
    keymap.of(passThrough(player, ["Mod-Alt-2", "Mod-Alt-3", "Mod-Alt-4"])),

    // recording
    CodeRecordingPlugin.recorder.extension({EditorView, keymap}, ["Mod-Enter"])
  ], []);

  /* render */

  return (
    <div className={"rp-codebooth"}>
      <Record extensions={recordExtensions}/>
      <iframe className="html-pane" ref={iframe} sandbox="allow-scripts"/>
    </div>
  );
}
