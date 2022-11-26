import type { NextPage } from "next";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Wrapper } from "./styled";

const LoadedCanvas = dynamic(() => import("../canvas"), {
  suspense: true,
  ssr: false,
});

const Midi: NextPage = () => {
  const [midi, setMidi] = useState<WebMidi.MIDIAccess | null>(null);

  useEffect(() => {
    if (midi) return;
    function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
      console.log("MIDI ready!");
      setMidi(midiAccess);
    }

    function onMIDIFailure(msg: string) {
      console.error(`Failed to get MIDI access - ${msg}`);
    }

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      alert("Platform not compatible");
    }
  }, [midi]);

  return (
    <Wrapper>
      {midi ? (
        <Suspense>
          <LoadedCanvas midi={midi} />
        </Suspense>
      ) : null}
    </Wrapper>
  );
};

export default Midi;
