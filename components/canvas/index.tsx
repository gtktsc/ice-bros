import React, { useEffect, useRef, useState } from "react";
import type P5 from "p5";
import { WebMidi, type NoteMessageEvent, type MessageEvent } from "webmidi";
import P5Canvas from "react-p5";

interface ComponentProps {}

const Canvas: React.FC<ComponentProps> = ({}: ComponentProps) => {
  const [loaded, setIsLoaded] = useState(false);
  const notes = useRef<{ [key: string]: number }>({});
  const message = useRef<MessageEvent | null>(null);
  const modulation = useRef<number>(100);
  const breath = useRef<number>(100);
  const pitch = useRef<number>(100);
  const volume = useRef<number>(100);
  const opacity = useRef<number>(0);
  const life = useRef<number>(255);
  const direction = useRef<"down" | "up">("down");

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
    p5.colorMode(p5.HSB, 127);

    p5.noStroke();
    p5.rectMode(p5.CENTER);
    p5.background(0);

    // rotation
    p5.translate(width / 2, height / 2);
    p5.rotate(p5.frameCount / modulation.current);
    p5.translate(-width / 2, -height / 2);

    p5.fill(p5.color(breath.current, modulation.current, volume.current));

    p5.quad(
      halfWidth / 2 + halfWidth * (1 - notes.current["E"]),
      halfHeight / 2 + halfHeight * (1 - notes.current["E"]),
      halfWidth +
        (halfWidth / 2 -
          (halfWidth + halfWidth / 2) * (1 - notes.current["D"])),
      halfHeight / 2 + (halfHeight / 2) * (1 - notes.current["D"]),

      //bottom
      halfWidth +
        halfWidth / 2 -
        (halfWidth + halfWidth / 2) * (1 - notes.current["G"]),
      halfHeight +
        halfHeight / 2 -
        (halfHeight + halfHeight / 2) * (1 - notes.current["G"]),
      halfWidth / 2 + (halfWidth / 2) * (1 - notes.current["F"]),
      halfHeight +
        halfHeight / 2 -
        (halfHeight + halfHeight / 2) * (1 - notes.current["F"])
    );

    Object.entries(notes.current).forEach(([key, currentNote]) => {
      const size = 200 * currentNote;

      if (key === "E") {
        currentNote > 0 &&
          p5.rect(halfWidth / 2, halfHeight - halfHeight / 2, size);
      } else if (key === "D") {
        currentNote > 0 &&
          p5.circle(
            halfWidth + halfWidth / 2,
            halfHeight - halfHeight / 2,
            size
          );
      } else if (key === "G") {
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
        currentNote > 0 &&
          p5.square(
            halfWidth / 2,
            halfHeight + halfHeight / 2,
            size,
            size / 100
          );
      }
      const newValue = currentNote - 0.01 < 0 ? 0 : currentNote - 0.01;
      notes.current = { ...notes.current, [key]: newValue };
    });

    if (opacity.current > 0) {
      opacity.current -= 0.1;
    }

    if (direction.current === "down") {
      life.current -= 1;
      if (life.current < 1) {
        direction.current = "up";
      }
    } else if (direction.current === "up") {
      life.current += 1;
      if (life.current > 100) {
        direction.current = "down";
      }
    }
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
