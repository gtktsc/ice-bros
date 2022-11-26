import type { NextPage } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Wrapper } from "./styled";

const LoadedCanvas = dynamic(() => import("../canvas"), {
  suspense: true,
  ssr: false,
});

const Midi: NextPage = () => {
  return (
    <Wrapper>
      <Suspense>
        <LoadedCanvas />
      </Suspense>
    </Wrapper>
  );
};

export default Midi;
