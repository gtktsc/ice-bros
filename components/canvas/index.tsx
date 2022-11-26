import React, { useEffect, useRef } from "react";
import p5 from "p5";
import { WebMidi, type NoteMessageEvent, type MessageEvent } from "webmidi";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("react-p5"), {
  ssr: false,
});

interface ComponentProps {
  midi: WebMidi.MIDIAccess;
}

const Canvas: React.FC<ComponentProps> = ({ midi }: ComponentProps) => {
  const notes = useRef<NoteMessageEvent[]>([]);
  const note = useRef<NoteMessageEvent | null>(null);
  const message = useRef<MessageEvent | null>(null);
  const modulation = useRef<number>(100);
  const breath = useRef<number>(100);
  const pitch = useRef<number>(100);
  const volume = useRef<number>(100);
  const opacity = useRef<number>(0);
  const life = useRef<number>(127);

  const width = document.body.clientWidth;
  const height = document.body.clientHeight;

  let x = width / 2;

  const y = height / 2;

  useEffect(() => {
    WebMidi.enable()
      .then(onEnabled)
      .catch((err) => alert(err));

    function onEnabled() {
      if (WebMidi.inputs[0]) {
        WebMidi.inputs[0].addListener("noteon", (e: NoteMessageEvent) => {
          const newNotes = [...notes.current, e].slice(-20);
          notes.current = newNotes;
          note.current = e;
          opacity.current = 0;
        });

        WebMidi.inputs[0].addListener("midimessage", (event) => {
          console.log({ event });
          // @ts-ignore
          const [type, data, value] = event?.data;

          // //modulation wheel
          if (type === 176 && data === 1) {
            modulation.current = value;
          }
          if (type === 176 && data === 2) {
            breath.current = value;
          }
          if (type === 176 && data === 7) {
            volume.current = value * 3;
          }
          if (type === 224 && data === 0) {
            pitch.current = value;
          }

          message.current = event;
        });

        //@ts-ignore
        window.WebMidi = WebMidi;
      }
    }
  }, []);

  //See annotations in JS for more information
  const setup = (p5: p5, canvasParentRef: Element) => {
    p5.createCanvas(
      document.body.clientWidth,
      document.body.clientHeight,
      "webgl"
    ).parent(canvasParentRef);
  };
  const draw = (p5: p5) => {
    p5.colorMode(p5.HSB, 127);

    p5.background(p5.color(0, 0, life.current));

    p5.rectMode(p5.CENTER);
    p5.stroke(p5.color(breath.current, modulation.current, volume.current));
    p5.fill(p5.color(breath.current, modulation.current, volume.current));
    p5.rotateX(p5.frameCount * 0.01);
    p5.rotateY(p5.frameCount * 0.01);
    notes.current.forEach((currentNote) => {
      p5.translate(currentNote.note.number || 0, 0);
      p5.box(opacity.current, opacity.current, opacity.current);
    });

    if (opacity.current < width / 2) {
      opacity.current += 1;
    } else {
      opacity.current = 0;
    }
    if (life.current < 0) {
      life.current = 127;
    } else {
      opacity.current += 1;
    }
  };

  //@ts-ignore
  return <DynamicComponentWithNoSSR setup={setup} draw={draw} />;
};

export default Canvas;
