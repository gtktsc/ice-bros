import React, { useEffect, useRef, useState } from "react";
import type P5 from "p5";
import { WebMidi, type NoteMessageEvent, type MessageEvent } from "webmidi";
import P5Canvas from "react-p5";

const Canvas: React.FC = () => {
  const [loaded, setIsLoaded] = useState(false);
  const notes = useRef<{ [key: string]: number }>({});
  const message = useRef<MessageEvent | null>(null);
  const modulation = useRef<number>(100);
  const breath = useRef<number>(100);
  const pitch = useRef<number>(100);
  const volume = useRef<number>(100);
  const random = useRef<number>(0);
  const direction = useRef<"up" | "down">("up");

  let width = window.innerWidth;
  let height = window.innerHeight;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  useEffect(() => {
    WebMidi.enable()
      .then(onEnabled)
      .catch((err) => alert(err));

    function onEnabled() {
      setIsLoaded(true);
      if (WebMidi.inputs[0]) {
        WebMidi.inputs[0].addListener("noteon", (e: NoteMessageEvent) => {
          const current = e.note.name;
          const newNotes = { ...notes.current, [current]: 1 };
          notes.current = newNotes;
        });

        WebMidi.inputs[0].addListener("midimessage", (event) => {
          // @ts-ignore
          const [type, data, value] = event?.data;

          // //modulation wheel
          if (type === 176 && data === 1) {
            modulation.current = (value / 127) * 100;
          }
          if (type === 176 && data === 2) {
            breath.current = (value / 127) * 100;
          }
          if (type === 176 && data === 7) {
            volume.current = (value / 127) * 100;
          }
          if (type === 224 && data === 0) {
            pitch.current = (value / 127) * 100;
          }

          message.current = event;
        });

        //@ts-ignore
        window.WebMidi = WebMidi;
      }

      return () => {
        if (WebMidi.inputs[0]) {
          WebMidi.inputs[0].removeListener();
        }
      };
    }
  }, []);

  //See annotations in JS for more information
  const setup = (p5: P5, canvasParentRef: Element) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
  };
  const draw = (p5: P5) => {
    if (direction.current === "up") {
      random.current = random.current + 1;
      if (random.current > 500) {
        direction.current = "down";
      }
    } else {
      random.current = random.current - 1;
      if (random.current < 1) {
        direction.current = "up";
      }
    }

    p5.colorMode(p5.HSB, 100);

    p5.noStroke();
    p5.rectMode(p5.CENTER);
    if (pitch.current > 50) p5.background(0);

    // rotation
    p5.translate(width / 2, height / 2);
    p5.rotate(p5.frameCount / 100);
    p5.translate(-width / 2, -height / 2);

    p5.fill(p5.color(breath.current, modulation.current, volume.current));

    new Array(Math.floor(random.current)).fill("").forEach((_, i) => {
      const pos = (i * Math.PI * 2) / 100;
      p5.circle(
        halfWidth +
          (halfWidth / 5) *
            (2 + 0.5 * Math.cos(random.current * pos)) *
            Math.cos(pos),
        halfHeight +
          (halfHeight / 5) *
            (2 + 0.5 * Math.cos(random.current * pos)) *
            Math.sin(pos),
        (random.current / pitch.current) * 5
      );
    });

    const x1Percentage = 1 - notes.current["E"];
    const x2Percentage = 1 - notes.current["D"];
    const x3Percentage = 1 - notes.current["G"];
    const x4Percentage = 1 - notes.current["F"];

    const [x, y] = [halfWidth / 2, halfHeight / 2];
    if (
      notes.current["E"] > 0 ||
      notes.current["D"] > 0 ||
      notes.current["G"] > 0 ||
      notes.current["F"] > 0
    ) {
      p5.quad(
        halfWidth - x * x1Percentage,
        halfHeight - y * x1Percentage,
        halfWidth + x * x2Percentage,
        halfHeight - y * x2Percentage,
        halfWidth + x * x3Percentage,
        halfHeight + y * x3Percentage,
        halfWidth - x * x4Percentage,
        halfHeight + y * x4Percentage
      );
    }

    p5.fill(p5.color(100 - breath.current, modulation.current, volume.current));
    new Array(Math.floor(random.current)).fill("").forEach((_, i) => {
      const pos = (i * Math.PI * 2) / 100;
      p5.circle(
        halfWidth -
          (halfWidth / 5) *
            (2 + 0.5 * Math.cos(random.current * pos)) *
            Math.cos(pos),
        halfHeight -
          (halfHeight / 5) *
            (2 + 0.5 * Math.cos(random.current * pos)) *
            Math.sin(pos),
        (random.current / pitch.current) * 5
      );
    });

    Object.entries(notes.current).forEach(([key, currentNote]) => {
      const size = 200 * currentNote;

      if (key === "E") {
        p5.fill(p5.color(breath.current, modulation.current, volume.current));

        currentNote > 0 &&
          p5.rect(halfWidth / 2, halfHeight - halfHeight / 2, size);
      } else if (key === "D") {
        p5.fill(
          p5.color(100 - breath.current, modulation.current, volume.current)
        );

        currentNote > 0 &&
          p5.circle(
            halfWidth + halfWidth / 2,
            halfHeight - halfHeight / 2,
            size
          );
      } else if (key === "G") {
        p5.fill(p5.color(breath.current, modulation.current, volume.current));

        currentNote > 0 &&
          p5.arc(
            halfWidth + halfWidth / 2,
            halfHeight + halfHeight / 2,
            size,
            size,
            0,
            2 * p5.PI * currentNote
          );
      } else if (key === "F") {
        p5.fill(
          p5.color(100 - breath.current, modulation.current, volume.current)
        );

        currentNote > 0 &&
          p5.square(
            halfWidth / 2,
            halfHeight + halfHeight / 2,
            size,
            size / 10
          );
      }
      const newValue = currentNote - 0.01 < 0 ? 0 : currentNote - 0.01;
      notes.current = { ...notes.current, [key]: newValue };
    });
  };

  return loaded ? (
    <P5Canvas
      windowResized={(p5) =>
        p5.resizeCanvas(window.innerWidth, window.innerHeight)
      }
      //@ts-ignore
      setup={setup}
      //@ts-ignore
      draw={draw}
    />
  ) : null;
};

export default Canvas;
