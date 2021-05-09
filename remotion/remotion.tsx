import * as React from "react";
import {useCallback, useEffect, useMemo, useRef} from "react";

import * as ReactDOM from "react-dom";

import {Audio} from "remotion";
import {Player, PlayerInternals, PlayerRef} from "@remotion/player";

// codemirror
import {keymap, EditorView, ViewPlugin} from "@codemirror/view";

import {cmReplay} from "rp-codemirror";

// local
import {Replay, Playground} from "../src/cm-views";
import {codeReplay} from "../src/recordings";
import {useStore} from "../src/store";

import {RemotionBridge} from "./bridge";

const fps = 30;
const durationInFrames = fps * 100;

function Demo() {
  const ref = useRef<PlayerRef>();
  const bridge = useRef<RemotionBridge>();
  
  useEffect(() => {
    bridge.current = new RemotionBridge({
      fps,
      player: ref.current
    });
  }, []);
  return (
    <Player
      clickToPlay={false}
      component={() => <HTMLBooth bridge={bridge.current}/>}
      durationInFrames={durationInFrames}
      fps={fps}
      compositionWidth={window.innerWidth}
      compositionHeight={window.innerHeight}
      controls
      ref={ref}/>
  );
}

export function HTMLBooth(props: {
  bridge: RemotionBridge;
}) {
  const iframe = useRef<HTMLIFrameElement>();
  const replayRef = useRef<EditorView>();
  const playgroundRef = useRef<EditorView>();

  const pane = useStore(state => state.pane);

  const playgroundExtensions = useMemo(() => [
    keymap.of([{
      key: "Mod-Enter",
      run: (view) => {
        iframe.current.srcdoc = view.state.doc.toString();
        return false;
    }}])
  ], []);

  /* methods */
  // active tab
  const tabToggle = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const pane = e.currentTarget.classList.contains("button-replay") ? "replay" : "playground";

    useStore.setState({pane});
  }, []);

  // copy
  const copy = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    playgroundRef.current.dispatch(playgroundRef.current.state.update({
      changes: {
        from: 0,
        to: playgroundRef.current.state.doc.length,
        insert: replayRef.current.state.doc
      }
    }))
  }, []);

  // run
  const run = useCallback(async e => {
    const active = useStore.getState().pane === "replay" ? replayRef : playgroundRef;
    iframe.current.srcdoc = active.current.state.doc.toString();
  }, []);

  const handleReplay = useCallback(key => {
    if (useStore.getState().pane === "replay") {
      iframe.current.srcdoc = replayRef.current.state.doc.toString();
    }
  }, []);

  /* render */
  return (
    <>
    <Audio src="https://d2og9lpzrymesl.cloudfront.net/r/cm6-demo/audio/audio.webm"/>
    <div className={`rp-codebooth active-${pane}`}>
      <Replay
        handle={handleReplay}
        playback={props.bridge}
        replay={codeReplay}
        viewRef={replayRef}/>
      <Playground extensions={playgroundExtensions} viewRef={playgroundRef}/>
      <div>
        <button className="button-replay" onClick={tabToggle}>Code</button>
        <button className="button-playground" onClick={tabToggle}>Playground</button>
        <button className="button-copy" onClick={copy}>Copy</button>
        <button className="button-run" onClick={run} title={`Cmd+Enter`}>Refresh</button>
      </div>
      <iframe className="html-pane" ref={iframe} sandbox="allow-scripts"/>
    </div>
    </>
  );
}

ReactDOM.render(<Demo/>, document.querySelector("main"));
