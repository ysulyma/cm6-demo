import * as React from "react";
import {useEffect, useRef} from "react";

import {basicSetup} from "@codemirror/basic-setup";
import {defaultTabBinding} from "@codemirror/commands";
import {html} from "@codemirror/lang-html";
import {keymap, EditorView, ViewPlugin, highlightActiveLine, drawSelection} from "@codemirror/view";
import {ChangeSet, EditorState, Extension} from "@codemirror/state";

import {cmReplay, fakeSelection} from "rp-codemirror";

type ReplayParams = Parameters<typeof cmReplay>[0];

const remove = [highlightActiveLine()];

/**

*/
export function Replay(props: {
  extensions?: Extension[];
  handle?: ReplayParams["handle"];
  playback: ReplayParams["playback"];
  replay: ReplayParams["data"];
  start?: number;
  viewRef?: React.MutableRefObject<EditorView>;
}) {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const view = new EditorView({
      state: EditorState.create({
        extensions: [
          // don't use basic setup bc we don't want active line highlighting
          (basicSetup as Extension[]).filter(extn => !remove.includes(extn)),
          keymap.of([defaultTabBinding]),
          html(),

          ViewPlugin.define(fakeSelection(drawSelection())),

          EditorView.editorAttributes.of({
            class: "code-replay"
          }),

          EditorView.editable.of(false),
          ...(props.extensions ?? [])
        ]
      })
    });

    cmReplay({
      ChangeSet,
      data: props.replay,
      handle: props.handle ?? (() => {}),
      playback: props.playback,
      start: props.start ?? 0,
      view
    });

    if (props.viewRef) {
      props.viewRef.current = view;
    }

    ref.current.replaceWith(view.dom);
  }, []);

  return (
    <div ref={ref}/>
  );
}

export function Playground(props: {
  extensions?: Extension[];
  viewRef?: React.MutableRefObject<EditorView>;
}) {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const view = new EditorView({
      state: EditorState.create({
        extensions: [
          basicSetup,
          keymap.of([defaultTabBinding]),
          html(),

          EditorView.editorAttributes.of({
            class: "code-playground"
          }),

          ...(props.extensions ?? [])
        ]
      })
    });

    if (props.viewRef) {
      props.viewRef.current = view;
    }

    ref.current.replaceWith(view.dom);
  }, []);

  return (
    <div ref={ref}/>
  );
}

export function Record(props: {
  extensions?: Extension[];
  viewRef?: React.MutableRefObject<EditorView>;
}) {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const view = new EditorView({
      state: EditorState.create({
        extensions: [
          basicSetup,
          keymap.of([defaultTabBinding]),
          html(),
          EditorView.editorAttributes.of({
            class: "code-record"
          }),

          ...(props.extensions ?? [])
        ]
      })
    });

    if (props.viewRef) {
      props.viewRef.current = view;
    }

    ref.current.replaceWith(view.dom);
  }, []);

  return (
    <div ref={ref}/>
  );
}
