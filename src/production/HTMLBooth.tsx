import * as React from "react";
import {useCallback, useMemo, useRef} from "react";

import {Player, Utils, usePlayer} from "ractive-player";
const {dragHelperReact} = Utils.interactivity;
const {constrain} = Utils.misc;
const {onClick} = Utils.mobile;

// codemirror
import {keymap, EditorView} from "@codemirror/view";
import {suspendControls} from "rp-codemirror/extensions";

// local
import {Replay, Playground} from "../cm-views";
import {codeReplay} from "../recordings";
import {useStore} from "../store";

const mac = navigator.platform === "MacIntel";
const Mod = mac ? "Cmd" : "Ctrl";

export function HTMLBooth() {
  const player = usePlayer();
  const iframe = useRef<HTMLIFrameElement>();
  const replayRef = useRef<EditorView>();
  const playgroundRef = useRef<EditorView>();

  const pane = useStore(state => state.pane);

  const replayExtensions = useMemo(() => [
    EditorView.domEventHandlers(suspendControls(player)),
  ], []);

  const playgroundExtensions = useMemo(() => [
    EditorView.domEventHandlers(suspendControls(player)),
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
  const copy = useCallback(() => {
    playgroundRef.current.dispatch(playgroundRef.current.state.update({
      changes: {
        from: 0,
        to: playgroundRef.current.state.doc.length,
        insert: replayRef.current.state.doc
      }
    }));
  }, []);

  // run
  const run = useCallback(async () => {
    const active = useStore.getState().pane === "replay" ? replayRef : playgroundRef;
    iframe.current.srcdoc = active.current.state.doc.toString();
  }, []);

  const handleReplay = useCallback((key, doc) => {
    if (useStore.getState().pane === "replay") {
      iframe.current.srcdoc = doc.toString();
    }
  }, []);

  /* buttons */
  const toggleEvents = useMemo(() => onClick(tabToggle), []);
  const copyEvents = useMemo(() => onClick(copy), []);
  const runEvents = useMemo(() => onClick(run), []);

  /* render */
  return (
    <div className={`rp-codebooth active-${pane}`} onMouseUp={Player.preventCanvasClick}>
      <Replay
        extensions={replayExtensions}
        handle={handleReplay}
        playback={player.playback.hub}
        replay={codeReplay}
        viewRef={replayRef}/>
      <Playground extensions={playgroundExtensions} viewRef={playgroundRef}/>
      <div onMouseUp={Player.preventCanvasClick}>
        <button className="button-replay" {...toggleEvents}>Code</button>
        <button className="button-playground" {...toggleEvents}>Playground</button>
        <button className="button-copy" {...copyEvents}>Copy</button>
        <button className="button-run" {...runEvents} title={`${Mod}+Enter`}>Refresh</button>
      </div>
      <Resize/>
      <iframe className="html-pane" ref={iframe} sandbox="allow-scripts"/>
    </div>
  );
}

function Resize() {
  const ref = useRef<HTMLDivElement>();

  /* event handlers */
  const resizeEvents = useMemo(() => dragHelperReact((e, {x}) => {
    const div = ref.current.parentElement;
    const rect = div.getBoundingClientRect();

    div.style.setProperty("--split", constrain(0.25, (x - rect.left) / rect.width, 0.75) * 100 + "%");
  }, () => {
    ref.current.parentElement.classList.add("dragging");
  }, () => {
    ref.current.parentElement.classList.remove("dragging");
  }, ref), []);

  return (
    <div
      {...resizeEvents}
      className="ui-resizable-handle ui-resizable-ew" style={{zIndex: 90}}
    />
  );
}
